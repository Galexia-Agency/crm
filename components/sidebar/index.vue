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
    <LayoutRefresh />
    <nav>
      <NuxtLink to="/">
        <h2>Home</h2>
      </NuxtLink>
      <div class="sidebar-buttons">
        <NuxtLink v-if="userInfo.groups.includes('billing')" to="/products" class="button primary">
          Products
        </NuxtLink>
        <button v-if="userInfo.groups.includes('admin')" type="button" class="button primary" @click="$store.dispatch('client/add')">
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
      <template v-if="Object.keys(getFilteredProjectsByStatus()).length > 0">
        <template v-for="(type, index) in getFilteredProjectsByStatus()">
          <SidebarProjectNavLink
            v-if="getFilteredProjectsByStatus()[index].length > 0 && index !== 'Other'"
            :key="index"
            :type="index"
            :clients="clients"
            :filtered-projects="getFilteredProjectsByStatus()[index]"
            :search="search"
          />
        </template>
        <template v-if="getFilteredProjectsByStatus().Other.length > 0">
          <h4 id="other">
            Other
          </h4>
          <template v-for="(client, index) in getFilteredProjectsByStatus().Other">
            <NuxtLink
              v-show="((!search) || ((client.business_name).toLowerCase()).startsWith(search.toLowerCase()))"
              :key="index"
              :to="`/client/${client.business_shortname.toLowerCase()}`"
              class="navLink other"
            >
              {{ client.business_name }}
            </NuxtLink>
          </template>
        </template>
      </template>
    </nav>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import Hamburger from 'vue-hamburger/hamburger.vue'

export default {
  components: {
    Hamburger
  },
  data () {
    return {
      search: '',
      expanded: null
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    ...mapState(
      'client',
      {
        clients: 'all'
      }
    ),
    ...mapGetters(
      'client/project',
      {
        getFilteredProjectsByStatus: 'getFilteredByStatus'
      }
    )
  }
}
</script>
