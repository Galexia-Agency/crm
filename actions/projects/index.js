import addProject from './addProject'
import updateProject from './updateProject'
import updateProjectList from './updateProjectList'
import projectDatesHelper from './projectDatesHelper'
import filteredProjectsHelper from './filteredProjectsHelper'
import lists from './lists'
import cards from './cards'

export default {
  ...addProject,
  ...updateProject,
  ...updateProjectList,
  ...projectDatesHelper,
  ...filteredProjectsHelper,
  ...lists,
  ...cards
}
