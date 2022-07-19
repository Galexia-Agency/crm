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
        <div class="before-after">
          <ui-input v-model="before" :type="conflicts.type" name="before" label="Content from the database" :disabled="true" />
          <ui-input v-model="after" :type="conflicts.type" name="after" label="Your content" :disabled="true" />
        </div>
        <ui-input v-model="updated" name="updated" label="Your updated content" :type="conflicts.type" :autofocus="true" />
        <ui-button style-type="primary" type="submit">
          Resolve
        </ui-button>
        <p style="font-size: .8em; font-weight: 700">
          Please note, once you click confirm, all previous data will be lost
        </p>
      </form>
    </div>
  </ui-modal>
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
  watch: {
    conflicts: {
      handler () {
        if (this.conflicts.reveal === true && this.conflicts.resolvePromise === null) {
          this.before = this.conflicts.before
          this.after = this.conflicts.after
          this.updated = this.conflicts.before + '\n' + this.conflicts.after
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
        before: '',
        after: '',
        updated: '',
        type: 'text',
        reveal: false
      })
    }
  }
}
</script>
