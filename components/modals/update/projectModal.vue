<template>
  <form class="query-form card" @submit.prevent="submit">
    <div class="card-content">
      <ui-input
        v-model="name"
        name="name"
        label="Name *"
        type="text"
        :autofocus="true"
        :required="true"
      />
      <ui-input
        v-model="status"
        name="status"
        label="Status *"
        type="select"
        :required="true"
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
      </ui-input>
      <ui-input
        v-model="project_url"
        name="project_url"
        label="Project URL"
        type="url"
      />
      <ui-input
        v-model="project_login_url"
        name="project_login_url"
        label="Project Login URL"
        type="url"
      />
      <ui-input
        v-model="hosting"
        name="hosting"
        label="Hosting"
        type="text"
      />
      <ui-input
        v-model="github_url"
        name="github_url"
        label="GitHub Link"
        type="url"
      />
      <ui-input
        v-model="drive_url"
        name="drive_url"
        label="Google Drive Link"
        type="url"
      />
      <ui-input
        v-model="viewer"
        name="viewer"
        label="Project Viewers"
        type="text"
        pattern="[^\s]+"
        @input="noSpaces()"
      />
      <ui-input
        v-model="contributor"
        name="contributor"
        label="Project Contributors"
        type="text"
        pattern="[^\s]+"
        @input="noSpaces()"
      />
      <ui-input
        v-model="admin"
        name="admin"
        label="Project Admins"
        type="text"
        pattern="[^\s]+"
        @input="noSpaces()"
      />
      <ui-input
        v-model="completion_amount"
        name="completion_amount"
        label="Completion Total"
        type="number"
      />
      <ui-input
        v-model="bb_revenue"
        name="bb_revenue"
        label="Before Business Revenue"
        type="number"
      />
      <ui-input
        v-model="bb_expenses"
        name="bb_expenses"
        label="Before Business Expenses"
        type="number"
      />
      <div class="field is-grouped">
        <ui-button type="submit" style-type="primary" :disabled="name === '' || status === '' || completion_amount === '' || bb_revenue === '' || bb_expenses === ''">
          {{ id ? 'Update' : 'Add' }}
        </ui-button>
        <ui-button style-type="text" @click="cancel">
          Cancel
        </ui-button>
      </div>
    </div>
  </form>
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
