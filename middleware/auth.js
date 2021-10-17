import Vue from 'vue'

export default async function () {
  if (await Vue.prototype.$auth.isAuthenticated()) {
    Vue.prototype.$auth.tokenManager.renew('accessToken')
  }
}
