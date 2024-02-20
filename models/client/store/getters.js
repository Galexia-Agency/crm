import makeHumanReadableCurrency from '~/plugins/mixins/makeHumanReadableCurrency'

export default {
  getById: (state) => (id) => {
    return state.all.find((item) => item.id === id)
  },
  getByShortname: (state) => (shortname) => {
    return state.all.find((client) => client.business_shortname.toLowerCase() === shortname)
  },
  getExpenses: (state, getters, rootState, rootGetters) => (client, humanReadable = false) => {
    let expenses = 0
    const projects = []
    rootGetters['client/project/getForClient'](client).forEach((projectId) => {
      projects.push(rootGetters['client/project/getById'](projectId))
    })
    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectBbExpenses = project.bb_expenses
        const projectPandleExpenses = project.pandle_expenses
        if (projectBbExpenses) {
          expenses += projectBbExpenses
        }
        if (projectPandleExpenses) {
          // This is to get a positive number, as pandle returns expenses as negatives
          expenses += Math.abs(projectPandleExpenses)
        }
      })
    }
    if (humanReadable) {
      if (expenses >= 0) {
        return `-£${makeHumanReadableCurrency(expenses)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(expenses))}`
    }
    return expenses
  },
  getRevenue: (state, getters, rootState, rootGetters) => (client, humanReadable = false) => {
    let revenue = 0
    const projects = []
    rootGetters['client/project/getForClient'](client).forEach((projectId) => {
      projects.push(rootGetters['client/project/getById'](projectId))
    })
    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectBbRevenue = project.bb_revenue
        const projectPandleIncome = project.pandle_income
        if (projectBbRevenue) {
          revenue += projectBbRevenue
        }
        if (projectPandleIncome) {
          revenue += projectPandleIncome
        }
      })
    }
    if (humanReadable) {
      if (revenue >= 0) {
        return `£${makeHumanReadableCurrency(revenue)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(revenue))}`
    }
    return revenue
  },
  getCompletionAmount: (state, getters, rootState, rootGetters) => (client, humanReadable = false) => {
    let completionAmount = 0
    const projects = []
    rootGetters['client/project/getForClient'](client).forEach((projectId) => {
      projects.push(rootGetters['client/project/getById'](projectId))
    })
    if (projects.length > 0) {
      projects.forEach((project) => {
        const projectCompletionAmount = project.completion_amount
        if (projectCompletionAmount) {
          completionAmount += projectCompletionAmount
        }
      })
    }
    if (humanReadable) {
      if (completionAmount >= 0) {
        return `£${makeHumanReadableCurrency(completionAmount)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(completionAmount))}`
    }
    return completionAmount
  },
  getProfit: (state, getters) => (client, humanReadable = false) => {
    const profit = getters.getRevenue(client) - getters.getExpenses(client)
    if (humanReadable) {
      if (profit >= 0) {
        return `£${makeHumanReadableCurrency(profit)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(profit))}`
    }
    return profit
  },
  getProfitMargin: (state, getters) => (client, humanReadable = false) => {
    let profitMargin = 0
    const profit = getters.getProfit(client)
    if (profit > 0) {
      profitMargin = (profit / getters.getRevenue(client)) * 100
    }
    if (profitMargin > 100) {
      profitMargin = 100
    }
    if (profitMargin < 0) {
      profitMargin = 0
    }
    if (humanReadable) {
      return `${profitMargin.toFixed(2)}%`
    }
    return profitMargin
  }
}
