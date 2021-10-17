<template>
  <div id="login">
    <div id="okta-signin-container" />
  </div>
</template>

<script>
export default {
  layout: 'login',
  async mounted () {
    const scopes = ['openid', 'profile', 'email']
    let OktaSignIn
    await import(/* webpackChunkName: "okta.signin", webpackPreload: true  */ '@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js').then((module) => {
      OktaSignIn = module.default
    })
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: this.$config.OKTA_ISSUER,
        issuer: this.$config.OKTA_ISSUER + '/oauth2/default',
        clientId: this.$config.OKTA_CLIENT_ID,
        redirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host + '/implicit/callback' : 'https://' + window.location.host + '/implicit/callback'
      })
      this.widget.showSignInToGetTokens({
        el: '#okta-signin-container',
        scopes
      }).then(async (tokens) => {
        await this.$auth.handleLoginRedirect(tokens)
      }).catch((err) => {
        throw err
      })
    })
    if (await this.$auth.isAuthenticated()) {
      this.$router.push('/')
    } else {
      const cookies = document.cookie.split(';')
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf('=')
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    }
  },
  async beforeDestroy () {
    this.widget.remove()
    await this.$auth.isAuthenticated()
  }
}
</script>
