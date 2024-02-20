<style scoped lang="scss">
  .list-container {
    display: inline-block;
    width: auto
  }
</style>
<template>
  <div v-if="userInfo.groups.includes('admin')" class="contact container">
    <template v-for="contact in contactsForClient">
      <button :key="contact.f_name" type="button" class="list-container" @click="$store.dispatch('client/contact/showContact', contact)">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-address-card']" />
        <span v-text="contact.f_name" />
      </button>
    </template>
    <button type="button" class="list-container" @click="$store.dispatch('client/contact/add', { client_id: client.id })">
      <FontAwesomeIcon :icon="['fa-solid', 'fa-plus']" />
      <span>New Contact</span>
    </button>
  </div>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  props: {
    client: {
      type: Object,
      required: true
    }
  },
  computed: {
    ...mapState([
      'userInfo'
    ]),
    ...mapGetters(
      'client/contact',
      [
        'getContactsForClientById'
      ]
    ),
    contactsForClient () {
      return this.client ? this.getContactsForClientById(this.client.id) : null
    }
  }
}
</script>
