<style scoped>
  textarea {
    min-height: 8em;
    resize: horizontal
  }
</style>

<template>
  <UiModal
    :active="active"
    @close="cancel"
  >
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <UiInput
          v-model="updatedClient.business_name"
          name="business_name"
          label="Business Name *"
          type="text"
          :autofocus="true"
          :required="true"
          @input="businessShortnameCreator"
        />
        <UiInput
          v-model="updatedClient.business_shortname"
          name="business_shortname"
          label="Business Shortname *"
          type="text"
          :required="true"
        />
        <UiInput
          v-model="updatedClient.about"
          name="about"
          label="About The Business"
          type="textarea"
        />
        <UiInput
          v-model="updatedClient.billing_email"
          name="billing_email"
          label="Billing Email"
          type="email"
        />
        <UiInput
          v-model="updatedClient.address.line1"
          name="address_line_1"
          label="Address Line 1"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.line2"
          name="address_line_2"
          label="Address Line 2"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.line3"
          name="address_line_3"
          label="Address Line 3"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.town"
          name="town_city"
          label="Town / City"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.county"
          name="county"
          label="County"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.postcode"
          name="postcode"
          label="Postcode"
          type="text"
        />
        <UiInput
          v-model="updatedClient.address.country"
          name="country"
          label="Country"
          type="text"
        />
        <UiInput
          v-model="updatedClient.source"
          name="source"
          label="Source"
          type="text"
        />
        <div class="field is-grouped">
          <UiButton type="submit" style-type="primary" :disabled="updatedClient.business_name === null || updatedClient.business_shortname === null">
            {{ updatedClient.id ? 'Update' : 'Add' }}
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
const clientDefault = {
  business_name: null,
  business_shortname: null,
  about: null,
  address: {
    line1: '',
    line2: '',
    line3: '',
    county: '',
    country: 'United Kingdom',
    postcode: '',
    town: ''
  },
  source: null,
  id: null,
  pandle_id: null,
  billing_email: null,
  updated_at: null,
  created_at: null,
  projects: []
}

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    client: {
      type: Object,
      default () {
        return clientDefault
      }
    }
  },
  data () {
    return {
      updatedClient: { ...clientDefault, ...this.client }
    }
  },
  methods: {
    businessShortnameCreator ($event) {
      const currentBusinessShortName = this.updatedClient.business_shortname ? this.safeURL(this.updatedClient.business_shortname) : ''
      const newBusinessShortName = $event ? this.safeURL($event) : ''
      if (
        currentBusinessShortName.slice(0, -1) === newBusinessShortName ||
        currentBusinessShortName === newBusinessShortName.slice(0, -1) ||
        currentBusinessShortName.slice(0, -2) === newBusinessShortName ||
        currentBusinessShortName === newBusinessShortName.slice(0, -2)
      ) {
        this.updatedClient.business_shortname = newBusinessShortName
      }
    },
    submit () {
      if (this.updatedClient.billing_email) {
        this.updatedClient.billing_email = this.updatedClient.billing_email.toLowerCase()
      }
      this.$emit('submit', this.updatedClient)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
