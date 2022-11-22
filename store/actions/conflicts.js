export default {
  conflicts ({ commit, state }, data) {
    // Commit data to conflicts and set reveal to true to open the modal
    commit('conflicts', { ...data, reveal: true })
    // Delay promise shim - need to wait for 1 second before the above data is committed and we can listen for the promise
    function delay (t, v) {
      return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
      })
    }
    // Return a promise so we can await it
    return new Promise((resolve) => {
      return delay(1000).then(async function () {
        return resolve(await state.conflicts.promise)
      })
    })
  }
}
