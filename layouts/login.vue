<template>
  <nuxt />
</template>

<script>
export default {
  mounted () {
    this.$auth.loginWith('okta').then(() => this.$router.push('/'))
  }
}
</script>
