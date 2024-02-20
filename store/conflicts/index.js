import mutations from './mutations'
import actions from './actions'

const state = () => ({
  promise: null,
  resolvePromise: null,
  property: {},
  ourPropertyValue: null,
  theirPropertyValue: null,
  reveal: false
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
