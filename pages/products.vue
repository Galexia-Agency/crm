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
          <th
            style="cursor: pointer"
            @click="
              productsValue = productsNameReverse
                ?
                  productsValue.sort(function (a, b) {
                    const textA = a.name.toUpperCase()
                    const textB = b.name.toUpperCase()
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                  }).reverse()
                :
                  productsValue.sort(function (a, b) {
                    const textA = a.name.toUpperCase()
                    const textB = b.name.toUpperCase()
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                  })
              productsNameReverse = !productsNameReverse
            "
          >
            Name
          </th>
          <th
            style="cursor: pointer"
            @click="
              productsValue = productsTypeReverse
                ?
                  productsValue.sort(function (a, b) {
                    const textA = a.type.toUpperCase()
                    const textB = b.type.toUpperCase()
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                  }).reverse()
                :
                  productsValue.sort(function (a, b) {
                    const textA = a.type.toUpperCase()
                    const textB = b.type.toUpperCase()
                    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
                  })
              productsTypeReverse = !productsTypeReverse
            "
          >
            Type
          </th>
          <th
            style="cursor: pointer"
            @click="
              productsValue = productsPriceReverse
                ?
                  productsValue.sort((a, b) => b.price - a.price).reverse()
                :
                  productsValue.sort((a, b) => b.price - a.price)
              productsPriceReverse = !productsPriceReverse
            "
          >
            Price
          </th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(product, index) in productsValue">
          <Product :key="`product_${index}`" :product="product" @updateProduct="showModal" />
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
      modal: false,
      productsValue: [],
      productsNameReverse: false,
      productsTypeReverse: false,
      productsPriceReverse: false
    }
  },
  computed: {
    ...mapState([
      'claims',
      'products'
    ])
  },
  watch: {
    products () {
      this.productsValue = [...this.products]
    }
  },
  mounted () {
    this.productsValue = [...this.products]
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
