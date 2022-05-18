<style scoped lang="scss">
  .chart {
    max-width: 350px;
    width: calc(100vw - 4rem)
  }
  h1 {
    padding: 2rem;
    padding-bottom: 0
  }
  h2 {
    margin-top: 2rem
  }
  main {
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    grid-gap: 2rem;
    justify-items: center;
    width: auto;
    margin: auto
  }
  section {
    width: 100%;
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
    display: block
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
    <h1>Welcome back {{ claims.name }}</h1>
    <main>
      <section v-if="overdueItems.length > 0">
        <h2>Overdue</h2>
        <section class="list-container">
          <div v-for="(item, index) in overdueItems" :key="item.id">
            <h4 v-if="index === 0 || overdueItems[index - 1].day !== item.day" v-text="item.day + ' ' + item.dayNo + ' ' + item.month" />
            <h6 v-if="index === 0 || overdueItems[index - 1].project !== item.project">
              <nuxt-link :to="'/client/' + item.projectShort.toLowerCase()" v-text="item.project" />
            </h6>
            <Card :item="item" :icons="false" />
          </div>
        </section>
      </section>
      <section v-if="dueItems.length > 0">
        <h2>To Do</h2>
        <section class="list-container">
          <div v-for="(item, index) in dueItems" :key="item.id">
            <h4 v-if="index === 0 || dueItems[index - 1].day !== item.day" v-text="item.day + ' ' + item.dayNo + ' ' + item.month" />
            <h6 v-if="index === 0 || dueItems[index - 1].project !== item.project">
              <nuxt-link :to="'/client/' + item.projectShort.toLowerCase()" v-text="item.project" />
            </h6>
            <Card :item="item" :icons="false" />
          </div>
        </section>
      </section>
    </main>
    <main v-if="claims.groups.includes('billing')">
      <section>
        <h2>Projects Status</h2>
        <pie-chart class="chart" :chart-data="projects" />
      </section>
      <section>
        <h2>Source of Clients</h2>
        <pie-chart class="chart" :chart-data="clientSource" />
      </section>
      <section>
        <h2>Hosting Locations</h2>
        <pie-chart class="chart" :chart-data="projectHosting" />
      </section>
      <section>
        <h2>
          Expenses Report
        </h2>
        <pie-chart
          class="chart"
          :chart-data="expenseData"
          :options="{
            tooltips: {
              enabled: true,
              callbacks: {
                label: function(tooltipItems, data) {
                  return data.labels[tooltipItems.datasetIndex] + ': £' + data.datasets[tooltipItems.datasetIndex].data[tooltipItems.datasetIndex]
                }
              }
            }
          }"
        />
      </section>
      <section>
        <h2>
          Bank Account Balance
        </h2>
        <bar-chart class="chart" :chart-data="bankAccountData" />
      </section>
      <section>
        <h2>
          Sales Performance
        </h2>
        <bar-chart class="chart" :chart-data="salesData" />
      </section>
      <section>
        <h2>
          Profit &amp; Loss Performance
        </h2>
        <bar-chart class="chart" :chart-data="profitLossData" />
      </section>
      <section>
        <h2>
          Cash Flow
        </h2>
        <bar-chart class="chart" :chart-data="cashFlowData" />
      </section>
      <section>
        <h2>
          Money Breakdown
        </h2>
        <table>
          <tbody>
            <tr>
              <td>
                Completion Total:
              </td>
              <td v-text="'£' + completion_total" />
            </tr>
            <tr>
              <td>
                Total Revenue
              </td>
              <td v-text="'£' + 0" />
            </tr>
            <tr>
              <td>
                Profit for the Period
              </td>
              <td v-text="'£' + TaxDividend['profit-for-period']" />
            </tr>
            <tr>
              <td>
                Reserves Brought Forward
              </td>
              <td v-text="'£' + TaxDividend['profit-carried-forward']" />
            </tr>
            <tr>
              <td>
                Corporation Tax Estimate
              </td>
              <td v-text="'£' + TaxDividend['estimated-corp-tax-to-pay']" />
            </tr>
            <tr>
              <td>
                Dividends Taken
              </td>
              <td v-text="'£' + TaxDividend['dividends-paid']" />
            </tr>
            <tr>
              <td>
                Available for Dividends
              </td>
              <td v-text="'£' + TaxDividend['available-amount']" />
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
              <td v-text="`£${client.project.completion_amount}`" />
            </tr>
          </tbody>
        </table>
      </section>
    </main>
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

    function pandleFetch ({ commit, url, type }) {
      if (sessionStorage.getItem(commit)) {
        return self.$store.commit(commit, JSON.parse(sessionStorage.getItem(commit)))
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
      } catch {
        await pandleSignin()
      }

      const pandleURLs = [
        {
          url: '/companies/46972/dashboard/bank_account_chart?page=1&size=24',
          commit: 'pandleBankAccountChart'
        },
        {
          url: '/companies/46972/dashboard/cash_flow_chart?page=1&size=24',
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
      Promise.all(pandleURLs.forEach(function (URL) {
        pandleFetch(URL)
      }))
    }
  },
  computed: {
    ...mapState([
      'claims'
    ]),
    TaxDividend () {
      return this.$store.state.pandle.dashboard.TaxDividendChart.attributes['chart-values']
    },
    projects () {
      return {
        labels: ['Leads', 'Development', 'On-Going', 'Paused'],
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF'],
            data: [this.$parent.$parent.filteredProjects.hotLeads.length + this.$parent.$parent.filteredProjects.coldLeads.length, this.$parent.$parent.filteredProjects.development.length, this.$parent.$parent.filteredProjects.onGoing.length, this.$parent.$parent.filteredProjects.paused.length]
          }
        ]
      }
    },
    completion_total () {
      let c = 0
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].completion_amount !== null) {
          c = c + parseInt(this.$store.state.projects[project].completion_amount)
        }
      }
      return c
    },
    clientsWithCompletion () {
      const c = []
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].completion_amount !== null && this.$store.state.projects[project].completion_amount !== 0) {
          const f = this.$store.state.clients.find(client => client.id === this.$store.state.projects[project].client_id)
          f.project = this.$store.state.projects[project]
          c.push(f)
        }
      }
      c.sort(function (a, b) {
        return b.project.completion_amount - a.project.completion_amount
      })
      return c
    },
    clientSource () {
      return {
        labels: Object.keys(this.count),
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#FFC0CB', '#FFA500', '#edc240'],
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
        a.push(this.$store.state.pandle.dashboard.SalesChart.attributes['chart-values'][elem].amount)
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
        a.push(this.$store.state.pandle.dashboard.ProfitLossChart.attributes['chart-values'][elem].amount)
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
        a.push(this.$store.state.pandle.dashboard.CashFlowChart.attributes['chart-values'][elem].amount)
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
        a.push(this.$store.state.pandle.dashboard.ExpenseChart.attributes['chart-values'][elem].amount)
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
    validURL (str) {
      const pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i') // fragment locator
      return !!pattern.test(str)
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
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      this.$parent.$parent.projects.forEach((project) => {
        if (project.lists) {
          project.lists.forEach((list) => {
            list.items.forEach((item) => {
              if (item.date) {
                const timestamp = Number(new Date(item.date))
                if (timestamp && due(timestamp)) {
                  const date = new Date(item.date)
                  // eslint-disable-next-line
                  let newItem = { ...item }
                  newItem.project = this.$parent.$parent.clients.find(client => client.id === project.client_id).business_name
                  newItem.projectShort = this.$parent.$parent.clients.find(client => client.id === project.client_id).business_shortname
                  newItem.dayNo = date.getDate()
                  newItem.day = days[date.getDay()]
                  newItem.month = months[date.getMonth()]
                  newItem.date = date
                  toDos.push(newItem)
                }
              }
            })
          })
        }
      })
      return toDos.sort((a, b) => b.date - a.date).reverse()
    }
  }
}
</script>
