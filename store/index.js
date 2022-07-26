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

export default {
  state
}
