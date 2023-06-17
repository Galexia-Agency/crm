<template>
  <div class="control">
    <button
      :type="type"
      :class="`button is-${styleType}`"
      v-bind="$attrs"
      :disabled="disabled"
      @click="$emit('click')"
    >
      <slot />
    </button>
  </div>
</template>

<script>
export default {
  props: {
    type: {
      type: String,
      default: 'button'
    },
    styleType: {
      type: String,
      default: 'button'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  },
  mounted () {
    if (this.autofocus) {
      this.$el.querySelector('button').focus()
    }
  }
}
</script>
