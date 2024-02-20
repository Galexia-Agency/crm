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
  <main v-if="overdueCards.length > 0 || dueCards.length > 0">
    <div class="toggle-container">
      Show in house tasks
      <UiToggle :model="showInHouseItems" label="Show In House Items" :class="{toggled: showInHouseItems}" @input="toggleShowInHouseItems" />
    </div>
    <section v-if="overdueCards.length > 0">
      <h2>
        Overdue
        <span class="card-count" v-html="`(${showInHouseItems ? '' : overdueCardsWithoutInHouse.length !== overdueCards.length ? `${overdueCardsWithoutInHouse.length }/` : ''}${overdueCards.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <NuxtLink v-for="(card, index) in overdueCards" :key="card.id" :to="card.projectLink" class="home-card-container">
          <h6 v-if="(showInHouseItems || (!showInHouseItems && card.projectStatus !== 'In House')) && (index === 0 || overdueCards[index - 1].clientName !== card.clientName || overdueCards[index - 1].projectName !== card.projectName)" v-text="`${card.clientName} - ${card.projectName}`" />
          <KanbanCard v-if="showInHouseItems || (!showInHouseItems && card.projectStatus !== 'In House')" :card="card" :icons="false" />
        </NuxtLink>
      </section>
    </section>
    <section v-if="dueCards.length > 0">
      <h2>
        To Do
        <span class="card-count" v-html="`(${showInHouseItems ? '' : dueCardsWithoutInHouse.length !== dueCards.length ? `${dueCardsWithoutInHouse.length }/` : ''}${dueCards.length} tasks total)`" />
      </h2>
      <section class="list-container">
        <NuxtLink v-for="(card, index) in dueCards" :key="card.id" :to="card.projectLink" class="home-card-container">
          <h6 v-if="(showInHouseItems || (!showInHouseItems && card.projectStatus !== 'In House')) && (index === 0 || dueCards[index - 1].clientName !== card.clientName || dueCards[index - 1].projectName !== card.projectName)" v-text="`${card.clientName} - ${card.projectName}`" />
          <KanbanCard v-if="showInHouseItems || (!showInHouseItems && card.projectStatus !== 'In House')" :card="card" :icons="false" />
        </NuxtLink>
      </section>
    </section>
    <HomepageProjectPHP />
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      showInHouseItems: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    ...mapState(
      'client/project',
      {
        projects: 'all'
      }
    ),
    ...mapGetters(
      'client/project',
      {
        getProjectLink: 'getLink'
      }
    ),
    dueCards () {
      return this.getLists('due')
    },
    dueCardsWithoutInHouse () {
      return this.dueCards.filter((obj) => obj.projectStatus !== 'In House')
    },
    overdueCards () {
      return this.getLists('overdue')
    },
    overdueCardsWithoutInHouse () {
      return this.overdueCards.filter((obj) => obj.projectStatus !== 'In House')
    }
  },
  mounted () {
    const inHouseTasksVisibility = localStorage.getItem('inHouseTasks_visibility')
    if (inHouseTasksVisibility !== null) {
      this.showInHouseItems = JSON.parse(inHouseTasksVisibility)
    }
  },
  methods: {
    toggleShowInHouseItems ($event) {
      this.showInHouseItems = $event
      localStorage.setItem('inHouseTasks_visibility', $event)
    },
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
            list.items.forEach((card) => {
              if (
                (
                  card.assignee === this.userInfo.email ||
                  (this.userInfo.email === 'joe@galexia.agency' && !card.assignee) ||
                  (this.userInfo.email === 'joe@galexia.agency' && card.assignee !== this.userInfo.email)
                ) &&
                card.date &&
                card.dateUNIX && due(card.dateUNIX)
              ) {
                const newCard = { ...card }
                newCard.projectName = project.name
                newCard.projectLink = this.getProjectLink(project)
                newCard.projectStatus = project.status
                toDos.push(newCard)
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
