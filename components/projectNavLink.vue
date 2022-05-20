<style scoped>
  .contentWrapper h4 {
    margin-top: .5rem;
    margin-bottom: .25em;
    text-decoration: underline
  }
  .navLink {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
</style>

<template>
  <div>
    <h4 v-text="type" />
    <template v-for="(project, index) in filteredProjects">
      <template v-for="(client, indexed) in clients">
        <nuxt-link
          v-show="((!search) || ((client.business_name).toLowerCase()).startsWith(search.toLowerCase()))"
          v-if="project.client_id === client.id && index === 0 || project.client_id === client.id && filteredProjects[index - 1].client_id !== project.client_id"
          :key="index + indexed"
          :to="`/client/${client.business_shortname.toLowerCase()}`"
          class="navLink"
          v-text="client.business_name"
        />
      </template>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    filteredProjects: {
      type: Array,
      default: null
    },
    type: {
      type: String,
      default: null,
      required: true
    },
    clients: {
      type: Array,
      default: null,
      required: true
    },
    search: {
      type: String,
      default: '',
      required: true
    }
  }
}
</script>
