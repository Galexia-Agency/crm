import { Store } from 'vuex'
import mutations from './mutations'
// Models
import product from '~/models/product/store'
import client from '~/models/client/store'
// Modals
import createModel from '~/store/createModel'
import conflicts from '~/store/conflicts'
import error from '~/store/error'
import confirm from '~/store/confirm'
// Other
import apiQueue from '~/store/apiQueue'

const state = () => ({
  loading: false,
  isClientLoaded: false,
  isRenewingTokens: false,
  isAuthenticated: false,
  allowDragScroll: true,
  userInfo: [],
  pandleMonthlyCharts: []
})

const createStore = () => {
  return new Store({
    modules: {
      // Models
      product,
      client,

      // Modals
      createModel,
      conflicts,
      error,
      confirm,

      // Other
      apiQueue
    },
    state,
    mutations,
    actions: {
      async nuxtClientInit ({ commit, state, rootState, dispatch }, { route, $auth, $axios, app }) {
        commit('loading', true)
        commit('isClientLoaded', false)
        if (await $auth.manuallyRenewTokens()) {
          if (
            (route &&
            route.name &&
            route.name === 'login') ||
            (app &&
            app.router &&
            app.router.app &&
            app.router.app._route &&
            app.router.app._route.name &&
            app.router.app._route.name === 'login')
          ) {
            // We do this to go home as soon as possible
            app.router.push('/')
            // We then have to do this to stop nuxt redirecting back to the login page when it's initialised
            window.onNuxtReady(() => { app.router.push('/') })
          }
          // eslint-disable-next-line no-console
          console.log('Starting the initial get')
          await Promise.all([
            $axios.$get('https://api.galexia.agency/get', {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }),
            // If userInfo is already in the store, we don't need to fetch it again
            state.userInfo.length === 0 ? $auth.getUser() : Promise.resolve(null)
          ]).then(([response, userInfo]) => {
            commit('updateUserInfo', userInfo)
            commit('client/initialise', { data: response[0], rootState })
            commit('client/contact/initialise', { data: response[1], rootState })
            // commit('domain/initialise', { data: response[2], rootState })
            commit('client/project/initialise', { data: response[3], rootState })
            commit('product/initialise', { data: response[4], rootState })
            commit('pandleDashboard', response[5])
            commit('isClientLoaded', true)
            commit('loading', false)
            // eslint-disable-next-line no-console
            console.log('Initial get has completed')
            // Set up our queue to process every second
            window.setInterval(() => {
              dispatch('apiQueue/process')
            }, 1000)
          })
        }
      }
    }
  })
}

export default createStore
