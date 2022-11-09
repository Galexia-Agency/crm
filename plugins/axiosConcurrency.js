// Axios Concurrency
export default function ({ store, app: { $axios } }, inject) {
  // Only allow 1 request to the server at any one time so that we avoid issues with out of sync updated_at times
  const MAX_REQUESTS_COUNT = 1
  // Set the interval to check for completed requests
  const INTERVAL_MS = 10
  // Store pending requests in this variable
  let PENDING_REQUESTS = 0
  // Create new axios instance
  const api = $axios.create({})
  /**
   * Axios Request Interceptor
   */
  api.interceptors.request.use(function (config) {
    return new Promise((resolve, reject) => {
      const interval = setInterval(() => {
        if (PENDING_REQUESTS < MAX_REQUESTS_COUNT) {
          PENDING_REQUESTS++
          clearInterval(interval)
          // Refresh the updated_at time from the store so that we're always at the latest point
          config.data.updated_at = store.getters.getProjectById(config.data.id).updated_at
          resolve(config)
        }
      }, INTERVAL_MS)
    })
  })
  /**
   * Axios Response Interceptor
   */
  api.interceptors.response.use(function (response) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.resolve(response)
  }, function (error) {
    PENDING_REQUESTS = Math.max(0, PENDING_REQUESTS - 1)
    return Promise.reject(error)
  })
  // Inject to context as $api
  inject('api', api)
}
