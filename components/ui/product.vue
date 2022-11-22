<template>
  <tr v-if="product.id">
    <td v-text="product.name" />
    <td v-text="product.type" />
    <td v-text="`£${parseFloat(product.price).toFixed(2)}`" />
    <td>
      <a href="javascript:void(0)" @click="$emit('updateProduct', product)">
        <font-awesome-icon :icon="['fa-solid', 'fa-edit']" />
      </a>
    </td>
  </tr>
</template>

<script>

export default {
  name: 'Product',
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
