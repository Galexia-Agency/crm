import { set } from 'vue'
import ClientClass from '../index'
import { getValues } from '~/models/genericProperty'

export default {
  initialise (state, { data, rootState }) {
    const allModels = []
    data.forEach((model) => {
      const hydratedModel = new ClientClass(model, rootState)
      allModels.push(getValues(hydratedModel))
    })
    allModels.sort(function (a, b) {
      const textA = a.business_shortname.toUpperCase()
      const textB = b.business_shortname.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
    state.all = [...allModels]
  },
  update (state, { data, rootState }) {
    const hydratedModel = new ClientClass(data, rootState)
    const index = state.all.findIndex((item) => item.id === data.id)
    if (index !== -1) {
      const updatedItem = { ...state.all[index], ...getValues(hydratedModel) }
      set(state.all, index, updatedItem)
    }
  }
}
