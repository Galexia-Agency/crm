export default {
  async initialise ({ dispatch }, { property, ours, theirs }) {
    const resolvedModel = { ...ours }

    // Loop through each property and resolve conflicts
    for (const key of Object.keys(ours)) {
      // If the property is not hidden and it has changed
      if (!ours[key].hidden && ours[key].value !== theirs[key].value) {
        resolvedModel[key].value = await dispatch('resolve', {
          property: property[key],
          ourPropertyValue: ours[key].value,
          theirPropertyValue: theirs[key].value
        })
      }
    }

    // Return the resolved model values
    const resolvedModelValues = {}
    for (const key in resolvedModel) {
      if (Object.prototype.hasOwnProperty.call(resolvedModel, key) && Object.prototype.hasOwnProperty.call(resolvedModel[key], 'value')) {
        resolvedModelValues[key] = resolvedModel[key].value
      }
    }
    return resolvedModelValues
  },
  async resolve ({ commit, state }, { property, ourPropertyValue, theirPropertyValue }) {
    let resolvePromise
    commit('update', { property, ourPropertyValue, theirPropertyValue, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    const response = await state.promise
    return response
  }
}
