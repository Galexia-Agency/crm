<template>
  <main>
    <section class="span-3">
      <h2>
        Refresh Data
      </h2>
      <p style="margin-bottom: 1rem">
        This will take a while
      </p>
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
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(
      'client',
      {
        getClientExpenses: 'getExpenses',
        getClientById: 'getById'
      }
    )
  },
  mounted () {
    // If Galexia doesn't have any expenses it means the client profit / loss cron failed, so we're forcing it on component load here
    if (this.getClientById(30) && !this.getClientExpenses(this.getClientById(30)) && process.env.NODE_ENV === 'production') {
      this.refreshClientProfitLoss()
    }
  },
  methods: {
    async refreshMonthlyCharts (force) {
      let response
      if (force) {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats?force=true')
      } else {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats')
      }
      this.$store.commit('pandleDashboard', response)
    },
    async refreshClientProfitLoss () {
      await this.$axios.$get('https://api.galexia.agency/project_profit_loss')
      await this.$store.dispatch('nuxtClientInit', this.$store, this.$nuxt.context)
    }
  }
}
</script>
