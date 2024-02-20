import CardClass from '../index'
import { getValues } from '~/models/genericProperty'

export default {
  add (state, { projectId, listId, title, description, date, clientName, clientShortName, updatedBy, assignee }) {
    // getListById is defined in a parent vuex module called project. It is a getter. How can I access it?
    const list = getListById(state.projects.find((project) => project.id === projectId).lists, listId)
    const createdDate = Date.now()
    const updatedDate = Date.now()
    list.items.push(makeCard({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee }))
  },
  update (state, { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, updatedBy, assignee }) {
    const updatedDate = Date.now()
    const updatedCard = makeCard({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee, id: cardId })
    const card = getCardById(state.projects.find((project) => project.id === projectId).lists, cardId)
    Object.assign(card, updatedCard)
  },
  move (state, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    const fromList = typeof fromListRef === 'number'
      ? rootState.project.all.find((project) => project.id === projectId).lists[fromListRef].items
      : getListById(projectId, fromListRef)
    const toList = typeof toListRef === 'number'
      ? state.projects.find((project) => project.id === projectId).lists[toListRef].items
      : getListById(projectId, toListRef)
    toList.splice(toIndex, 0, fromList.splice(fromIndex, 1)[0])
  },
  archive (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    const item = list.items.find((item) => item.id === cardId)
    item.archived = true
    item.date = null
  },
  unarchive (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    const item = list.items.find((item) => item.id === cardId)
    item.archived = false
  },
  remove (state, { projectId, cardId }) {
    const list = getListByCardId(state.projects.find((project) => project.id === projectId).lists, cardId)
    list.items.splice(list.items.findIndex((item) => item.id === cardId), 1)
  }
}
