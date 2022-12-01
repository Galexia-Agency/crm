import { makeItem, makeList } from '~/utils/data'
import { getItemById, getListById, getListByItemId } from '~/utils/board'
import { diffDays } from '~/plugins/mixins/dates'
import { safeURL } from '~/plugins/mixins/urls'

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
    Object.assign(state.conflicts, data)
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
  projectDatesHelper (state) {
    for (const project in state.projects) {
      const client = state.clients.find(client => client.id === state.projects[project].client_id)
      state.projects[project].client_name = client.business_name
      state.projects[project].link = '/client/' + client.business_shortname.toLowerCase() + '#' + safeURL(state.projects[project].name)
      state.projects[project].daysToStart = 0
      state.projects[project].daysToComplete = 0
      state.projects[project].daysWithUs = 0
      if (state.projects[project].enquiry_date && state.projects[project].start_date) {
        state.projects[project].daysToStart = diffDays(state.projects[project].enquiry_date, state.projects[project].start_date)
        if (!state.projects[project].ongoing) {
          if (state.projects[project].completion_date) {
            state.projects[project].daysToComplete = diffDays(state.projects[project].start_date, state.projects[project].completion_date)
          } else {
            state.projects[project].daysToComplete = diffDays(state.projects[project].start_date, null) + '+'
          }
        }
        if (state.projects[project].status === 'On-Going') {
          state.projects[project].daysWithUs = diffDays(state.projects[project].start_date, null)
        }
      }
    }
    state.projects.sort(function (a, b) {
      const textA = a.client_name.toUpperCase()
      const textB = b.client_name.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
  },
  filteredProjectsHelper (state) {
    const hotLeads = []
    const coldLeads = []
    const development = []
    const paused = []
    const inHouse = []
    const onGoing = []
    const closedLead = []
    const completed = []
    const cancelled = []
    const other = []
    state.clients.forEach((client) => {
      state.projects.forEach((project) => {
        if (project.client_id === client.id) {
          if (project.status === 'Lead') {
            hotLeads.push(project)
          } else if (project.status === 'Hot Lead') {
            hotLeads.push(project)
          } else if (project.status === 'Cold Lead') {
            coldLeads.push(project)
          } else if (project.status === 'Development') {
            development.push(project)
          } else if (project.status === 'Paused') {
            paused.push(project)
          } else if (project.status === 'In House') {
            inHouse.push(project)
          } else if (project.status === 'On-Going') {
            onGoing.push(project)
          } else if (project.status === 'Closed Lead') {
            closedLead.push(project)
          } else if (project.status === 'Completed') {
            completed.push(project)
          } else if (project.status === 'Cancelled') {
            cancelled.push(project)
          } else if (this.claims.groups.includes('admin')) {
            other.push(project)
          }
        }
      })
      if (
        hotLeads.find(e => e.client_id === client.id) === undefined &&
        coldLeads.find(e => e.client_id === client.id) === undefined &&
        development.find(e => e.client_id === client.id) === undefined &&
        paused.find(e => e.client_id === client.id) === undefined &&
        inHouse.find(e => e.client_id === client.id) === undefined &&
        onGoing.find(e => e.client_id === client.id) === undefined &&
        closedLead.find(e => e.client_id === client.id) === undefined &&
        completed.find(e => e.client_id === client.id) === undefined &&
        cancelled.find(e => e.client_id === client.id) === undefined &&
        state.claims.groups.includes('admin')
      ) {
        other.push(client)
      }
    })
    state.filteredProjects = {
      hotLeads,
      coldLeads,
      development,
      paused,
      inHouse,
      onGoing,
      closedLead,
      completed,
      cancelled,
      other
    }
  },
  products (state, data) {
    state.products = data
  },
  pandleDashboard (state, data) {
    Object.assign(state.pandle.dashboard.monthlyCharts, data)
  },
  updatePandleDataHelper (state) {
    for (const client in state.clients) {
      // Set default values
      state.clients[client].expenses = 0
      state.clients[client].revenue = 0
      state.clients[client].profit = 0
      state.clients[client].completion_amount = 0
      const projects = state.projects.filter(project => project.client_id === state.clients[client].id)
      if (projects.length > 0) {
        for (const project in projects) {
          // Set client expenses
          if (projects[project].bb_expenses) {
            state.clients[client].expenses += parseFloat(projects[project].bb_expenses)
          }
          if (projects[project].pandle_expenses) {
            state.clients[client].expenses += Math.abs(parseFloat(projects[project].pandle_expenses))
          }
          // Set client revenue
          if (projects[project].bb_revenue) {
            state.clients[client].revenue += parseFloat(projects[project].bb_revenue)
          }
          if (projects[project].pandle_income) {
            state.clients[client].revenue += parseFloat(projects[project].pandle_income)
          }
          // Set client completion amount
          if (projects[project].completion_amount !== null) {
            state.clients[client].completion_amount += parseFloat(projects[project].completion_amount)
          }
        }
      }
      // Set client profit
      if (state.clients[client].revenue !== undefined && state.clients[client].expenses !== undefined) {
        state.clients[client].profit = parseFloat(state.clients[client].revenue) - parseFloat(state.clients[client].expenses)
        if (state.clients[client].profit > 0) {
          state.clients[client].profit_margin = (state.clients[client].profit / state.clients[client].revenue) * 100
        } else {
          state.clients[client].profit_margin = 0
        }
      }
    }
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
  },
  updateProduct (state, data) {
    const item = state.products.find(product => product.id === data.id)
    if (item) {
      Object.assign(item, data)
    }
  }
}

export default mutations
