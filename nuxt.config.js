export default {
  target: 'static',
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | Galexia Creative Agency CRM',
    link: [
      { rel: 'apple-touch-icon', sizes: '60x60', href: '/apple-touch-icon-60x60.png?v=dLXLEPEjpj' },
      { rel: 'apple-touch-icon', sizes: '76x76', href: '/apple-touch-icon-76x76.png?v=dLXLEPEjpj' },
      { rel: 'apple-touch-icon', sizes: '120x120', href: '/apple-touch-icon-120x120.png?v=dLXLEPEjpj' },
      { rel: 'apple-touch-icon', sizes: '152x152', href: '/apple-touch-icon-152x152.png?v=dLXLEPEjpj' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon-180x180.png?v=dLXLEPEjpj' },
      { rel: 'icon', type: 'image/png', sizes: '192x192', href: '/favicon-192x192.png?v=dLXLEPEjpj' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png?v=dLXLEPEjpj' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png?v=dLXLEPEjpj' },
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg?v=dLXLEPEjpj', color: '#534bae' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'preload', as: 'style', href: 'https://fonts.googleapis.com/css2?family=Assistant:wght@300;400&family=Montserrat:ital,wght@0,600;0,700;1,600;1,700&family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap' },
      { rel: 'stylesheet', media: 'print', onload: 'this.media="all"', href: 'https://fonts.googleapis.com/css2?family=Assistant:wght@300;400&family=Montserrat:ital,wght@0,600;0,700;1,600;1,700&family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap' }
    ],
    __dangerouslyDisableSanitizers: ['script', 'noscript'],
    noscript: [
      { innerHTML: '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Assistant:wght@300;400&family=Montserrat:ital,wght@0,600;0,700;1,600;1,700&family=Open+Sans:ital,wght@0,400;0,600;1,400;1,600&display=swap" />' }
    ]
  },
  router: {
    middleware: ['auth']
  },
  /*
   ** Customize the progress-bar color
   */
  loading: {
    color: '#1A237E',
    height: '3px'
  },
  /*
   ** Global CSS
   */
  css: [
    'bulma',
    '~/assets/css/transition.css'
  ],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: [
    '~plugins/board',
    '~plugins/asyncComputed',
    '~plugins/mixins/urls',
    '~plugins/vueInlineSVG'
  ],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: [
    // Doc: https://github.com/nuxt-community/eslint-module
    '@nuxtjs/eslint-module',
    // Doc: https://github.com/nuxt-community/stylelint-module
    '@nuxtjs/stylelint-module'
  ],
  /*
   ** Nuxt.js modules
   */
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    '@nuxtjs/pwa'
  ],
  publicRuntimeConfig: {
    OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID,
    OKTA_ISSUER: process.env.OKTA_ISSUER
  },
  auth: {
    strategies: {
      okta: {
        scheme: 'oauth2',
        endpoints: {
          authorization: process.env.OKTA_ISSUER + '/v1/authorize',
          token: process.env.OKTA_ISSUER + '/v1/token',
          userInfo: process.env.OKTA_ISSUER + '/v1/userinfo',
          logout: false
        },
        token: {
          property: 'access_token',
          type: 'Bearer',
          global: true,
          required: true
        },
        refreshToken: {
          property: 'refresh_token',
          maxAge: 60 * 60 * 24 * 30
        },
        responseType: 'code',
        grantType: 'authorization_code',
        clientId: process.env.OKTA_CLIENT_ID,
        scope: ['openid', 'profile', 'email'],
        codeChallengeMethod: 'S256',
        redirect: {
          login: '/login',
          callback: '/',
          home: '/',
          logout: false
        }
      }
    }
  },
  pwa: {
    workbox: {
      offlinePage: '/index.html'
    },
    manifest: {
      name: 'CRM',
      shortName: 'CRM',
      background_color: '#ffffff',
      display: 'standalone',
      lang: 'en-GB'
    },
    meta: {
      name: 'CRM',
      mobileAppIOS: true,
      theme_color: '#1a237e',
      lang: 'en-GB'
    }
  },
  /*
   ** Build configuration
   */
  build: {
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: false,
        minifyJS: false,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true
      }
    }
  }
}
