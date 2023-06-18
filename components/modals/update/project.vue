<template>
  <UiModal
    :active="active"
    @close="cancel"
  >
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <UiInput
          v-model="updatedProject.name"
          name="name"
          label="Name *"
          type="text"
          :autofocus="true"
          :required="true"
        />
        <UiInput
          v-model="updatedProject.status"
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
        </UiInput>
        <UiInput
          v-model="updatedProject.project_url"
          name="project_url"
          label="Project URL"
          type="url"
        />
        <UiInput
          v-model="updatedProject.project_login_url"
          name="project_login_url"
          label="Project Login URL"
          type="url"
        />
        <UiInput
          v-model="updatedProject.hosting"
          name="hosting"
          label="Hosting"
          type="text"
        />
        <UiInput
          v-model="updatedProject.php"
          name="php"
          label="PHP Version"
          type="select"
          :options="['7.3', '7.4', '8.0', '8.1', '8.2']"
        />
        <UiInput
          v-model="updatedProject.github_url"
          name="github_url"
          label="GitHub Link"
          type="url"
        />
        <UiInput
          v-model="updatedProject.drive_url"
          name="drive_url"
          label="Google Drive Link"
          type="url"
        />
        <UiInput
          v-model="updatedProject.viewer"
          name="viewer"
          label="Project Viewers"
          type="text"
          pattern="[^\s]+"
          :no-spaces="true"
        />
        <UiInput
          v-model="updatedProject.contributor"
          name="contributor"
          label="Project Contributors"
          type="text"
          pattern="[^\s]+"
          :no-spaces="true"
        />
        <UiInput
          v-model="updatedProject.admin"
          name="admin"
          label="Project Admins"
          type="text"
          pattern="[^\s]+"
          :no-spaces="true"
        />
        <UiInput
          v-model="updatedProject.completion_amount"
          name="completion_amount"
          label="Completion Total"
          prefix="£"
          type="number"
        />
        <UiInput
          v-model="updatedProject.bb_revenue"
          name="bb_revenue"
          label="Before Business Revenue"
          prefix="£"
          type="number"
        />
        <UiInput
          v-model="updatedProject.bb_expenses"
          name="bb_expenses"
          label="Before Business Expenses"
          prefix="£"
          type="number"
        />
        <UiInput
          v-model="updatedProject.enquiry_date"
          name="enquiry_date"
          label="Date of Enquiry"
          type="date"
        />
        <UiInput
          v-model="updatedProject.start_date"
          name="start_date"
          label="Date of Project Start"
          type="date"
        />
        <UiInput
          v-model="updatedProject.ongoing"
          name="ongoing"
          :label="`${new Date(updatedProject.start_date) > new Date() ? 'Is' : 'Was'} this an ongoing project?`"
          type="checkbox"
        />
        <UiInput
          v-model="updatedProject.completion_date"
          name="completion_date"
          label="Date of Project Completion"
          type="date"
          :disabled="updatedProject.ongoing"
        />
        <div class="field is-grouped">
          <UiButton
            type="submit"
            style-type="primary"
            :disabled="updatedProject.name === '' || updatedProject.status === '' || updatedProject.completion_amount === '' || updatedProject.bb_revenue === '' || updatedProject.bb_expenses === ''"
          >
            {{ updatedProject.id ? 'Update' : 'Add' }}
          </UiButton>
          <UiButton style-type="text" @click="cancel">
            Cancel
          </UiButton>
        </div>
      </div>
    </form>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

const projectDefault = {
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

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    project: {
      type: Object,
      default () {
        return projectDefault
      }
    }
  },
  data () {
    return {
      updatedProject: { ...projectDefault, ...this.project }
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ])
  },
  watch: {
    // Watch when the modal is opened so we can update the admins
    'project.client_id': {
      handler (value) {
        if (value) {
          this.updateAdmins()
        }
      },
      immediate: true
    }
  },
  methods: {
    updateAdmins () {
      if (!this.updatedProject.admin) {
        // Add yourself at the beginning
        if (this.userInfo.email !== 'joe@galexia.agency') {
          this.updatedProject.admin = `joe@galexia.agency,${this.userInfo.email}`
        // Add Joe at the beginning
        } else {
          this.updatedProject.admin = 'joe@galexia.agency'
        }
      } else {
        // Add yourself at the beginning
        if (this.userInfo.email !== 'joe@galexia.agency') {
          this.updatedProject.admin = `${this.userInfo.email},${this.updatedProject.admin}`
        }
        // Add Joe at the beginning
        if (!this.updatedProject.admin.includes('joe@galexia.agency')) {
          this.updatedProject.admin = `joe@galexia.agency,${this.updatedProject.admin}`
        }
      }
    },
    submit () {
      this.updateAdmins()
      if (parseFloat(this.updatedProject.completion_amount)) {
        this.updatedProject.completion_amount = parseFloat(this.updatedProject.completion_amount).toFixed(2)
      }
      if (parseFloat(this.updatedProject.bb_revenue)) {
        this.updatedProject.bb_revenue = parseFloat(this.updatedProject.bb_revenue).toFixed(2)
      }
      if (parseFloat(this.updatedProject.bb_expenses)) {
        this.updatedProject.bb_expenses = parseFloat(this.updatedProject.bb_expenses).toFixed(2)
      }
      this.$emit('submit', this.updatedProject)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
