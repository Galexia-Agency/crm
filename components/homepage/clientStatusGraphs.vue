<template>
  <main>
    <section v-if="Object.keys(filteredProjects).length > 0" class="chart">
      <h2>Projects Status</h2>
      <pie-chart :chart-data="projectStatus" />
    </section>
    <section v-if="clients.length > 0" class="chart">
      <h2>Source of Clients</h2>
      <pie-chart :chart-data="clientSource" />
    </section>
    <section v-if="projects.length > 0" class="chart">
      <h2>Hosting Locations</h2>
      <pie-chart :chart-data="projectHosting" />
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import PieChart from '../charts/PieChart'

export default {
  name: 'ClientStatusGraphs',
  components: {
    PieChart
  },
  computed: {
    ...mapState([
      'filteredProjects',
      'projects',
      'clients'
    ]),
    projectStatus () {
      if (Object.keys(this.filteredProjects).length > 0) {
        const leads = this.filteredProjects['Hot Lead'].concat(this.filteredProjects['Cold Lead']).filter((thing, index, self) =>
          index === self.findIndex(t => (
            t.client_id === thing.client_id
          ))
        )
        const development = this.filteredProjects.Development.filter((thing, index, self) =>
          index === self.findIndex(t => (
            t.client_id === thing.client_id
          ))
        )
        const onGoing = this.filteredProjects['On-Going'].filter((thing, index, self) =>
          index === self.findIndex(t => (
            t.client_id === thing.client_id
          ))
        )
        const paused = this.filteredProjects.Paused.filter((thing, index, self) =>
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
      }
      return null
    },
    count () {
      /* Group above array by source */
      return this.clientSources.reduce(function (r, a) {
        r[a] = r[a] || []
        r[a].push(a)
        return r
      }, Object.create(null))
    },
    clientSources () {
      const clients = []
      /* Create new array with just client source */
      this.clients.forEach((elem) => {
        if (elem.source) {
          clients.push(elem.source)
        }
      })
      return clients
    },
    clientSourceValues () {
      const a = []
      for (const elem in this.count) {
        a.push(this.count[elem].length)
      }
      return a
    },
    clientSource () {
      return {
        labels: Object.keys(this.count),
        datasets: [
          {
            backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#0080FF', '#FFA500', '#EDC240', '#FA0B0C', '#FFC0CB', '#404040'],
            data: this.clientSourceValues
          }
        ]
      }
    },
    projectHostings () {
      const project = []
      /* Create new array with just client source */
      this.projects.forEach((elem) => {
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
    }
  }
}
</script>
