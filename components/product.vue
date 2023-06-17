<template>
  <tr v-if="product.id">
    <td v-text="product.name" />
    <td v-text="product.type" />
    <td v-text="`£${product.price}`" />
    <td>
      <button @click="$emit('update-product', product)">
        <FontAwesomeIcon :icon="['fa-solid', 'fa-edit']" />
      </button>
    </td>
  </tr>
</template>

<script>

export default {
  props: {
    product: {
      type: Object,
      default () {
        return {
          id: null,
          name: '',
          type: '',
          price: 0.00
        }
      }
    }
  }
}
</script>
