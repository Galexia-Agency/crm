<template>
  <section v-if="projectsPHP.length > 0">
    <h2>
      Project PHP Versions
    </h2>
    <table>
      <tbody>
        <tr v-for="project, index in projectsPHP" :key="`project_php_${index}`">
          <td>
            <nuxt-link :to="project.link" style="color: black" v-text="project.name" />
          </td>
          <td v-text="project.php" />
        </tr>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ProjectPHP',
  computed: {
    ...mapState([
      'clients',
      'projects'
    ]),
    projectsPHP () {
      const projects = []
      for (const projectId in this.projects) {
        const projectToPush = {}
        const project = this.projects[projectId]
        const client = this.clients.find(client => client.id === project.client_id)
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
    }
  }
}
</script>
