import mutations from './mutations'
import actions from './actions'

const state = () => ({
  promise: null,
  resolvePromise: null,
  text: '',
  reveal: false
})

export default {
  namespaced: true,
  state,
  actions,
  mutations
}
