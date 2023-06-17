<template>
  <div>
    <LayoutLoading />
    <nuxt v-if="isClientLoaded" />
  </div>
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
