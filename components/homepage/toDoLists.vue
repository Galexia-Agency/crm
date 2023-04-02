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
</style>

<template>
  <main v-if="overdueItems.length > 0 || dueItems.length > 0">
    <section v-if="overdueItems.length > 0">
      <h2>
        Overdue
        <span class="card-count" v-html="`(${overdueItems.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <nuxt-link v-for="(item, index) in overdueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
          <h6 v-if="index === 0 || overdueItems[index - 1].clientName !== item.clientName || overdueItems[index - 1].projectName !== item.projectName" v-text="`${item.clientName} - ${item.projectName}`" />
          <Card :item="item" :icons="false" />
        </nuxt-link>
      </section>
    </section>
    <section v-if="dueItems.length > 0">
      <h2>
        To Do
        <span class="card-count" v-html="`(${dueItems.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <nuxt-link v-for="(item, index) in dueItems" :key="item.id" :to="`/client/${item.clientShortName.toLowerCase()}/#${safeURL(item.projectName)}`" class="home-card-container">
          <h6 v-if="index === 0 || dueItems[index - 1].clientName !== item.clientName || dueItems[index - 1].projectName !== item.projectName" v-text="`${item.clientName} - ${item.projectName}`" />
          <Card :item="item" :icons="false" />
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

export default {
  name: 'ToDoLists',
  components: {
    Card,
    ProjectPHP
  },
  computed: {
    ...mapState([
      'projects',
      'userInfo'
    ]),
    dueItems () {
      return this.getLists('due')
    },
    overdueItems () {
      return this.getLists('overdue')
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
