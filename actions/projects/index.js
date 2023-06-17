import addProject from './addProject'
import updateProject from './updateProject'
import updateProjectList from './updateProjectList'
import projectDatesHelper from './projectDatesHelper'
import filteredProjectsHelper from './filteredProjectsHelper'
import projectsForClientHelper from './projectsForClientHelper'
import lists from './lists'
import cards from './cards'

export default {
  ...addProject,
  ...updateProject,
  ...updateProjectList,
  ...projectDatesHelper,
  ...filteredProjectsHelper,
  ...projectsForClientHelper,
  ...lists,
  ...cards,
  async moveProject ({ commit, dispatch, getters }, [clientId, fromIndex, toIndex]) {
    await commit('moveProjectForClient', [clientId, fromIndex, toIndex])
    return await dispatch('updateClient', getters.getClientById(clientId))
  }
}
