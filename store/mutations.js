import { makeItem, makeList } from '~/utils/data'
import { getItemById, getListById, getListByItemId } from '~/utils/board'

const mutations = {
  okta (state, { authenticated, claims }) {
    state.authenticated = authenticated
    if (claims) {
      state.claims = claims
    }
  },
  error (state, data) {
    // eslint-disable-next-line no-console
    console.error(data.description)
    state.error.active = typeof data.active === 'undefined' ? true : data.active
    state.error.description = data.description
    state.error.data = data.data
  },
  clients (state, data) {
    state.clients = data
  },
  contacts (state, data) {
    state.contacts = data
  },
  domains (state, data) {
    state.domains = data
  },
  projects (state, data) {
    state.projects = data
  },
  pandleBankAccountChart (state, data) {
    state.pandle.dashboard.bankAccountChart = data
  },
  pandleCashFlowChart (state, data) {
    state.pandle.dashboard.CashFlowChart = data
  },
  pandleExpenseChart (state, data) {
    state.pandle.dashboard.ExpenseChart = data
  },
  pandleProfitLossChart (state, data) {
    state.pandle.dashboard.ProfitLossChart = data
  },
  pandleSalesChart (state, data) {
    state.pandle.dashboard.SalesChart = data
  },
  pandleTaxDividendChart (state, data) {
    state.pandle.dashboard.TaxDividendChart = data
  },

  addList (state, { projectId, title }) {
    if (!Array.isArray(state.projects.find(project => project.id === projectId).lists)) {
      state.projects.find(project => project.id === projectId).lists = []
    }
    state.projects.find(project => project.id === projectId).lists.push(makeList(title))
  },

  editList (state, { projectId, title, id }) {
    state.projects.find(project => project.id === projectId).lists.find(list => list.id === id).title = title
  },

  moveList (state, [projectId, fromIndex, toIndex]) {
    const lists = state.projects.find(project => project.id === projectId).lists
    lists.splice(toIndex, 0, lists.splice(fromIndex, 1)[0])
  },

  archiveList (state, { projectId, listId }) {
    state.projects.find(project => project.id === projectId).lists.find(i => i.id === listId).archived = true
  },

  unarchiveList (state, { projectId, listId }) {
    state.projects.find(project => project.id === projectId).lists.find(i => i.id === listId).archived = false
  },

  removeList (state, { projectId, listId }) {
    state.projects.find(project => project.id === projectId).lists = state.projects.find(project => project.id === projectId).lists.filter(i => i.id !== listId)
  },

  addItem (state, { projectId, listId, title, description, date, dateUNIX, dayNo, day, month, clientName, clientShortName, updatedBy, assignee }) {
    const list = getListById(state.projects.find(project => project.id === projectId).lists, listId)
    const createdDate = Date.now()
    const updatedDate = Date.now()
    list.items.push(makeItem({ title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee }))
  },

  updateItem (state, { projectId, itemId, title, description, date, dateUNIX, createdDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee }) {
    const updatedDate = Date.now()
    const updatedItem = makeItem({ title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee, itemId })
    const item = getItemById(state.projects.find(project => project.id === projectId).lists, itemId)
    Object.assign(item, updatedItem)
  },

  moveItem (state, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    const fromList = typeof fromListRef === 'number'
      ? state.projects.find(project => project.id === projectId).lists[fromListRef].items
      : getListById(projectId, fromListRef)
    const toList = typeof toListRef === 'number'
      ? state.projects.find(project => project.id === projectId).lists[toListRef].items
      : getListById(projectId, toListRef)
    toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0])
  },

  archiveItem (state, { projectId, itemId }) {
    const list = getListByItemId(state.projects.find(project => project.id === projectId).lists, itemId)
    const item = list.items.find(item => item.id === itemId)
    item.archived = true
    item.date = null
  },

  unarchiveItem (state, { projectId, itemId }) {
    const list = getListByItemId(state.projects.find(project => project.id === projectId).lists, itemId)
    const item = list.items.find(item => item.id === itemId)
    item.archived = false
  },

  removeItem (state, { projectId, itemId }) {
    const list = getListByItemId(state.projects.find(project => project.id === projectId).lists, itemId)
    list.items.splice(list.items.findIndex(item => item.id === itemId), 1)
  },

  updateProject (state, data) {
    const item = state.projects.find(project => project.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  },

  updateContact (state, data) {
    const item = state.contacts.find(contact => contact.id === data[0].id)
    if (item) {
      Object.assign(item, data[0])
    }
  },

  updateClient (state, data) {
    const item = state.clients.find(client => client.id === data[0].id)
    if (item) {
      Object.assign(item, data[0])
    }
  }
}

export default mutations
