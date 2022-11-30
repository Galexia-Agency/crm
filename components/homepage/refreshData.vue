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
  methods: {
    async refreshMonthlyCharts (force) {
      this.loading = true
      let response
      if (force) {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats?force=true')
      } else {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats')
      }
      this.$store.commit('pandleDashboard', response)
      this.loading = false
    },
    async refreshClientProfitLoss () {
      this.loading = true
      await this.$axios.$get('https://api.galexia.agency/project_profit_loss')
      await this.$store.dispatch('nuxtClientInit', this.$store, this.$nuxt.context)
      this.loading = false
    }
  }
}
</script>
