import createPersistedState from 'vuex-persistedstate'

export const state = () => ({
  auth: false,
  contacts: [],
  domains: [],
  projects: [],
  clients: [],
  error: {
    active: false
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

let plugins

if (process.env.NODE_ENV === 'production') {
  plugins = [createPersistedState]
}

export default {
  state,
  plugins
}
