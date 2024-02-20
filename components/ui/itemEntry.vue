<style lang="scss">
  .ui-card-entry {
    margin: 5px
  }
</style>

<template>
  <form class="ui-card-entry field has-addons" @submit.prevent="emit(false)">
    <div class="control is-expanded">
      <input
        v-model="input"
        class="input"
        :placeholder="placeholder"
        @keydown="fixAndroid"
        @paste="pasteMultiple"
      >
    </div>
    <div v-if="icon" class="control">
      <button type="button" class="button is-primary" :disabled="input.length === 0" @click.prevent="emit(true)">
        <span class="icon is-small">
          <FontAwesomeIcon :icon="['fa-solid', `fa-${icon}`]" />
        </span>
      </button>
    </div>
  </form>
</template>

<script>
/**
 * @emits {id, text, more}   enter
 */
export default {
  props: {
    listId: {
      type: [String, Number],
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    icon: {
      type: String,
      default: 'angle-right'
    }
  },
  data () {
    return {
      input: ''
    }
  },
  methods: {
    emit (more) {
      if (this.input) {
        this.$emit('enter', {
          listId: this.listId,
          text: this.input,
          more
        })
        this.input = ''
      }
    },
    pasteMultiple ($event) {
      const self = this
      if ($event.clipboardData.getData('text').includes('\n')) {
        $event.clipboardData.getData('text').split('\n').forEach((i) => {
          this.$emit('enter', {
            id: self.listId,
            text: i
          })
        })
        setTimeout(function () {
          self.input = ''
        }, 1)
      }
    },
    fixAndroid ($event) {
      if ($event.key !== 'Enter') {
        const self = this
        setTimeout(function () {
          self.input = $event.target.value
          self.$emit('input', self.input)
        }, 1)
      }
    }
  }
}
</script>
