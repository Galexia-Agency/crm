<style scoped lang="scss">
  .before-after {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1rem
  }
  p {
    margin-bottom: 1rem
  }
</style>
<template>
  <UiModal
    :active="reveal"
    :cancellable="false"
  >
    <form v-if="reveal" class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <h2>
          Please resolve the conflicts to continue
        </h2>
        <p>
          It seems like some of this data has been updated by someone else whilst you've been editing it.
        </p>
        <p style="font-weight: bold">
          Data that has changed: {{ property.label }}
        </p>
        <template v-if="property.type === 'editor'">
          <div class="before-after">
            <UiEditor
              :value="ourPropertyValue"
              label="Content from the database"
              :disabled="true"
            />
            <UiEditor
              :value="theirPropertyValue"
              label="Your content"
              :disabled="true"
            />
          </div>
          <UiEditor
            v-model="updatedValue"
            label="Your updated content"
            @editor-update-shim="editorUpdateShim"
          />
        </template>
        <template v-else>
          <div class="before-after">
            <UiInput
              :value="ourPropertyValue"
              name="before"
              :input-type="property.inputType"
              :type="property.type"
              :options="property.inputType === 'select' ? property.options : null"
              label="Content from the database"
              :disabled="true"
            />
            <UiInput
              :value="theirPropertyValue"
              name="after"
              :input-type="property.inputType"
              :type="property.type"
              :options="property.inputType === 'select' ? property.options : null"
              label="Your content"
              :disabled="true"
            />
            <UiInput
              v-model="updatedValue"
              name="updated"
              :input-type="property.inputType"
              :type="property.type"
              :options="property.inputType === 'select' ? property.options : null"
              label="Your updated content"
              :autofocus="true"
              :pattern="property.pattern"
              :no-spaces="property.noSpaces"
              :required="property.required"
              @error="e => { isFormValid = !e }"
            />
          </div>
        </template>
        <UiButton style-type="primary" type="submit" style="margin-top: 1rem">
          Resolve
        </UiButton>
        <p style="margin-top: .5rem; font-weight: 700;font-size: .8em">
          Please note, once you click resolve, all previous data will be lost
        </p>
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
      updatedValue: ''
    }
  },
  computed: {
    ...mapState('conflicts', [
      'resolvePromise',
      'property',
      'ourPropertyValue',
      'theirPropertyValue',
      'reveal'
    ])
  },
  watch: {
    theirPropertyValue (value) {
      this.updatedValue = value
    }
  },
  methods: {
    submit () {
      if (!this.isFormValid) {
        return
      }
      this.resolvePromise(this.updatedValue)
      this.$store.commit('conflicts/update', {
        promise: null,
        resolvePromise: null,
        property: null,
        ourPropertyValue: null,
        theirPropertyValue: null,
        reveal: false
      })
      this.updatedValue = ''
    },
    editorUpdateShim (value) {
      this.updatedValue = value.getHTML()
    }
  }
}
</script>
