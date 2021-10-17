<template>
  <div class="control">
    <button
      type="button"
      :class="`button is-${type}`"
      v-bind="$attrs"
      :disabled="disabled"
      :autofocus="autofocus"
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
    disabled: {
      type: Boolean,
      default: false
    },
    autofocus: {
      type: Boolean,
      default: false
    }
  }
}
</script>
