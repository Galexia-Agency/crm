<style lang="scss">
  :root {
    --primaryColor: #1A237E;
    --secondaryColor: #212121;
    --tertiaryColor: white;
    --primaryFont: 'Montserrat', serif;
    --secondaryFont: 'Open Sans', sans-serif;
    --borderRadius: 0;
    --fontSize: 16px;
    --scrollbarBG: #F3F3F3;
    --thumbBG: #1A237E4D;

    overflow: hidden
  }
  body {
    overflow: hidden
  }

  /* Scrollbars */
  *::-webkit-scrollbar {
    width: 16px
  }
  * {
    scrollbar-width: thin;
    scrollbar-color: var(--thumbBG) var(--scrollbarBG);
    box-sizing: border-box
  }
  ::-webkit-scrollbar-track {
    background: var(--scrollbarBG)
  }
  ::-webkit-scrollbar-thumb {
    background-color: var(--thumbBG);
    border-radius: 6px;
    border: 3px solid var(--scrollbarBG)
  }

  /* Content */
  .contentWrapper {
    font-family: var(--secondaryFont);
    color: var(--secondaryColor);
    font-size: 16px;
    font-weight: 400;
    margin: 0;
    display: grid;
    grid-template-columns: 300px 1fr;
    h1, h2, h3, h4, h5, h6 {
      font-family: var(--primaryFont);
      font-weight: 400;
      color: var(--primaryColor);
      margin: 0 0 1em
    }
    h1 {
      font-size: 1.66em
    }
    h2 {
      font-size: 1.5em;
      margin: 0 0 .5em
    }
    h3 {
      font-size: 1.33em
    }
    h4 {
      font-size: 1.25em
    }
    h5 {
      font-size: 1.2em
    }
    h6 {
      font-size: 1.1em
    }
    .button.is-primary[disabled], fieldset[disabled] .button.is-primary, .button.is-primary, .button.is-primary:hover, .button.is-primary.is-hovered {
      background: var(--primaryColor)
    }
    .button.is-primary:hover, .button.is-primary.is-hovered {
      opacity: .9
    }
    .input:focus, .textarea:focus, .select select:focus, .is-focused.input, .is-focused.textarea, .select select.is-focused, .input:active, .textarea:active, .select select:active, .is-active.input, .is-active.textarea, .select select.is-active {
      border-color: var(--primaryColor)
    }
    input[type='date'] {
      max-width: calc(100% - 49px)
    }
  }
  :focus:not(:focus-visible) {
    outline: none
  }
  :any-link {
    color: var(--primaryColor);
    text-decoration: none
  }
  main {
    padding: 2rem
  }
  nav {
    padding: 2rem;
    height: 100vh;
    overflow-y: scroll
  }
  button {
    background: transparent;
    border: none;
    cursor: pointer;
    font-size: 1rem;
    font-family: inherit;
    color: var(--primaryColor)
  }
  .search {
    width: 75%;
    font-size: 1rem;
    padding: .25rem
  }

  /* Card */
  .item-description {
    font-weight: 100
  }
  .item-title {
    font-size: .9rem;
    max-width: 82%;
    overflow-wrap: break-word;
    word-wrap: break-word
  }

  /* Menu */
  .hamburger {
    /* stylelint-disable-next-line */
    display: none!important
  }

  @media (max-width: 1000px) {
    main, nav {
      padding: 1.5rem
    }
    main {
      padding-top: 4rem;
      min-width: 100vw
    }
    .hamburger, nav, .contentWrapper {
      /* stylelint-disable-next-line */
      transition: .5s!important
    }
    .hamburger {
      padding: 0;
      /* stylelint-disable-next-line */
      display: inline-block!important;
      position: absolute;
      left: 1.75rem;
      top: 1rem;
      cursor: pointer;
      z-index: 2
    }
    .contentWrapper {
      grid-template-columns: 1fr
    }
    nav {
      z-index: 98;
      position: absolute;
      left: Min(calc(-100vw - 3rem - 46px), -300px);
      width: Min(calc(100vw - 3rem - 46px), 300px);
      background: white;
      border-right: 2px solid #F3F3F3
    }
    .nav_open nav {
      left: 0
    }
    .nav_open .contentWrapper, .nav_open .hamburger {
      margin-left: Min(calc(100vw - 3rem - 46px), 300px)
    }
  }

  /* Board */
  .board {
    margin-top: 20px;
    white-space: nowrap;
    > * {
      display: inline-block
    }
    .new-list {
      margin-top: 10px
    }
  }

  $column-width: 320px;
  .smooth-dnd-draggable-wrapper .list-container {
    padding-bottom: 0
  }
  .list-container {
    width: $column-width;
    padding: 10px;
    margin: 5px;
    margin-right: 20px;
    background-color: #F3F3F3;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .12), 0 1px 1px rgba(0, 0, 0, .24);
    max-height: 60vh;
    overflow: auto;
    > .item-entry {
      background-color: #F3F3F3;
      padding-bottom: 10px;
      position: sticky;
      bottom: 0
    }
  }
  .lists-container {
    > * {
      display: inline-block;
      vertical-align: top
    }
  }
  .list-header {
    padding-bottom: 5px;
    padding-top: 10px;
    margin-top: -10px;
    font-size: 18px;
    position: sticky;
    top: -10px;
    z-index: 1;
    background: #F3F3F3
  }
  .list-header .list-delete {
    display: none
  }
  .list-header:hover .list-delete {
    display: inline
  }
  .list-title {
    border: none;
    background: transparent;
    font-size: 1rem;
    padding: .25rem;
    width: 75%
  }
  .archived {
    color: black;
    border: 1px solid black
  }
  .archived .list-title {
    width: 60%
  }
  .list-title:focus {
    background: white
  }
  .card {
    margin: 5px;
    background-color: white;
    box-shadow: 0 1px 1px rgba(0, 0, 0, .12), 0 1px 1px rgba(0, 0, 0, .24);
    padding: 10px
  }
  .card-ghost {
    transition: .25s all;
    box-shadow: 0 5px 10px rgba(0, 0, 0, .12);
    transform: scale(1.1)
  }
  .card-ghost-drop {
    transform: scale(1)
  }
  .list-drag-handle {
    cursor: move;
    padding: 5px
  }
  .list-delete {
    cursor: pointer;
    padding: 5px
  }
  .item-entry {
    padding-top: 10px;
    margin-top: 10px;
    border-top: 1px solid #DDDDDD
  }
  .new-list {
    width: $column-width;
    margin-left: -10px
  }
  .clear-button {
    position: absolute;
    top: 20px;
    right: 20px
  }
  .refresh {
    font-size: 2rem;
    width: min-content;
    position: absolute;
    right: 2rem;
    top: .5rem;
    cursor: pointer;
    z-index: 9;
    transition: transform .66s ease-in-out 0s
  }
  .refresh.clicked {
    transform: rotate(360deg)
  }
  .nav_open .refresh {
    opacity: 0;
    pointer-events: none
  }
  @media (hover: none) {
    .list-header .list-delete {
      display: inline
    }
  }

  /* Error */
  .error {
    background-color: white;
    display: grid;
    gap: 1rem;
    place-content: center;
    padding: 30px
  }

  /* NavLink */
  .contentWrapper h4#other {
    margin-top: .5rem;
    margin-bottom: .25em;
    text-decoration: underline
  }
  .navLink.other {
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis
  }
