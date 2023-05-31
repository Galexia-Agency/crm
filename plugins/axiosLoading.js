export default function ({ $axios, $api, store }) {
  $axios.interceptors.request.use((config) => {
    store.commit('loading', true)
    return config
  })
  $api.interceptors.request.use((config) => {
    store.commit('loading', true)
    return config
  })
  $axios.interceptors.response.use((config) => {
    store.commit('loading', false)
    return config
  })
  $api.interceptors.response.use((config) => {
    store.commit('loading', false)
    return config
  })
}
