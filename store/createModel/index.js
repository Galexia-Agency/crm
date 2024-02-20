import mutations from './mutations'
import actions from './actions'

const state = () => ({
  promise: null,
  resolvePromise: null,
  model: {},
  reveal: false
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
