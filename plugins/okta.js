import Vue from 'vue'
import OktaVue from '@okta/okta-vue'
import { OktaAuth } from '@okta/okta-auth-js'

export default ({ app }) => {
  const oktaAuth = new OktaAuth({
    issuer: app.$config.OKTA_ISSUER + '/oauth2/default',
    clientId: app.$config.OKTA_CLIENT_ID,
    redirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host + '/implicit/callback' : 'https://' + window.location.host + '/implicit/callback',
    scopes: ['openid', 'profile', 'email', 'groups'],
    async onSessionExpired () {
      await Vue.prototype.$auth.logout({ postLogoutRedirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host : 'https://' + window.location.host })
    }
  })
  Vue.use(OktaVue, { oktaAuth })
}
