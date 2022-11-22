import addProject from './addProject'
import updateProject from './updateProject'
import updateProjectList from './updateProjectList'
import lists from './lists'
import cards from './cards'

export default {
  ...addProject,
  ...updateProject,
  ...updateProjectList,
  ...lists,
  ...cards
}
