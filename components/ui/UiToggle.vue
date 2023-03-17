<style scoped lang="scss">
  /* Toggle */
  .list-container.switch {
    position: relative;
    width: 92px;
    height: 46px;
    cursor: pointer;
    input {
      width: 0;
      height: 0;
      opacity: 0
    }
  }
  .slider {
    position: absolute;
    top: 10px;
    bottom: 10px;
    left: calc(10px + 1.66em);
    min-width: 40px;
    background-color: #CCCCCC;
    transition: .4s;
    &:before {
      position: absolute;
      bottom: 2px;
      left: 4px;
      width: 20px;
      height: 20px;
      background-color: white;
      transition: .4s;
      content: ''
    }
    &.round {
      border-radius: 34px;
      &:before {
        border-radius: 50%
      }
    }
  }
  input {
    &:checked + .slider {
      background-color: var(--primaryColor)
    }
    &:focus + .slider {
      box-shadow: 0 0 1px var(--primaryColor)
    }
    &:checked + .slider:before {
      transform: translateX(12px)
    }
  }
</style>

<template>
  <label class="switch">
    <input v-model="inputVal" type="checkbox" :aria-label="label">
    <span class="slider round" />
    <slot />
  </label>
</template>

<script>
export default {
  props: {
    model: {
      type: Boolean
    },
    label: {
      type: String,
      default: 'Toggle'
    }
  },
  computed: {
    inputVal: {
      get () {
        return this.model
      },
      set (val) {
        this.$emit('input', val)
      }
    }
  }
}
</script>
