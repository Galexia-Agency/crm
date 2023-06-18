<style lang="scss">
  #login {
    width: 320px;
    margin: auto;
    padding: 8% 0 0;
    #okta-sign-in {
      min-width: auto;
      padding-top: 1.2rem
    }
    .infobox-error {
      color: red
    }
    .mfa-send-email-content {
      padding-bottom: 2rem
    }
    .resend-email-btn {
      display: block
    }
    h1 {
      text-align: center;
      a {
        display: block;
        width: 125px;
        height: 125px;
        margin: 0 auto 25px;
        margin-bottom: 40px;
        padding: 0;
        overflow: hidden;
        color: #3C434A;
        font-weight: 400;
        font-size: 20px;
        line-height: 1.3;
        text-decoration: none;
        text-indent: -9999px;
        background-image: url('./assets/img/logo.png');
        background-repeat: no-repeat;
        background-position: center top;
        background-size: cover;
        outline: 0;
        filter: drop-shadow(.5px 2.5px 2.5px #6564AE99)
      }
    }
    .o-form-head {
      display: none
    }
    .o-form-content {
      padding-bottom: 2rem
    }
    .o-form-button-bar {
      float: right;
      margin-top: -3.5rem;
      .button {
        display: inline-block;
        color: white;
        font-size: 13px;
        background: var(--primaryColor);
        border-color: var(--primaryColor);
        &:hover {
          background-color: #534BAE
        }
      }
    }
    .custom-checkbox {
      label {
        margin-left: .5rem;
        font-size: .9rem
      }
    }
    .o-form-input, .o-form-input-name-answer {
      input[type='text'], input[type='password'], input[type='tel'] {
        display: block;
        width: 100%;
        min-height: 40px;
        max-height: none;
        margin: 1rem 0;
        padding: .5rem;
        font-size: 1rem;
        font-family: sans-serif;
        line-height: 1.75rem;
        background: linear-gradient(180deg, rgb(83 75 174 / 15%) 0%, rgb(26 35 126 / 15%) 100%);
        border: none;
        border-radius: .25rem;
        box-shadow: 0 5px 5px rgb(26 35 126 / 7.5%)
      }
    }
    .okta-form-input-error {
      span {
        display: none
      }
      margin-bottom: .5em;
      color: red;
      text-align: left
    }
    .o-form-label label {
      display: inline-block;
      margin-bottom: 3px;
      font-size: 14px;
      line-height: 1.5
    }
  }
</style>
<template>
  <div id="login">
    <h1>
      <a href="https://galexia.agency">
        Galexia
      </a>
    </h1>
    <div id="okta-signin-container" />
    <LayoutRefresh />
  </div>
</template>

<script>
export default {
  name: 'Login',
  layout: 'login',
  async mounted () {
    let OktaSignIn
    await import(/* webpackChunkName: "okta.signin", webpackPreload: true  */ '@okta/okta-signin-widget/dist/js/okta-sign-in.no-polyfill.min.js').then((module) => {
      OktaSignIn = module.default
    })
    const redirectUri = window.location.host === 'localhost:8888' ? `http://${window.location.host}/implicit/callback` : `https://${window.location.host}/implicit/callback`
    this.$nextTick(function () {
      this.widget = new OktaSignIn({
        baseUrl: this.$config.OKTA_ISSUER,
        issuer: `${this.$config.OKTA_ISSUER}/oauth2/default`,
        clientId: this.$config.OKTA_CLIENT_ID,
        redirectUri,
        useClassicEngine: true,
        authClient: this.$auth
      })
      const checkElementInterval = setInterval(() => {
        const formElement = document.querySelector('form')

        if (formElement) {
          formElement.addEventListener('submit', () => {
            this.$store.commit('loading', true)
          })
          clearInterval(checkElementInterval) // Stop the loop
        }
      }, 250)
      this.widget.showSignInToGetTokens({
        el: '#okta-signin-container',
        scopes: this.$config.OKTA_SCOPES
      }).then(async (tokens) => {
        await this.$auth.tokenManager.setTokens(tokens)
        this.widget.remove()
        await this.$store.dispatch('nuxtClientInit', this.$store, this.$nuxt.context)
      }).catch((err) => {
        throw err
      }).finally(() => {
        this.$store.commit('loading', false)
      })
    })
  }
}
</script>
