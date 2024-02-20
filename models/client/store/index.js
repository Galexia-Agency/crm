import contact from '../../contact/store/index'
import project from '../../project/store/index'
// import domain from '../../domain/index'
import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = () => ({
  all: []
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
  modules: {
    contact,
    project
    // domain
  }
}
