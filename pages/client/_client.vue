<style scoped lang="scss">
  .container {
    margin: 2rem 0
  }
  svg {
    color: var(--primaryColor)
  }
  .client {
    position: relative;
    height: 100vh;
    overflow-y: scroll;
    &.blossomTreePhoto {
      --primaryColor: #D485C4
    }
  }
  .fixed {
    position: sticky;
    left: 0
  }
  .about_the_business {
    max-width: 1000px;
    margin-bottom: 2em;
    white-space: break-spaces
  }
  .monies {
    display: flex;
    flex-wrap: wrap;
    gap: 1em
  }
  .project {
    margin-bottom: 2rem
  }
</style>

<template>
  <main v-if="client" v-dragscroll.x.nomiddle.noright.noback.noforward="allowDragScroll && hasFinePointerControl" class="client" :class="{blossomTreePhoto}">
    <div class="fixed">
      <h1>
        {{ client.business_name }}
        <a v-if="userInfo.groups.includes('admin')" @click="$store.dispatch('client/update', { client })">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
        </a>
      </h1>
      <p v-if="client.about" class="about_the_business" v-text="client.about" />
      <div v-if="userInfo.groups.includes('billing')" class="monies">
        <h2 v-text="`Revenue: ${getClientRevenue(client, true)}`" />
        <h2 v-text="`Expenses: ${getClientExpenses(client, true)}`" />
        <h2 v-text="`Net Profit: ${getClientProfit(client, true)}`" />
        <h2 v-text="`Profit Margin: ${getClientProfitMargin(client, true)}`" />
        <h2 v-text="`Completion Total: ${getClientCompletionAmount(client, true)}`" />
      </div>
      <button v-if="!client.pandle_id && userInfo.groups.includes('admin')" class="button primary" type="button" @click="addClientPandle()">
        Add to Pandle
      </button>
      <Contacts :client="client" />
    </div>
    <DraggableContainer
      class="container"
      drag-class="project-ghost"
      drop-class="project-ghost-drop"
      lock-axis="y"
      drag-handle-selector=".project-drag-handle"
      :animation-duration="100"
      @drag-start="dragStartHandler()"
      @drag-end="dragEndHandler()"
      @drop="onProjectDrop"
    >
      <template v-for="(project, index) in projectsForClient">
        <Draggable :key="project.id">
          <Project
            :id="safeURL(project.name)"
            :project-id="project.id"
            :index="index"
            class="project"
          />
        </Draggable>
      </template>
    </DraggableContainer>
    <div v-if="userInfo.groups.includes('admin')" class="fixed">
      <button type="button" class="button primary" @click="$store.dispatch('client/project/add', {client_id: client.id})">
        New Project
      </button>
    </div>
    <ModalsDisplayContact />
    <!-- <ModalsDisplayProjectMoneyGraphs /> -->
  </main>
</template>

<script>
import { Container as DraggableContainer, Draggable } from 'vue-smooth-dnd'
import { mapState, mapGetters } from 'vuex'
import { dragscroll } from 'vue-dragscroll'
import { makeDropHandler } from '~/plugins/makeDropHandler'

export default {
  name: 'Client',
  components: {
    DraggableContainer,
    Draggable
  },
  directives: {
    dragscroll
  },
  head () {
    return {
      title: this.client.business_name
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'allowDragScroll'
    ]),
    ...mapGetters(
      'client',
      {
        getClientByShortname: 'getByShortname',
        getClientExpenses: 'getExpenses',
        getClientRevenue: 'getRevenue',
        getClientProfit: 'getProfit',
        getClientProfitMargin: 'getProfitMargin',
        getClientCompletionAmount: 'getCompletionAmount'
      }
    ),
    ...mapGetters(
      'client/project',
      {
        getProjectById: 'getById',
        getProjectsForClient: 'getForClient'
      }
    ),
    client () {
      return this.getClientByShortname(this.$route.params.client)
    },
    projectsForClient () {
      if (!this.client) {
        return []
      }
      const projects = []
      this.getProjectsForClient(this.client).forEach((projectId) => {
        projects.push(this.getProjectById(projectId))
      })
      return projects
    },
    hasFinePointerControl () {
      return window.matchMedia('(pointer: fine)').matches
    },
    blossomTreePhoto () {
      if (this.projectsForClient.length === 0) {
        return null
      }
      return this.projectsForClient.some((project) => project.admin.includes('chelsea@galexia.agency'))
    }
  },
  created () {
    if (!this.client) {
      this.$nuxt.context.error({ statusCode: 404, message: 'Client not found' })
    }
  },
  mounted () {
    if (this.$route.hash && document.querySelector(this.$route.hash)) {
      document.querySelector(this.$route.hash).scrollIntoView()
    }
  },
  methods: {
    onProjectDrop: makeDropHandler('onProjectDropComplete'),
    async onProjectDropComplete (src, trg) {
      await this.$store.dispatch('client/project/move', [
        this.client.id,
        src.index,
        trg.index
      ])
    },
    addClientPandle () {
      if (!this.client.billing_email) {
        this.$store.dispatch('error/initialise', 'This client needs a Billing Email before they can be added to Pandle')
      } else if (!this.client.address_line_1) {
        this.$store.dispatch('error/initialise', 'This client needs an Address Line 1 before they can be added to Pandle')
      } else if (!this.client.address_town) {
        this.$store.dispatch('error/initialise', 'This client needs a Town / City before they can be added to Pandle')
      } else if (!this.client.address_county) {
        this.$store.dispatch('error/initialise', 'This client needs a County before they can be added to Pandle')
      } else if (!this.client.address_postcode) {
        this.$store.dispatch('error/initialise', 'This client needs a Postcode before they can be added to Pandle')
      } else if (!this.client.address_country) {
        this.$store.dispatch('error/initialise', 'This client needs a Country before they can be added to Pandle')
      } else {
        this.$store.dispatch('client/addToPandle', this.client)
      }
    }
  }
}
</script>
