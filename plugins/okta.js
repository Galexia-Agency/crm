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
    tokenManager: {
      autoRenew: false
    },
    // This will redirect the user to the login page when Okta detects that a user's session is no longer active
    async onSessionExpired () {
      await ctx.$logout()
    }
  })
  Vue.use(OktaVue, { oktaAuth })
  // Inject okta to the context as $auth
  ctx.$auth = oktaAuth
  inject('auth', oktaAuth)
}
