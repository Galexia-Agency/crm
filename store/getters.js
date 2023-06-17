// file deepcode ignore ArrayMethodOnNonArray: false positive
import { diffDays } from '~/plugins/mixins/dates'
import { safeURL } from '~/plugins/mixins/urls'
import { getCardById, getListById, getListByCardId } from '~/utils/board'

const getters = {
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
        daysToComplete = diffDays(project.start_date, null) + '+'
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
    return '/client/' + client.business_shortname.toLowerCase() + '#' + safeURL(project.name)
  }
}

export default getters
