export default {
  async initialise ({ commit, state }, text = 'Are you sure?') {
    let resolvePromise
    commit('update', { text, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.promise
  }
}
