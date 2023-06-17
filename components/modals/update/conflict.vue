<style scoped>
  .before-after {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem
  }
  p {
    margin-bottom: 1rem
  }
</style>
<template>
  <UiModal :active="conflicts.reveal" :cancellable="false">
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
            <UiEditor
              v-model="before"
              label="Content from the database"
              :disabled="true"
            />
            <UiEditor
              v-model="after"
              label="Your content"
              :disabled="true"
            />
          </div>
          <UiEditor
            v-model="updated"
            label="Your updated content"
            @editorUpdateShim="editorUpdateShim"
          />
        </template>
        <template v-else>
          <div class="before-after">
            <UiInput
              v-model="before"
              :type="conflicts.type"
              :options="conflicts.options"
              name="before"
              label="Content from the database"
              :disabled="true"
            />
            <UiInput
              v-model="after"
              :type="conflicts.type"
              :options="conflicts.options"
              name="after"
              label="Your content"
              :disabled="true"
            />
            <UiInput
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
        <UiButton style-type="primary" type="submit" style="margin-top: 1rem">
          Resolve
        </UiButton>
        <p style=" margin-top: .5rem; font-weight: 700;font-size: .8em">
          Please note, once you click resolve, all previous data will be lost
        </p>
      </form>
    </div>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
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
  beforeMount () {
    this.before = this.conflicts.before
    this.after = this.conflicts.after
    this.updated = this.conflicts.after
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
