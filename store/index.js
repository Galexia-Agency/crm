import importedActions from '../actions'

export const state = () => ({
  isRenewingTokens: false,
  authenticated: false,
  claims: [],
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
    if (await $auth.manuallyRenewTokens()) {
      if (route && route.name && route.name === 'login') {
        window.onNuxtReady(() => { app.router.push('/') })
      }
      // eslint-disable-next-line no-console
      console.log('Starting the initial get')
      $axios.$get('https://api.galexia.agency/get',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
        .then((response) => {
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
          if (route && route.name && route.name === 'client-client') {
            if (!state.clients.find((client) => client.business_shortname.toLowerCase() === route.params.client)) {
              window.onNuxtReady(() => { window.$nuxt.error({ statusCode: 404, message: 'Client not found' }) })
            }
          }
        })
        .catch(function (e) {
          const error = {}
          error.description = e
          commit('error', error)
        })
      if (state.claims.length === 0) {
        // We only need to get the user info once, so we do it here rather than in the updateAuthHeaders call
        commit('okta', { authenticated: true, claims: await $auth.getUser() })
      }
      // eslint-disable-next-line no-console
      console.log('Claims have been updated')
    }
  },
  updateAuthHeaders ({ commit, state }, context) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const accessToken = await context.$auth.getAccessToken()
      if (!accessToken) {
        reject(Error('We couldn\'t get the access token'))
      }
      if (state.accessToken !== accessToken) {
        context.$axios.setHeader('Authorization', `Bearer ${accessToken}`)
        context.$api.setHeader('Authorization', `Bearer ${accessToken}`)
        // eslint-disable-next-line no-console
        console.log('Auth headers have been updated')
      }
      resolve()
    })
  },
  ...importedActions
}

export default {
  state,
  actions
}
