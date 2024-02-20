import mutations from './mutations'
import actions from './actions'

const state = () => ({
  promise: null,
  resolvePromise: null,
  message: '',
  reveal: false
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
