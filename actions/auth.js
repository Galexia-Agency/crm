export default {
  async updateUserInfo ({ commit }, $auth) {
    return commit('updateUserInfo', await $auth.getUser())
  }
}
