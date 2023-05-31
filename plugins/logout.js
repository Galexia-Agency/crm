export default (ctx, inject) => {
  inject('logout', async () => {
    ctx.store.commit('loading', true)
    await ctx.app.$auth.signOut({ postLogoutRedirectUri: window.location.host === 'localhost:8888' ? 'http://' + window.location.host : 'https://' + window.location.host })
    localStorage.clear()
    sessionStorage.clear()
    // Delete all cookies
    const COOKIES = document.cookie.split(';')
    for (let i = 0; i < COOKIES.length; i++) {
      const COOKIE = COOKIES[i]
      const EQ_POS = COOKIE.indexOf('=')
      const NAME = EQ_POS > -1 ? COOKIE.substr(0, EQ_POS) : COOKIE
      document.cookie = NAME + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
    }
    ctx.store.commit('loading', false)
  })
}
