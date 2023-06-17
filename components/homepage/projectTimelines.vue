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
            <th @click="sort = 'with-us', reverse = !reverse">
              This project has been with us for x days
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="project, index in projectsTimelinesValue">
            <tr v-if="project.enquiry_date && project.start_date" :key="`project_timelines_${index}`">
              <td>
                <NuxtLink :to="project.link" style="color: black">
                  {{ `${project.client_name} - ${project.name}` }}
                </NuxtLink>
              </td>
              <td v-text="humanReadableDate(project.enquiry_date)" />
              <td v-text="project.daysToStart" />
              <td v-if="project.daysToComplete" v-text="project.daysToComplete" />
              <td v-else>
                -
              </td>
              <td v-if="project.daysWithUs" v-text="project.daysWithUs" />
              <td v-else>
                -
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
    projectsTimelinesValue () {
      const clonedProjects = []
      Object.assign(clonedProjects, this.projects)
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
      if (this.sort === 'with-us') {
        return this.reverse
          ? clonedProjects.sort((a, b) => parseInt(b.daysWithUs) - parseInt(a.daysWithUs))
          : clonedProjects.sort((a, b) => parseInt(b.daysWithUs) - parseInt(a.daysWithUs)).reverse()
      }
      return clonedProjects
    }
  }
}
</script>
