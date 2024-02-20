<style scoped lang="scss">
  svg {
    color: var(--primaryColor)
  }
  .fa-address-card {
    margin-bottom: 1rem;
    font-size: 3rem
  }
  .edit {
    float: right;
    svg {
      font-size: 1.25rem
    }
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
  <UiModal
    :active="displayContact.reveal"
    @close="cancel"
  >
    <div v-if="displayContact.reveal" class="card">
      <div class="card-content">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-address-card']" />
        <button type="button" class="edit" @click="$store.dispatch('client/contact/update', displayContact.contact)">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
        </button>
        <h2 v-if="displayContact.contact.title && displayContact.contact.f_name && displayContact.contact.l_name" v-text="`${displayContact.contact.f_name} ${displayContact.contact.l_name} (${displayContact.contact.title})`" />
        <h2 v-else-if="displayContact.contact.f_name && displayContact.contact.l_name" v-text="`${displayContact.contact.f_name} ${displayContact.contact.l_name}`" />
        <h2 v-else v-text="`${displayContact.contact.f_name}`" />
        <h3 v-if="displayContact.contact.role" v-text="displayContact.contact.role" />
        <template v-if="displayContact.contact.email">
          <template v-for="email in displayContact.contact.email.split(',')">
            <a :key="email" target="_blank" :href="`mailto:${email.toLowerCase()}`">
              <FontAwesomeIcon :icon="['fa-solid', 'fa-envelope']" />
              {{ email.toLowerCase() }}
            </a>
          </template>
        </template>
        <template v-if="displayContact.contact.tel">
          <template v-for="tel in displayContact.contact.tel.split(',')">
            <a :key="tel" target="_blank" :href="`tel:${tel}`">
              <FontAwesomeIcon :icon="['fa-solid', 'fa-phone']" />
              {{ tel }}
            </a>
          </template>
        </template>
        <template v-if="displayContact.contact.facebook">
          <a target="_blank" :href="displayContact.contact.facebook">
            <FontAwesomeIcon :icon="['fa-brands', 'fa-facebook-f']" />
            {{ displayContact.contact.facebook }}
          </a>
        </template>
      </div>
    </div>
  </UiModal>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState(
      'client/contact',
      [
        'displayContact'
      ]
    )
  },
  methods: {
    cancel () {
      this.$store.dispatch('client/contact/hideContact')
    }
  }
}
</script>
