<style scoped>
  i {
    color: var(--primaryColor)
  }
  .fa-address-card {
    font-size: 3rem;
    margin-bottom: 1rem
  }
  .edit {
    float: right
  }
  .fa-edit {
    font-size: 1rem
  }
  a {
    display: block;
    padding: .25rem
  }
  h3 {
    margin-bottom: .5em
  }
</style>
<template>
  <div class="card">
    <div class="card-content">
      <i class="fas fa-address-card" />
      <button class="edit" @click="edit">
        <i class="far fa-edit" />
      </button>
      <h2 v-if="contact.title && contact.f_name && contact.l_name" v-text="`${contact.f_name} ${contact.l_name} (${contact.title})`" />
      <h2 v-else-if="contact.f_name && contact.l_name" v-text="`${contact.f_name} ${contact.l_name}`" />
      <h2 v-else v-text="`${contact.f_name}`" />
      <h3 v-if="contact.role" v-text="contact.role" />
      <template v-if="contact.email">
        <template v-for="email in contact.email.split(',')">
          <a :key="email" target="_blank" :href="`mailto:${email.toLowerCase()}`">
            <i class="fas fa-envelope" />
            {{ email.toLowerCase() }}
          </a>
        </template>
      </template>
      <template v-if="contact.tel">
        <template v-for="tel in contact.tel.split(',')">
          <a :key="tel" target="_blank" :href="`tel:${tel}`">
            <i class="fas fa-phone" />
            {{ tel }}
          </a>
        </template>
      </template>
      <template v-if="contact.facebook">
        <a target="_blank" :href="contact.facebook">
          <i class="fab fa-facebook-f" />
          {{ contact.facebook }}
        </a>
      </template>
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
    contact () {
      return this.$data
    }
  },
  methods: {
    show (data) {
      Object.assign(this, data)
    },
    cancel () {
      this.$emit('cancel', this.values)
      this.reset()
    },
    reset () {
      Object.assign(this, data())
    },
    edit () {
      this.$emit('edit', this.contact)
    }
  }
}
</script>
