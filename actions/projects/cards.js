export default {
  async addCard ({ state, commit, dispatch, getters }, { projectId, listId, title, description = '', date = '', assignee = '' }) {
    assignee = assignee || state.userInfo.email
    const clientName = getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    const clientShortName = getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.userInfo.email

    await commit('addCard', { projectId, listId, title, description, date, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
  },
  async updateCard ({ state, commit, dispatch, getters }, { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, assignee }) {
    assignee = assignee || state.userInfo.email
    clientName = clientName || getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    clientShortName = clientShortName || getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.userInfo.email
    await commit('updateCard', { projectId, cardId, title, description, date, createdDate, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
  },
  async moveCard ({ commit, dispatch }, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    await commit('moveCard', [projectId, fromListRef, fromIndex, toListRef, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveCard ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to archive this item?'))) {
      return
    }
    await commit('archiveCard', { projectId, cardId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveCard ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to unarchive this item?'))) {
      return
    }
    await commit('unarchiveCard', { projectId, cardId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeCard ({ commit, dispatch }, { projectId, cardId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to delete this item?'))) {
      return
    }
    await commit('removeCard', { projectId, cardId })
    return await dispatch('updateProjectList', projectId)
  }
}
