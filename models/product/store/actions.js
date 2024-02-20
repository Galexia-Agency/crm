import ProductClass from '../index'
import { addModel, updateModel } from '~/models/reusableModelActions'

export default {
  async add ({ commit, dispatch, rootState }) {
    return await addModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ProductClass, endpoint: 'products' })
  },
  async update ({ commit, dispatch, rootState }, data) {
    return await updateModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ProductClass, data, endpoint: 'products' })
  }
}
