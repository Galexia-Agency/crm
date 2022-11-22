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
  conflicts (state, data) {
    if (data.reveal || data.reveal === false) {
      state.conflicts.reveal = data.reveal
    }
    if (data.promise || data.promise === null) {
      state.conflicts.promise = data.promise
    }
    if (data.resolvePromise || data.resolvePromise === null) {
      state.conflicts.resolvePromise = data.resolvePromise
    }
    if (data.before || data.before === '') {
      state.conflicts.before = data.before
    }
    if (data.after || data.after === '') {
      state.conflicts.after = data.after
    }
    if (data.updated || data.updated === '') {
      state.conflicts.updated = data.updated
    }
    if (data.title || data.title === '') {
      state.conflicts.title = data.title
    }
    if (data.type) {
      state.conflicts.type = data.type
    }
    if (data.options) {
      state.conflicts.options = data.options
    }
    if (data.pattern) {
      state.conflicts.pattern = data.pattern
    }
    if (data.noSpaces) {
      state.conflicts.noSpaces = data.noSpaces
    }
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
  products (state, data) {
    state.products = data
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
    const updatedItem = makeItem({ title, description, date, dateUNIX, createdDate, updatedDate, dayNo, day, month, clientName, clientShortName, updatedBy, assignee, id: itemId })
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
    const item = state.contacts.find(contact => contact.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  },

  updateClient (state, data) {
    const item = state.clients.find(client => client.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  }
}

export default mutations
