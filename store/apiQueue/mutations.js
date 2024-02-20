export default {
  update (state, data) {
    Object.assign(state, data)
  },
  add (state, data) {
    const existingRequest = state.requests.find((request) => request.endpoint === data.endpoint)

    if (existingRequest) {
      existingRequest.payload = data.payload
    } else {
      data.promise = new Promise((resolve, reject) => {
        data.resolve = resolve
        data.reject = reject
      })
      state.requests.push(data)
    }
    return data
  }
}
