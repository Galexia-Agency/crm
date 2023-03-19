import { redirectToLogin } from '~/utils/auth'

async function getAccessToken ({ $auth, route, app }) {
  // We have to call isAuthenticated() first before we can get the access token
  const isAuthenticated = await $auth.isAuthenticated()
  if (!isAuthenticated) {
    redirectToLogin({ route, app, error: 'We are not authenticated' })
  }
  const accessToken = await $auth.getAccessToken()
  if (!accessToken) {
    redirectToLogin({ route, app, error: 'There was a problem getting the access token' })
  }
  return accessToken
}

export default function ({ route, app, $axios, $api, $auth }) {
  $axios.interceptors.request.use(async (config) => {
    config.headers.common.Authorization = `Bearer ${await getAccessToken({ route, app, $auth })}`
    return config
  })
  $api.interceptors.request.use(async (config) => {
    config.headers.common.Authorization = `Bearer ${await getAccessToken({ route, app, $auth })}`
    return config
  })
}
