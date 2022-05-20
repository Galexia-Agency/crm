import { getItemById, getListById, getListByItemId } from '~/utils/board'

const getters = {
  getProjectById: state => (projectId) => {
    return state.projects.find(project => project.id === projectId)
  },

  getClientById: state => (clientId) => {
    return state.clients.find(client => client.id === clientId)
  },

  getListById: state => (projectId, listId) => {
    return getListById(state.projects.find(project => project.id === projectId).lists, listId)
  },

  getListByItemId: state => (projectId, itemId) => {
    return getListByItemId(state.projects.find(project => project.id === projectId).lists, itemId)
  },

  getItemById: state => (projectId, itemId) => {
    return getItemById(state.projects.find(project => project.id === projectId).lists, itemId)
  }
}

export default getters
