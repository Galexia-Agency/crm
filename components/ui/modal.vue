<style scoped>
  .modal {
    display: flex
  }
  .modal-enter-active,
  .modal-leave-active {
    transition: opacity .33s ease-in-out
  }
  .modal-enter,
  .modal-leave-to {
    opacity: 0
  }
</style>

<template>
  <transition name="modal">
    <div v-if="active" class="modal">
      <div class="modal-background" @mousedown="cancel" />
      <div class="modal-content">
        <slot />
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  props: {
    active: Boolean,
    cancellable: {
      type: [Number, Boolean],
      default: true
    }
  },
  // Keep drag scroll value in sync with whether the modal is open or not
  watch: {
    active: {
      handler (value) {
        this.$store.commit('updateDragScroll', !value)
      },
      immediate: true
    }
  },
  mounted () {
    window.addEventListener('keydown', this.onKeyDown)
  },
  destroyed () {
    window.removeEventListener('keydown', this.onKeyDown)
  },
  methods: {
    cancel () {
      if (this.cancellable) {
        this.close()
      }
    },
    close () {
      this.$emit('close')
    },
    onKeyDown (event) {
      if (event.key === 'Escape') {
        this.cancel()
      }
    }
  }
}

</script>
