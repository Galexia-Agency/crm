<template>
  <div class="query-form card">
    <div class="card-content">
      <ui-input
        v-model="title"
        v-validate="'required'"
        name="title"
        label="Title"
        :error="getError('title')"
        :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))"
        @enter="validate"
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
        @enter="validate"
        @resetDate="resetDate"
      />
      <div class="field is-grouped">
        <ui-button type="primary" :disabled="!($parent.$parent.$parent.project.admin.includes(claims.email) || ($parent.$parent.$parent.project.contributor && $parent.$parent.$parent.project.contributor.includes(claims.email)))" @click="validate">
          {{ id ? 'Update' : 'Add' }}
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
import Editor from '../editor/Editor'
function data () {
  return {
    id: null,
    title: '',
    description: ' ',
    date: null,
    message: '',
    createdDate: null,
    updatedDate: null
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
    validate () {
      this.$validator
        .validate()
        .then((state) => {
          if (state) {
            return this.submit()
          }
          this.message = 'Please complete the required fields!'
        })
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
    reset () {
      Object.assign(this, data())
    },
    getError (name) {
      if (this.errors) {
        return (this.errors.first(name) || '').replace(/The .+ field/, 'This field')
      } else {
        return null
      }
    }
  }
}

</script>
