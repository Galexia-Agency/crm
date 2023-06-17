<style scoped>
  p {
    margin-bottom: 1em
  }
  .control {
    display: inline
  }
</style>

<template>
  <UiModal :active="confirm.reveal" :cancellable="false">
    <div class="query-form card">
      <form class="card-content" @submit.prevent="submit">
        <p v-text="confirm.text" />
        <UiButton :autofocus="true" style-type="primary" type="submit">
          Yes
        </UiButton>
        <UiButton style-type="text" @click="cancel">
          No
        </UiButton>
      </form>
    </div>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'confirm'
    ])
  },
  watch: {
    'confirm.reveal': {
      handler (value) {
        if (value) {
          return window.addEventListener('keydown', this.onKeyDown)
        }
        return window.removeEventListener('keydown', this.onKeyDown)
      },
      immediate: true
    }
  },
  methods: {
    submit () {
      this.confirm.resolvePromise(true)
      this.$store.commit('confirm', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    },
    cancel () {
      this.confirm.resolvePromise(false)
      this.$store.commit('confirm', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    },
    onKeyDown (event) {
      if (event.key === 'Escape') {
        this.cancel()
      }
    }
  }
}
</script>
