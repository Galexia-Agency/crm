<template>
  <UiModal
    :active="reveal"
    @close="cancel"
  >
    <form v-if="reveal" class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <template v-for="(input, index) in model">
          <UiInput
            v-if="!input.hidden"
            :key="index"
            v-model="input.value"
            :name="index"
            :label="input.label"
            :input-type="input.inputType"
            :type="input.type"
            :options="input.inputType === 'select' ? input.options : null"
            :autofocus="index === firstVisibleIndex"
            :required="input.required"
            :pattern="input.pattern"
            :no-spaces="input.noSpaces"
            @error="(e) => handleError(e, index)"
          />
        </template>
        <div class="field is-grouped">
          <UiButton style-type="primary" type="submit" :disabled="!isFormValid">
            {{ model.id.value ? 'Update' : 'Add' }}
          </UiButton>
          <UiButton style-type="text" @click="cancel">
            Cancel
          </UiButton>
        </div>
      </div>
    </form>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
      isFormValid: false,
      errors: {}
    }
  },
  computed: {
    ...mapState('createModel', [
      'resolvePromise',
      'model',
      'reveal'
    ]),
    firstVisibleIndex () {
      return Object.keys(this.model).filter((input) => !this.model[input].hidden)[0]
    }
  },
  methods: {
    handleError (error, title) {
      if (error) {
        this.errors[title] = true
      } else if (this.errors[title]) {
        delete this.errors[title]
      }
      // Check if there are any errors stored, not just for the input that is emmiting the event
      if (this.errors && Object.keys(this.errors).length === 0) {
        this.isFormValid = true
      } else {
        this.isFormValid = false
      }
    },
    submit () {
      if (!this.isFormValid) {
        return
      }
      this.resolvePromise(this.model)
      this.$store.commit('createModel/update', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    },
    cancel () {
      this.resolvePromise(false)
      this.$store.commit('createModel/update', {
        promise: null,
        resolvePromise: null,
        text: '',
        reveal: false
      })
    }
  }
}
</script>
