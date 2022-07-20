<style scoped lang="scss">
  h1 {
    padding: 2rem;
    padding-bottom: 0
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
    margin: auto
  }
  section {
    width: 100%;
    max-width: 450px;
    &.chart {
      max-width: 350px;
      width: calc(100vw - 4rem)
    }
    table {
      width: 100%
    }
  }
  .home {
    overflow-y: auto;
    height: 100vh;
    position: relative
  }
  .card {
    display: block;
    margin: 0;
    // stylelint-disable-next-line declaration-no-important
    cursor: pointer!important
  }
  table td:first-child {
    font-weight: bold
  }
  table td {
    padding: .5em
  }
  table tr:nth-of-type(odd) {
    background-color: var(--scrollbarBG)
  }
  .home-card-container {
    margin-bottom: 1rem;
    display: block;
    cursor: pointer
  }
  @media (max-width: 1000px) {
    h1 {
      padding: 1.5rem;
      padding-top: 4rem
    }
    main {
      padding-top: 0;
      min-width: 97.5vw
    }
  }
</style>

<template>
  <div v-if="$parent.$parent.projects" class="home">
    <template v-if="!$parent.$parent.$fetchState.pending">
      <h1>Welcome back {{ claims.name }}</h1>
      <main>
        <section v-if="overdueItems.length > 0">
          <h2>Overdue</h2>
          <section class="list-container">
            <nuxt-link v-for="(item, index) in overdueItems" :key="item.id" :to="'/client/' + item.clientShortName.toLowerCase()" class="home-card-container">
              <h6 v-if="index === 0 || overdueItems[index - 1].clientName !== item.clientName" v-text="`${item.clientName} - ${item.projectName}`" />
              <Card :item="item" :icons="false" />
            </nuxt-link>
          </section>
        </section>
        <section v-if="dueItems.length > 0">
          <h2>To Do</h2>
          <section class="list-container">
            <nuxt-link v-for="(item, index) in dueItems" :key="item.id" :to="'/client/' + item.clientShortName.toLowerCase()" class="home-card-container">
              <h6 v-if="index === 0 || dueItems[index - 1].clientName !== item.clientName" v-text="`${item.clientName} - ${item.projectName}`" />
              <Card :item="item" :icons="false" />
            </nuxt-link>
          </section>
        </section>
      </main>
      <main v-if="claims.groups.includes('billing')">
        <section class="chart">
          <h2>Projects Status</h2>
          <pie-chart :chart-data="projects" />
        </section>
        <section class="chart">
          <h2>Source of Clients</h2>
          <pie-chart :chart-data="clientSource" />
        </section>
        <section class="chart">
          <h2>Hosting Locations</h2>
          <pie-chart :chart-data="projectHosting" />
        </section>
        <section class="chart">
          <h2>
            Expenses Report
          </h2>
          <pie-chart
            :chart-data="expenseData"
            :options="{
              tooltips: {
                callbacks: {
                  label: function(tooltipItem, data) {
                    return data.labels[tooltipItem.index] + ': £' + data.datasets[0].data[tooltipItem.index].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                  }
                }
              }
            }"
          />
        </section>
        <section class="chart">
          <h2>
            Bank Account Balance
          </h2>
          <bar-chart :chart-data="bankAccountData" />
        </section>
        <section class="chart">
          <h2>
            Sales Performance
          </h2>
          <bar-chart :chart-data="salesData" />
        </section>
        <section class="chart">
          <h2>
            Profit &amp; Loss Performance
          </h2>
          <bar-chart :chart-data="profitLossData" />
        </section>
        <section class="chart">
          <h2>
            Cash Flow
          </h2>
          <bar-chart :chart-data="cashFlowData" />
        </section>
        <section>
          <h2>
            Money Breakdown
          </h2>
          <table>
            <tbody>
              <tr>
                <td>
                  Completion Total
                </td>
                <td v-text="'£' + completion_total" />
              </tr>
              <tr>
                <td>
                  Total Revenue
                </td>
                <td v-text="'£' + revenue" />
              </tr>
              <tr>
                <td>
                  Profit for the Period
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['profit-for-period']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  Reserves Brought Forward
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['profit-carried-forward']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  Corporation Tax Estimate
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['estimated-corp-tax-to-pay']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  Dividends Taken
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['dividends-paid']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  Available for Dividends
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['available-amount']).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
            </tbody>
          </table>
        </section>
        <section>
          <h2>
            Clients with a completion
          </h2>
          <table>
            <tbody>
              <tr v-for="client, index in clientsWithCompletion" :key="index">
                <td>
                  <nuxt-link :to="`/client/${client.business_shortname.toLowerCase()}`" style="color: black" v-text="client.business_name" />
                </td>
                <td v-text="`£${client.completion_amount.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`" />
              </tr>
            </tbody>
          </table>
        </section>
      </main>
    </template>
    <template v-else>
      <main>
        <section class="list-container">
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
        </section>
        <section class="list-container">
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
          <div class="loading-content" />
        </section>
      </main>
    </template>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import PieChart from '~/components/charts/PieChart'
import BarChart from '~/components/charts/BarChart'
import Card from '~/components/Card'

