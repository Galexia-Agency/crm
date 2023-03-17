<style lang="scss">
.sidebar-buttons {
  display: flex;
  flex-wrap: wrap;
  margin-bottom: 1rem;
  column-gap: 1rem;
  row-gap: .5rem;
  .button {
    display: block;
    color: black
  }
}
</style>

<template>
  <div style="display: contents">
    <Hamburger type="arrow" color="var(--primaryColor)" :expanded="expanded" />
    <button type="button" class="refresh" :class="{clicked: refreshed}" @click="refresh">
      <font-awesome-icon :icon="['fa-solid', 'fa-sync']" />
    </button>
    <nav>
      <nuxt-link to="/">
        <h2>Home</h2>
      </nuxt-link>
      <div class="sidebar-buttons">
        <nuxt-link v-if="claims.groups.includes('billing')" to="/products" class="button primary">
          Products
        </nuxt-link>
        <button v-if="claims.groups.includes('admin')" type="button" class="button primary" @click="$parent.showClientModal()">
          New Client
        </button>
        <button type="button" class="button primary" @click="$logout()">
          Logout
        </button>
      </div>
      <input
        v-model="search"
        type="search"
        rel="search"
        placeholder="Search clients..."
        aria-label="Search clients..."
        class="search"
      >
      <template v-if="Object.keys(filteredProjects).length > 0">
        <template v-for="(type, index) in filteredProjects">
          <project-nav-link
            v-if="filteredProjects[index].length > 0 && index !== 'Other'"
            :key="`${index}_${filteredProjects[index].length}`"
            :type="index"
            :clients="clients"
            :filtered-projects="filteredProjects[index]"
            :search="search"
          />
        </template>
        <template v-if="filteredProjects.Other.length > 0">
          <h4 id="other">
            Other
          </h4>
          <template v-for="(client, index) in filteredProjects.Other">
            <nuxt-link
              v-show="((!search) || ((client.business_name).toLowerCase()).startsWith(search.toLowerCase()))"
              :key="`${index}_${client.business_name}`"
              :to="`/client/${client.business_shortname.toLowerCase()}`"
              class="navLink other"
              v-text="client.business_name"
            />
          </template>
        </template>
      </template>
    </nav>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Hamburger from 'vue-hamburger/hamburger.vue'
import projectNavLink from '~/components/projectNavLink'

export default {
  components: {
    Hamburger,
    projectNavLink
  },
  data () {
    return {
      search: '',
      refreshed: false,
      expanded: null
    }
  },
  computed: {
    ...mapState([
      'filteredProjects',
      'clients',
      'claims'
    ])
  },
  methods: {
    refresh () {
      this.refreshed = true
      location.reload()
    }
  }
}
</script>
