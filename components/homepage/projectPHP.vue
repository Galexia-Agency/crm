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
              <nuxt-link :to="project.link" style="color: black" v-text="`${project.client_name} - ${project.name}`" />
            </td>
            <td v-text="project.php" />
          </tr>
        </template>
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
      'projects'
    ])
  }
}
</script>
