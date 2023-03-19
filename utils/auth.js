/* eslint-disable no-console */
export function redirectToLogin ({ route, app, error }) {
  console.error(error)
  console.error('You are not logged in')
  if (route.path !== '/login') {
    console.log('Redirecting to login page')
    app.router.push('/login')
    window.onNuxtReady(() => { app.router.push('/login') })
  } else {
    console.log('You are already on the login page')
  }
}
