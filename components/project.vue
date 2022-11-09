<style scoped lang="scss">
  .edit {
    color: var(--primaryColor);
    font-size: 1.25rem
  }
  button.centered {
    cursor: pointer;
    display: inline-grid;
    place-content: center;
    place-items: center;
    font-size: 1.5rem;
    .fa-sort-up {
      margin-top: .4em
    }
    .fa-sort-down {
      margin-top: -.4em
    }
  }
  .project-details {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
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
    color: var(--primaryColor);
    display: inline-block;
    width: auto
  }
  select {
    border: none;
    font-size: 16px;
    background: transparent;
    height: 100%
  }
</style>

<template>
  <div>
    <div class="project-details">
      <button type="button" class="centered" @click="show = !show">
        <font-awesome-icon v-if="show" :icon="['fa-solid', 'fa-sort-up']" />
        <font-awesome-icon v-else :icon="['fa-solid', 'fa-sort-down']" />
      </button>
      <h2>
        {{ project.name }}
      </h2>
      <a v-if="project.admin.includes(claims.email)" class="edit" @click="showProjectModal(project)">
        <font-awesome-icon :icon="['fa-solid', 'fa-edit']" />
      </a>
      <a v-if="project.project_url" class="list-container" :href="project.project_url" target="_blank">
        <font-awesome-icon :icon="['fa-solid', 'fa-desktop']" />
        <span>URL</span>
      </a>
      <a v-if="project.project_login_url" class="list-container" :href="project.project_login_url" target="_blank">
        <font-awesome-icon :icon="['fa-solid', 'fa-sign-in-alt']" />
        <span>Login</span>
      </a>
      <a v-if="project.github_url" class="list-container" :href="project.github_url" target="_blank">
        <font-awesome-icon :icon="['fa-brands', 'fa-github']" />
        <span>GitHub</span>
      </a>
      <a v-if="project.drive_url" class="list-container" :href="project.drive_url" target="_blank">
        <font-awesome-icon :icon="['fa-brands', 'fa-google-drive']" />
        <span>Drive</span>
      </a>
      <span v-if="project.hosting && project.hosting === 'Digital Ocean'" class="list-container">
        <font-awesome-icon :icon="['fa-brands', 'fa-digital-ocean']" />
        <span>Digital Ocean</span>
      </span>
      <span v-else-if="project.hosting && project.hosting === 'Netlify'" class="list-container">
        <font-awesome-icon :icon="['fa-solid', 'fa-cloud']" />
        <span>Netlify</span>
      </span>
      <a v-else-if="project.hosting && validURL(project.hosting)" :href="project.hosting" target="_blank" class="list-container">
        <font-awesome-icon :icon="['fa-solid', 'fa-cloud']" />
        <span v-text="formatURL(project.hosting)" />
      </a>
      <span v-else-if="project.hosting" class="list-container">
        <font-awesome-icon :icon="['fa-solid', 'fa-cloud']" />
        <span v-text="project.hosting" />
      </span>
      <div class="list-container">
        <font-awesome-icon :icon="['fa-solid', 'fa-tasks']" />
        <span v-text="project.status" />
      </div>
      <a v-if="$parent.client.pandle_id && !project.pandle_id && claims.groups.includes('admin')" class="list-container" @click="addProjectPandle(project)">
        <font-awesome-icon :icon="['fa-solid', 'fa-calculator']" />
        Add to Pandle
      </a>
      <a v-else-if="project.pandle_id && claims.groups.includes('admin')" class="list-container" :href="`https://my.pandle.com/projects/${project.pandle_id}`" target="_blank">
        <font-awesome-icon :icon="['fa-solid', 'fa-calculator']" />
        View in Pandle
      </a>
      <Toggle :model="showArchived" label="Show Deleted Items" class="list-container" :class="{toggled: showArchived}" @input="showArchived = $event">
        <font-awesome-icon :icon="['fa-solid', 'fa-trash-can']" />
      </Toggle>
    </div>
    <board v-show="show" :project-id="project.id" />
    <ui-modal
      ref="modal"
      :active="modal"
      @close="hideProjectModal"
    >
      <projectModal ref="project" @submit="updateProject" @cancel="hideProjectModal" />
    </ui-modal>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import EventSourcePolyfill from 'eventsource'
// eslint-disable-next-line import/no-webpack-loader-syntax
import Worker from 'worker-loader!../workers/projectSSE.js'
import Toggle from '~/components/ui/UiToggle.vue'
import Board from '~/components/Board'
import projectModal from '~/components/modals/update/projectModal'

export default {
  components: {
    Toggle,
    Board,
    projectModal
  },
  props: {
    project: {
      type: Object,
      default: null,
      required: true
    }
  },
  data () {
    return {
      modal: false,
      show: true,
      showArchived: false,
      sseWorker: null,
      sse: null
    }
  },
  computed: {
    ...mapState([
      'claims'
    ])
  },
  mounted () {
    const id = this.project.id
    const authToken = `Bearer ${this.$auth.getAccessToken()}`
    const self = this
    const url = `https://api.galexia.agency/projects/sse?id=${id}`
    if (window.Worker) {
      this.sseWorker = new Worker()
      this.sseWorker.postMessage(['start', url, id, authToken])
      this.sseWorker.onmessage = (e) => {
        self.sse_updateProject(e.data)
      }
    } else {
      this.sse = new EventSourcePolyfill(url, {
        headers: {
          Authorization: authToken
        },
        withCredentials: false
      })
      this.sse.addEventListener(id, function (event) {
        self.sse_updateProject(JSON.parse(event.data)[0])
      }, false)
    }
  },
  beforeDestroy () {
    if (window.Worker) {
      this.sseWorker.postMessage(['stop'])
    } else {
      // eslint-disable-next-line no-lonely-if
      if (this.sse) {
        this.sse.close()
      }
    }
  },
  methods: {
    sse_updateProject (newProject) {
      this.$nuxt.$loading.start()
      newProject.lists = JSON.parse(newProject.lists)
      const currentProject = this.$store.state.projects.find(project => project.id === newProject.id)
      // If the database content is newer, then replace our version
      if (new Date(newProject.updated_at) > new Date(currentProject.updated_at)) {
        this.$store.commit('updateProject', newProject)
      }
      this.$nuxt.$loading.finish()
    },
    changeArchived () {
      this.showArchived = !this.showArchived
    },
    showProjectModal (data) {
      this.$parent.dragging = true
      this.modal = true
      this.$nextTick(() => {
        this.$refs.project.show(data)
      })
    },
    hideProjectModal () {
      this.$parent.dragging = false
      this.modal = false
    },
    async updateProject (data) {
      this.hideProjectModal()
      try {
        await this.$store.dispatch('updateProject', data)
      } catch (e) {
        const error = {}
        error.description = e
        error.data = data
        this.$store.commit('error', error)
      }
    },
    async addProjectPandle (data) {
      const datad = {}
      Object.assign(datad, data)
      datad.client_name = this.$parent.client.business_shortname
      try {
        await this.$store.dispatch('addProjectPandle', datad)
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
