import { getValues } from '~/models/genericProperty'
import { unflattenObject } from '~/plugins/mixins/json'

function stringifyProperties (modelValues) {
  for (const key in modelValues) {
    // Arrays are a typeof object apparently
    if (typeof modelValues[key] === 'object') {
      modelValues[key] = JSON.stringify(modelValues[key])
    }
  }
  return modelValues
}

export function prepareModelForUpload (model) {
  let modelToReturn = { ...model }
  // Return the values
  modelToReturn = getValues(modelToReturn)
  // Unflatten the model
  modelToReturn = unflattenObject(modelToReturn)
  // Stringify JSON properties
  return stringifyProperties(modelToReturn)
}

export async function addModel ({ commit, dispatch, rootState, ClassType, data, endpoint }) {
  // Open the modal to create a new model. This returns the model, or false
  const modelToAdd = await dispatch('createModel/initialise', new ClassType(data, rootState), { root: true })

  if (modelToAdd) {
    const request = await commit('apiQueue/add', {
      method: 'PUT',
      endpoint,
      payload: { ...prepareModelForUpload(modelToAdd) }
    }, { root: true })

    const response = await request.promise

    return commit('initialise', { data: response, rootState })
  }
}

export async function updateModel ({ axios, commit, dispatch, rootState, ClassType, data, endpoint, force }) {
  let updatedModel = new ClassType(data, rootState)
  if (!force) {
    // Open the modal to create a new model. This returns the model, or false
    updatedModel = await dispatch('createModel/initialise', updatedModel, { root: true })
  }
  if (updatedModel) {
    try {
      const request = await commit('apiQueue/add', {
        method: 'POST',
        endpoint,
        payload: { ...prepareModelForUpload(updatedModel) }
      }, { root: true })

      const response = await request.promise

      return commit('update', { data: response[0], rootState })
    } catch (e) {
      if (await e.response && await e.response.status === 429) {
        const conflictResolvedModel = await dispatch(
          'conflicts/initialise',
          {
            property: new ClassType(),
            ours: new ClassType(updatedModel),
            theirs: new ClassType(e.response.data[0])
          },
          {
            root: true
          }
        )
        const request = await commit('apiQueue/add', {
          method: 'POST',
          endpoint,
          payload: { ...conflictResolvedModel, force: true }
        }, { root: true })

        const response = await request.promise
        return commit('update', { data: response[0], rootState })
      }
    }
  }
}
