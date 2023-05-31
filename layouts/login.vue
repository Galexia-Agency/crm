<template>
  <div>
    <Loading />
    <nuxt v-if="isClientLoaded" />
  </div>
</template>

<script>
import { mapState } from 'vuex'
import Loading from '~/components/global/loading'

export default {
  components: {
    Loading
  },
  computed: {
    ...mapState([
      'isClientLoaded'
    ])
  }
}
</script>
