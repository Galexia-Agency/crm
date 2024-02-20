const mutations = {
  loading (state, bool) {
    state.loading = bool
  },
  isClientLoaded (state, bool) {
    state.isClientLoaded = bool
  },
  isRenewingTokens (state, bool) {
    state.isRenewingTokens = bool
  },
  isAuthenticated (state, bool) {
    state.isAuthenticated = bool
  },
  updateUserInfo (state, userInfo) {
    state.userInfo = userInfo
    // eslint-disable-next-line no-console
    console.log('Claims have been updated')
  },
  updateDragScroll (state, data) {
    state.allowDragScroll = data
  },
  pandleDashboard (state, data) {
    state.pandleMonthlyCharts = [...data]
  }
}

export default mutations
