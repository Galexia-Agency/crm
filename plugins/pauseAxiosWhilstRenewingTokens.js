export default function ({ $axios, $api, store }) {
  function pauseWhilstRenewing (config) {
    // Check if token renewal is in progress
    if (!store.state.isRenewingTokens) {
      // Token renewal is not in progress, so proceed with the request
      return config
    } else {
      // Token renewal is in progress, so pause the request
      return new Promise((resolve, reject) => {
        store.watch((state) => state.isRenewingTokens, (renewingTokens) => {
          if (renewingTokens) {
            // Token renewal is still in progress, so keep waiting

          } else {
            // Token renewal is complete, so resume the request
            resolve(config)
          }
        })
      })
    }
  }
  $axios.interceptors.request.use((config) => {
    return pauseWhilstRenewing(config)
  })
  $api.interceptors.request.use((config) => {
    return pauseWhilstRenewing(config)
  })
}
