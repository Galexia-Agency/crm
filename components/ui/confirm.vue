<style scoped>
  p {
    margin-bottom: 1em
  }
  .control {
    display: inline
  }
</style>

<template>
  <UiModal :active="reveal" :cancellable="false">
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <p v-text="text" />
        <UiButton :autofocus="true" style-type="primary" type="submit">
          Yes
        </UiButton>
        <UiButton style-type="text" @click="cancel">
          No
        </UiButton>
      </div>
    </form>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('confirm',
      [
        'resolvePromise',
        'text',
        'reveal'
      ])
  },
  methods: {
    submit () {
      this.resolvePromise(true)
      this.$store.commit('confirm/update', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    },
    cancel () {
      this.resolvePromise(false)
      this.$store.commit('confirm/update', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    }
  }
}
</script>