</style>

<template>
  <div v-if="authenticated" class="contentWrapper">
    <ui-modal
      ref="modal"
      :active="error.active"
    >
      <div class="error">
        <h1>Uh oh! An error has occured</h1>
        <h2>{{ error.description }}</h2>
        <p>Please copy the below information so as to not lose your changes</p>
        <textarea :value="JSON.stringify(error.data)" rows="10" />
      </div>
    </ui-modal>
    <Hamburger type="arrow" color="var(--primaryColor)" :expanded="expanded" />
    <nav>
      <nuxt-link to="/">
        <h2>Clients</h2>
      </nuxt-link>
      <input
        v-model="search"
        type="search"
        rel="search"
        placeholder="Search..."
        aria-label="Search..."
        class="search"
      >
      <project-nav-link v-if="filteredProjects.hotLeads.length > 0" type="Hot Leads" :clients="clients" :filtered-projects="filteredProjects.hotLeads" :search="search" />
      <project-nav-link v-if="filteredProjects.development.length > 0" type="Development" :clients="clients" :filtered-projects="filteredProjects.development" :search="search" />
      <project-nav-link v-if="filteredProjects.inHouse.length > 0" type="In House" :clients="clients" :filtered-projects="filteredProjects.inHouse" :search="search" />
      <project-nav-link v-if="filteredProjects.university.length > 0" type="University" :clients="clients" :filtered-projects="filteredProjects.university" :search="search" />
      <project-nav-link v-if="filteredProjects.coldLeads.length > 0" type="Cold Leads" :clients="clients" :filtered-projects="filteredProjects.coldLeads" :search="search" />
      <project-nav-link v-if="filteredProjects.paused.length > 0" type="Paused" :clients="clients" :filtered-projects="filteredProjects.paused" :search="search" />
      <project-nav-link v-if="filteredProjects.onGoing.length > 0" type="On-Going" :clients="clients" :filtered-projects="filteredProjects.onGoing" :search="search" />
      <project-nav-link v-if="filteredProjects.closedLead.length > 0" type="Closed Leads" :clients="clients" :filtered-projects="filteredProjects.closedLead" :search="search" />
      <project-nav-link v-if="filteredProjects.cancelled.length > 0" type="Cancelled" :clients="clients" :filtered-projects="filteredProjects.cancelled" :search="search" />
      <template v-if="filteredProjects.other.length > 0">
        <h4 id="other">
          Other
        </h4>
        <template v-for="(project, index) in filteredProjects.other">
          <nuxt-link
            v-show="((!search) || ((project.business_name).toLowerCase()).startsWith(search.toLowerCase()))"
            :key="index + project.business_name"
            :to="`/client/${project.business_shortname.toLowerCase()}`"
            class="navLink other"
            v-text="project.business_name"
          />
        </template>
      </template>
      <br>
      <button class="button primary" @click="showClientModal()">
        New Client
      </button>
      <button class="button primary" @click="logout()">
        Logout
      </button>
    </nav>
    <button class="refresh" :class="{clicked: refreshed}" @click="refresh">
      <i class="fas fa-sync" />
    </button>
    <nuxt />
    <ui-modal
      ref="modal"
      :active="modal.client"
      @close="hideClientModal"
    >
      <clientModal ref="newClient" @add="newClient" @cancel="hideClientModal" />
    </ui-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Hamburger from 'vue-hamburger/hamburger.vue'
