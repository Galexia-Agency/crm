<style lang="scss" scoped>
.input_pop_up {
  padding: 0 1em;
  input {
    margin: .8rem 1rem .6rem 0
  }
  .input:not(#img_uploader) {
    width: calc(100% - 105px)
  }
  .button {
    display: inline;
    margin: .8rem 0 .6rem
  }
}
</style>

<template>
  <form
    v-if="reveal"
    class="input_pop_up"
    @submit.prevent="resolvePromise(urlLink), reveal = false"
  >
    <input
      v-if="inputType === 'link'"
      v-model="urlLink"
      type="text"
      placeholder="Link URL"
      aria-label="Link URL"
      required
      class="input"
    >
    <input
      v-else-if="inputType === 'image'"
      id="img_uploader"
      type="file"
      accept="image/*"
      class="input"
      @change="$parent.addImg(), reveal = false"
    >
    <button v-if="inputType !== 'image'" type="submit" class="button is-primary">
      Submit
    </button>
  </form>
</template>

<script>
export default {
  data () {
    return {
      reveal: false,
      resolvePromise: undefined,
      urlLink: null,
      inputType: null
    }
  },
  methods: {

    // -----------------------------
    // General
    // -----------------------------

    /**
     * Shows the input alert.
     * @param {string} inputType - The mode of the alert.
     * @returns A promise to resolve the state of the alert.
     */
    show (inputType) {
      if (this.reveal === false || this.inputType !== inputType) {
        this.inputType = inputType
        this.reveal = true
        this.urlLink = null
        return new Promise((resolve) => {
          this.resolvePromise = resolve
        })
      } else {
        this.reveal = false
        this.urlLink = null
      }
    }
  }
}
</script>
