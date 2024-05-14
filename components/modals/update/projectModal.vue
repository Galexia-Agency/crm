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
        <option value="Ad-Hoc">
          Ad-Hoc
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
        v-model="php"
        name="php"
        label="PHP Version"
        type="select"
        :options="['7.3', '7.4', '8.0', '8.1', '8.2', '8.3']"
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
        :no-spaces="true"
      />
      <ui-input
        v-model="contributor"
        name="contributor"
        label="Project Contributors"
        type="text"
        pattern="[^\s]+"
        :no-spaces="true"
      />
      <ui-input
        v-model="admin"
        name="admin"
        label="Project Admins"
        type="text"
        pattern="[^\s]+"
        :no-spaces="true"
      />
      <ui-input
        v-model="completion_amount"
        name="completion_amount"
        label="Completion Total"
        prefix="£"
        type="number"
      />
      <ui-input
        v-model="bb_revenue"
        name="bb_revenue"
        label="Before Business Revenue"
        prefix="£"
        type="number"
      />
      <ui-input
        v-model="bb_expenses"
        name="bb_expenses"
        label="Before Business Expenses"
        prefix="£"
        type="number"
      />
      <ui-input
        v-model="enquiry_date"
        name="enquiry_date"
        label="Date of Enquiry"
        type="date"
      />
      <ui-input
        v-model="start_date"
        name="start_date"
        label="Date of Project Start"
        type="date"
      />
      <ui-input
        v-model="ongoing"
        name="ongoing"
        :label="(new Date(start_date) > new Date() ? 'Is ' : 'Was ') + 'this an ongoing project?'"
        type="checkbox"
      />
      <ui-input
        v-model="completion_date"
        name="completion_date"
        label="Date of Project Completion"
        type="date"
        :disabled="ongoing"
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
    php: '',
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
    admin: 'joe@galexia.agency',
    updated_at: null,
    created_at: null,
    enquiry_date: '',
    start_date: '',
    ongoing: false,
    completion_date: ''
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
      'userInfo'
    ])
  },
  methods: {
    show (data) {
      this.reset()
      Object.assign(this, data)
      if (this.userInfo.email !== 'joe@galexia.agency') {
        this.admin = 'joe@galexia.agency,' + this.userInfo.email
      }
      this.ongoing = Boolean(this.ongoing)
    },
    submit () {
      this.$emit('submit', this.values)
    },
    cancel () {
      this.$emit('cancel', this.values)
    },
    reset () {
      Object.assign(this, data())
    }
  }
}
</script>
