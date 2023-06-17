<style scoped lang="scss">
  .list-container {
    display: inline-block;
    width: auto
  }
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
        <a v-if="userInfo.groups.includes('admin')" @click="showUpdateClientModal()">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
        </a>
      </h1>
      <p v-if="client.about" class="about_the_business" v-text="client.about" />
      <div v-if="userInfo.groups.includes('billing')" class="monies">
        <h2 v-if="client.revenue != undefined" v-text="'Total Revenue: £' + client.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.expenses != undefined" v-text="'Total Expenses: £' + client.expenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.profit != undefined" v-text="'Total Net Profit: £' + client.profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.completion_amount != undefined" v-text="'Completion Total: £' + client.completion_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
      </div>
      <button v-if="!client.pandle_id && userInfo.groups.includes('admin')" class="button primary" type="button" @click="addClientPandle()">
        Add to Pandle
      </button>
      <div v-if="userInfo.groups.includes('admin')" class="contact container">
        <template v-for="contact in contactsForClient">
          <span :key="contact.id + 'i'" style="display: none">
            {{ contact.org = client.business_name }}
          </span>
          <button :key="contact.id" type="button" class="list-container" @click="showDisplayContactModal(contact)">
            <FontAwesomeIcon :icon="['fa-solid', 'fa-address-card']" />
            <span v-text="contact.f_name" />
          </button>
        </template>
        <button type="button" class="list-container" @click="showUpdateContactModal({client_id: client.id})">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-plus']" />
          <span>New Contact</span>
        </button>
      </div>
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
    <ModalsDisplayContact :display="modalsContactToDisplay" @cancel="hideDisplayContactModal" @submit="showUpdateContactModal" />
    <!-- The key here ensures that the component is updated when the contact prop updates -->
    <ModalsUpdateContact :key="`contact_modal_${JSON.stringify(contactToUpdate)}`" :active="modalsUpdateContactActive" :contact="contactToUpdate" @cancel="hideUpdateContactModal" @submit="updateOrAddContact" />
    <ModalsUpdateProject :key="`project_modal_${JSON.stringify(projectToUpdate)}`" :active="modalsUpdateProjectActive" :project="projectToUpdate" @cancel="hideUpdateProjectModal" @submit="addProject" />
    <ModalsUpdateClient :key="`project_modal_${JSON.stringify(client)}`" :active="modalsUpdateClientActive" :client="client" @cancel="hideUpdateClientModal" @submit="updateClient" />
    <div v-if="userInfo.groups.includes('admin')" class="fixed">
      <button type="button" class="button primary" @click="showUpdateProjectModal({client_id: client.id})">
        New Project
      </button>
    </div>
  </main>
</template>

<script>
import { Container as DraggableContainer, Draggable } from 'vue-smooth-dnd'
import { mapState, mapGetters } from 'vuex'
import { dragscroll } from 'vue-dragscroll'
import { makeDropHandler } from '~/utils/plugins'

export default {
  name: 'Client',
  metaInfo () {
    return {
      title: this.client.business_name
    }
  },
  components: {
    DraggableContainer,
    Draggable
  },
  directives: {
    dragscroll
  },
  data () {
    return {
      modalsContactToDisplay: false,
      modalsUpdateContactActive: false,
      modalsUpdateProjectActive: false,
      modalsUpdateClientActive: false,
      contactToUpdate: null,
      projectToUpdate: null
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'contacts',
      'projects',
      'allowDragScroll'
    ]),
    ...mapGetters([
      'getClientByShortname',
      'getProjectById'
    ]),
    client () {
      return this.getClientByShortname(this.$route.params.client)
    },
    contactsForClient () {
      return this.client ? this.contacts.filter((contact) => contact.client_id === this.client.id) : null
    },
    projectsForClient () {
      if (!this.client) {
        return []
      }
      const projects = []
      this.client.projects.forEach((projectId) => {
        projects.push(this.getProjectById(projectId))
      })
      return projects
    },
    hasFinePointerControl () {
      return window.matchMedia('(pointer: fine)').matches
    },
    blossomTreePhoto () {
      if (!this.projectsForClient) {
        return null
      }
      return Object.values(this.projectsForClient).some((project) => project.admin.includes('chelsea@galexia.agency'))
    },
    addressForContact () {
      return JSON.stringify(this.client.address)
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
      await this.$store.dispatch('moveProject', [
        this.client.id,
        src.index,
        trg.index
      ])
    },
    // Display Contact Modal
    showDisplayContactModal (contact) {
      this.modalsContactToDisplay = contact
    },
    hideDisplayContactModal () {
      this.modalsContactToDisplay = false
    },
    // Update Contact Modal
    showUpdateContactModal (contact) {
      this.contactToUpdate = contact
      this.modalsUpdateContactActive = true
      this.hideDisplayContactModal()
    },
    hideUpdateContactModal () {
      this.modalsUpdateContactActive = false
      this.contactToUpdate = null
    },
    updateOrAddContact (contact) {
      if (contact.id) {
        this.$store.dispatch('updateContact', { ...contact, address: this.addressForContact })
      } else {
        this.$store.dispatch('addContact', { ...contact, address: this.addressForContact })
      }
      this.hideUpdateContactModal()
    },
    // Update Project Modal
    showUpdateProjectModal (project) {
      this.modalsUpdateProjectActive = true
      this.projectToUpdate = project
    },
    hideUpdateProjectModal () {
      this.modalsUpdateProjectActive = false
      this.projectToUpdate = null
    },
    addProject (project) {
      this.hideUpdateProjectModal()
      this.$store.dispatch('addProject', project)
    },
    // Update Client Modal
    showUpdateClientModal () {
      this.modalsUpdateClientActive = true
    },
    hideUpdateClientModal () {
      this.modalsUpdateClientActive = false
    },
    async updateClient (client) {
      this.hideUpdateClientModal()
      await this.$store.dispatch('updateClient', client)
      if (this.$route.params.client !== client.business_shortname.toLowerCase()) {
        this.$router.push('/client/' + client.business_shortname.toLowerCase())
      }
    },
    addClientPandle () {
      const error = {}
      if (!this.client.billing_email) {
        error.description = 'This client needs a Billing Email before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!this.client.address.line1) {
        error.description = 'This client needs an Address Line 1 before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!this.client.address.town) {
        error.description = 'This client needs a Town / City before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!this.client.address.county) {
        error.description = 'This client needs a County before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!this.client.address.postcode) {
        error.description = 'This client needs a Postcode before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!this.client.address.country) {
        error.description = 'This client needs a Country before they can be added to Pandle'
        this.$store.commit('error', error)
      } else {
        this.$store.dispatch('addClientPandle', this.client)
      }
    }
  }
}
</script>
