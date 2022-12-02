export default {
  async addList ({ commit, dispatch }, { projectId, title }) {
    await commit('addList', { projectId, title })
    return await dispatch('updateProjectList', projectId)
  },
  async editList ({ commit, dispatch }, { projectId, title, id }) {
    await commit('editList', { projectId, title, id })
    return await dispatch('updateProjectList', projectId)
  },
  async moveList ({ commit, dispatch }, [projectId, fromIndex, toIndex]) {
    await commit('moveList', [projectId, fromIndex, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveList ({ commit, dispatch }, { projectId, listId }) {
    await commit('archiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveList ({ commit, dispatch }, { projectId, listId }) {
    await commit('unarchiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeList ({ commit, dispatch }, { projectId, listId }) {
    await commit('removeList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  }
}
