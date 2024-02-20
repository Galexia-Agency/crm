export default {
  process ({ state, commit }) {
    for (const request of state.requests) {
      try {
        let response
        switch (request.method) {
          case 'GET':
            response = this.$axios.$get(`https://api.galexia.agency/${request.endpoint}`)
            break
          case 'PUT':
            response = this.$axios.$put(`https://api.galexia.agency/${request.endpoint}`, {
              ...request.payload
            }, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            })
            break
          case 'POST':
            response = this.$axios.$post(`https://api.galexia.agency/${request.endpoint}`, {
              ...request.payload
            }, {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            })
            break
        }
        request.resolve(response)
      } catch (e) {
        request.reject(e)
      }
    }
    commit('update', { requests: [] })
  }
}
