export default {
  async addList ({ commit, dispatch }, { projectId, title }) {
    await commit('addList', { projectId, title })
    return await dispatch('updateProjectList', projectId)
  },
  async updateList ({ commit, dispatch }, { projectId, title, id }) {
    await commit('updateList', { projectId, title, id })
    return await dispatch('updateProjectList', projectId)
  },
  async moveList ({ commit, dispatch }, [projectId, fromIndex, toIndex]) {
    await commit('moveList', [projectId, fromIndex, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveList ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to archive this list?'))) {
      return
    }
    await commit('archiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveList ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to unarchive this list?'))) {
      return
    }
    await commit('unarchiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeList ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm', 'Are you sure you want to delete this list?'))) {
      return
    }
    await commit('removeList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  }
}
