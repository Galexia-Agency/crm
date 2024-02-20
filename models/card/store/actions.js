export default {
  async add ({ state, commit, dispatch, getters, rootState, rootCommit }, { projectId, listId, title, description = '', date = '', assignee = '' }) {
    assignee = assignee || rootState.userInfo.email
    const project = getters['client/project/getById'](projectId)
    const clientId = project.client_id
    const client = getters['client/getById'](clientId)
    const clientName = client.business_name
    const clientShortName = client.business_shortname
    const updatedBy = rootState.userInfo.email
    const list = getters['client/project/list/getById'](listId)
    const createdDate = Date.now()
    const updatedDate = createdDate
    const card = makeCard({ title, description, date, createdDate, updatedDate, clientName, clientShortName, updatedBy, assignee })

    list.items.push(card)

    rootCommit('client/project/update', { projectId, listId, title, description, date, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('list/sync', projectId, { root: true })
  },
  async update ({ state, commit, dispatch, getters, rootState }, { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, assignee }) {
    assignee = assignee || rootState.userInfo.email
    clientName = clientName || getters['client/getById'](getters['client/project/getById'](projectId).client_id).business_name
    clientShortName = clientShortName || getters['client/getById'](getters['client/project/getById'](projectId).client_id).business_shortname
    const updatedBy = rootState.userInfo.email
    commit('update', { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('list/sync', projectId, { root: true })
  },
  async move ({ commit, dispatch }, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    commit('move', [projectId, fromListRef, fromIndex, toListRef, toIndex])
    return await dispatch('list/sync', projectId, { root: true })
  },
  async archive ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to archive this item?', { root: true }))) {
      return
    }
    commit('archive', { projectId, cardId })
    return await dispatch('list/sync', projectId, { root: true })
  },
  async unarchive ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to unarchive this item?', { root: true }))) {
      return
    }
    commit('unarchive', { projectId, cardId })
    return await dispatch('list/sync', projectId, { root: true })
  },
  async remove ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to delete this item?', { root: true }))) {
      return
    }
    commit('remove', { projectId, cardId })
    return await dispatch('list/sync', projectId, { root: true })
  }
}
