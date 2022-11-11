<style scoped>
  .before-after {
    display: grid;
    grid-template-columns: repeat(auto-fit, minMax(250px, 1fr));
    gap: 1rem
  }
  p {
    margin-bottom: 1rem
  }
</style>
<template>
  <ui-modal
    ref="modal"
    :active="conflicts.reveal"
  >
    <div class="query-form card">
      <form class="card-content" @submit.prevent="submit">
        <h2>
          Please resolve the conflicts to continue
        </h2>
        <p>
          It seems like some of this data has been updated by someone else whilst you've been editing it.
        </p>
        <p style="font-weight: bold">
          Data that has changed: {{ conflicts.title }}
        </p>
        <template v-if="conflicts.type === 'editor'">
          <div class="before-after">
            <Editor
              v-model="before"
              label="Content from the database"
              :disabled="true"
            />
            <Editor
              v-model="after"
              label="Your content"
              :disabled="true"
            />
          </div>
          <Editor
            v-model="updated"
            label="Your updated content"
            @editorUpdateShim="editorUpdateShim"
          />
        </template>
        <template v-else>
          <div class="before-after">
            <ui-input
              v-model="before"
              :type="conflicts.type"
              :options="conflicts.options"
              name="before"
              label="Content from the database"
              :disabled="true"
            />
            <ui-input
              v-model="after"
              :type="conflicts.type"
              :options="conflicts.options"
              name="after"
              label="Your content"
              :disabled="true"
            />
            <ui-input
              v-model="updated"
              name="updated"
              label="Your updated content"
              :type="conflicts.type"
              :options="conflicts.options"
              :autofocus="true"
              :required="conflicts.required"
              :pattern="conflicts.pattern"
              :no-spaces="conflicts.noSpaces"
            />
          </div>
        </template>
        <ui-button style-type="primary" type="submit" style="margin-top: 1rem">
          Resolve
        </ui-button>
        <p style="font-size: .8em; font-weight: 700; margin-top: .5rem">
          Please note, once you click resolve, all previous data will be lost
        </p>
      </form>
    </div>
  </ui-modal>
</template>

<script>
import { mapState } from 'vuex'
import Editor from '../editor/Editor'

export default {
  components: {
    Editor
  },
  data () {
    return {
      before: '',
      after: '',
      updated: ''
    }
  },
  computed: {
    ...mapState([
      'conflicts'
    ])
  },
  watch: {
    conflicts: {
      handler () {
        if (this.conflicts.reveal === true && this.conflicts.resolvePromise === null) {
          this.before = this.conflicts.before
          this.after = this.conflicts.after
          this.updated = this.conflicts.after
          let resolvePromise
          this.$parent.$parent.$parent.dragging = true
          // eslint-disable-next-line
          const promise = new Promise((resolve) => { resolvePromise = resolve })
          this.$store.commit('conflicts', { resolvePromise, promise, reveal: true })
        }
      },
      deep: true
    }
  },
  methods: {
    submit () {
      this.$store.commit('conflicts', { updated: this.updated })
      this.conflicts.resolvePromise(this.updated)
      this.$store.commit('conflicts', {
        promise: null,
        resolvePromise: null,
        title: '',
        before: '',
        after: '',
        updated: '',
        type: 'text',
        reveal: false
      })
      this.before = ''
      this.after = ''
      this.updated = ''
      this.$parent.$forceUpdate()
    },
    editorUpdateShim (value) {
      this.updated = value.getHTML()
    }
  }
}
</script>
