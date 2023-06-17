<template>
  <UiModal
    :active="active"
    @close="cancel"
  >
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <UiInput
          v-model="updatedContact.title"
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
        </UiInput>
        <UiInput
          v-model="updatedContact.f_name"
          name="f_name"
          label="First Name *"
          type="text"
          :required="true"
        />
        <UiInput
          v-model="updatedContact.l_name"
          name="l_name"
          label="Last Name *"
          type="text"
          :required="true"
        />
        <UiInput
          v-model="updatedContact.tel"
          name="tel"
          label="Telephone"
          type="text"
          pattern="[^\s]+"
          :no-spaces="true"
        />
        <UiInput
          v-model="updatedContact.email"
          name="email"
          label="Email *"
          type="text"
          :required="true"
          pattern="[^\s]+"
          :no-spaces="true"
        />
        <UiInput
          v-model="updatedContact.role"
          name="role"
          label="Role"
          type="text"
        />
        <UiInput
          v-model="updatedContact.facebook"
          name="fb"
          label="Facebook Profile Link"
          type="url"
        />
        <div class="field is-grouped">
          <UiButton type="submit" style-type="primary" :disabled="updatedContact.f_name === null || updatedContact.email === null">
            {{ updatedContact.id ? 'Update' : 'Add' }}
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
const contactDefault = {
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
  google_contact_id: null
}

export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    contact: {
      type: Object,
      default () {
        return contactDefault
      }
    }
  },
  data () {
    return {
      updatedContact: { ...contactDefault, ...this.contact }
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.updatedContact)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
