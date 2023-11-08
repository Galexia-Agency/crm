<style lang="scss">
  .home {
    position: relative;
    height: 100vh;
    overflow-y: auto;
    h1 {
      padding: 2rem;
      padding-bottom: 0;
      @media (max-width: 1000px) {
        padding: 1.5rem;
        padding-top: 4rem
      }
    }
    main {
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      width: auto;
      margin: auto;
      overflow-y: auto;
      @media (max-width: 1000px) {
        min-width: 97.5vw;
        padding-top: 0
      }
    }
    section {
      width: 100%;
      max-width: 450px;
      &.chart {
        width: calc(100vw - 4rem);
        max-width: 350px
      }
      &.span-2 {
        max-width: calc(900px + 2rem);
        >div:has(canvas) {
          height: 400px
        }
      }
      &.span-3 {
        max-width: 100%;
        >div:has(canvas) {
          height: 400px
        }
      }
    }
  }
</style>

<template>
  <div class="home">
    <h1>Welcome back {{ userInfo.name }}</h1>
    <HomepageToDoLists />
    <!-- <HomepageNetData /> -->
    <HomepageClientStatusGraphs />
    <template v-if="userInfo.groups.includes('billing')">
      <HomepageMoneyBreakdown />
      <HomepageMonthlyCharts />
      <HomepageProjectTimelines />
      <HomepageClientProfitLoss />
      <HomepageRefreshData />
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'Home',
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  mounted () {
    document.addEventListener('visibilitychange', this.visibleChange)
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.visibleChange)
  },
  methods: {
    visibleChange () {
      if (document.visibilityState !== 'visible') {
        this.$store.dispatch('nuxtClientInit', this.$store, this.$nuxt.context)
      }
    }
  }
}
</script>
