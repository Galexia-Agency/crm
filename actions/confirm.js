export default {
  async confirm ({ commit, state }, text = 'Are you sure?') {
    let resolvePromise
    commit('confirm', { text, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.confirm.promise
  }
}
