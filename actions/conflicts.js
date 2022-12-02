export default {
  async conflicts ({ commit, state }, data) {
    let resolvePromise
    commit('conflicts', { ...data, reveal: true, promise: new Promise((resolve) => { resolvePromise = resolve }), resolvePromise })
    return await state.conflicts.promise
  }
}
