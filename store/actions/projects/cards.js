export default {
  async addItem ({ state, commit, dispatch, getters }, { projectId, listId, title, description, date, assignee }) {
    assignee = assignee || state.claims.email
    let dayNo, day, month, dateUNIX
    if (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const JSdate = new Date(date)
      dayNo = JSdate.getDate()
      day = days[JSdate.getDay()]
      month = months[JSdate.getMonth()]
      dateUNIX = Number(new Date(date))
    }
    const clientName = getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    const clientShortName = getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.claims.email

    await commit('addItem', { projectId, listId, title, description, date, dateUNIX, dayNo, day, month, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
  },
  async updateItem ({ state, commit, dispatch, getters }, { projectId, itemId, title, description, date, createdDate, clientName, clientShortName, assignee }) {
    assignee = assignee || state.claims.email
    clientName = clientName || getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    clientShortName = clientShortName || getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.claims.email
    let dayNo, day, month, dateUNIX
    if (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const JSdate = new Date(date)
      dayNo = JSdate.getDate()
      day = days[JSdate.getDay()]
      month = months[JSdate.getMonth()]
      dateUNIX = Number(new Date(date))
    }
    await commit('updateItem', { projectId, itemId, title, description, date, dateUNIX, dayNo, day, month, createdDate, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
  },
  async moveItem ({ commit, dispatch }, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    await commit('moveItem', [projectId, fromListRef, fromIndex, toListRef, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('archiveItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('unarchiveItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('removeItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
  }
}
