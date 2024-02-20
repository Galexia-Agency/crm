<template>
  <tr v-if="product.id">
    <td v-text="product.name" />
    <td v-text="product.type" />
    <td v-text="`£${product.price}`" />
    <td>
      <button @click="$store.dispatch('product/update', product)">
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
      required: true
    }
  }
}
</script>
