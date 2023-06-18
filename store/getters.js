// file deepcode ignore ArrayMethodOnNonArray: false positive
import { diffDays } from '~/plugins/mixins/dates'
import { safeURL } from '~/plugins/mixins/urls'
import { getCardById, getListById, getListByCardId } from '~/utils/board'
import makeHumanReadableCurrency from '~/plugins/mixins/makeHumanReadableCurrency'

const gettersToExport = {
  getProjectById: (state) => (id) => {
    return state.projects.find((item) => item.id === id)
  },
  getClientById: (state) => (id) => {
    return state.clients.find((item) => item.id === id)
  },
  getClientByShortname: (state) => (shortname) => {
    return state.clients.find((client) => client.business_shortname.toLowerCase() === shortname)
  },
  getContactById: (state) => (id) => {
    return state.contacts.find((item) => item.id === id)
  },
  getDomainById: (state) => (id) => {
    return state.domains.find((item) => item.id === id)
  },
  getProductById: (state) => (id) => {
    return state.products.find((item) => item.id === id)
  },
  getListById: (state) => (projectId, listId) => {
    return getListById(state.projects.find((project) => project.id === projectId).lists, listId)
  },
  getListByCardId: (state) => (projectId, cardId) => {
    return getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
  },
  getCardById: (state) => (projectId, cardId) => {
    return getCardById(state.projects.find((project) => project.id === projectId).lists, cardId)
  },
  getProjectsForClient: (state) => (client) => {
    // Get the project ids of each project associated with the client
    let projectIds = state.projects.filter((project) => project.client_id === client.id).map((project) => {
      return project.id
    })
    // Combine the current project ids (if they've already been set), with those from the database. Set creates an array of unique values
    if (Array.isArray(client.projects)) {
      projectIds = [...new Set([...client.projects, ...projectIds])]
    }
    return projectIds
  },
  getFilteredProjects: (state) => () => {
    const filteredProjects = {
      'Hot Lead': [],
      'Cold Lead': [],
      Development: [],
      Paused: [],
      'In House': [],
      'On-Going': [],
      'Closed Lead': [],
      Completed: [],
      Cancelled: [],
      Other: []
    }
    state.clients.forEach((client) => {
      state.projects.forEach((project) => {
        if (project.client_id === client.id && project.status && filteredProjects[project.status]) {
          filteredProjects[project.status].push(project)
        }
      })
      if (
        filteredProjects['Hot Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['Cold Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Development.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Paused.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['In House'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['On-Going'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['Closed Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Completed.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Cancelled.find((e) => e.client_id === client.id) === undefined &&
        state.userInfo.groups.includes('admin')
      ) {
        filteredProjects.Other.push(client)
      }
    })
    return filteredProjects
  },
  getProjectDaysToStart: (state) => (project) => {
    let daysToStart = 0
    if (project.enquiry_date) {
      if (project.start_date) {
        daysToStart = diffDays(project.enquiry_date, project.start_date)
      } else {
        daysToStart = diffDays(project.enquiry_date, null)
      }
    }
    return daysToStart
  },
  getProjectDaysToComplete: (state) => (project) => {
    let daysToComplete = 0
    if (project.enquiry_date && project.start_date && !project.ongoing) {
      if (project.completion_date) {
        daysToComplete = diffDays(project.start_date, project.completion_date)
      } else {
        daysToComplete = `${diffDays(project.start_date, null)}+`
      }
    }
    return daysToComplete
  },
  getProjectDaysWithUs: (state) => (project) => {
    let daysWithUs = 0
    if (project.enquiry_date && project.start_date && project.status === 'On-Going') {
      daysWithUs = diffDays(project.start_date, null)
    }
    return daysWithUs
  },
  getProjectClientName: (state, getters) => (project) => {
    const client = getters.getClientById(project.client_id)
    return client.business_name
  },
  getProjectLink: (state, getters) => (project) => {
    const client = getters.getClientById(project.client_id)
    return `/client/${client.business_shortname.toLowerCase()}#${safeURL(project.name)}`
  },
  getClientExpenses: (state, getters) => (client, humanReadable = false) => {
    let expenses = 0
    const projects = []
    getters.getProjectsForClient(client).forEach((projectId) => {
      projects.push(getters.getProjectById(projectId))
    })
    if (projects.length > 0) {
      for (const project in projects) {
        const projectBbExpenses = parseFloat(projects[project].bb_expenses)
        const projectPandleExpenses = parseFloat(projects[project].pandle_expenses)
        if (projectBbExpenses) {
          expenses += projectBbExpenses
        }
        if (projectPandleExpenses) {
          // This is to get a positive number, as pandle returns expenses as negatives
          expenses += Math.abs(projectPandleExpenses)
        }
      }
    }
    if (humanReadable) {
      if (expenses >= 0) {
        return `-£${makeHumanReadableCurrency(expenses)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(expenses))}`
    }
    return expenses
  },
  getClientRevenue: (state, getters) => (client, humanReadable = false) => {
    let revenue = 0
    const projects = []
    getters.getProjectsForClient(client).forEach((projectId) => {
      projects.push(getters.getProjectById(projectId))
    })
    if (projects.length > 0) {
      for (const project in projects) {
        const projectBbRevenue = parseFloat(projects[project].bb_revenue)
        const projectPandleIncome = parseFloat(projects[project].pandle_income)
        if (projectBbRevenue) {
          revenue += projectBbRevenue
        }
        if (projectPandleIncome) {
          revenue += projectPandleIncome
        }
      }
    }
    if (humanReadable) {
      if (revenue >= 0) {
        return `£${makeHumanReadableCurrency(revenue)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(revenue))}`
    }
    return revenue
  },
  getClientCompletionAmount: (state, getters) => (client, humanReadable = false) => {
    let completionAmount = 0
    const projects = []
    getters.getProjectsForClient(client).forEach((projectId) => {
      projects.push(getters.getProjectById(projectId))
    })
    if (projects.length > 0) {
      for (const project in projects) {
        const projectCompletionAmount = parseFloat(projects[project].completion_amount)
        if (projectCompletionAmount) {
          completionAmount += projectCompletionAmount
        }
      }
    }
    if (humanReadable) {
      if (completionAmount >= 0) {
        return `£${makeHumanReadableCurrency(completionAmount)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(completionAmount))}`
    }
    return completionAmount
  },
  getClientProfit: (state, getters) => (client, humanReadable = false) => {
    const profit = parseFloat(getters.getClientRevenue(client)) - parseFloat(getters.getClientExpenses(client))
    if (humanReadable) {
      if (profit >= 0) {
        return `£${makeHumanReadableCurrency(profit)}`
      }
      return `-£${makeHumanReadableCurrency(Math.abs(profit))}`
    }
    return profit
  },
  getClientProfitMargin: (state, getters) => (client, humanReadable = false) => {
    let profitMargin = 0
    const profit = getters.getClientProfit(client)
    if (profit > 0) {
      profitMargin = (profit / getters.getClientRevenue(client)) * 100
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

export default gettersToExport
