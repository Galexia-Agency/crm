<style scoped lang="scss">
  .contentWrapper h4 {
    margin-top: .5rem;
    margin-bottom: .25em;
    text-decoration: underline
  }
  .navLink {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    &.blossomTreePhoto {
      color: #D485C4
    }
  }
</style>

<template>
  <div>
    <h4 v-text="type" />
    <template v-for="(project, index) in filteredProjects">
      <template v-for="client in clients">
        <NuxtLink
          v-show="((!search) || ((client.business_name).toLowerCase()).startsWith(search.toLowerCase()))"
          v-if="project.client_id === client.id && index === 0 || project.client_id === client.id && filteredProjects[index - 1].client_id !== project.client_id"
          :key="`${client.business_shortname}_${project.status}`"
          :to="`/client/${client.business_shortname.toLowerCase()}`"
          class="navLink"
          :class="{blossomTreePhoto: project.admin.includes('chelsea@galexia.agency')}"
        >
          {{ client.business_name }}
        </NuxtLink>
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
