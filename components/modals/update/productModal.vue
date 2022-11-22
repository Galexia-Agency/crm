<template>
  <form class="query-form card" @submit.prevent="submit">
    <div class="card-content">
      <ui-input
        v-model="name"
        name="name"
        label="Name *"
        type="text"
        :autofocus="true"
        :required="true"
      />
      <ui-input
        v-model="type"
        name="type"
        label="Type *"
        type="select"
        :options="['One-off', 'Monthly', 'Yearly']"
        :required="true"
      />
      <ui-input
        v-model="price"
        name="price"
        label="Price *"
        prefix="£"
        type="number"
        :required="true"
      />
      <div class="field is-grouped">
        <ui-button type="submit" style-type="primary" :disabled="!name || !type || !price">
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
    id: null,
    name: '',
    type: '',
    price: 0.00,
    updated_at: null,
    created_at: null
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
    show (product) {
      this.reset()
      Object.assign(this, product)
    },
    submit () {
      this.$emit('submit', this.values)
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