import projectNavLink from '~/components/projectNavLink'
import clientModal from '~/components/modals/update/clientModal'

export default {
  components: {
    projectNavLink,
    Hamburger,
    clientModal
  },
  async fetch () {
    if (await this.$auth.isAuthenticated()) {
      this.$store.commit('okta', { authenticated: await this.$auth.isAuthenticated(), claims: await this.$auth.getUser() })
      this.$axios.setHeader('Authorization', `Bearer ${this.$auth.getAccessToken()}`)
      const response = await this.$axios.$get('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/',
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )

      response[3].forEach((project, index) => {
        if (project.lists) {
          response[3][index].lists = JSON.parse(project.lists)
        }
      })
      const clients = await response[0].sort(function (a, b) {
        const textA = a.business_shortname.toUpperCase()
        const textB = b.business_shortname.toUpperCase()
        return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
      })
      this.$store.commit('clients', clients)
      this.$store.commit('contacts', response[1])
      this.$store.commit('domains', response[2])
      this.$store.commit('projects', response[3])

      /* Pandle */
      // If pandle data is not set in local storage
      if (!localStorage.getItem('pandle')) {
        const response = await this.$axios.get(window.location.origin + '/.netlify/functions/sign_in')
        localStorage.setItem('pandle', JSON.stringify(response))
      }
      let pandle = JSON.parse(localStorage.getItem('pandle'))
      if (pandle.data.expiry) {
        // Check if pandle data has expired
        const unixTimestamp = pandle.data.expiry
        if (new Date() > new Date(unixTimestamp * 1000)) {
          const response = await this.$axios.get(window.location.origin + '/.netlify/functions/sign_in')
          localStorage.setItem('pandle', JSON.stringify(response))
        }
        pandle = JSON.parse(localStorage.getItem('pandle'))
        // Set pandle headers
        this.$axios.setHeader('access-token', pandle.data['access-token'])
        this.$axios.setHeader('client', pandle.data.client)
        this.$axios.setHeader('uid', pandle.data.uid)

        const pandleBankAccountChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/bank_account_chart',
            type: 'GET'
          }
        )
        this.$store.commit('pandleBankAccountChart', pandleBankAccountChart.data.data)

        const pandleCashFlowChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/cash_flow_chart',
            type: 'GET'
          }
        )
        this.$store.commit('pandleCashFlowChart', pandleCashFlowChart.data.data)

        const pandleExpenseChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/expense_chart',
            type: 'GET'
          }
        )
        this.$store.commit('pandleExpenseChart', pandleExpenseChart.data.data)

        const pandleProfitLossChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/profit_and_loss_chart',
            type: 'GET'
          }
        )
        this.$store.commit('pandleProfitLossChart', pandleProfitLossChart.data.data)

        const pandleSalesChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/sales_chart',
            type: 'GET'
          }
        )
        this.$store.commit('pandleSalesChart', pandleSalesChart.data.data)

        const pandleTaxDividendChart = await this.$axios.post(window.location.origin + '/.netlify/functions/request',
          {
            url: '/companies/46972/dashboard/tax_and_dividend',
            type: 'GET'
          }
        )
        this.$store.commit('pandleTaxDividendChart', pandleTaxDividendChart.data.data)
      } else {
        this.$store.commit('error', { description: 'Cannot sign in to Pandle' })
      }
    } else {
      this.$router.push('/login')
    }
  },
  data () {
    return {
      search: '',
      refreshed: false,
      modal: {
        client: false
      },
      expanded: null
    }
  },
  computed: {
    ...mapState([
      'error',
      'contacts',
      'domains',
      'projects',
      'clients',
      'authenticated'
    ]),
    filteredProjects () {
      const hotLeads = []
      const coldLeads = []
      const development = []
      const paused = []
      const inHouse = []
      const university = []
      const onGoing = []
      const closedLead = []
      const cancelled = []
      const other = []
      this.clients.forEach((client) => {
        this.projects.forEach((project) => {
          if (project.client_id === client.id) {
            if (project.status === 'Lead') {
              hotLeads.push(project)
            } else if (project.status === 'Hot Lead') {
              hotLeads.push(project)
            } else if (project.status === 'Cold Lead') {
              coldLeads.push(project)
            } else if (project.status === 'Development') {
              development.push(project)
            } else if (project.status === 'Paused') {
              paused.push(project)
            } else if (project.status === 'In House') {
              inHouse.push(project)
            } else if (project.status === 'University') {
              university.push(project)
            } else if (project.status === 'On-Going') {
              onGoing.push(project)
            } else if (project.status === 'Closed Lead') {
              closedLead.push(project)
            } else if (project.status === 'Cancelled') {
              cancelled.push(project)
            } else {
              other.push(project)
            }
          }
        })
        if (
          hotLeads.find(e => e.client_id === client.id) === undefined &&
          coldLeads.find(e => e.client_id === client.id) === undefined &&
          development.find(e => e.client_id === client.id) === undefined &&
          paused.find(e => e.client_id === client.id) === undefined &&
          inHouse.find(e => e.client_id === client.id) === undefined &&
          university.find(e => e.client_id === client.id) === undefined &&
          onGoing.find(e => e.client_id === client.id) === undefined &&
          closedLead.find(e => e.client_id === client.id) === undefined &&
          cancelled.find(e => e.client_id === client.id) === undefined
        ) {
          other.push(client)
        }
      })
      return {
        hotLeads,
        coldLeads,
        development,
        paused,
        inHouse,
        university,
        onGoing,
        closedLead,
        cancelled,
        other
      }
    }
  },
  methods: {
    async logout () {
      await this.$auth.signOut()
      this.$store.dispatch('okta', { authenticated: await this.$auth.isAuthenticated() })
      localStorage.clear()
      sessionStorage.clear()
      const COOKIES = document.cookie.split(';')
      for (let i = 0; i < COOKIES.length; i++) {
        const COOKIE = COOKIES[i]
        const EQ_POS = COOKIE.indexOf('=')
        const NAME = EQ_POS > -1 ? COOKIE.substr(0, EQ_POS) : COOKIE
        document.cookie = NAME + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
      }
    },
    refresh () {
      this.refreshed = true
      location.reload()
    },
    showClientModal (data) {
      this.modal.client = true
      const self = this
      document.documentElement.classList.remove('nav_open')
      setTimeout(function () {
        document.documentElement.classList.add('nav_close')
        self.expanded = false
      }, 500)
      this.$nextTick(() => {
        this.$refs.newClient.show(data)
      })
    },
    hideClientModal () {
      this.modal.client = false
    },
    async newClient (data) {
      this.hideClientModal()
      try {
        await this.$store.dispatch('addClient', data)
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    }
  }
}
</script>
