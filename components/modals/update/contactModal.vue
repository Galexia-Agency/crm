<template>
  <form class="query-form card" @submit.prevent="submit">
    <div class="card-content">
      <ui-input
        v-model="title"
        name="gender"
        label="Gender"
        type="select"
        :autofocus="true"
      >
        <option value="Male">
          Male
        </option>
        <option value="Female">
          Female
        </option>
        <option value="Other">
          Other
        </option>
      </ui-input>
      <ui-input
        v-model="f_name"
        name="f_name"
        label="First Name *"
        type="text"
        :required="true"
      />
      <ui-input
        v-model="l_name"
        name="l_name"
        label="Last Name *"
        type="text"
        :required="true"
      />
      <ui-input
        v-model="tel"
        name="tel"
        label="Telephone"
        type="text"
        pattern="[^\s]+"
        @input="noSpaces()"
      />
      <ui-input
        v-model="email"
        name="email"
        label="Email *"
        type="text"
        :required="true"
        pattern="[^\s]+"
        @input="noSpaces()"
      />
      <ui-input
        v-model="role"
        name="role"
        label="Role"
        type="text"
      />
      <ui-input
        v-model="facebook"
        name="fb"
        label="Facebook Profile Link"
        type="url"
      />
      <div class="field is-grouped">
        <ui-button type="submit" style-type="primary" :disabled="f_name === null || email === null">
          {{ id ? 'Update' : 'Add' }}
        </ui-button>
        <ui-button style-type="text" @click="cancel">
          Cancel
        </ui-button>
      </div>
    </div>
  </form>
</template>

<script>
function data () {
  return {
    client_id: null,
    title: null,
    email: null,
    f_name: null,
    facebook: null,
    id: null,
    l_name: null,
    role: null,
    tel: null,
    created_at: null,
    updated_at: null,
    google_contact_id: null,
    org: null
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
      Object.assign(this, data)
    },
    submit () {
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
    },
    noSpaces () {
      if (this.$data.tel) {
        this.$data.tel = this.$data.tel.replaceAll(' ', '')
      }
      if (this.$data.email) {
        this.$data.email = this.$data.email.replaceAll(' ', '')
      }
    }
  }
}
</script>
