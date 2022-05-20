<style scoped>
  textarea {
    resize: horizontal;
    min-height: 8em
  }
</style>

<template>
  <div class="query-form card">
    <div class="card-content">
      <ui-input
        v-model="business_name"
        v-validate="'required'"
        :error="getError('business_name')"
        name="business_name"
        label="Business Name *"
        type="text"
        autofocus
        @enter="validate"
      />
      <ui-input
        v-model="business_shortname"
        v-validate="'required'"
        :error="getError('business_shortname')"
        name="business_shortname"
        label="Business Shortname *"
        type="text"
        @enter="validate"
      />
      <div class="field">
        <label for="about" class="label">
          About The Business
        </label>
        <textarea
          v-model="about"
          name="about"
          class="input"
          type="text"
        />
      </div>
      <div class="field">
        <label for="billing_email" class="label">
          Billing Email
        </label>
        <input
          v-model="billing_email"
          name="billing_email"
          class="input"
          type="email"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Address Line 1
        </label>
        <input
          v-model="address.line1"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Address Line 2
        </label>
        <input
          v-model="address.line2"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Address Line 3
        </label>
        <input
          v-model="address.line3"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Town / City
        </label>
        <input
          v-model="address.town"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          County
        </label>
        <input
          v-model="address.county"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Postcode
        </label>
        <input
          v-model="address.postcode"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="address" class="label">
          Country
        </label>
        <input
          v-model="address.country"
          name="address"
          class="input"
        >
      </div>
      <div class="field">
        <label for="source" class="label">
          Source
        </label>
        <input
          v-model="source"
          name="source"
          class="input"
          type="text"
        >
      </div>
      <div class="field is-grouped">
        <ui-button v-if="id" type="primary" :disabled="business_name === null || business_shortname === null" @click="submit">
          Update
        </ui-button>
        <ui-button v-else type="primary" :disabled="business_name === null || business_shortname === null" @click="submit">
          Add
        </ui-button>
        <ui-button type="text" @click="cancel">
          Cancel
        </ui-button>
      </div>
    </div>
  </div>
</template>

<script>
function data () {
  return {
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
    billing_email: null
  }
}
export default {
  data () {
    return data()
  },
  computed: {
    values () {
      return this.$data
    }
  },
  methods: {
    show (data) {
      this.reset()
      if (data) {
        Object.assign(this, data)
        try {
          if (data.address !== null || data.address !== '') {
            if (data.address.includes('\\')) {
              this.address = JSON.parse(JSON.parse(data.address))
            } else {
              this.address = JSON.parse(data.address)
            }
          } else {
            this.address = {
              line1: '',
              line2: '',
              line3: '',
              county: '',
              country: 'United Kingdom',
              postcode: '',
              town: ''
            }
          }
        } catch (e) {
          if (data.address !== null || data.address !== '') {
            this.address = {
              line1: data.address,
              line2: '',
              line3: '',
              county: '',
              country: 'United Kingdom',
              postcode: '',
              town: ''
            }
          } else {
            this.address = {
              line1: '',
              line2: '',
              line3: '',
              county: '',
              country: 'United Kingdom',
              postcode: '',
              town: ''
            }
          }
        }
      }
      this.$el.querySelector('input').focus()
    },
    submit () {
      if (this.billing_email) {
        this.billing_email = this.billing_email.toLowerCase()
      }
      if (this.id) {
        this.$emit('submit', this.values)
      } else {
        this.$emit('add', this.values)
      }
    },
    cancel () {
      this.$emit('cancel', this.values)
    },
    reset () {
      Object.assign(this, data())
    }
  }
}
</script>
