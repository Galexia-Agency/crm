import mutations from './mutations'
import actions from './actions'

const state = () => ({
  requests: []
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
