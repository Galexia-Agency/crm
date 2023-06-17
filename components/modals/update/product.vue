<template>
  <UiModal
    :active="active"
    @close="cancel"
  >
    <form class="query-form card" @submit.prevent="submit">
      <div class="card-content">
        <UiInput
          v-model="updatedProduct.name"
          name="name"
          label="Name *"
          type="text"
          :autofocus="true"
          :required="true"
        />
        <UiInput
          v-model="updatedProduct.type"
          name="type"
          label="Type *"
          type="select"
          :options="['One-off', 'Monthly', 'Yearly']"
          :required="true"
        />
        <UiInput
          v-model="updatedProduct.price"
          name="price"
          label="Price *"
          prefix="£"
          type="number"
          :required="true"
        />
        <div class="field is-grouped">
          <UiButton type="submit" style-type="primary" :disabled="!updatedProduct.name || !updatedProduct.type || !updatedProduct.price">
            {{ updatedProduct.id ? 'Update' : 'Add' }}
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
const productDefault = {
  id: null,
  name: '',
  type: '',
  price: 0.00,
  updated_at: null,
  created_at: null
}
export default {
  props: {
    active: {
      type: Boolean,
      required: true
    },
    product: {
      type: Object,
      default () {
        return productDefault
      }
    }
  },
  data () {
    return {
      updatedProduct: { ...productDefault, ...this.product }
    }
  },
  methods: {
    submit () {
      this.$emit('submit', this.updatedProduct)
    },
    cancel () {
      this.$emit('cancel')
    }
  }
}
</script>
