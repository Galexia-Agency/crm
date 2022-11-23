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
  .home-card-container {
    margin-bottom: 1rem;
    display: block;
    cursor: pointer
  }
  .netdata {
    width: 100%;
    iframe {
      min-height: 200px;
      margin: 1rem 0
    }
    a {
      display: block;
      text-align: center
    }
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
    <template>
      <h1>Welcome back {{ claims.name }}</h1>
      <main>
        <section v-if="overdueItems.length > 0">
          <h2>Overdue</h2>
          <section class="list-container">
            <nuxt-link v-for="(item, index) in overdueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
              <h6 v-if="index === 0 || overdueItems[index - 1].clientName !== item.clientName || overdueItems[index - 1].projectName !== item.projectName" v-text="`${item.clientName} - ${item.projectName}`" />
              <Card :item="item" :icons="false" />
            </nuxt-link>
          </section>
        </section>
        <section v-if="dueItems.length > 0">
          <h2>To Do</h2>
          <section class="list-container">
            <nuxt-link v-for="(item, index) in dueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
              <h6 v-if="index === 0 || dueItems[index - 1].clientName !== item.clientName || dueItems[index - 1].projectName !== item.projectName" v-text="`${item.clientName} - ${item.projectName}`" />
              <Card :item="item" :icons="false" />
            </nuxt-link>
          </section>
        </section>
        <section v-if="projectsPHP.length > 0">
          <h2>
            Project PHP Versions
          </h2>
          <table>
            <tbody>
              <tr v-for="project, index in projectsPHP" :key="index">
                <td>
                  <nuxt-link :to="project.link" style="color: black" v-text="project.name" />
                </td>
                <td v-text="project.php" />
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <main v-if="claims.email === 'joe@galexia.agency'">
        <div class="netdata">
          <h2>
            Digital Ocean Server Overview
          </h2>
          <iframe src="https://netdata.galexia.agency/bos-dashboard.html" width="100%" />
          <a href="https://netdata.galexia.agency/" target="_blank">View full stats here</a>
        </div>
      </main>
      <main>
        <section v-if="claims.groups.includes('billing')" class="chart">
          <h2>
            Bank Account Balance
          </h2>
          <bar-chart :chart-data="bankAccountData" />
        </section>
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
      </main>
      <main v-if="claims.groups.includes('billing')">
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
                <td v-text="humanReadableDate(this.$config.PANDLE_COMPANY_INCORPORATION)" />
              </tr>
              <tr class="divider" />
              <tr>
                <td>
                  Completion Total
                </td>
                <td v-text="'£' + completion_total" />
              </tr>
              <tr>
                <td>
                  Last Year Cash in bank
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['profit-carried-forward']).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  This Year Net Profit
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['profit-for-period']).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  This Year Corporation Tax Estimate
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['estimated-corp-tax-to-pay']).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  This Year Dividends Taken
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['dividends-paid']).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  This Year Available for Dividends
                </td>
                <td v-text="'£' + parseFloat(TaxDividend['available-amount']).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr class="divider" />
              <tr>
                <td>
                  All Time Revenue
                </td>
                <td v-text="'£' + revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  All Time Expenses
                </td>
                <td v-text="'-£' + expenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
              </tr>
              <tr>
                <td>
                  All Time Net Profit
                </td>
                <td v-text="'£' + netProfit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
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
                <td v-text="`£${client.completion_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`" />
              </tr>
            </tbody>
          </table>
        </section>
      </main>
      <main v-if="claims.groups.includes('billing')">
        <section>
          <p><a href="javascript:void(0)" @click="refreshMonthlyCharts(false)">Refresh Monthly Charts (last 4 months)</a></p>
          <p><a href="javascript:void(0)" @click="refreshMonthlyCharts(true)">Refresh Monthly Charts (all time)</a></p>
        </section>
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
      <main>
        <section v-if="projectsTimelines.length > 0" class="span-2">
          <h2>
            Project Timelines
          </h2>
          <table>
            <thead>
              <tr>
                <th
                  style="cursor: pointer"
                  @click="
                    projectsTimelinesValue = projectsTimelinesNamesReverse
                      ?
                        projectsTimelines.sort(function (a, b) {
                          const textA = a.client_name.toUpperCase()
                          const textB = b.client_name.toUpperCase()
                          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                        })
                      :
                        projectsTimelines.sort(function (a, b) {
                          const textA = a.client_name.toUpperCase()
                          const textB = b.client_name.toUpperCase()
                          return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                        }).reverse()
                    projectsTimelinesNamesReverse = !projectsTimelinesNamesReverse"
                >
                  Project
                </th>
                <th
                  style="cursor: pointer"
                  @click="
                    projectsTimelinesValue = dateOfEnquiryReverse
                      ?
                        projectsTimelines.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)).reverse()
                      :
                        projectsTimelines.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date))
                    dateOfEnquiryReverse = !dateOfEnquiryReverse
                  "
                >
                  Date of project enquiry
                </th>
                <th
                  style="cursor: pointer"
                  @click="
                    projectsTimelinesValue = daysToStartReverse
                      ?
                        projectsTimelines.sort((a, b) => b.daysToStart - a.daysToStart).reverse()
                      :
                        projectsTimelines.sort((a, b) => b.daysToStart - a.daysToStart)
                    daysToStartReverse = !daysToStartReverse
                  "
                >
                  Days from date of enquiry to project kick-off
                </th>
                <th
                  style="cursor: pointer"
                  @click="
                    projectsTimelinesValue = daysToCompleteReverse
                      ?
                        projectsTimelines.sort((a, b) => parseInt(b.daysToComplete) - parseInt(a.daysToComplete)).reverse()
                      :
                        projectsTimelines.sort((a, b) => parseInt(b.daysToComplete) - parseInt(a.daysToComplete))
                    daysToCompleteReverse = !daysToCompleteReverse
                  "
                >
                  Days from project kick-off to publication
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="project, index in projectsTimelinesValue ? projectsTimelinesValue : projectsTimelines" :key="index">
                <td>
                  <nuxt-link :to="project.link" style="color: black" v-text="project.name" />
                </td>
                <td v-text="humanReadableDate(project.enquiry_date)" />
                <td v-text="project.daysToStart" />
                <td v-if="project.daysToComplete" v-text="project.daysToComplete" />
                <td v-else>
                  -
                </td>
              </tr>
            </tbody>
          </table>
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
  name: 'Home',
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
        return self.$axios.$post(location.origin + '/.netlify/functions/request', { url, type: 'GET' })
          .then(function (response) {
            self.$store.commit(commit, response.data)
            sessionStorage.setItem(commit, JSON.stringify(response.data))
          })
          .catch(function (e) {
            const error = {}
            error.description = e.message
            self.$store.commit('error', error)
          })
      }
    }

    if (this.claims.groups.includes('billing')) {
      const pandleURLs = [
        {
          url: `/companies/${this.$config.PANDLE_COMPANY_ID}/dashboard/bank_account_chart`,
          commit: 'pandleBankAccountChart'
        },
        {
          url: `/companies/${this.$config.PANDLE_COMPANY_ID}/dashboard/tax_and_dividend?page=1&size=24`,
          commit: 'pandleTaxDividendChart'
        }
      ]
      Promise.all(pandleURLs.map(async (URL) => {
        await pandleFetch(URL)
      }))
    }
  },
  data () {
    return {
      projectsTimelinesValue: this.projectsTimelines,
      projectsTimelinesNamesReverse: false,
      daysToStartReverse: false,
      daysToCompleteReverse: false,
      dateOfEnquiryReverse: false
    }
  },
  computed: {
    ...mapState([
      'claims'
    ]),
    bb_projectsRevenue () {
      let a = 0
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].bb_revenue) {
          a += parseFloat(this.$store.state.projects[project].bb_revenue)
        }
      }
      return a
    },
    bb_projectExpenses () {
      let a = 0
      for (const project in this.$store.state.projects) {
        if (this.$store.state.projects[project].bb_expenses) {
          a += parseFloat(this.$store.state.projects[project].bb_expenses)
        }
      }
      return a
    },
    revenue () {
      let a = this.bb_projectsRevenue
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
        a += parseFloat(month.sales)
      })
      return a
    },
    expenses () {
      let a = this.bb_projectExpenses
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
        a += parseFloat(month.expenses)
      })
      return a
    },
    netProfit () {
      return this.revenue - this.expenses
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
      return c.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
    projectsPHP () {
      const projects = []
      for (const projectId in this.$store.state.projects) {
        const projectToPush = {}
        const project = this.$store.state.projects[projectId]
        const client = this.$store.state.clients.find(client => client.id === project.client_id)
        if (project.php && project.status !== 'Completed' && project.status !== 'Cancelled') {
          projectToPush.php = project.php
          projectToPush.client_name = client.business_name
          projectToPush.name = client.business_name + ' - ' + project.name
          projectToPush.link = '/client/' + client.business_shortname.toLowerCase() + '#' + this.safeURL(project.name)
          projects.push(projectToPush)
        }
      }
      return projects.sort(function (a, b) {
        const textA = a.client_name.toUpperCase()
        const textB = b.client_name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
    },
    projectsTimelines () {
      const projects = []
      for (const projectId in this.$store.state.projects) {
        const projectToPush = {}
        const project = this.$store.state.projects[projectId]
        const client = this.$store.state.clients.find(client => client.id === project.client_id)
        if (project.enquiry_date && project.start_date) {
          projectToPush.daysToStart = this.diffDays(project.enquiry_date, project.start_date)
          projectToPush.enquiry_date = project.enquiry_date
          projectToPush.daysToComplete = 0
          if (!project.ongoing) {
            if (project.completion_date) {
              projectToPush.daysToComplete = this.diffDays(project.start_date, project.completion_date)
            } else {
              projectToPush.daysToComplete = this.diffDays(project.start_date, null) + '+'
            }
          }
          projectToPush.client_name = client.business_name
          projectToPush.name = client.business_name + ' - ' + project.name
          projectToPush.link = '/client/' + client.business_shortname.toLowerCase() + '#' + this.safeURL(project.name)
          projects.push(projectToPush)
        }
      }
      return projects.sort(function (a, b) {
        const textA = a.client_name.toUpperCase()
        const textB = b.client_name.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
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
    months () {
      const a = []
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
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
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
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
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
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
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
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
      this.$store.state.pandle.dashboard.monthlyCharts.forEach((month) => {
        a.push(parseFloat(month.cash_flow).toFixed(2))
      })
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
  mounted () {
    if (this.claims.email === 'joe@galexia.agency') {
      this.$el.querySelector('.netdata iframe').addEventListener('onload', this.updateIframeHeight())
      window.addEventListener('resize', this.updateIframeHeight())
      window.addEventListener('orientationchange', this.updateIframeHeight())
      screen.orientation.addEventListener('change', this.updateIframeHeight())
    }
  },
  methods: {
    updateIframeHeight () {
      this.$el.querySelector('.netdata iframe').style.height = this.$el.querySelector('.netdata iframe').contentWindow.document.body.offsetHeight + 'px'
    },
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
              if (item.assignee === this.claims.email || (this.claims.email === 'joe@galexia.agency' && !item.assignee) || (this.claims.email === 'joe@galexia.agency' && item.assignee !== this.claims.email)) {
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
    },
    async refreshMonthlyCharts (force) {
      let response
      if (force) {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats?force=true')
      } else {
        response = await this.$axios.$get('https://api.galexia.agency/monthly_stats')
      }
      this.$store.commit('pandleDashboard', response)
    }
  }
}
</script>
