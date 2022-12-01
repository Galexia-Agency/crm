import importedActions from './actions'

export const state = () => ({
  authenticated: false,
  claims: [],
  clients: [],
  contacts: [],
  domains: [],
  projects: [],
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
  async nuxtClientInit ({ commit }, { route, store, $auth, $axios, $api }) {
    if (await $auth.isAuthenticated()) {
      commit('okta', { authenticated: await $auth.isAuthenticated(), claims: await $auth.getUser() })
      $axios.setHeader('Authorization', `Bearer ${$auth.getAccessToken()}`)
      $api.setHeader('Authorization', `Bearer ${$auth.getAccessToken()}`)
      await $axios.$get('https://api.galexia.agency/get',
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
          commit('projectDatesHelper')
          commit('updatePandleDataHelper')
          commit('filteredProjectsHelper')
          if (route && route.name && route.name === 'client-client') {
            if (!store.state.clients.find(client => client.business_shortname.toLowerCase() === route.params.client)) {
              window.onNuxtReady(() => { window.$nuxt.error({ statusCode: 404, message: 'Client not found' }) })
            }
          }
        })
        .catch(function (e) {
          const error = {}
          error.description = e.message
          commit('error', error)
        })
    } else {
      window.onNuxtReady(() => { window.$nuxt.$router.push('/login') })
    }
  },
  ...importedActions
}

export default {
  state,
  actions
}
