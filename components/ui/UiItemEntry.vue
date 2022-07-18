
<style lang="scss">
  .ui-item-entry {
    margin: 5px
  }
</style>

<template>
  <div class="ui-item-entry field has-addons">
    <div class="control is-expanded">
      <input
        v-model.trim="input"
        class="input"
        enterkeyhint="enter"
        :placeholder="placeholder"
        @keydown.enter="onEnter"
        @input="update"
        @paste="pasteMultiple"
      >
    </div>
    <div v-if="icon" class="control">
      <button type="submit" class="button is-primary" :disabled="input.length === 0" @click="onClick">
        <span class="icon is-small">
          <font-awesome-icon :icon="['fa-solid', `fa-${icon}`]" />
        </span>
      </button>
    </div>
  </div>
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
    onEnter ($event) {
      this.emit($event.metaKey || $event.ctrlKey)
    },
    onClick () {
      this.emit(true)
    },
    emit (more) {
      if (this.input) {
        this.$emit('enter', {
          id: this.listId,
          text: this.input,
          more
        })
        this.input = ''
      }
    },
    update ($event) {
      this.input = $event.target.value
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
    }
  }
}
</script>
