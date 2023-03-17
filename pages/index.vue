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
    h2 {
      margin-top: 2rem
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
