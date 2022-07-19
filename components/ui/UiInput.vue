<style lang="scss">
  .help-text {
    font-size: .8em;
    display: block;
    font-weight: 400
  }
  .label {
    .textarea,
    .input {
      margin-top: .5em
    }
  }
  .select-wrapper {
    position: relative;
    &:after {
      content: '';
      border-bottom: 1px solid black;
      border-right: 1px solid black;
      width: 10px;
      height: 10px;
      position: absolute;
      right: 10px;
      top: calc(50% - 2.5px);
      transform: rotate(45deg)
    }
  }
</style>

<template>
  <div class="field">
    <label v-if="label" class="label">{{ label }}<span v-if="help" class="help-text">({{ help }})</span>
      <div class="control">
        <textarea
          v-if="type === 'textarea'"
          v-model.trim="input"
          :name="name"
          class="textarea"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
        />
        <div v-if="type === 'select'" class="select-wrapper">
          <select
            v-model="input"
            :name="name"
            class="input"
            v-bind="$attrs"
            :disabled="disabled"
            :required="required"
          >
            <slot />
          </select>
        </div>
        <input
          v-else
          v-model.trim="input"
          :type="type"
          :name="name"
          class="input"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          @keydown.enter="onEnter"
        >
        <button
          v-if="type === 'date'"
          type="button"
          class="button is-primary"
          :disabled="disabled"
          style="margin-top: .5em"
          @click="resetDate"
        >
          X
        </button>
      </div>
    </label>
  </div>
</template>

<script>
import field from '../mixins/field'
/**
 * @emits {KeyboardEvent} enter
 */
export default {
  extends: field,
  props: {
    type: {
      type: [String, Number],
      default: 'text'
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    help: {
      type: String,
      default: null
    }
  },
  mounted () {
    if (this.autofocus) {
      this.$el.querySelector('input, textarea, select').focus()
    }
  },
  methods: {
    onEnter ($event) {
      this.$emit('enter', $event)
    },
    resetDate ($event) {
      this.$emit('resetDate', $event)
    }
  }
}
</script>
