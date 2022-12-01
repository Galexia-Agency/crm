<template>
  <main v-if="clientsValue.length > 0">
    <section class="span-2">
      <h2>
        Clients Profit / Loss performance
      </h2>
      <table>
        <thead>
          <tr>
            <th @click="sort = 'name', reverse = ! reverse">
              Client
            </th>
            <th @click="sort = 'revenue', reverse = ! reverse">
              Revenue
            </th>
            <th @click="sort = 'expenses', reverse = ! reverse">
              Expenses
            </th>
            <th @click="sort = 'net-profit', reverse = ! reverse">
              Net Profit
            </th>
            <th @click="sort = 'profit-margin', reverse = ! reverse">
              Profit Margin
            </th>
          </tr>
        </thead>
        <tbody>
          <template v-for="client in clientsValue ? clientsValue : clients">
            <tr v-if="client.profit" :key="`client_profit_loss_${client.business_name}`">
              <td>
                <nuxt-link :to="`/client/${client.business_shortname}`" style="color: black" v-text="client.business_name" />
              </td>
              <td v-if="client.revenue >= 0" v-text="`£${client.revenue.toFixed(2)}`" />
              <td v-else v-text="`-£${Math.abs(client.revenue).toFixed(2)}`" />
              <td v-if="client.expenses >= 0" v-text="`-£${client.expenses.toFixed(2)}`" />
              <td v-else v-text="`-£${Math.abs(client.expenses).toFixed(2)}`" />
              <td v-if="client.profit >= 0" v-text="`£${client.profit.toFixed(2)}`" />
              <td v-else v-text="`-£${Math.abs(client.profit).toFixed(2)}`" />
              <td v-if="client.profit_margin > 0 && client.profit_margin <= 100" v-text="`${client.profit_margin.toFixed(2)}%`" />
              <td v-else>
                -
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ClientProfitLoss',
  data () {
    return {
      sort: '',
      reverse: false
    }
  },
  computed: {
    ...mapState([
      'clients'
    ]),
    clientsValue () {
      const clonedClients = []
      Object.assign(clonedClients, this.clients)
      if (this.sort === 'name') {
        return this.reverse
          ? clonedClients.sort(function (a, b) {
            const textA = a.business_name.toUpperCase()
            const textB = b.business_name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          })
          : clonedClients.sort(function (a, b) {
            const textA = a.business_name.toUpperCase()
            const textB = b.business_name.toUpperCase()
            return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
          }).reverse()
      }
      if (this.sort === 'revenue') {
        return this.reverse
          ? clonedClients.sort((a, b) => b.revenue - a.revenue)
          : clonedClients.sort((a, b) => b.revenue - a.revenue).reverse()
      }
      if (this.sort === 'expenses') {
        return this.reverse
          ? clonedClients.sort((a, b) => b.expenses - a.expenses)
          : clonedClients.sort((a, b) => b.expenses - a.expenses).reverse()
      }
      if (this.sort === 'net-profit') {
        return this.reverse
          ? clonedClients.sort((a, b) => b.profit - a.profit)
          : clonedClients.sort((a, b) => b.profit - a.profit).reverse()
      }
      if (this.sort === 'profit-margin') {
        return this.reverse
          ? clonedClients.sort((a, b) => parseInt(b.profit_margin) - parseInt(a.profit_margin))
          : clonedClients.sort((a, b) => parseInt(b.profit_margin) - parseInt(a.profit_margin)).reverse()
      }
      return clonedClients
    }
  }
}
</script>
