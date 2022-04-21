
export default function ({ store, app: { $axios }, error: nuxtError }) {
  const controller = new AbortController()

  $axios.interceptors.request.use((config) => {
    if (store.state.claims.email === 'demo@galexia.agency' && config.method !== 'get') {
      controller.abort()
      store.commit('error', { description: 'Changes can\'t be saved using the demo account', data: null })
    }
    return {
      ...config,
      signal: controller.signal
    }
  },
  (error) => {
    nuxtError({
      statusCode: error.response.status,
      message: error.message
    })
    return Promise.reject(error)
  })
}
