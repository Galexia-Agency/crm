<template>
  <main v-if="projectsTimelinesValue.length > 0">
    <section class="span-2">
      <h2>
        Project Timelines
      </h2>
      <table>
        <thead>
          <tr>
            <th @click="sort = 'name', reverse = !reverse">
              Project
            </th>
            <th @click="sort = 'enquiry', reverse = !reverse">
              Date of project enquiry
            </th>
            <th @click="sort = 'start', reverse = !reverse">
              Days from date of enquiry to project kick-off
            </th>
            <th @click="sort = 'complete', reverse = !reverse">
              Days from project kick-off to publication
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project, index in projectsTimelinesValue" :key="`project_timelines_${index}`">
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

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectTimelines',
  data () {
    return {
      sort: '',
      reverse: false
    }
  },
  computed: {
    ...mapState([
      'clients',
      'projects'
    ]),
    projectsTimelines () {
      const projects = []
      for (const projectId in this.projects) {
        const projectToPush = {}
        const project = this.projects[projectId]
        const client = this.clients.find(client => client.id === project.client_id)
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
    projectsTimelinesValue () {
      const clonedProjects = []
      Object.assign(clonedProjects, this.projectsTimelines)
      if (this.sort === 'name') {
        return this.reverse
          ? clonedProjects.sort(function (a, b) {
            const textA = a.client_name.toUpperCase()
            const textB = b.client_name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })
          : clonedProjects.sort(function (a, b) {
            const textA = a.client_name.toUpperCase()
            const textB = b.client_name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          }).reverse()
      }
      if (this.sort === 'enquiry') {
        return this.reverse
          ? clonedProjects.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date))
          : clonedProjects.sort((a, b) => new Date(b.enquiry_date) - new Date(a.enquiry_date)).reverse()
      }
      if (this.sort === 'start') {
        return this.reverse
          ? clonedProjects.sort((a, b) => b.daysToStart - a.daysToStart)
          : clonedProjects.sort((a, b) => b.daysToStart - a.daysToStart).reverse()
      }
      if (this.sort === 'complete') {
        return this.reverse
          ? clonedProjects.sort((a, b) => parseInt(b.daysToComplete) - parseInt(a.daysToComplete))
          : clonedProjects.sort((a, b) => parseInt(b.daysToComplete) - parseInt(a.daysToComplete)).reverse()
      }
      return clonedProjects
    }
  }
}
</script>
