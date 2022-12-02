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
    fieldset:not([disabled]) .button.is-primary:not([disabled]):hover, fieldset:not([disabled]) .button.is-primary.is-hovered:not([disabled]) {
      opacity: .9
    }
    .button.is-archive[disabled], fieldset[disabled] .button.is-archive, .button.is-archive, .button.is-archive:hover, .button.is-archive.is-hovered {
      background: transparent;
      border: 1px solid red;
      color: red
    }
    .button.is-archive:hover, .button.is-archive.is-hovered {
      background: whitesmoke
    }
    .input:focus, .textarea:focus, .select select:focus, .is-focused.input, .is-focused.textarea, .select select.is-focused, .input:active, .textarea:active, .select select:active, .is-active.input, .is-active.textarea, .select select.is-active {
      border-color: var(--primaryColor)
    }
    input[type='date'] {
      max-width: calc(100% - 49px)
    }
  }
  svg:not(:root).svg-inline--fa, svg:not(:host).svg-inline--fa {
    box-sizing: border-box
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
  .item-title, .item-date {
    font-size: .9rem;
    max-width: 82%;
    overflow-wrap: break-word;
    word-wrap: break-word
  }
  .item-date, .item-assignee {
    color: var(--primaryColor);
    opacity: .6
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
      bottom: -1px
    }
  }
  .lists-container {
    > * {
      display: inline-block;
      vertical-align: top
    }
  }
  .list-header {
    padding-bottom: 10px;
    padding-top: 10px;
    margin-top: -10px;
    margin-left: 5px;
    margin-right: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: .5rem;
    font-size: 18px;
    position: sticky;
    top: -10px;
    z-index: 1;
    background: #F3F3F3
  }
  .list-header .list-delete {
    opacity: 0
  }
  .list-header:hover .list-delete {
    opacity: 1
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
    transform: scale(1.1);
    cursor: move
  }
  .card-ghost-drop {
    transform: scale(1)
  }
  .list-drag-handle {
    cursor: move
  }
  .list-container.archived .list-drag-handle {
    cursor: not-allowed
  }
  .list-delete {
    cursor: pointer
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

  /* Loading */
  .sidebar-loading, .main-loading {
    background-color: #E4E4E4;
    animation: fade-data .6s linear infinite alternate-reverse
  }
  .loading-content {
    background: linear-gradient(90deg, #F4F4F4 8%, #E4E4E4 18%, #F4F4F4 33%);
    border-radius: 10px;
    animation: shimmer-data 5s linear infinite forwards;
    height: 20px;
    margin-bottom: 20px
  }
  /* stylelint-disable-next-line at-rule-no-unknown */
  @for $i from 2 through 10 {
    .loading-content:nth-child(#{$i}) {
      animation-delay: .25s * $i
    }
  }

  @keyframes fade-data {
    from {
      opacity: .6
    }
    to {
      opacity: 1
    }
  }
  @keyframes shimmer-data {
    from {
      background-position: 0 0
    }
    to {
      background-position: 100rem 0
    }
  }

  /* Tables */
  table {
    width: 100%;
    thead {
      border-bottom: 1px solid black
    }
    th {
      cursor: pointer;
      user-select: none
    }
    th, td {
      padding: .5em
    }
    tbody {
      tr:nth-of-type(odd) {
        background-color: var(--scrollbarBG)
      }
      td:first-child {
        font-weight: bold
      }
      tr.divider {
        border-bottom: 2px solid
      }
    }
  }

  /* Buttons */
  .field.is-grouped {
    flex-direction: row-reverse;
    gap: .75rem
  }
  .field.is-grouped > .control:not(:last-child) {
    margin-right: 0
  }
</style>

<template>
  <div v-if="authenticated" class="contentWrapper">
    <ui-modal
      ref="modal"
      :active="error.active"
      :cancellable="!error.data"
      @close="$store.commit('error', { active: false })"
    >
      <div class="error">
        <h1>Uh oh! An error has occured</h1>
        <h2>{{ error.description }}</h2>
        <template v-if="error.data">
          <p>Please copy the below information so as to not lose your changes</p>
          <textarea :value="JSON.stringify(error.data)" rows="10" />
        </template>
      </div>
    </ui-modal>
    <Sidebar />
    <nuxt />
    <ui-modal
      ref="modal"
      :active="modal.client"
      @close="hideClientModal"
    >
      <clientModal ref="newClient" @add="newClient" @cancel="hideClientModal" />
    </ui-modal>
    <ConflictsModal v-if="conflicts.reveal" ref="conflicts" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Sidebar from '~/components/sidebar'
import clientModal from '~/components/modals/update/clientModal'
import ConflictsModal from '~/components/modals/conflictModal'

export default {
  name: 'DefaultLayout',
  components: {
    Sidebar,
    clientModal,
    ConflictsModal
  },
  data () {
    return {
      modal: {
        client: false
      }
    }
  },
  computed: {
    ...mapState([
      'error',
      'authenticated',
      'conflicts'
    ])
  },
  mounted () {
    document.addEventListener('visibilitychange', this.refreshOkta)
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.refreshOkta)
  },
  methods: {
    async refreshOkta () {
      if (document.visibilityState === 'visible' && await this.$auth.isAuthenticated()) {
        await this.$store.commit('okta', { authenticated: await this.$auth.isAuthenticated(), claims: await this.$auth.getUser() })
        this.$axios.setHeader('Authorization', `Bearer ${this.$auth.getAccessToken()}`)
        this.$api.setHeader('Authorization', `Bearer ${this.$auth.getAccessToken()}`)
      }
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
        this.$router.push('/client/' + data.business_shortname)
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
