<style scoped>
  .error {
    display: grid;
    gap: 1rem;
    padding: 30px;
    background-color: white;
    place-content: center
  }
</style>

<template>
  <UiModal
    :active="reveal"
    @close="cancel"
  >
    <div class="error">
      <h1>Uh oh! An error has occured</h1>
      <h2>{{ message }}</h2>
      <div class="field is-grouped">
        <UiButton style-type="primary" @click="cancel">
          Okay
        </UiButton>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState('error',
      [
        'resolvePromise',
        'message',
        'reveal'
      ])
  },
  methods: {
    cancel () {
      this.resolvePromise()
      this.$store.commit('error/update', {
        promise: null,
        resolvePromise: null,
        message: '',
        reveal: false
      })
    }
  }
}
</script>
