export default {
  async updateUserInfo ({ commit }, $auth) {
    return commit('updateUserInfo', await $auth.getUser())
  },
  updateAuthHeaders ({ state }, context) {
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      const accessToken = await context.$auth.getAccessToken()
      if (!accessToken) {
        reject(Error('We couldn\'t get the access token'))
      }
      if (state.accessToken !== accessToken) {
        context.$axios.setHeader('Authorization', `Bearer ${accessToken}`)
        context.$api.setHeader('Authorization', `Bearer ${accessToken}`)
        // eslint-disable-next-line no-console
        console.log('Auth headers have been updated')
      }
      resolve()
    })
  }
}
