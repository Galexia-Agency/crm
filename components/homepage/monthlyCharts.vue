<template>
  <main>
    <section class="span-3">
      <h2>
        Sales Performance
      </h2>
      <bar-chart :chart-data="salesData" />
    </section>
    <section class="span-3">
      <h2>
        Expenses Performance
      </h2>
      <bar-chart :chart-data="expensesData" />
    </section>
    <section class="span-3">
      <h2>
        Profit &amp; Loss Performance
      </h2>
      <bar-chart :chart-data="profitLossData" />
    </section>
    <section class="span-3">
      <h2>
        Cash Flow
      </h2>
      <bar-chart :chart-data="cashFlowData" />
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import BarChart from '../charts/BarChart'

export default {
  name: 'MonthlyCharts',
  components: {
    BarChart
  },
  computed: {
    ...mapState([
      'pandle'
    ]),
    months () {
      const a = []
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(new Date(month.month).toLocaleDateString(undefined, { year: 'numeric', month: 'short' }))
      })
      return a
    },
    salesData () {
      return {
        labels: this.months,
        datasets: [
          {
            backgroundColor: '#2196f3',
            data: this.salesValues
          }
        ]
      }
    },
    salesValues () {
      const a = []
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(parseFloat(month.sales).toFixed(2))
      })
      return a
    },
    expensesData () {
      return {
        labels: this.months,
        datasets: [
          {
            backgroundColor: '#edc240',
            data: this.expensesValues
          }
        ]
      }
    },
    expensesValues () {
      const a = []
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(parseFloat(month.expenses).toFixed(2))
      })
      return a
    },
    profitLossData () {
      return {
        labels: this.months,
        datasets: [
          {
            backgroundColor: '#009688',
            data: this.profitLossValues
          }
        ]
      }
    },
    profitLossValues () {
      const a = []
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(parseFloat(month.profit_loss).toFixed(2))
      })
      return a
    },
    cashFlowData () {
      return {
        labels: this.months,
        datasets: [
          {
            backgroundColor: '#9c27b0',
            data: this.cashFlowValues
          }
        ]
      }
    },
    cashFlowValues () {
      const a = []
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(parseFloat(month.cash_flow).toFixed(2))
      })
      return a
    }
  }
}
</script>
