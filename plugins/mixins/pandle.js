import Vue from 'vue'

Vue.mixin({
  methods: {
    async pandleBootstrap () {
      let pandle
      const self = this

      async function pandleSignin () {
        const response = await self.$axios.get(window.location.origin + '/.netlify/functions/sign_in')
        sessionStorage.setItem('pandle', JSON.stringify(response))
      }

      function pandleSetUp () {
        pandle = JSON.parse(sessionStorage.getItem('pandle'))
        // Set pandle headers
        self.$axios.setHeader('access-token', pandle.data['access-token'])
        self.$axios.setHeader('client', pandle.data.client)
        self.$axios.setHeader('uid', pandle.data.uid)
      }

      if (this.claims.groups.includes('billing')) {
        /* Pandle */
        // If pandle data is not set in local storage
        if (!sessionStorage.getItem('pandle')) {
          await pandleSignin()
        } else if (JSON.parse(sessionStorage.getItem('pandle')).data.expiry) {
          // Check if pandle data has expired
          const unixTimestamp = JSON.parse(sessionStorage.getItem('pandle')).data.expiry
          if (new Date() > new Date(unixTimestamp * 1000)) {
            await pandleSignin()
          }
        } else {
          this.$store.commit('error', { description: 'Cannot sign in to Pandle' })
        }
        pandleSetUp()
        // Test login worked
        try {
          await this.$axios.post(window.location.origin + '/.netlify/functions/request',
            {
              url: '/companies',
              type: 'GET'
            }
          )
        } catch (e) {
          await pandleSignin()
          pandleSetUp()
        }
      }
    }
  }
})
