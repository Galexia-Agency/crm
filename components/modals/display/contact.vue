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
    :active="!!display"
    @close="cancel"
  >
    <div class="card">
      <div class="card-content">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-address-card']" />
        <button type="button" class="edit" @click="submit">
          <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
        </button>
        <h2 v-if="display.title && display.f_name && display.l_name" v-text="`${display.f_name} ${display.l_name} (${display.title})`" />
        <h2 v-else-if="display.f_name && display.l_name" v-text="`${display.f_name} ${display.l_name}`" />
        <h2 v-else v-text="`${display.f_name}`" />
        <h3 v-if="display.role" v-text="display.role" />
        <template v-if="display.email">
          <template v-for="email in display.email.split(',')">
            <a :key="email" target="_blank" :href="`mailto:${email.toLowerCase()}`">
              <FontAwesomeIcon :icon="['fa-solid', 'fa-envelope']" />
              {{ email.toLowerCase() }}
            </a>
          </template>
        </template>
        <template v-if="display.tel">
          <template v-for="tel in display.tel.split(',')">
            <a :key="tel" target="_blank" :href="`tel:${tel}`">
              <FontAwesomeIcon :icon="['fa-solid', 'fa-phone']" />
              {{ tel }}
            </a>
          </template>
        </template>
        <template v-if="display.facebook">
          <a target="_blank" :href="display.facebook">
            <FontAwesomeIcon :icon="['fa-brands', 'fa-facebook-f']" />
            {{ display.facebook }}
          </a>
        </template>
      </div>
    </div>
  </UiModal>
</template>

<script>
export default {
  props: {
    display: {
      type: [Object, Boolean],
      required: true
    }
  },
  methods: {
    cancel () {
      this.$emit('cancel')
    },
    submit () {
      this.$emit('submit', this.display)
    }
  }
}
</script>
