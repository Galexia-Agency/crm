<template>
  <main>
    <section>
      <h2>
        Money Breakdown
      </h2>
      <table>
        <tbody>
          <tr>
            <td>
              Date of Incorportation
            </td>
            <td v-text="humanReadableDate($config.COMPANY_INCORPORATION)" />
          </tr>
          <template v-for="year, index in yearlyMoneyBreakdown">
            <tr :key="index + '_divider'" class="divider" />
            <tr :key="index + '_revenue'">
              <td>
                {{ index }} Revenue
              </td>
              <td v-text="'£' + year.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </tr>
            <tr :key="index + '_expenses'">
              <td>
                {{ index }} Expenses
              </td>
              <td v-text="'-£' + year.expenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </tr>
            <tr :key="index + '_netProfit'">
              <td>
                {{ index }} Net Profit
              </td>
              <td v-text="'£' + year.netProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
            </tr>
            <tr :key="index + '_netProfitMargin'">
              <td>
                {{ index }} Net Profit Margin
              </td>
              <td v-text="year.netProfitMargin.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'" />
            </tr>
          </template>
          <tr class="divider" />
          <tr>
            <td>
              All Time Revenue
            </td>
            <td v-text="'£' + allTimeRevenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
          </tr>
          <tr>
            <td>
              All Time Expenses
            </td>
            <td v-text="'-£' + allTimeExpenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
          </tr>
          <tr>
            <td>
              All Time Net Profit
            </td>
            <td v-text="'£' + allTimeNetProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
          </tr>
          <tr>
            <td>
              All Time Net Profit Margin
            </td>
            <td v-text="allTimeNetProfitMargin.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',') + '%'" />
          </tr>
        </tbody>
      </table>
    </section>
    <ClientCompletion />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import ClientCompletion from './clientCompletion'

export default {
  name: 'MoneyBreakdown',
  components: {
    ClientCompletion
  },
  computed: {
    ...mapState([
      'projects',
      'pandle'
    ]),
    bb_projectsRevenue () {
      let a = 0
      for (const project in this.projects) {
        if (this.projects[project].bb_revenue) {
          a += parseFloat(this.projects[project].bb_revenue)
        }
      }
      return a
    },
    bb_projectExpenses () {
      let a = 0
      for (const project in this.projects) {
        if (this.projects[project].bb_expenses) {
          a += parseFloat(this.projects[project].bb_expenses)
        }
      }
      return a
    },
    allTimeRevenue () {
      let a = this.bb_projectsRevenue
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a += parseFloat(month.sales)
      })
      return a
    },
    allTimeExpenses () {
      let a = this.bb_projectExpenses
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        a += parseFloat(month.expenses)
      })
      return a
    },
    allTimeNetProfit () {
      return this.allTimeRevenue - this.allTimeExpenses
    },
    allTimeNetProfitMargin () {
      return (this.allTimeNetProfit / this.allTimeRevenue) * 100
    },
    yearlyMoneyBreakdown () {
      const a = {}
      this.pandle.dashboard.monthlyCharts.forEach((month) => {
        let date = new Date(month.month)
        date.setMonth(date.getMonth() - (this.$config.TAX_YEAR_MONTH - 1))
        date = date.getFullYear()
        if (date === new Date().getFullYear()) {
          date = 'YTD'
        }
        if (!a[date]) {
          a[date] = {
            revenue: 0,
            expenses: 0,
            netProfit: 0,
            netProfitMargin: 0
          }
        }
        a[date].revenue += parseFloat(month.sales)
        a[date].expenses += parseFloat(month.expenses)
        a[date].netProfit = a[date].revenue - a[date].expenses
        a[date].netProfitMargin = (a[date].netProfit / a[date].revenue) * 100
      })
      return a
    }
  }
}
</script>
