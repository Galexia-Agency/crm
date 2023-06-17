<style scoped lang="scss">
  .edit {
    color: var(--primaryColor);
    font-size: 1.25rem
  }
  button.centered {
    display: inline-grid;
    font-size: 1.5rem;
    cursor: pointer;
    place-content: center;
    place-items: center;
    .fa-sort-up {
      margin-top: .4em
    }
    .fa-sort-down {
      margin-top: -.4em
    }
  }
  .project-details {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
    h2 {
      margin: 0
    }
    .list-container {
      margin-right: 0;
      border: 1px solid transparent;
      transition: border-color .4s;
      &.toggled {
        border: 1px solid black
      }
    }
  }
  .container {
    margin: 2rem 0
  }
  .list-container {
    display: inline-block;
    width: auto;
    color: var(--primaryColor)
  }
  select {
    height: 100%;
    font-size: 16px;
    background: transparent;
    border: none
  }
  .project-drag-handle {
    color: var(--primaryColor);
    transform: rotate(90deg);
    cursor: move
  }
</style>

<template>
  <div>
    <div class="project-details">
      <FontAwesomeIcon :icon="['fa-solid', 'fa-grip']" class="project-drag-handle" />
      <button type="button" class="centered" @click="toggleProjectVisibility">
        <FontAwesomeIcon v-if="show" :icon="['fa-solid', 'fa-sort-up']" />
        <FontAwesomeIcon v-else :icon="['fa-solid', 'fa-sort-down']" />
      </button>
      <h2 v-text="project.name" />
      <a v-if="project.admin.includes(userInfo.email)" class="edit" @click="showProjectModal(project)">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
      </a>
      <a v-if="project.project_url" class="list-container" :href="project.project_url" target="_blank">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-desktop']" />
        <span>URL</span>
      </a>
      <a v-if="project.project_login_url" class="list-container" :href="project.project_login_url" target="_blank">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-sign-in-alt']" />
        <span>Login</span>
      </a>
      <a v-if="project.github_url" class="list-container" :href="project.github_url" target="_blank">
        <FontAwesomeIcon :icon="['fa-brands', 'fa-github']" />
        <span>GitHub</span>
      </a>
      <a v-if="project.drive_url" class="list-container" :href="project.drive_url" target="_blank">
        <FontAwesomeIcon :icon="['fa-brands', 'fa-google-drive']" />
        <span>Drive</span>
      </a>
      <span v-if="project.hosting && project.hosting === 'Digital Ocean'" class="list-container">
        <FontAwesomeIcon :icon="['fa-brands', 'fa-digital-ocean']" />
        <span>Digital Ocean</span>
      </span>
      <span v-else-if="project.hosting && project.hosting === 'Netlify'" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-cloud']" />
        <span>Netlify</span>
      </span>
      <a v-else-if="project.hosting && validURL(project.hosting)" :href="project.hosting" target="_blank" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-cloud']" />
        <span v-text="formatURL(project.hosting)" />
      </a>
      <span v-else-if="project.hosting" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-cloud']" />
        <span v-text="project.hosting" />
      </span>
      <div v-if="project.php" class="list-container">
        <FontAwesomeIcon :icon="['fa-brands', 'fa-php']" />
        <span v-text="project.php" />
      </div>
      <div class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-tasks']" />
        <span v-text="project.status" />
      </div>
      <div v-if="daysToStart" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calendar-alt']" />
        <span v-text="daysToStart" />
      </div>
      <div v-if="daysToComplete" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calendar-alt']" />
        <span v-text="daysToComplete" />
      </div>
      <div v-if="daysWithUs" class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calendar-alt']" />
        <span v-text="daysWithUs" />
      </div>
      <a v-if="client.pandle_id && !project.pandle_id && userInfo.groups.includes('admin')" class="list-container" @click="addProjectPandle()">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calculator']" />
        Add to Pandle
      </a>
      <a v-else-if="project.pandle_id && userInfo.groups.includes('admin')" class="list-container" :href="`https://my.pandle.com/projects/${project.pandle_id}`" target="_blank">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-calculator']" />
        View in Pandle
      </a>
      <!-- <button v-if="project.pandle_id && userInfo.groups.includes('billing')" class="list-container" type="button" @click="createInvoice()">
        Create Invoice
      </button>
      <button v-if="project.pandle_id && userInfo.groups.includes('billing')" class="list-container" type="button" @click="createQuote()">
        Create Quote
      </button> -->
      <button v-if="project.pandle_id && userInfo.groups.includes('billing')" class="list-container" type="button" @click="showMoneyGraphsModal">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-chart-bar']" />
        View Monthly Monetary Accounts
      </button>
      <div class="list-container">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-trash-can']" />
        <UiToggle :model="showArchived" label="Show Deleted Items" :class="{toggled: showArchived}" @input="showArchived = $event" />
      </div>
    </div>
    <KanbanBoard
      v-show="show"
      :project="project"
      :show-archived="showArchived"
    />
    <ModalsUpdateProject :active="modalsUpdateProjectActive" :project="project" @submit="updateProject" @cancel="hideProjectModal" />
    <ModalsDisplayProjectMoneyGraphs :active="modalsProjectMoneyGraphActive" :project="project" @cancel="hideMoneyGraphsModal" />
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'
import EventSourcePolyfill from 'eventsource'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!../workers/projectSSE.js'

