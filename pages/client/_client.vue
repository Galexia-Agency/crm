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
</style>

<template>
  <main v-if="client" v-dragscroll.x.nomiddle.noright.noback.noforward="!dragging && !hover" class="client" :class="{blossomTreePhoto}">
    <div class="fixed">
      <h1>
        {{ client.business_name }}
        <a v-if="userInfo.groups.includes('admin')" @click="showClientModal(client)">
          <font-awesome-icon :icon="['fa-solid', 'fa-edit']" />
        </a>
      </h1>
      <p v-if="client.about" class="about_the_business" v-text="client.about" />
      <div v-if="userInfo.groups.includes('billing')" class="monies">
        <h2 v-if="client.revenue" v-text="'Total Revenue: £' + client.revenue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.expenses" v-text="'Total Expenses: £' + client.expenses.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.profit" v-text="'Total Net Profit: £' + client.profit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-if="client.completion_amount" v-text="'Completion Total: £' + client.completion_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
      </div>
      <button v-if="!client.pandle_id && userInfo.groups.includes('admin')" class="button primary" type="button" @click="addClientPandle()">
        Add to Pandle
      </button>
      <div v-if="userInfo.groups.includes('admin')" class="contact container">
        <template v-for="contact in contactsForClient">
          <span :key="contact.id + 'i'" style="display: none">
            {{ contact.org = client.business_name }}
          </span>
          <button :key="contact.id" type="button" class="list-container" @click="showContactModal(contact)">
            <font-awesome-icon :icon="['fa-solid', 'fa-address-card']" />
            <span v-text="contact.f_name" />
          </button>
        </template>
        <button type="button" class="list-container" @click="showEditContactModal({client_id: client.id})">
          <font-awesome-icon :icon="['fa-solid', 'fa-plus']" />
          <span>New Contact</span>
        </button>
      </div>
    </div>
    <template v-for="(project, index) in projectsForClient">
      <project :id="safeURL(project.name)" :key="project.id" :project-id="project.id" :index="index" class="project container" />
    </template>
    <ui-modal
      ref="modal"
      :active="modal.contact"
      :cancellable="1"
      @close="hideContactModal"
    >
      <contact ref="contact" @cancel="hideContactModal" @edit="showEditContactModal" />
    </ui-modal>
    <ui-modal
      ref="modal"
      :active="modal.editContact"
      @close="hideEditContactModal(), hideContactModal()"
    >
      <contactModal ref="editContact" @cancel="hideEditContactModal(), hideContactModal()" @submit="editContact" @add="addContact" />
    </ui-modal>
    <ui-modal
      ref="modal"
      :active="modal.newProject"
      @close="hideNewProjectModal"
    >
      <projectModal ref="newProject" @submit="addProject" @cancel="hideNewProjectModal" />
    </ui-modal>
    <ui-modal
      ref="modal"
      :active="modal.client"
      @close="hideClientModal"
    >
      <clientModal ref="client" @submit="editClient" @cancel="hideClientModal" />
    </ui-modal>
    <div v-if="userInfo.groups.includes('admin')" class="fixed">
      <button type="button" class="button primary" @click="showNewProjectModal({client_id: client.id})">
        New Project
      </button>
    </div>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import { dragscroll } from 'vue-dragscroll'
import Contact from '~/components/modals/display/contactModal'
import contactModal from '~/components/modals/update/contactModal'
import Project from '~/components/project'
import projectModal from '~/components/modals/update/projectModal'
import clientModal from '~/components/modals/update/clientModal'

export default {
  name: 'Client',
  metaInfo () {
    return {
      title: this.client.business_name
    }
  },
  components: {
    Contact,
    contactModal,
    Project,
    projectModal,
    clientModal
  },
  directives: {
    dragscroll
  },
  data () {
    return {
      modal: {
        contact: false,
        newProject: false,
        editContact: false,
        client: false
      },
      dragging: false
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'clients',
      'contacts',
      'projects'
    ]),
    client () {
      return this.clients.find((client) => client.business_shortname.toLowerCase() === this.$route.params.client)
    },
    contactsForClient () {
      return this.client ? this.contacts.filter((contact) => contact.client_id === this.client.id) : null
    },
    projectsForClient () {
      return this.client ? this.projects.filter((project) => project.client_id === this.client.id) : null
    },
    hover () {
      return window.matchMedia('(hover: none)').matches
    },
    blossomTreePhoto () {
      for (const project in this.projectsForClient) {
        if (this.projectsForClient[project].admin.includes('chelsea@galexia.agency')) {
          return true
        }
      }
      return false
    }
  },
  created () {
    if (this.clients && !this.client) {
      this.$nuxt.context.error({ statusCode: 404, message: 'Client not found' })
    }
  },
  mounted () {
    if (this.$route.hash && document.querySelector(this.$route.hash)) {
      document.querySelector(this.$route.hash).scrollIntoView()
    }
  },
  methods: {
    showContactModal (data) {
      this.dragging = true
      this.modal.contact = true
      this.$nextTick(() => {
        this.$refs.contact.show(data)
      })
    },
    showEditContactModal (data) {
      this.dragging = true
      this.modal.editContact = true
      this.$nextTick(() => {
        this.$refs.editContact.show(data)
      })
    },
    showNewProjectModal (data) {
      this.dragging = true
      this.modal.newProject = true
      this.$nextTick(() => {
        this.$refs.newProject.show(data)
      })
    },
    showClientModal (data) {
      this.dragging = true
      this.modal.client = true
      this.$nextTick(() => {
        this.$refs.client.show(data)
      })
    },
    hideContactModal () {
      this.dragging = false
      this.modal.contact = false
    },
    hideNewProjectModal () {
      this.dragging = false
      this.modal.newProject = false
    },
    hideEditContactModal () {
      this.dragging = false
      this.modal.editContact = false
    },
    hideClientModal () {
      this.dragging = false
      this.modal.client = false
    },
    async addProject (data) {
      this.hideNewProjectModal()
      try {
        await this.$store.dispatch('addProject', data)
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    },
    async editContact (data) {
      this.hideContactModal()
      this.hideEditContactModal()
      try {
        await this.$store.dispatch('updateContact', data)
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    },
    async addContact (data) {
      this.hideEditContactModal()
      try {
        await this.$store.dispatch('addContact', data)
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    },
    async editClient (data) {
      this.hideClientModal()
      try {
        await this.$store.dispatch('updateClient', data)
        if (this.$route.params.client !== data.business_shortname.toLowerCase()) {
          this.$router.push('/client/' + data.business_shortname.toLowerCase())
        }
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    },
    async addClientPandle () {
      const data = {}
      Object.assign(data, this.client)
      const error = {}
      data.address = JSON.parse(data.address)
      if (!data.billing_email) {
        error.description = 'This client needs a Billing Email before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!data.address.line1) {
        error.description = 'This client needs an Address Line 1 before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!data.address.town) {
        error.description = 'This client needs a Town / City before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!data.address.county) {
        error.description = 'This client needs a County before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!data.address.postcode) {
        error.description = 'This client needs a Postcode before they can be added to Pandle'
        this.$store.commit('error', error)
      } else if (!data.address.country) {
        error.description = 'This client needs a Country before they can be added to Pandle'
        this.$store.commit('error', error)
      } else {
        try {
          await this.$store.dispatch('addClientPandle', data)
        } catch (e) {
          const error = {}
          error.description = e
          error.data = data
          this.$store.commit('error', error)
        }
      }
    }
  }
}
</script>
