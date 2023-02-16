<template>
  <main>
    <section class="span-3">
      <h2>
        Refresh Data
      </h2>
      <p style="margin-bottom: 1rem">
        This will take a while
      </p>
      <p v-if="loading" style="margin-bottom: 1rem" v-text="loadingText" />
      <div class="field is-grouped" style="flex-direction: row">
        <button class="button" @click="refreshMonthlyCharts(false)">
          Refresh Monthly Charts (last 4 months)
        </button>
        <button class="button" @click="refreshMonthlyCharts(true)">
          Refresh Monthly Charts (all time)
        </button>
        <button class="button" @click="refreshClientProfitLoss()">
          Refresh Client Profit/Loss accounts
        </button>
      </div>
    </section>
  </main>
</template>

<script>
export default {
  name: 'RefreshData',
  data () {
    return {
      loading: false,
      loadingText: 'Loading'
    }
  },
  watch: {
    loading () {
      let timeout
      if (this.loading === true) {
        timeout = window.setInterval(() => {
          this.loadingText += '.'
        }, 1000)
      } else {
        window.clearInterval(timeout)
        this.loadingText = 'Loading'
      }
    }
  },
  mounted () {
    // If Galexia doesn't have any expenses it means the client profit / loss cron failed, so we're forcing it on component load here
    if (this.$store.getters.getClientById(30)) {
      if (!this.$store.getters.getClientById(30).expenses) {
        this.refreshClientProfitLoss()
      }
    }
  },
  methods: {
    async refreshMonthlyCharts (force) {
      this.loading = true
      let response
      try {
        if (force) {
          response = await this.$axios.$get('https://api.galexia.agency/monthly_stats?force=true')
        } else {
          response = await this.$axios.$get('https://api.galexia.agency/monthly_stats')
        }
        this.$store.commit('pandleDashboard', response)
      } catch (e) {
        this.$store.commit('error', e)
      }
      this.loading = false
      this.loadingText = 'Loading'
      this.$parent.$forceUpdate()
    },
    async refreshClientProfitLoss () {
      this.loading = true
      try {
        await this.$axios.$get('https://api.galexia.agency/project_profit_loss')
        await this.$store.dispatch('nuxtClientInit', this.$store, this.$nuxt.context)
      } catch (e) {
        this.$store.commit('error', e)
      }
      this.loading = false
      this.loadingText = 'Loading'
      this.$parent.$forceUpdate()
    }
  }
}
</script>