export default {
  components: {
    PieChart,
    BarChart,
    Card
  },
  async fetch () {
    await this.pandleBootstrap()
    const self = this
    function pandleFetch ({ commit, url }) {
      if (sessionStorage.getItem(commit)) {
        self.$store.commit(commit, JSON.parse(sessionStorage.getItem(commit)))
        return Promise.resolve('done')
      } else {
        return self.$axios.post(location.origin + '/.netlify/functions/request', { url, type: 'GET' })
          .then(function (response) {
            self.$store.commit(commit, response.data.data)
            sessionStorage.setItem(commit, JSON.stringify(response.data.data))
          })
          .catch(function (e) {
            const error = {}
            error.description = e
            self.$store.commit('error', error)
          })
      }
    }

    if (this.claims.groups.includes('billing')) {
      const pandleURLs = [
        {
          url: '/companies/46972/dashboard/bank_account_chart',
          commit: 'pandleBankAccountChart'
        },
        {
          url: '/companies/46972/dashboard/cash_flow_chart?page=2&size=24',
          commit: 'pandleCashFlowChart'
        },
        {
          url: '/companies/46972/dashboard/expense_chart?page=1&size=24',
          commit: 'pandleExpenseChart'
        },
        {
          url: '/companies/46972/dashboard/profit_and_loss_chart?page=1&size=24',
          commit: 'pandleProfitLossChart'
        },
        {
          url: '/companies/46972/dashboard/sales_chart?page=1&size=24',
          commit: 'pandleSalesChart'
        },
        {
          url: '/companies/46972/dashboard/tax_and_dividend?page=1&size=24',
          commit: 'pandleTaxDividendChart'
        }
      ]
      Promise.all(pandleURLs.map(async (URL) => {
        await pandleFetch(URL)
      }))
    }
  },
  computed: {
    ...mapState([
      'claims'
    ]),
    revenue () {
      let a = 0
      for (const sale in this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values']) {
        a = a + parseFloat(this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values'][sale].amount)
      }
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].bb_revenue) {
          a = a + parseFloat(this.$store.state.projects[project].bb_revenue)
        }
      }
      return a.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    TaxDividend () {
      return this.$store.state.pandle.dashboard.TaxDividendChart.attributes['chart-values']
    },
    projects () {
      const leads = this.$parent.$parent.filteredProjects.hotLeads.concat(this.$parent.$parent.filteredProjects.coldLeads).filter((thing, index, self) =>
        index === self.findIndex(t => (
          t.client_id === thing.client_id
        ))
      )
      const development = this.$parent.$parent.filteredProjects.development.filter((thing, index, self) =>
        index === self.findIndex(t => (
          t.client_id === thing.client_id
        ))
      )
      const onGoing = this.$parent.$parent.filteredProjects.onGoing.filter((thing, index, self) =>
        index === self.findIndex(t => (
          t.client_id === thing.client_id
        ))
      )
      const paused = this.$parent.$parent.filteredProjects.paused.filter((thing, index, self) =>
        index === self.findIndex(t => (
          t.client_id === thing.client_id
        ))
      )
      return {
        labels: ['Leads', 'Development', 'On-Going', 'Paused'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#FFA500'],
            data: [leads.length, development.length, onGoing.length, paused.length]
          }
        ]
      }
    },
    completion_total () {
      let c = 0
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].completion_amount !== null) {
          c = c + parseFloat(this.$store.state.projects[project].completion_amount)
        }
      }
      return c.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    },
    clientsWithCompletion () {
      const c = {}
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].completion_amount !== null && parseFloat(this.$store.state.projects[project].completion_amount) !== 0) {
          const clientName = this.$store.state.clients.find(client => client.id === this.$store.state.projects[project].client_id).business_name
          if (c[clientName]) {
            c[clientName] += parseFloat(this.$store.state.projects[project].completion_amount)
          } else {
            c[clientName] = parseFloat(this.$store.state.projects[project].completion_amount)
          }
        }
      }
      const clients = []
      Object.keys(c).map(key => [key, c[key]]).forEach((clientWithCompletion) => {
        const object = {}
        object.business_name = clientWithCompletion[0]
        object.business_shortname = this.$store.state.clients.find(client => client.business_name === clientWithCompletion[0]).business_shortname
        object.completion_amount = clientWithCompletion[1]
        clients.push(object)
      })
      return clients.sort(function (a, b) {
        return b.completion_amount - a.completion_amount
      })
    },
    clientSource () {
      return {
        labels: Object.keys(this.count),
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#FFC0CB', '#FFA500', '#edc240', '#0080FF'],
            data: this.clientSourceValues
          }
        ]
      }
    },
    projectHosting () {
      return {
        labels: Object.keys(this.hosting),
        datasets: [
          {
            backgroundColor: ['#0080FF', '#00AD9F', '#F6821F'],
            data: this.projectHostingValues
          }
        ]
      }
    },
    bankAccountData () {
      return {
        labels: this.bankAccountNames,
        datasets: [
          {
            backgroundColor: '#edc240',
            data: this.bankAccountValues
          }
        ]
      }
    },
    bankAccountValues () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.bankAccountChart.attributes['chart-values']) {
        a.push(this.$store.state.pandle.dashboard.bankAccountChart.attributes['chart-values'][elem].balance)
      }
      return a
    },
    bankAccountNames () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.bankAccountChart.attributes['chart-values']) {
        a.push(this.$store.state.pandle.dashboard.bankAccountChart.attributes['chart-values'][elem].name)
      }
      return a
    },
    salesData () {
      return {
        labels: this.salesMonths,
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
      for (const elem in this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values']) {
        a.push(parseFloat(this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values'][elem].amount).toFixed(2))
      }
      return a
    },
    salesMonths () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values']) {
        a.push(this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values'][elem].month)
      }
      return a
    },
    profitLossData () {
      return {
        labels: this.profitLossMonths,
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
      for (const elem in this.$store.state.pandle.dashboard.ProfitLossChart.attributes['chart-values']) {
        a.push(parseFloat(this.$store.state.pandle.dashboard.ProfitLossChart.attributes['chart-values'][elem].amount).toFixed(2))
      }
      return a
    },
    profitLossMonths () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.ProfitLossChart.attributes['chart-values']) {
        a.push(this.$store.state.pandle.dashboard.ProfitLossChart.attributes['chart-values'][elem].month)
      }
      return a
    },
    cashFlowData () {
      return {
        labels: this.cashFlowMonths,
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
      for (const elem in this.$store.state.pandle.dashboard.CashFlowChart.attributes['chart-values']) {
        a.push(parseFloat(this.$store.state.pandle.dashboard.CashFlowChart.attributes['chart-values'][elem].amount).toFixed(2))
      }
      return a
    },
    cashFlowMonths () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.CashFlowChart.attributes['chart-values']) {
        a.push(this.$store.state.pandle.dashboard.CashFlowChart.attributes['chart-values'][elem].month)
      }
      return a
    },
    expenseData () {
      return {
        labels: this.expenseTypes,
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#FFC0CB', '#FFA500', '#edc240', '#C8A2C8', '#00ffff'],
            data: this.expenseValues
          }
        ]
      }
    },
    expenseValues () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.ExpenseChart.attributes['chart-values']) {
        a.push(parseFloat(this.$store.state.pandle.dashboard.ExpenseChart.attributes['chart-values'][elem].amount).toFixed(2))
      }
      return a
    },
    expenseTypes () {
      const a = []
      for (const elem in this.$store.state.pandle.dashboard.ExpenseChart.attributes['chart-values']) {
        a.push(this.htmlDecode(this.$store.state.pandle.dashboard.ExpenseChart.attributes['chart-values'][elem].name))
      }
      return a
    },
    dueItems () {
      return this.getLists('due')
    },
    overdueItems () {
      return this.getLists('overdue')
    },
    clientSources () {
      const clients = []
      /* Create new array with just client source */
      this.$store.state.clients.forEach((elem) => {
        if (elem.source !== null) {
          clients.push(elem.source)
        }
      })
      return clients
    },
    count () {
      /* Group above array by source */
      return this.clientSources.reduce(function (r, a) {
        r[a] = r[a] || []
        r[a].push(a)
        return r
      }, Object.create(null))
    },
    clientSourceValues () {
      const a = []
      for (const elem in this.count) {
        a.push(this.count[elem].length)
      }
      return a
    },
    projectHostings () {
      const project = []
      /* Create new array with just client source */
      this.$store.state.projects.forEach((elem) => {
        if (elem.hosting !== null) {
          project.push(elem.hosting)
        }
      })
      return project
    },
    hosting () {
      /* Group above array by source */
      return this.projectHostings.reduce(function (r, a) {
        if (a === 'Digital Ocean' || a === 'Netlify' || a === 'Cloudflare Workers') {
          r[a] = r[a] || []
          r[a].push(a)
        }
        return r
      }, Object.create(null))
    },
    projectHostingValues () {
      const a = []
      for (const elem in this.hosting) {
        a.push(this.hosting[elem].length)
      }
      return a
    }
  },
  methods: {
    htmlDecode (input) {
      const e = document.createElement('textarea')
      e.innerHTML = input
      // handle case of empty input
      return e.childNodes.length === 0 ? '' : e.childNodes[0].nodeValue
    },
    getLists (dueType) {
      function due (timestamp) {
        if (dueType === 'overdue') {
          return timestamp < Date.now()
        } else if (dueType === 'due') {
          return timestamp > Date.now()
        }
      }
      const toDos = []
      this.$parent.$parent.projects.forEach((project) => {
        if (project.lists) {
          project.lists.forEach((list) => {
            list.items.forEach((item) => {
              if (item.asignee === this.claims.email || (this.claims.email === 'joe@galexia.agency' && !item.asignee)) {
                if (item.date) {
                  if (item.dateUNIX && due(item.dateUNIX)) {
                    const newItem = { ...item }
                    newItem.projectName = project.name
                    toDos.push(newItem)
                  }
                }
              }
            })
          })
        }
      })
      return toDos.sort((a, b) => b.dateUNIX - a.dateUNIX).reverse()
    }
  }
}
</script>
