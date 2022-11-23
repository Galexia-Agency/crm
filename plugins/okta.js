import Vue from 'vue'
import OktaVue from '@okta/okta-vue'
import { OktaAuth } from '@okta/okta-auth-js'

export default (ctx, inject) => {
  const oktaAuth = new OktaAuth({
    issuer: ctx.app.$config.OKTA_ISSUER + '/oauth2/default',
    clientId: ctx.app.$config.OKTA_CLIENT_ID,
    redirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host + '/implicit/callback' : 'https://' + window.location.host + '/implicit/callback',
    scopes: ['openid', 'profile', 'email', 'groups', 'offline_access'],
    pkce: true,
    autoRenew: true,
    async onSessionExpired () {
      await ctx.app.$auth.logout({ postLogoutRedirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host : 'https://' + window.location.host })
    }
  })
  Vue.use(OktaVue, { oktaAuth })
  // Inject okta to the context as $auth
  ctx.$auth = oktaAuth
  inject('auth', oktaAuth)
}
