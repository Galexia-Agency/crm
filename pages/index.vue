<style lang="scss">
  .home {
    overflow-y: auto;
    height: 100vh;
    position: relative;
    h1 {
      padding: 2rem;
      padding-bottom: 0;
      @media (max-width: 1000px) {
        padding: 1.5rem;
        padding-top: 4rem
      }
    }
    h2 {
      margin-top: 2rem
    }
    main {
      overflow-y: auto;
      display: flex;
      flex-wrap: wrap;
      gap: 2rem;
      width: auto;
      margin: auto;
      @media (max-width: 1000px) {
        padding-top: 0;
        min-width: 97.5vw
      }
    }
    section {
      width: 100%;
      max-width: 450px;
      &.chart {
        max-width: 350px;
        width: calc(100vw - 4rem)
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
    <template>
      <h1>Welcome back {{ claims.name }}</h1>
      <ToDoLists />
      <NetData />
      <ClientStatusGraphs />
      <template v-if="claims.groups.includes('billing')">
        <MoneyBreakdown />
        <MonthlyCharts />
        <ProjectTimelines />
        <ClientProfitLoss />
        <RefreshData />
      </template>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import ToDoLists from '~/components/homepage/toDoLists'
import NetData from '~/components/homepage/netData'
import ClientStatusGraphs from '~/components/homepage/clientStatusGraphs'
import MoneyBreakdown from '~/components/homepage/moneyBreakdown'
import MonthlyCharts from '~/components/homepage/monthlyCharts'
import ProjectTimelines from '~/components/homepage/projectTimelines'
import ClientProfitLoss from '~/components/homepage/clientProfitLoss'
import RefreshData from '~/components/homepage/refreshData'

export default {
  name: 'Home',
  components: {
    ToDoLists,
    NetData,
    ClientStatusGraphs,
    MoneyBreakdown,
    MonthlyCharts,
    ProjectTimelines,
    ClientProfitLoss,
    RefreshData
  },
  computed: {
    ...mapState([
      'claims'
    ])
  }
}
</script>
