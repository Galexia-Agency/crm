<style lang="scss">
  .home-card-container {
    display: block;
    margin-bottom: 1rem;
    cursor: pointer;
    .card {
      display: block;
      margin: 0;
      // stylelint-disable-next-line declaration-no-important
      cursor: pointer!important
    }
  }
  .card-count {
    font-size: .75em
  }
  .toggle-container {
    width: 100%
  }
</style>

<template>
  <main v-if="overdueItems.length > 0 || dueItems.length > 0">
    <div class="toggle-container">
      Show in house tasks
      <Toggle :model="showInHouseItems" label="Show In House Items" :class="{toggled: showInHouseItems}" @input="showInHouseItems = $event" />
    </div>
    <section v-if="overdueItems.length > 0">
      <h2>
        Overdue
        <span class="card-count" v-html="`(${showInHouseItems ? '' : overdueItemsWithoutInHouse.length !== overdueItems.length ? overdueItemsWithoutInHouse.length + '/' : ''}${overdueItems.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <nuxt-link v-for="(item, index) in overdueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
          <h6 v-if="(showInHouseItems || (!showInHouseItems && item.projectStatus !== 'In House')) && (index === 0 || overdueItems[index - 1].clientName !== item.clientName || overdueItems[index - 1].projectName !== item.projectName)" v-text="`${item.clientName} - ${item.projectName}`" />
          <Card v-if="showInHouseItems || (!showInHouseItems && item.projectStatus !== 'In House')" :item="item" :icons="false" />
        </nuxt-link>
      </section>
    </section>
    <section v-if="dueItems.length > 0">
      <h2>
        To Do
        <span class="card-count" v-html="`(${showInHouseItems ? '' : dueItemsWithoutInHouse.length !== dueItems.length ? dueItemsWithoutInHouse.length + '/' : ''}${dueItems.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <nuxt-link v-for="(item, index) in dueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
          <h6 v-if="(showInHouseItems || (!showInHouseItems && item.projectStatus !== 'In House')) && (index === 0 || dueItems[index - 1].clientName !== item.clientName || dueItems[index - 1].projectName !== item.projectName)" v-text="`${item.clientName} - ${item.projectName}`" />
          <Card v-if="showInHouseItems || (!showInHouseItems && item.projectStatus !== 'In House')" :item="item" :icons="false" />
        </nuxt-link>
      </section>
    </section>
    <ProjectPHP />
  </main>
</template>

<script>
import { mapState } from 'vuex'
import Card from '../Card'
import ProjectPHP from './projectPHP'
import Toggle from '~/components/ui/UiToggle.vue'

export default {
  name: 'ToDoLists',
  components: {
    Card,
    ProjectPHP,
    Toggle
  },
  data () {
    return {
      showInHouseItems: true
    }
  },
  computed: {
    ...mapState([
      'projects',
      'userInfo'
    ]),
    dueItems () {
      return this.getLists('due')
    },
    dueItemsWithoutInHouse () {
      return this.dueItems.filter((obj) => obj.projectStatus !== 'In House')
    },
    overdueItems () {
      return this.getLists('overdue')
    },
    overdueItemsWithoutInHouse () {
      return this.overdueItems.filter((obj) => obj.projectStatus !== 'In House')
    }
  },
  methods: {
    getLists (dueType) {
      function due (timestamp) {
        if (dueType === 'overdue') {
          return timestamp < Date.now()
        } else if (dueType === 'due') {
          return timestamp > Date.now()
        }
      }
      const toDos = []
      this.projects.forEach((project) => {
        if (project.lists) {
          project.lists.forEach((list) => {
            list.items.forEach((item) => {
              if (item.assignee === this.userInfo.email || (this.userInfo.email === 'joe@galexia.agency' && !item.assignee) || (this.userInfo.email === 'joe@galexia.agency' && item.assignee !== this.userInfo.email)) {
                if (item.date) {
                  if (item.dateUNIX && due(item.dateUNIX)) {
                    const newItem = { ...item }
                    newItem.projectName = project.name
                    newItem.projectStatus = project.status
                    toDos.push(newItem)
                  }
                }
              }
            })
          })
        }
      })
      return toDos.sort((a, b) => b.dateUNIX - a.dateUNIX).reverse()
    }
  }
}
</script>
