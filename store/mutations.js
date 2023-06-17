import { makeCard, makeList } from '~/utils/data'
import { getCardById, getListById, getListByCardId } from '~/utils/board'
import { isJsonString } from '~/plugins/mixins/json'

const mutations = {
  loading (state, bool) {
    state.loading = bool
  },
  isClientLoaded (state, bool) {
    state.isClientLoaded = bool
  },
  isRenewingTokens (state, bool) {
    state.isRenewingTokens = bool
  },
  isAuthenticated (state, bool) {
    state.isAuthenticated = bool
  },
  updateUserInfo (state, userInfo) {
    state.userInfo = userInfo
    // eslint-disable-next-line no-console
    console.log('Claims have been updated')
  },
  error (state, data) {
    // eslint-disable-next-line no-console
    console.error(data.description)
    if (data.description && data.description.message) {
      state.error.description = data.description.message
    } else {
      state.error.description = data.description
    }
    state.error.active = typeof data.active === 'undefined' ? true : data.active
    state.error.data = data.data
  },
  conflicts (state, data) {
    Object.assign(state.conflicts, data)
  },
  confirm (state, data) {
    Object.assign(state.confirm, data)
  },
  updateDragScroll (state, data) {
    state.allowDragScroll = data
  },
  clients (state, data) {
    data.sort(function (a, b) {
      const textA = a.business_shortname.toUpperCase()
      const textB = b.business_shortname.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
    data.forEach((client, index) => {
      if (isJsonString(client.address)) {
        data[index].address = JSON.parse(client.address)
      }
      if (isJsonString(client.projects)) {
        data[index].projects = JSON.parse(client.projects)
      }
    })
    state.clients = data
  },
  contacts (state, data) {
    state.contacts = data
  },
  domains (state, data) {
    state.domains = data
  },
  projects (state, data) {
    data.forEach((project, index) => {
      data[index].ongoing = Boolean(project.ongoing)
    })
    state.projects = data
  },
  filteredProjects (state, data) {
    state.filteredProjects = data
  },
  products (state, data) {
    state.products = data
  },
  pandleDashboard (state, data) {
    Object.assign(state.pandle.dashboard.monthlyCharts, data)
  },
  addList (state, { projectId, title }) {
    if (!Array.isArray(state.projects.find((project) => project.id === projectId).lists)) {
      state.projects.find((project) => project.id === projectId).lists = []
    }
    state.projects.find((project) => project.id === projectId).lists.push(makeList(title))
  },
  updateList (state, { projectId, title, id }) {
    state.projects.find((project) => project.id === projectId).lists.find((list) => list.id === id).title = title
  },
  moveList (state, [projectId, fromIndex, toIndex]) {
    const lists = state.projects.find((project) => project.id === projectId).lists
    lists.splice(toIndex, 0, lists.splice(fromIndex, 1)[0])
  },
  archiveList (state, { projectId, listId }) {
    const list = state.projects.find((project) => project.id === projectId).lists.find((i) => i.id === listId)
    list.archived = true
    list.items.forEach((item) => {
      if (item.date) {
        item.date = null
        item.dateUNIX = null
        item.day = null
        item.dayNo = null
        item.month = null
        item.updatedBy = state.userInfo.email
        item.updatedDate = Date.now()
      }
    })
  },
  unarchiveList (state, { projectId, listId }) {
    state.projects.find((project) => project.id === projectId).lists.find((i) => i.id === listId).archived = false
  },
  removeList (state, { projectId, listId }) {
    state.projects.find((project) => project.id === projectId).lists = state.projects.find((project) => project.id === projectId).lists.filter((i) => i.id !== listId)
  },
  addCard (state, { projectId, listId, title, description, date, clientName, clientShortName, updatedBy, assignee }) {
    const list = getListById(state.projects.find((project) => project.id === projectId).lists, listId)
    const createdDate = Date.now()
    const updatedDate = Date.now()
    list.items.push(makeCard({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee }))
  },
  updateCard (state, { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, updatedBy, assignee }) {
    const updatedDate = Date.now()
    const updatedCard = makeCard({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee, id: cardId })
    const card = getCardById(state.projects.find((project) => project.id === projectId).lists, cardId)
    Object.assign(card, updatedCard)
  },
  moveCard (state, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    const fromList = typeof fromListRef === 'number'
      ? state.projects.find((project) => project.id === projectId).lists[fromListRef].items
      : getListById(projectId, fromListRef)
    const toList = typeof toListRef === 'number'
      ? state.projects.find((project) => project.id === projectId).lists[toListRef].items
      : getListById(projectId, toListRef)
    toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0])
  },
  archiveCard (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    const item = list.items.find((item) => item.id === cardId)
    item.archived = true
    item.date = null
  },
  unarchiveCard (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    const item = list.items.find((item) => item.id === cardId)
    item.archived = false
  },
  removeCard (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    list.items.splice(list.items.findIndex((item) => item.id === cardId), 1)
  },
  updateProject (state, data) {
    const item = state.projects.find((project) => project.id === data.id)
    data.ongoing = Boolean(data.ongoing)
    if (item) {
      Object.assign(item, data)
    }
  },
  moveProjectForClient (state, [clientId, fromIndex, toIndex]) {
    const projects = state.clients.find((client) => client.id === clientId).projects
    projects.splice(toIndex, 0, projects.splice(fromIndex, 1)[0])
  },
  updateContact (state, data) {
    const item = state.contacts.find((contact) => contact.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  },
  updateClient (state, data) {
    if (isJsonString(data.address)) {
      data.address = JSON.parse(data.address)
    }
    if (isJsonString(data.projects)) {
      data.projects = JSON.parse(data.projects)
    }
    const item = state.clients.find((client) => client.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  },
  updateProduct (state, data) {
    const item = state.products.find((product) => product.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  }
}

export default mutations