export default {
  props: {
    projectId: {
      type: Number,
      required: true
    },
    index: {
      type: Number,
      required: true
    }
  },
  data () {
    return {
      modalsUpdateProjectActive: false,
      modalsProjectMoneyGraphActive: false,
      show: true,
      showArchived: false,
      sseWorker: null,
      sse: null,
      timeout: null
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'isRenewingTokens',
      'projects'
    ]),
    ...mapGetters([
      'getProjectById',
      'getClientById',
      'getProjectClientName',
      'getProjectDaysToStart',
      'getProjectDaysToComplete',
      'getProjectDaysWithUs'
    ]),
    client () {
      return this.getClientById(this.project.client_id)
    },
    project () {
      return this.getProjectById(this.projectId)
    },
    daysToStart () {
      const daysToStart = this.getProjectDaysToStart(this.project)
      if (!daysToStart) {
        return null
      }
      if (this.project.start_date) {
        if (daysToStart === 1) {
          return `Project took ${daysToStart} day to start`
        }
        return `Project took ${daysToStart} days to start`
      }
      if (daysToStart === 1) {
        return `Project has been a lead for ${daysToStart} day`
      }
      return `Project has been a lead for ${daysToStart} days`
    },
    daysToComplete () {
      const daysToComplete = this.getProjectDaysToComplete(this.project)
      // If this is an ongoing project, then there is no end date really
      if (this.project.ongoing) {
        return null
      }
      if (this.project.completion_date) {
        if (daysToComplete === 1) {
          return `Project took ${daysToComplete} day to complete`
        }
        return `Project took ${daysToComplete} days to complete`
      }
      if (daysToComplete === 1) {
        return `Project has taken ${daysToComplete} day`
      }
      return `Project has taken ${daysToComplete} days`
    },
    daysWithUs () {
      const daysWithUs = this.getProjectDaysWithUs(this.project)
      if (!daysWithUs) {
        return null
      }
      if (daysWithUs === 1) {
        return `Project has been with us for ${daysWithUs} day`
      }
      return `Project has been with us for ${daysWithUs} days`
    }
  },
  watch: {
    isRenewingTokens (newVal) {
      if (document.visibilityState === 'visible') {
        if (newVal) {
        // eslint-disable-next-line no-console
          console.log('Stopping SSE due to renewing tokens and we need to send the new token with SSE')
          this.sse_end()
        } else {
        // eslint-disable-next-line no-console
          console.log('Starting SSE due to tokens now being renewed')
          this.sse_start()
        }
      }
    }
  },
  mounted () {
    this.sse_start()
    document.addEventListener('visibilitychange', this.visibleChange)
    const projectVisibility = localStorage.getItem(`${this.getProjectClientName(this.project)}_${this.project.name}_visibility`)
    if (projectVisibility !== null) {
      this.show = JSON.parse(projectVisibility)
    }
  },
  beforeDestroy () {
    clearTimeout(this.timeout)
    document.removeEventListener('visibilitychange', this.visibleChange)
    this.sse_end()
  },
  methods: {
    toggleProjectVisibility () {
      this.show = !this.show
      localStorage.setItem(`${this.getProjectClientName(this.project)}_${this.project.name}_visibility`, this.show)
    },
    visibleChange () {
      if (document.visibilityState !== 'visible') {
        clearTimeout(this.timeout)
        this.sse_end()
      }
    },
    sse_start () {
      this.timeout = window.setTimeout(async () => {
        if (!this.isRenewingTokens && document.visibilityState === 'visible') {
          const id = this.project.id
          const authToken = `Bearer ${await this.$auth.getAccessToken()}`
          const self = this
          const url = `https://api.galexia.agency/projects/sse?id=${id}`
          if (window.Worker) {
            if (!this.sseWorker) {
              this.sseWorker = new Worker()
              this.sseWorker.postMessage(['start', url, id, authToken])
              this.sseWorker.onmessage = (e) => {
                self.sse_updateProject(e.data)
              }
              // eslint-disable-next-line no-console
              console.log('Started SSE')
            } else {
              this.sse_end()
              this.sse_start()
            }
          } else if (!this.sse) {
            this.sse = new EventSourcePolyfill(url, {
              headers: {
                Authorization: authToken
              },
              withCredentials: false
            })
            this.sse.addEventListener(id, function (event) {
              self.sse_updateProject(JSON.parse(event.data)[0])
            }, {
              once: false,
              retry: 5000
            })
            // eslint-disable-next-line no-console
            console.log('Started SSE')
          } else {
            this.sse_end()
            this.sse_start()
          }
        }
        // Delay the SSE request slightly for each consecutive project
      }, (this.index + 1) * 500)
    },
    sse_end () {
      if (window.Worker) {
        if (this.sseWorker) {
          this.sseWorker.postMessage(['stop'])
          this.sseWorker = null
          // eslint-disable-next-line no-console
          console.log('Stopped SSE')
        }
      } else if (this.sse) {
        this.sse.close()
        this.sse = null
        // eslint-disable-next-line no-console
        console.log('Stopped SSE')
      }
    },
    sse_updateProject (newProject) {
      try {
        this.$store.commit('loading', true)
        newProject.lists = JSON.parse(newProject.lists)
        const currentProject = this.$store.getters.getProjectById(newProject.id)
        // If the database content is newer, then replace our version
        if (new Date(newProject.updated_at) > new Date(currentProject.updated_at)) {
          this.$store.commit('updateProject', newProject)
        }
      } catch (e) {
        // eslint-disable-next-line no-console
        console.error(e)
        this.sse_end()
      } finally {
        // Give this a bit of a delay so the loading indicator actually appears
        window.setTimeout(() => {
          this.$store.commit('loading', false)
        }, 250)
      }
    },
    changeArchived () {
      this.showArchived = !this.showArchived
    },
    showProjectModal () {
      this.modalsUpdateProjectActive = true
    },
    hideProjectModal () {
      this.modalsUpdateProjectActive = false
    },
    showMoneyGraphsModal () {
      this.modalsProjectMoneyGraphActive = true
    },
    hideMoneyGraphsModal () {
      this.modalsProjectMoneyGraphActive = false
    },
    updateProject (data) {
      this.hideProjectModal()
      this.$store.dispatch('updateProject', data)
    },
    addProjectPandle () {
      const data = {}
      Object.assign(data, this.project)
      data.client_name = this.client.business_shortname
      this.$store.dispatch('addProjectPandle', data)
    }
  }
}
</script>
