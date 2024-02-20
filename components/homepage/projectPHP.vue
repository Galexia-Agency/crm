<template>
  <section v-if="projects.length > 0">
    <h2>
      Project PHP Versions
    </h2>
    <table>
      <tbody>
        <template v-for="project, index in projects">
          <tr v-if="project.php && project.status !== 'Completed' && project.status !== 'Cancelled'" :key="`project_php_${index}`">
            <td>
              <NuxtLink :to="getProjectLink(project)" style="color: black">
                {{ `${getProjectClientName(project)} - ${project.name}` }}
              </NuxtLink>
            </td>
            <td v-text="project.php" />
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  computed: {
    ...mapState(
      'client/project',
      {
        projects: 'all'
      }
    ),
    ...mapGetters(
      'client/project',
      {
        getProjectLink: 'getLink',
        getProjectClientName: 'getClientName'
      }
    )
  }
}
</script>
