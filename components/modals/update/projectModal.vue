<template>
  <div class="query-form card">
    <div class="card-content">
      <div class="field">
        <label for="name" class="label">
          Name *
        </label>
        <input
          v-model="name"
          name="name"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="status" class="label">
          Status *
        </label>
        <select
          v-model="status"
          name="status"
          class="input"
        >
          <option value="Hot Lead">
            Hot Lead
          </option>
          <option value="Cold Lead">
            Cold Lead
          </option>
          <option value="Development">
            Development
          </option>
          <option value="Paused">
            Paused
          </option>
          <option value="In House">
            In House
          </option>
          <option value="On-Going">
            On-Going
          </option>
          <option value="Closed Lead">
            Closed Lead
          </option>
          <option value="Completed">
            Completed
          </option>
          <option value="Cancelled">
            Cancelled
          </option>
        </select>
      </div>
      <div class="field">
        <label for="project_url" class="label">
          Project URL
        </label>
        <input
          v-model="project_url"
          name="project_url"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="project_login_url" class="label">
          Project Login URL
        </label>
        <input
          v-model="project_login_url"
          name="project_login_url"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="hosting" class="label">
          Hosting
        </label>
        <input
          v-model="hosting"
          name="hosting"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="github_link" class="label">
          GitHub Link
        </label>
        <input
          v-model="github_url"
          type="url"
          name="github_url"
          class="input"
        >
      </div>
      <div class="field">
        <label for="drive_url" class="label">
          Google Drive Link
        </label>
        <input
          v-model="drive_url"
          type="url"
          name="drive_url"
          class="input"
        >
      </div>
      <div class="field">
        <label for="viewer" class="label">
          Project Viewers
        </label>
        <input
          v-model="viewer"
          type="text"
          name="viewer"
          class="input"
          pattern="[^\s]+"
          @input="noSpaces()"
        >
      </div>
      <div class="field">
        <label for="contributor" class="label">
          Project Contributors
        </label>
        <input
          v-model="contributor"
          type="text"
          name="contributor"
          class="input"
          pattern="[^\s]+"
          @input="noSpaces()"
        >
      </div>
      <div class="field">
        <label for="admin" class="label">
          Project Admins
        </label>
        <input
          v-model="admin"
          type="text"
          name="admin"
          class="input"
          pattern="[^\s]+"
          @input="noSpaces()"
        >
      </div>
      <div class="field">
        <label for="completion" class="label">
          Completion Total
        </label>
        <input
          v-model="completion_amount"
          type="number"
          name="completion"
          class="input"
        >
      </div>
      <div class="field">
        <label for="bb_revenue" class="label">
          Before Business Revenue
        </label>
        <input
          v-model="bb_revenue"
          type="number"
          name="bb_revenue"
          class="input"
        >
      </div>
      <div class="field">
        <label for="bb_expenses" class="label">
          Before Business Expenses
        </label>
        <input
          v-model="bb_expenses"
          type="number"
          name="bb_expenses"
          class="input"
        >
      </div>
      <div class="field is-grouped">
        <ui-button v-if="id" type="primary" :disabled="name === '' || status === '' || completion_amount === '' || bb_revenue === '' || bb_expenses === ''" @click="submit">
          Update
        </ui-button>
        <ui-button v-else type="primary" :disabled="name === '' || status === '' || completion_amount === '' || bb_revenue === '' || bb_expenses === ''" @click="submit">
          Add
        </ui-button>
        <ui-button type="text" @click="cancel">
          Cancel
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapState } from 'vuex'
function data () {
  return {
    client_id: null,
    id: null,
    name: '',
    status: '',
    hosting: '',
    github_url: '',
    drive_url: '',
    project_url: '',
    project_login_url: '',
    pandle_id: null,
    completion_amount: 0,
    bb_revenue: 0,
    bb_expenses: 0,
    viewer: '',
    contributor: '',
    admin: 'joe@galexia.agency'
  }
}
export default {
  data () {
    return data()
  },
  computed: {
    values () {
      return this.$data
    },
    ...mapState([
      'claims'
    ])
  },
  methods: {
    show (data) {
      this.reset()
      Object.assign(this, data)
      if (this.claims.email !== 'joe@galexia.agency') {
        this.admin = 'joe@galexia.agency,' + this.claims.email
      }
      this.$el.querySelector('input').focus()
    },
    submit () {
      this.$emit('submit', this.values)
    },
    cancel () {
      this.$emit('cancel', this.values)
    },
    reset () {
      Object.assign(this, data())
    },
    noSpaces () {
      if (this.$data.viewer) {
        this.$data.viewer = this.$data.viewer.replaceAll(' ', '')
      }
      if (this.$data.contributor) {
        this.$data.contributor = this.$data.contributor.replaceAll(' ', '')
      }
      if (this.$data.admin) {
        this.$data.admin = this.$data.admin.replaceAll(' ', '')
      }
    }
  }
}
</script>
