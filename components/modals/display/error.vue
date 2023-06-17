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
    :active="error.active"
    @close="$store.commit('error', { active: false })"
  >
    <div class="error">
      <h1>Uh oh! An error has occured</h1>
      <h2>{{ error.description }}</h2>
      <template v-if="error.data">
        <p>Please copy the below information so as to not lose your changes</p>
        <!-- deepcode ignore PureFunctionReturnValueIgnored: The return value is passed through as value -->
        <textarea :value="JSON.stringify(error.data)" rows="10" />
      </template>
    </div>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'error'
    ])
  }
}
</script>
