export default {
  target: 'static',
  components: true,
  ssr: false,
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: '%s | Galexia Creative Agency BOS',
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
      { rel: 'preconnect', href: 'https://api.galexia.agency' }
    ]
  },
  /*
   ** Router
   */
  router: {},
  /*
   ** Customize the progress-bar color
   */
  loading: false,
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
    '~plugins/logout',
    '~plugins/okta',
    '~plugins/manuallyRenewTokens',
    '~plugins/mixins/dates',
    '~plugins/mixins/urls',
    '~plugins/mixins/json',
    '~plugins/mixins/draggingHandler',
    '~plugins/mixins/makeHumanReadableCurrency',
    '~plugins/inlineSVG',
    '~plugins/fontAwesome',
    '~plugins/axiosConcurrency',
    '~plugins/pauseAxiosWhilstRenewingTokens',
    '~plugins/authHeaders',
    '~plugins/axiosLoading'
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
    'nuxt-client-init-module',
    '@nuxtjs/axios',
    '@nuxtjs/pwa'
  ],
  /*
   ** Public Environment Variables
   */
  publicRuntimeConfig: {
    OKTA_CLIENT_ID: process.env.OKTA_CLIENT_ID,
    OKTA_ISSUER: process.env.OKTA_ISSUER,
    OKTA_SCOPES: ['openid', 'profile', 'email', 'groups', 'offline_access'],
    PANDLE_COMPANY_ID: process.env.PANDLE_COMPANY_ID,
    COMPANY_INCORPORATION: process.env.COMPANY_INCORPORATION,
    TAX_YEAR_MONTH: process.env.TAX_YEAR_MONTH
  },
  pwa: {
    workbox: {
      offlinePage: '/index.html'
    },
    manifest: {
      name: 'Galexia Business Operating System',
      shortName: 'BOS',
      background_color: '#ffffff',
      display: 'standalone',
      lang: 'en-GB'
    },
    meta: {
      name: 'BOS',
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
