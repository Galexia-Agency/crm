import addProject from './addProject'
import updateProject from './updateProject'
import updateProjectList from './updateProjectList'
import projectDatesHelper from './projectDatesHelper'
import lists from './lists'
import cards from './cards'

export default {
  ...addProject,
  ...updateProject,
  ...updateProjectList,
  ...projectDatesHelper,
  ...lists,
  ...cards,
  async moveProject ({ dispatch, getters }, [clientId, fromIndex, toIndex]) {
    const client = getters.getClientById(clientId)
    const updatedClient = { ...client }
    const projects = getters.getProjectsForClient(client)
    projects.splice(toIndex, 0, projects.splice(fromIndex, 1)[0])
    updatedClient.projects = projects
    return await dispatch('updateClient', updatedClient)
  }
}
