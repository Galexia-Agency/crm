<style lang="scss" scoped>
  .refresh {
    position: absolute;
    top: .5rem;
    right: 2rem;
    z-index: 9;
    width: min-content;
    font-size: 2rem;
    cursor: pointer;
    transition: transform .66s ease-in-out 0s
  }
  .refresh.clicked {
    transform: rotate(360deg)
  }
  .nav_open .refresh {
    opacity: 0;
    pointer-events: none
  }
</style>

<template>
  <button type="button" class="refresh" :class="{clicked: refreshed}" @click="refresh">
    <FontAwesomeIcon :icon="['fa-solid', 'fa-sync']" />
  </button>
</template>

<script>
export default {
  data () {
    return {
      refreshed: false
    }
  },
  methods: {
    refresh () {
      this.refreshed = true
      location.reload()
    }
  }
}
</script>
