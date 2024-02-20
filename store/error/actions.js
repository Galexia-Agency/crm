export default {
  async initialise ({ commit, state }, message) {
    let resolvePromise
    commit('update', { message, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.promise
  }
}
