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
    height: 100vh;
    position: relative;
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
    margin-bottom: 2em;
    white-space: break-spaces;
    max-width: 1000px
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
        <a v-if="claims.groups.includes('admin')" @click="showClientModal(client)">
          <font-awesome-icon :icon="['fa-solid', 'fa-edit']" />
        </a>
      </h1>
      <p v-if="client.about" class="about_the_business" v-text="client.about" />
      <div v-if="claims.groups.includes('billing')" class="monies">
        <h2 v-text="'Total Income: £' + income.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-text="'Total Expenses: £' + expenses.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-text="'Total Profit: £' + profit.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
        <h2 v-text="'Completion Total: £' + completion_total.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')" />
      </div>
      <button v-if="!client.pandle_id && claims.groups.includes('admin')" class="button primary" type="button" @click="addClientPandle()">
        Add to Pandle
      </button>
      <div v-if="claims.groups.includes('admin')" class="contact container">
        <template v-for="contact in contacts">
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
    <template v-for="project in projects">
      <project :id="encodeURIComponent(project.name.replaceAll(' ', '-').toLowerCase())" :key="project.id" :project="project" class="project container" />
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
    <div v-if="claims.groups.includes('admin')" class="fixed">
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
  async fetch () {
    // Set Up Pandle
    await this.pandleBootstrap()

    // Income
    const IncomeURLs = []
    if (this.claims.groups.includes('billing')) {
      for (const project in this.projects) {
        if (this.projects[project].bb_revenue) {
          this.income = this.income + parseFloat(this.projects[project].bb_revenue)
        }
        if (this.projects[project].pandle_id) {
          IncomeURLs.push(`/companies/46972/projects/${this.projects[project].pandle_id}/income_transactions`)
        }
      }
      if (this.client) {
        if (this.client.pandle_id) {
          IncomeURLs.push(`/companies/46972/customers/${this.client.pandle_id}/account`)
        }
      }
    }

    // Expenses
    const ExpensesURLs = []
    if (this.claims.groups.includes('billing')) {
      for (const project in this.projects) {
        if (this.projects[project].bb_expenses) {
          this.expenses = this.expenses + parseFloat(this.projects[project].bb_expenses)
        }
        if (this.projects[project].pandle_id) {
          ExpensesURLs.push(`/companies/46972/projects/${this.projects[project].pandle_id}/expense_transactions`)
        }
      }
    }

    // Pandle Fetch
    if (IncomeURLs) {
      for (const value of await Promise.all(IncomeURLs.map(this.pandleFetch))) {
        this.income = this.income + value
      }
    }
    if (ExpensesURLs) {
      for (const value of await Promise.all(ExpensesURLs.map(this.pandleFetch))) {
        this.expenses = this.expenses + value
      }
    }
  },
  data () {
    return {
      modal: {
        contact: false,
        newProject: false,
        editContact: false,
        client: false
      },
      dragging: false,
      income: 0,
      expenses: 0
    }
  },
  computed: {
    client () {
      return this.$store.state.clients.find(client => client.business_shortname.toLowerCase() === this.$route.params.client)
    },
    contacts () {
      return this.client ? this.$store.state.contacts.filter(contact => contact.client_id === this.client.id) : null
    },
    projects () {
      return this.client ? this.$store.state.projects.filter(project => project.client_id === this.client.id) : null
    },
    hover () {
      return window.matchMedia('(hover: none)').matches
    },
    profit () {
      return this.income - this.expenses
    },
    completion_total () {
      let c = 0
      for (const project in this.projects) {
        if (this.projects[project].completion_amount !== null) {
          c = c + parseFloat(this.projects[project].completion_amount)
        }
      }
      return c
    },
    blossomTreePhoto () {
      for (const project in this.projects) {
        if (this.projects[project].admin.includes('chelsea@galexia.agency')) {
          return true
        }
      }
      return false
    },
    ...mapState([
      'claims'
    ])
  },
  mounted () {
    if (this.$route.hash && document.querySelector(this.$route.hash)) {
      document.querySelector(this.$route.hash).scrollIntoView()
    }
  },
  methods: {
    pandleFetch (url) {
      let value = 0
      return this.$axios.$post(location.origin + '/.netlify/functions/request', { url, type: 'GET' })
        .then(function (response) {
          for (const a in response.data) {
            if (response.data[a].attributes['total-amount']) {
              value = value + parseFloat(response.data[a].attributes['total-amount'])
            }
          }
          return value
        })
        .catch(function (e) {
          const error = {}
          error.description = e.message
          this.$store.commit('error', error)
        })
    },
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
        window.location = '/client/' + data.business_shortname.toLowerCase()
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
