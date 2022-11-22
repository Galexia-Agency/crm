<style scoped lang="scss">
  table {
    max-width: 500px;
    width: 100%;
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
          <th>
            Name
          </th>
          <th>
            Type
          </th>
          <th>
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(product, index) in products">
          <Product :key="index" :product="product" @updateProduct="showModal" />
        </template>
      </tbody>
    </table>
    <div v-if="claims.groups.includes('admin')">
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
      modal: false
    }
  },
  computed: {
    ...mapState([
      'claims',
      'products'
    ])
  },
  methods: {
    async submitProduct (product) {
      this.hideModal()
      if (product.id) {
        await this.$store.dispatch('updateProduct', product)
      } else {
        await this.$store.dispatch('addProduct', product)
      }
      this.$forceUpdate()
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
