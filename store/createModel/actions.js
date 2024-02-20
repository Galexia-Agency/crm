export default {
  async initialise ({ commit, state }, model) {
    let resolvePromise
    commit('update', { model, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.promise
  }
}
