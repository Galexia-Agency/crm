import getters from './getters'
import mutations from './mutations'
import actions from './actions'

const state = () => ({
  all: [],
  displayContact: {
    contact: null,
    reveal: false,
    promise: null,
    resolvePromise: null
  }
})

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
