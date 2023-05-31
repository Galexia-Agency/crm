<style lang="scss" scoped>
.progress-container {
  position: relative;
  width: 100%;
  height: 3px;
  overflow: hidden
}
.progress-bar {
  position: absolute;
  left: 50%;
  width: 0%;
  height: 100%;
  background-color: var(--primaryColor);
  transform: translateX(-50%);
  &.loading {
    animation-name: loading;
    animation-duration: 1s;
    animation-iteration-count: infinite
  }
}
@keyframes loading {
  0% {
    width: 0%
  }
  100% {
    width: 100%
  }
}
</style>

<template>
  <div class="progress-container">
    <div class="progress-bar" :class="{ loading }" />
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState([
      'loading'
    ])
  }
}
</script>
