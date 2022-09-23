import importedActions from './importedActions'

export const state = () => ({
  authenticated: false,
  claims: [],
  contacts: [],
  domains: [],
  projects: [],
  clients: [],
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
      bankAccountChart: {
        attributes: {
          'chart-values': [
            {
              name: '',
              balance: 0
            }
          ]
        }
      },
      CashFlowChart: {
        attributes: {
          'chart-values': [
            {
              amount: 0,
              month: ''
            }
          ]
        }
      },
      ExpenseChart: {
        attributes: {
          'chart-values': [
            {
              name: '',
              amount: 0
            }
          ]
        }
      },
      ProfitLossChart: {
        attributes: {
          'chart-values': [
            {
              amount: 0,
              month: ''
            }
          ]
        }
      },
      SalesChart: {
        attributes: {
          'chart-values': [
            {
              amount: 0,
              month: ''
            }
          ]
        }
      },
      TaxDividendChart: {
        attributes: {
          'chart-values': []
        }
      }
    }
  }
})

export const actions = {
  async nuxtClientInit ({ commit }, { route, store, $auth, $axios }) {
    if (await $auth.isAuthenticated()) {
      commit('okta', { authenticated: await $auth.isAuthenticated(), claims: await $auth.getUser() })
      $axios.setHeader('Authorization', `Bearer ${$auth.getAccessToken()}`)
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
          })
          const clients = response[0].sort(function (a, b) {
            const textA = a.business_shortname.toUpperCase()
            const textB = b.business_shortname.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })
          commit('clients', clients)
          commit('contacts', response[1])
          commit('domains', response[2])
          commit('projects', response[3])
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
