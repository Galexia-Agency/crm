// file deepcode ignore ArrayMethodOnNonArray: false positive
import { diffDays } from '~/plugins/mixins/dates'
import { safeURL } from '~/plugins/mixins/urls'

export default {
  getById: (state) => (id) => {
    return state.all.find((item) => item.id === id)
  },
  getForClient: (state) => (client) => {
    // Get the project ids of each project associated with the client
    let projectIds = state.all.filter((project) => project.client_id === client.id).map((project) => {
      return project.id
    })
    // Combine the current project ids (if they've already been set), with those from the database. Set creates an array of unique values
    if (Array.isArray(client.projects)) {
      projectIds = [...new Set([...client.projects, ...projectIds])]
    }
    return projectIds
  },
  getFilteredByStatus: (state, getters, rootState) => () => {
    const filteredProjectsByStatus = {
      'Hot Lead': [],
      'Cold Lead': [],
      Development: [],
      'Ad-Hoc': [],
      Paused: [],
      'In House': [],
      'On-Going': [],
      'Closed Lead': [],
      Completed: [],
      Cancelled: [],
      Other: []
    }
    rootState.client.all.forEach((client) => {
      state.all.forEach((project) => {
        if (project.client_id === client.id && project.status && filteredProjectsByStatus[project.status]) {
          filteredProjectsByStatus[project.status].push(project)
        }
      })
      if (
        filteredProjectsByStatus['Hot Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus['Cold Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus.Development.find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus['Ad-Hoc'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus.Paused.find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus['In House'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus['On-Going'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus['Closed Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus.Completed.find((e) => e.client_id === client.id) === undefined &&
        filteredProjectsByStatus.Cancelled.find((e) => e.client_id === client.id) === undefined &&
        rootState.userInfo.groups.includes('admin')
      ) {
        filteredProjectsByStatus.Other.push(client)
      }
    })
    return filteredProjectsByStatus
  },
  getDaysToStart: () => (project) => {
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
  getDaysToComplete: () => (project) => {
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
  getDaysWithUs: () => (project) => {
    let daysWithUs = 0
    if (project.enquiry_date && project.start_date && project.status === 'On-Going') {
      daysWithUs = diffDays(project.start_date, null)
    }
    return daysWithUs
  },
  getClientName: (state, getters, rootState, rootGetters) => (project) => {
    const client = rootGetters['client/getById'](project.client_id)
    return client.business_name
  },
  getLink: (state, getters, rootState, rootGetters) => (project) => {
    const client = rootGetters['client/getById'](project.client_id)
    return `/client/${client.business_shortname.toLowerCase()}#${safeURL(project.name)}`
  }
}
