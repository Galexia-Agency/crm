<style scoped lang="scss">
  .card-modal-buttons-container {
    justify-content: space-between;
    > div {
      display: flex
    }
  }
</style>

<template>
  <form class="query-form card" @submit.prevent="submit">
    <div class="card-content">
      <ui-input
        v-model="title"
        name="title"
        label="Title"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        :autofocus="true"
        :required="true"
      />
      <Editor
        v-if="title"
        v-model="description"
        label="Description"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        @editorUpdateShim="editorUpdateShim"
      />
      <ui-input
        v-model="date"
        name="date"
        type="date"
        label="Date"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        @resetDate="resetDate"
      />
      <ui-input
        v-model="assignee"
        name="assignee"
        type="text"
        label="Assignee"
        help="Email Address"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
      />
      <div class="field last-updated">
        Last updated by <strong>{{ updatedBy }}</strong> at <strong>{{ (new Date(updatedDate)).toLocaleTimeString("en-GB") }}</strong> on <strong>{{ (new Date(updatedDate)).toLocaleDateString("en-GB") }}</strong>
      </div>
      <div class="field is-grouped card-modal-buttons-container">
        <div>
          <ui-button type="submit" style-type="primary" :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))">
            {{ id ? 'Update' : 'Add' }}
          </ui-button>
          <ui-button style-type="text" @click="cancel">
            Cancel
          </ui-button>
        </div>
        <ui-button style-type="archive" @click="archive">
          Archive
        </ui-button>
      </div>
    </div>
  </form>
</template>

<script>
import { mapState } from 'vuex'
import Editor from '../editor/Editor'
function data () {
  return {
    id: null,
    title: '',
    description: ' ',
    date: null,
    dayNo: null,
    day: null,
    month: null,
    message: '',
    createdDate: null,
    updatedDate: null,
    clientName: null,
    clientShortName: null,
    updatedBy: null,
    assignee: 'joe@galexia.agency'
  }
}
export default {
  components: {
    Editor
  },
  data () {
    return data()
  },
  computed: {
    ...mapState([
      'claims'
    ]),
    values () {
      return this.$data
    }
  },
  methods: {
    editorUpdateShim (value) {
      this.description = value.getHTML()
    },
    show (data) {
      this.reset()
      Object.assign(this, data)
      this.$el.querySelector('input').focus()
    },
    resetDate () {
      this.date = null
    },
    submit () {
      this.$emit('submit', this.values)
    },
    cancel () {
      this.$emit('cancel', this.values)
    },
    archive () {
      this.$emit('archive', this.values)
    },
    reset () {
      Object.assign(this, data())
    }
  }
}

</script>
