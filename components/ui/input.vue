<style lang="scss" scoped>
.help-text {
  display: block;
  font-weight: 400;
  font-size: .8em
}
input {
  accent-color: var(--primaryColor)
}
.label {
  .textarea,
  .input {
    margin-top: .5em
  }
  &:has(input[type='checkbox']) {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: .5rem;
    align-items: center;
    .control {
      grid-row: 1;
      grid-column: 1
    }
  }
}
textarea {
  min-height: 8em;
  resize: horizontal
}
.select-wrapper {
  position: relative;
  &:after {
    position: absolute;
    top: calc(50% - 2.5px);
    right: 10px;
    width: 10px;
    height: 10px;
    border-right: 1px solid black;
    border-bottom: 1px solid black;
    transform: rotate(45deg);
    content: ''
  }
}
.control.withPrefix {
  position: relative;
  &:before {
    position: absolute;
    top: .5em;
    left: 0;
    z-index: 1;
    display: inline-flex;
    width: 2rem;
    height: calc(100% - .5em);
    color: #363636;
    line-height: 1;
    text-align: center;
    content: var(--prefix);
    place-content: center;
    place-items: center
  }
  input {
    padding-left: 2rem
  }
}
.field.error {
  .select select, .textarea, .input {
    border-color: red
  }
}
.input-error {
  color: red;
  font-size: .8rem
}
</style>

<template>
  <div class="field" :class="{error}">
    <label v-if="label" class="label">{{ `${label}${required ? '*' : ''}` }}<span v-if="help" class="help-text">({{ help }})</span>
      <div v-if="error" class="input-error" v-text="error" />
      <div class="control" :class="{ withPrefix: prefix }" :style="prefix ? `--prefix: '${prefix}'`: ''">
        <textarea
          v-if="inputType === 'textarea'"
          v-model.trim="input"
          :name="name"
          class="textarea"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
        />
        <div v-else-if="inputType === 'select'" class="select-wrapper">
          <select
            v-model="input"
            :name="name"
            class="input"
            v-bind="$attrs"
            :disabled="disabled"
            :required="required"
          >
            <template v-if="options.length > 0">
              <template v-for="option in options">
                <option :key="option" :value="option" v-text="option" />
              </template>
            </template>
            <slot />
          </select>
        </div>
        <input
          v-else-if="inputType === 'checkbox'"
          v-model="input"
          type="checkbox"
          :name="name"
          :disabled="disabled"
        >
        <input
          v-else-if="inputType === 'number'"
          v-model.trim="input"
          type="number"
          :name="name"
          class="input"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          :pattern="noSpaces ? '[^s]+' : null"
          @keydown.enter="onEnter"
          @keyup="noSpacesFunction()"
        >
        <input
          v-else-if="inputType === 'currency'"
          v-model.trim="input"
          type="number"
          step="0.01"
          :name="name"
          class="input"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          :pattern="noSpaces ? '[^s]+' : null"
          @keydown.enter="onEnter"
          @keyup="noSpacesFunction()"
        >
        <input
          v-else
          v-model.trim="input"
          :type="inputType"
          :name="name"
          class="input"
          v-bind="$attrs"
          :disabled="disabled"
          :required="required"
          :pattern="noSpaces ? '[^s]+' : null"
          @keydown.enter="onEnter"
          @keyup="noSpacesFunction()"
        >
        <button
          v-if="inputType === 'date'"
          type="button"
          class="button is-primary"
          :disabled="disabled"
          style="margin-top: .5em"
          @click="input = ''"
        >
          X
        </button>
      </div>
    </label>
  </div>
</template>

<script>
export default {
  props: {
    name: {
      type: String,
      required: true
    },
    value: {
      type: [String, Number, Boolean],
      required: true
    },
    label: {
      type: String,
      required: true
    },
    inputType: {
      type: String,
      default: 'text'
    },
    type: {
      type: String,
      required: true
    },
    options: {
      type: [Array],
      default () {
        return []
      }
    },
    autofocus: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    noSpaces: {
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
  computed: {
    input: {
      get () {
        let updatedValue = this.value
        if (this.type === 'float') {
          updatedValue = parseFloat(updatedValue).toFixed(2)
        } else if (this.type === 'integer') {
          updatedValue = parseFloat(updatedValue)
        }
        return updatedValue
      },
      set (value) {
        let updatedValue = value
        if (this.type === 'float') {
          updatedValue = parseFloat(updatedValue).toFixed(2)
        } else if (this.type === 'integer') {
          updatedValue = parseFloat(updatedValue)
        }
        this.$emit('input', updatedValue)
      }
    },
    prefix () {
      if (this.inputType === 'currency') {
        return '£'
      }
      return null
    },
    error () {
      if (this.required) {
        if (this.value) {
          if (this.type === 'integer' || this.type === 'float' || this.type === 'number') {
            if (!parseFloat(this.value)) {
              return 'Please make sure to enter a number'
            }
          // eslint-disable-next-line valid-typeof
          } else if (typeof this.value !== this.type) {
            return `Please make sure to enter a ${this.type}`
          }
        } else {
          return 'Please make sure to provide a value for the required field'
        }
      }
      return false
    }
  },
  watch: {
    error (value) {
      this.$emit('error', !!value)
    }
  },
  mounted () {
    this.$emit('error', !!this.error)
    if (this.autofocus) {
      this.$el.querySelector('input, textarea, select').focus()
    }
  },
  methods: {
    onEnter ($event) {
      this.noSpacesFunction()
      this.$emit('enter', $event)
    },
    noSpacesFunction () {
      if (this.noSpaces) {
        if (this.input) {
          this.input = this.input.replaceAll(' ', '')
        }
      }
    }
  }
}
</script>
