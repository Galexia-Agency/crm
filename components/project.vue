<style scoped lang="scss">
  h2 {
    display: inline
  }
  .edit {
    color: var(--primaryColor)
  }
  button.centered {
    cursor: pointer;
    user-select: none;
    h2 {
      display: inline-grid;
      place-content: center;
      place-items: center;
      grid-auto-flow: column;
      gap: .5em
    }
    i {
      height: .66em;
      width: .66em;
      display: grid;
      place-content: center;
      place-items: center;
      position: relative
    }
    i:before {
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0
    }
    .fa-sort-up:before {
      top: .1em
    }
    .fa-sort-down:before {
      top: -.3em
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
      <button class="centered" @click="show = !show">
        <h2>
          <i v-if="show" class="fas fa-sort-up" />
          <i v-else class="fas fa-sort-down" />
        </h2>
      </button>
      <h2>
        {{ project.name }}
      </h2>
      <a class="edit" @click="showProjectModal(project)">
        <i class="far fa-edit" />
      </a>
      <a v-if="project.project_url" class="list-container" :href="project.project_url" target="_blank">
        <i class="fas fa-desktop" />
        <span>URL</span>
      </a>
      <a v-if="project.project_login_url" class="list-container" :href="project.project_login_url" target="_blank">
        <i class="fas fa-sign-in-alt" />
        <span>Login</span>
      </a>
      <a v-if="project.github_url" class="list-container" :href="project.github_url" target="_blank">
        <i class="fab fa-github" />
        <span>GitHub</span>
      </a>
      <a v-if="project.drive_url" class="list-container" :href="project.drive_url" target="_blank">
        <i class="fab fa-google-drive" />
        <span>Drive</span>
      </a>
      <span v-if="project.hosting && project.hosting === 'Digital Ocean'" class="list-container">
        <i class="fab fa-digital-ocean" />
        <span>Digital Ocean</span>
      </span>
      <span v-else-if="project.hosting && project.hosting === 'Netlify'" class="list-container">
        <i class="fas fa-cloud" />
        <span>Netlify</span>
      </span>
      <a v-else-if="project.hosting && validURL(project.hosting)" :href="project.hosting" target="_blank" class="list-container">
        <i class="fas fa-cloud" />
        <span v-text="formatURL(project.hosting)" />
      </a>
      <span v-else-if="project.hosting" class="list-container">
        <i class="fas fa-cloud" />
        <span v-text="project.hosting" />
      </span>
      <div class="list-container">
        <i class="fas fa-tasks" />
        <span v-text="project.status" />
      </div>
      <a v-if="$parent.client.pandle_id && !project.pandle_id" class="list-container" @click="addProjectPandle(project)">
        <i class="fas fa-calculator" />
        Add to Pandle
      </a>
      <a v-else-if="project.pandle_id" class="list-container" :href="`https://my.pandle.com/projects/${project.pandle_id}`" target="_blank">
        <i class="fas fa-calculator" />
        View in Pandle
      </a>
      <Toggle :model="showArchived" label="Show Deleted Items" class="list-container" :class="{toggled: showArchived}" @input="showArchived = $event">
        <i class="fas fa-trash-alt" />
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
      showArchived: false
    }
  },
  methods: {
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
