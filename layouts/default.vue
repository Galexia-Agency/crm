<style lang="scss">
  :root {
    --primaryColor: #1A237E;
    --secondaryColor: #212121;
    --tertiaryColor: white;
    --borderRadius: 0;
    --fontSize: 16px;
    --scrollbarBG: #F3F3F3;
    --thumbBG: #1A237E4D;

    overflow: hidden
  }
  body {
    overflow: hidden;
    font-family: sans-serif
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
    border: 3px solid var(--scrollbarBG);
    border-radius: 6px
  }

  /* Content */
  .contentWrapper, .modal {
    display: grid;
    grid-template-columns: 300px 1fr;
    margin: 0;
    color: var(--secondaryColor);
    font-weight: 400;
    font-size: 1rem;
    h1, h2, h3, h4, h5, h6 {
      margin: 0 0 1em;
      color: var(--primaryColor);
      font-weight: 400
    }
    h1 {
      font-size: 1.66em
    }
    h2 {
      margin: 0 0 .5em;
      font-size: 1.5em
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
      color: red;
      background: transparent;
      border: 1px solid red
    }
    .button.is-archive:hover, .button.is-archive.is-hovered {
      background: whitesmoke
    }
    .input:focus, .textarea:focus, .select select:focus, .is-focused.input, .is-focused.textarea, .select select.is-focused, .input:active, .textarea:active, .select select:active, .is-active.input, .is-active.textarea, .select select.is-active {
      border-color: var(--primaryColor)
    }
    input[type='date'] {
      display: inline-block;
      max-width: calc(100% - 50px)
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
    height: 100vh;
    padding: 2rem;
    overflow-y: scroll
  }
  button {
    color: var(--primaryColor);
    font-size: 1rem;
    font-family: inherit;
    background: transparent;
    border: none;
    cursor: pointer
  }
  .search {
    width: 75%;
    padding: .25rem;
    font-size: 1rem
  }

  /* Card */
  .card-description {
    font-weight: 100
  }
  .card-title, .card-date {
    max-width: 82%;
    font-size: .9rem;
    text-wrap: initial;
    overflow-wrap: break-word
  }
  .card-date, .card-assignee {
    color: var(--primaryColor);
    opacity: .6
  }

  /* Menu */
  .hamburger {
    /* stylelint-disable-next-line declaration-no-important */
    display: none!important
  }

  @media (max-width: 1000px) {
    main, nav {
      padding: 1.5rem
    }
    main {
      min-width: 100vw;
      padding-top: 4rem
    }
    .hamburger, nav, .contentWrapper {
      /* stylelint-disable-next-line declaration-no-important */
      transition: .5s!important
    }
    .hamburger {
      position: absolute;
      top: 1rem;
      left: 1.75rem;
      z-index: 2;
      /* stylelint-disable-next-line declaration-no-important */
      display: inline-block!important;
      padding: 0;
      cursor: pointer
    }
    .contentWrapper {
      grid-template-columns: 1fr
    }
    nav {
      position: absolute;
      /* stylelint-disable-next-line function-name-case, declaration-property-value-no-unknown */
      left: Min(calc(-100vw - 3rem - 46px), -300px);
      z-index: 98;
      /* stylelint-disable-next-line function-name-case, declaration-property-value-no-unknown */
      width: Min(calc(100vw - 3rem - 46px), 300px);
      background: white;
      border-right: 2px solid #F3F3F3
    }
    .nav_open nav {
      left: 0
    }
    .nav_open .contentWrapper, .nav_open .hamburger {
      /* stylelint-disable-next-line function-name-case, declaration-property-value-no-unknown */
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
  .board-container .smooth-dnd-draggable-wrapper .list-container {
    padding-bottom: 0
  }
  .smooth-dnd-container.horizontal > * {
    display: table-cell
  }
  .smooth-dnd-container.vertical > .smooth-dnd-draggable-wrapper {
    /* stylelint-disable-next-line declaration-no-important */
    overflow: visible!important
  }
  .list-container {
    width: $column-width;
    max-height: 60vh;
    margin: 0 20px 0 0;
    padding: 10px;
    overflow: auto;
    background-color: #F3F3F3;
    box-shadow: 0 1px 1px rgba(0 0 0 / 12%), 0 1px 1px rgba(0 0 0 / 24%);
    > .card-entry {
      position: sticky;
      bottom: -1px;
      padding-bottom: 10px;
      background-color: #F3F3F3
    }
  }
  .list-header {
    position: sticky;
    top: -10px;
    z-index: 1;
    display: flex;
    gap: .5rem;
    align-items: center;
    justify-content: space-between;
    margin-top: -10px;
    margin-right: 5px;
    margin-left: 5px;
    padding-top: 10px;
    padding-bottom: 10px;
    font-size: 18px;
    background: #F3F3F3
  }
  .list-header .list-delete {
    opacity: 0
  }
  .list-header:hover .list-delete {
    opacity: 1
  }
  .list-title {
    width: 75%;
    padding: .25rem;
    font-size: 1rem;
    background: transparent;
    border: none
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
    padding: 10px;
    background-color: white;
    box-shadow: 0 1px 1px rgba(0 0 0 / 12%), 0 1px 1px rgba(0 0 0 / 24%)
  }
  .card-ghost {
    box-shadow: 0 5px 10px rgba(0 0 0 / 12%);
    transform: scale(1.1);
    cursor: move;
    transition: .25s all
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
  .card-entry {
    margin-top: 10px;
    padding-top: 10px;
    border-top: 1px solid #DDDDDD
  }
  .new-list {
    width: $column-width;
    margin-left: -5px
  }
  .clear-button {
    position: absolute;
    top: 20px;
    right: 20px
  }
  @media (hover: none) {
    .list-header .list-delete {
      display: inline
    }
  }

  /* NavLink */
  .contentWrapper h4#other {
    margin-top: .5rem;
    margin-bottom: .25em;
    text-decoration: underline
  }
  .navLink.other {
    display: block;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis
  }

  /* Loading */
  .sidebar-loading, .main-loading {
    background-color: #E4E4E4;
    animation: fade-data .6s linear infinite alternate-reverse
  }
  .loading-content {
    height: 20px;
    margin-bottom: 20px;
    background: linear-gradient(90deg, #F4F4F4 8%, #E4E4E4 18%, #F4F4F4 33%);
    border-radius: 10px;
    animation: shimmer-data 5s linear infinite forwards
  }
  @for $i from 2 through 10 {
    .loading-content:nth-child(#{$i}) {
      /* stylelint-disable-next-line declaration-property-value-no-unknown */
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
  <div>
    <LayoutLoading />
    <div v-if="isAuthenticated && isClientLoaded" class="contentWrapper">
      <Sidebar />
      <Nuxt />
      <UiError />
      <UiConflict />
      <UiConfirm />
      <UiCreateModel />
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'DefaultLayout',
  computed: {
    ...mapState([
      'isAuthenticated',
      'isClientLoaded'
    ])
  },
  mounted () {
    document.addEventListener('visibilitychange', this.handleVisibilityChange)
  },
  beforeDestroy () {
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)
  },
  methods: {
    /*
      Although we have a timer running to renew the accessToken,
      it is possible this timer got cleared by the browser putting the tab into a sleep mode.
      When we navigate back to the tab, we call manuallyRenewTokens, which checks whether the timer is still running, and re-confirms our auth state
    */
    handleVisibilityChange () {
      if (document.visibilityState === 'visible') {
        // Renew tokens now as we've just got back to the page
        this.$auth.manuallyRenewTokens()
      }
    }
  }
}
</script>
