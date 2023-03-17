<style scoped lang="scss">
  table {
    max-width: 500px;
    margin-bottom: 1rem
  }

</style>

<template>
  <main>
    <h1>
      Products
    </h1>
    <table>
      <thead>
        <tr>
          <th @click="sort = 'name', reverse = !reverse">
            Name
          </th>
          <th @click="sort = 'type', reverse = !reverse">
            Type
          </th>
          <th @click="sort = 'price', reverse = !reverse">
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(product, index) in productsValues">
          <Product :key="`product_${index}`" :product="product" @updateProduct="showModal" />
        </template>
      </tbody>
    </table>
    <div v-if="userInfo.groups.includes('admin')">
      <button type="button" class="button primary" @click="showModal">
        New Product
      </button>
    </div>
    <ui-modal
      ref="modal"
      :active="modal"
      @close="hideModal"
    >
      <Modal ref="product_modal" @submit="submitProduct" @cancel="hideModal" />
    </ui-modal>
  </main>
</template>

<script>
import { mapState } from 'vuex'
import Modal from '../components/modals/update/productModal'
import Product from '../components/ui/product'

export default {
  name: 'Products',
  metaInfo () {
    return {
      title: 'Products'
    }
  },
  components: {
    Product,
    Modal
  },
  data () {
    return {
      modal: false,
      sort: '',
      reverse: false
    }
  },
  computed: {
    ...mapState([
      'userInfo',
      'products'
    ]),
    productsValues () {
      const clonedProducts = []
      Object.assign(clonedProducts, this.products)
      if (this.sort === 'name') {
        return this.reverse
          ? clonedProducts.sort(function (a, b) {
            const textA = a.name.toUpperCase()
            const textB = b.name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })
          : clonedProducts.sort(function (a, b) {
            const textA = a.name.toUpperCase()
            const textB = b.name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          }).reverse()
      }
      if (this.sort === 'type') {
        return this.reverse
          ? clonedProducts.sort(function (a, b) {
            const textA = a.type.toUpperCase()
            const textB = b.type.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })
          : clonedProducts.sort(function (a, b) {
            const textA = a.type.toUpperCase()
            const textB = b.type.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          }).reverse()
      }
      if (this.sort === 'price') {
        return this.reverse
          ? clonedProducts.sort((a, b) => b.price - a.price)
          : clonedProducts.sort((a, b) => b.price - a.price).reverse()
      }
      return clonedProducts
    }
  },
  methods: {
    async submitProduct (product) {
      this.hideModal()
      if (product.id) {
        await this.$store.dispatch('updateProduct', product)
      } else {
        await this.$store.dispatch('addProduct', product)
      }
    },
    showModal (product) {
      this.modal = true
      this.$nextTick(() => {
        this.$refs.product_modal.show(product)
      })
    },
    hideModal () {
      this.modal = false
    }
  }
}
</script>
