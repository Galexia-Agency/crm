
import jwtDecode from 'jwt-decode'

export default (ctx) => {
  // Add the manually renew tokens method to Okta Auth
  ctx.$auth.manuallyRenewTokens = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // Set the authenticated state to false as we don't know what the state is yet
        ctx.app.store.commit('isAuthenticated', false)
        ctx.app.store.commit('isRenewingTokens', true)
        // Set a timeout of 1 second for fetching the auth state so we don't get stuck in a loop
        const timeoutPromise = new Promise((resolve, reject) => {
          setTimeout(() => {
            reject(new Error('Timeout'))
          }, 1000) // set timeout to 1 second
        })
        // If we're already authenticated, then setup Vuex with the required info and resolve as quickly as possible
        // We then continue to renew tokens in the background
        if (await Promise.race([ctx.$auth.isAuthenticated(), timeoutPromise])) {
          await ctx.app.store.dispatch('updateAuthHeaders', ctx)
          // We update the authenticated state here as we know we are now authenticated
          ctx.app.store.commit('isAuthenticated', true)
          resolve(true)
        }
        // eslint-disable-next-line no-console
        console.log('Trying to renew tokens')
        const tokens = await ctx.$auth.token.renewTokens()
        await ctx.$auth.tokenManager.setTokens(tokens)
        await ctx.app.store.dispatch('updateAuthHeaders', ctx)
        // eslint-disable-next-line no-console
        console.log('Successfully renewed tokens')
        // We update the authenticated state here as we have now renewed the tokens and are authenticated again
        ctx.app.store.commit('isAuthenticated', true)
        ctx.app.store.commit('isRenewingTokens', false)
        resolve(true)
        // Renew the accessToken 30 seconds before it expires
        // Current time
        const now = new Date().getTime()
        // Decode the token to get the expiration time
        const { exp } = jwtDecode(tokens.accessToken.value)
        // Calculate the delay between now and expiry time
        const delay = new Date((exp - 30) * 1000).getTime() - now
        // If the Unix time is in the past, execute the callback immediately
        if (delay <= 0) {
          ctx.$auth.manuallyRenewTokens()
        } else {
          setTimeout(ctx.$auth.manuallyRenewTokens, delay)
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error)
        // eslint-disable-next-line no-console
        console.error('You are not logged in')
        if (ctx.route.path !== '/login') {
          // eslint-disable-next-line no-console
          console.log('Redirecting to login page')
          window.onNuxtReady(() => { ctx.app.router.push('/login') })
        } else {
          // eslint-disable-next-line no-console
          console.log('You are already on the login page')
        }
        ctx.app.store.commit('isClientLoaded', true)
        resolve(false)
      }
    })
  }
}
