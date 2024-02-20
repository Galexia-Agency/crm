import ContactClass from '../index'
import { addModel, updateModel } from '~/models/reusableModelActions'

export default {
  async add ({ commit, dispatch, rootState }, data) {
    return await addModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ContactClass, data, endpoint: 'contacts' })
  },
  async update ({ commit, dispatch, rootState }, data) {
    return await updateModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ContactClass, data, endpoint: 'contacts' })
  },
  async showContact ({ commit, state }, contact) {
    let resolvePromise
    commit('display', { contact, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.displayContact.promise
  },
  hideContact ({ commit }) {
    commit('display', {
      contact: null,
      reveal: false,
      promise: null,
      resolvePromise: null
    })
  }
}
