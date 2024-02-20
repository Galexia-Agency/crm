import mutations from './mutations'
import actions from './actions'
import getters from './getters'

const state = () => ({
  all: []
})

export default {
  namespaced: true,
  state,
  actions,
  mutations,
  getters
}
