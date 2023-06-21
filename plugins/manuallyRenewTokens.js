/* eslint-disable no-console */
function redirectToLogin ({ route, app, error }) {
  console.error(error)
  console.error('You are not logged in')
  if (route.path !== '/login') {
    console.log('Redirecting to login page')
    app.router.push('/login')
    window.onNuxtReady(() => { app.router.push('/login') })
  } else {
    console.log('You are already on the login page')
  }
}

async function renewTokens (ctx) {
  ctx.app.store.commit('isRenewingTokens', true)
  console.log('Trying to renew tokens')
  const tokens = await ctx.$auth.token.renewTokens()
  await ctx.$auth.tokenManager.setTokens(tokens)
  console.log('Successfully renewed tokens')
  ctx.app.store.commit('isRenewingTokens', false)
  automaticTokenRenewal(ctx)
}

async function automaticTokenRenewal (ctx) {
  /*
    Renew the accessToken 30 seconds before it expires, or now, whichever is sooner
  */
  const now = new Date().getTime() // Current time
  const accessToken = await ctx.$auth.tokenManager.get('accessToken') // Decode the token to get the expiration time
  if (!accessToken) {
    console.log('When trying to find the expiry time of the access token, we could not get the access token.')
    console.log('We are now attempting to get a new access token')
    await renewTokens(ctx)
  } else {
    const exp = accessToken.expiresAt
    // Calculate the delay between now and expiry time
    const delay = new Date((exp - 30) * 1000).getTime() - now
    const isNow = delay <= 0
    console.log(`The access token ${isNow ? 'has expired' : `expires in ${delay / 1000}s`}, so we have set up a request to renew it by sending off the refresh token`)
    // If the Unix time is in the past, execute the callback immediately
    if (isNow) {
      await renewTokens(ctx)
    } else {
      clearTimeout(window.timer)
      window.timer = setTimeout(async () => { await renewTokens(ctx) }, delay)
    }
  }
}

export default (ctx) => {
  // Add the manually renew tokens method to Okta Auth
  ctx.$auth.manuallyRenewTokens = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        /*
          Set the authenticated state and resolve as quickly as possible to start the initial get
        */
        const isAuthenticated = await ctx.$auth.isAuthenticated({
          expiredTokenBehavior: 'none'
        })
        console.log(`Okta thinks we are${isAuthenticated ? '' : ' not'} authenticated`)
        if (isAuthenticated) {
          // We update the authenticated state here as we know we are now authenticated
          ctx.app.store.commit('isAuthenticated', true)
          resolve(true)
        }

        /*
          Set up token renewal
        */
        await automaticTokenRenewal(ctx)

        /*
          We update the authenticated state here as we have now renewed the tokens and are authenticated again
        */
        ctx.app.store.commit('isAuthenticated', true)
        resolve(true)
      } catch (error) {
        redirectToLogin({ error, route: ctx.route, app: ctx.app })
        ctx.app.store.commit('isAuthenticated', false)
        ctx.app.store.commit('isRenewingTokens', false)
        ctx.app.store.commit('isClientLoaded', true)
        resolve(false)
      }
    })
  }
}
