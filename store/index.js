import importedActions from '../actions'

export const state = () => ({
  loading: false,
  isClientLoaded: false,
  isRenewingTokens: false,
  isAuthenticated: false,
  userInfo: [],
  clients: [],
  contacts: [],
  domains: [],
  projects: [],
  filteredProjects: {},
  products: [],
  error: {
    active: false
  },
  conflicts: {
    promise: null,
    resolvePromise: null,
    title: '',
    before: '',
    after: '',
    updated: '',
    type: 'text',
    reveal: false
  },
  pandle: {
    dashboard: {
      monthlyCharts: []
    }
  }
})

export const actions = {
  async nuxtClientInit ({ commit, dispatch, state }, { route, $auth, $axios, app }) {
    commit('isClientLoaded', false)
    if (await $auth.manuallyRenewTokens()) {
      if (
        (route &&
        route.name &&
        route.name === 'login') ||
        (app &&
        app.router &&
        app.router.app &&
        app.router.app._route &&
        app.router.app._route.name &&
        app.router.app._route.name === 'login')
      ) {
        // We do this to go home as soon as possible
        app.router.push('/')
        // We then have to do this to stop nuxt redirecting back to the login page when it's initialised
        window.onNuxtReady(() => { app.router.push('/') })
      }
      // eslint-disable-next-line no-console
      console.log('Starting the initial get')
      await Promise.all([
        $axios.$get('https://api.galexia.agency/get', {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }),
        // If userInfo is already in the store, we don't need to fetch it again
        state.userInfo.length === 0 ? dispatch('updateUserInfo', $auth) : Promise.resolve(null)
      ]).then(([response]) => {
        response[3].forEach((project, index) => {
          if (project.lists) {
            response[3][index].lists = JSON.parse(project.lists)
          }
          if (project.ongoing) {
            response[3][index].ongoing = Boolean(project.ongoing)
          }
        })
        commit('clients', response[0].sort(function (a, b) {
          const textA = a.business_shortname.toUpperCase()
          const textB = b.business_shortname.toUpperCase()
          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
        }))
        commit('contacts', response[1])
        commit('domains', response[2])
        commit('projects', response[3])
        commit('products', response[4])
        commit('pandleDashboard', response[5])
        dispatch('projectDatesHelper')
        dispatch('updateClientPandleDataHelper')
        dispatch('filteredProjectsHelper')
        commit('isClientLoaded', true)
        // eslint-disable-next-line no-console
        console.log('Initial get has completed')
      }).catch(function (e) {
        const error = {}
        error.description = e
        commit('error', error)
      })
    }
  },
  ...importedActions
}

export default {
  state,
  actions
}
