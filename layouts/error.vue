<style scoped>
  .error {
    align-content: center;
    min-height: 600px;
    text-align: center
  }
  .error h1 {
    margin-top: 5rem;
    font-size: 2.25rem;
    font-size: clamp(1.75rem, 1vw + 1rem, 3rem)
  }
</style>

<template>
  <div class="error">
    <div v-if="error.statusCode === 404">
      <h1>
        404 - Page not found
      </h1>
    </div>
    <div v-else>
      <h1>
        {{ error.statusCode }} - An error occurred
      </h1>
      <p>{{ message }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'NuxtError',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  head () {
    return {
      title: this.message
    }
  },
  computed: {
    statusCode () {
      return (this.error && this.error.statusCode) || 500
    },
    message () {
      return this.error.message
    }
  }
}
</script>
