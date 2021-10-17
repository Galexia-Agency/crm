<template>
  <div class="query-form card">
    <div class="card-content">
      <ui-input
        v-model="title"
        v-validate="'required'"
        name="title"
        label="Title"
        :error="getError('title')"
        @enter="validate"
      />
      <Editor
        v-if="title"
        v-model="description"
        label="Description"
        @editorUpdateShim="editorUpdateShim"
      />
      <ui-input
        v-model="date"
        name="date"
        type="date"
        label="Date"
        @enter="validate"
        @resetDate="resetDate"
      />
      <div class="field is-grouped">
        <ui-button type="primary" @click="validate">
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
