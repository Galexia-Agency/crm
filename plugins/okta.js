import Vue from 'vue'
import OktaVue from '@okta/okta-vue'
import { OktaAuth } from '@okta/okta-auth-js'

export default (ctx, inject) => {
  const redirectUri = window.location.host === 'localhost:8888' ? 'http://' + window.location.host + '/implicit/callback' : 'https://' + window.location.host + '/implicit/callback'

  const oktaAuth = new OktaAuth({
    issuer: ctx.app.$config.OKTA_ISSUER + '/oauth2/default',
    clientId: ctx.app.$config.OKTA_CLIENT_ID,
    redirectUri,
    scopes: ctx.app.$config.OKTA_SCOPES,
    pkce: true,
    // This renews the access token if it is expiring and we are using the app
    autoRenew: true,
    expireEarlySeconds: 120,
    // This will redirect the user to the login page when Okta detects that a user's session is no longer active
    async onSessionExpired () {
      await ctx.$logout()
    }
  })
  Vue.use(OktaVue, { oktaAuth })
  // Inject okta to the context as $auth
  ctx.$auth = oktaAuth
  // Add the manually renew tokens method to Okta Auth
  ctx.$auth.manuallyRenewTokens = () => {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // If we're already authenticated, then setup Vuex with the required info and resolve as quickly as possible
        // We then continue to renew tokens in the background
        if (await ctx.$auth.isAuthenticated()) {
          await ctx.app.store.dispatch('updateAuthHeaders', ctx)
          resolve(true)
        }
        ctx.app.store.commit('isRenewingTokens', true)
        // eslint-disable-next-line no-console
        console.log('Trying to renew tokens')
        const renewToken = await ctx.$auth.token.renewTokens()
        await ctx.$auth.tokenManager.setTokens(renewToken)
        await ctx.app.store.dispatch('updateAuthHeaders', ctx)
        // eslint-disable-next-line no-console
        console.log('Successfully renewed tokens')
        // We update the authenticated state here as we have now renewed the tokens and are authenticated again
        ctx.app.store.commit('okta', { authenticated: true })
        ctx.app.store.commit('isRenewingTokens', false)
        resolve(true)
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
        resolve(false)
      }
    })
  }
  inject('auth', oktaAuth)
}
