export default function ({ $axios, $api, $auth }) {
  $axios.interceptors.request.use(async (config) => {
    config.headers.common.Authorization = `Bearer ${await $auth.getAccessToken()}`
    return config
  })
  $api.interceptors.request.use(async (config) => {
    config.headers.common.Authorization = `Bearer ${await $auth.getAccessToken()}`
    return config
  })
}
