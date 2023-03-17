import { getItemById, getListById, getListByItemId } from '~/utils/board'

const getters = {
  getProjectById: (state) => (id) => {
    return state.projects.find((item) => item.id === id)
  },

  getClientById: (state) => (id) => {
    return state.clients.find((item) => item.id === id)
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

  getListByItemId: (state) => (projectId, itemId) => {
    return getListByItemId(state.projects.find((project) => project.id === projectId).lists, itemId)
  },

  getItemById: (state) => (projectId, itemId) => {
    return getItemById(state.projects.find((project) => project.id === projectId).lists, itemId)
  }
}

export default getters
