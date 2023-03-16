import importedActions from '../actions'

export const state = () => ({
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
  async nuxtClientInit ({ commit, dispatch }, { route, store, $auth, $axios, $api }) {
    const authenticated = await $auth.isAuthenticated()
    console.log('nuxtclientinitauthenticated', authenticated)
    if (authenticated) {
      commit('okta', { authenticated: true, claims: await $auth.getUser() })
      const accessToken = await $auth.getAccessToken()
      $axios.setHeader('Authorization', `Bearer ${accessToken}`)
      $api.setHeader('Authorization', `Bearer ${accessToken}`)
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
          dispatch('projectDatesHelper')
          dispatch('updateClientPandleDataHelper')
          dispatch('filteredProjectsHelper')
          if (route && route.name && route.name === 'client-client') {
            if (!store.state.clients.find(client => client.business_shortname.toLowerCase() === route.params.client)) {
              window.onNuxtReady(() => { window.$nuxt.error({ statusCode: 404, message: 'Client not found' }) })
            }
          }
        })
        .catch(function (e) {
          const error = {}
          error.description = e
          commit('error', error)
        })
    } else {
      try {
        console.log('Trying to renew tokens')
        const renewToken = await this.$auth.token.renewTokens()
        await this.$auth.tokenManager.setTokens(renewToken)
        dispatch('nuxtClientInit')
      } catch {
        console.error('You are not logged in')
        window.onNuxtReady(() => {
          if (window.$nuxt.$route.path !== '/login') {
            console.log('Redirecting to login page')
            window.$nuxt.$router.push('/login')
          } else {
            console.log('You are already on the login page')
          }
        })
      }
    }
  },
  ...importedActions
}

export default {
  state,
  actions
}
