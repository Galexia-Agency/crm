<template>
  <div class="query-form card">
    <div class="card-content">
      <div class="field">
        <label for="gender" class="label">
          Gender
        </label>
        <select
          v-model="title"
          name="gender"
          class="input"
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
        </select>
      </div>
      <div class="field">
        <label for="f_name" class="label">
          First Name *
        </label>
        <input
          v-model="f_name"
          name="f_name"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="l_name" class="label">
          Last Name
        </label>
        <input
          v-model="l_name"
          name="l_name"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="tel" class="label">
          Telephone
        </label>
        <input
          v-model="tel"
          name="tel"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="email" class="label">
          Email *
        </label>
        <input
          v-model="email"
          name="email"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="role" class="label">
          Role
        </label>
        <input
          v-model="role"
          name="role"
          class="input"
          type="text"
        >
      </div>
      <div class="field">
        <label for="fb" class="label">
          Facebook Profile Link
        </label>
        <input
          v-model="facebook"
          name="fb"
          class="input"
          type="text"
        >
      </div>
      <div class="field is-grouped">
        <ui-button v-if="id" type="primary" :disabled="f_name === null || email === null" @click="submit">
          Update
        </ui-button>
        <ui-button v-else type="primary" :disabled="f_name === null || email === null" @click="submit">
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
      this.$el.querySelector('input').focus()
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
    }
  }
}
</script>
