<template>
  <nuxt v-if="isClientLoaded" />
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'isClientLoaded'
    ])
  }
}
</script>
