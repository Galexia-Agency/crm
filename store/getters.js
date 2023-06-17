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
  }
}

export default getters
