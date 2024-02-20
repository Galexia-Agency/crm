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
          <template v-for="client in clientsValue">
            <tr v-if="getClientProfit(client)" :key="`client_profit_loss_${client.business_name}`">
              <td>
                <NuxtLink :to="`/client/${client.business_shortname}`" style="color: black">
                  {{ client.business_name }}
                </NuxtLink>
              </td>
              <td v-text="getClientRevenue(client, true)" />
              <td v-text="getClientExpenses(client, true)" />
              <td v-text="getClientProfit(client, true)" />
              <td v-text="getClientProfitMargin(client, true)" />
            </tr>
          </template>
        </tbody>
      </table>
    </section>
  </main>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
  data () {
    return {
      sort: '',
      reverse: false
    }
  },
  computed: {
    ...mapState(
      'client',
      {
        clients: 'all'
      }
    ),
    ...mapGetters(
      'client',
      {
        getClientExpenses: 'getExpenses',
        getClientRevenue: 'getRevenue',
        getClientProfit: 'getProfit',
        getClientProfitMargin: 'getProfitMargin'
      }
    ),
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
          ? clonedClients.sort((a, b) => this.getClientRevenue(b) - this.getClientRevenue(a))
          : clonedClients.sort((a, b) => this.getClientRevenue(b) - this.getClientRevenue(a)).reverse()
      }
      if (this.sort === 'expenses') {
        return this.reverse
          ? clonedClients.sort((a, b) => this.getClientExpenses(b) - this.getClientExpenses(a))
          : clonedClients.sort((a, b) => this.getClientExpenses(b) - this.getClientExpenses(a)).reverse()
      }
      if (this.sort === 'net-profit') {
        return this.reverse
          ? clonedClients.sort((a, b) => this.getClientProfit(b) - this.getClientProfit(a))
          : clonedClients.sort((a, b) => this.getClientProfit(b) - this.getClientProfit(a)).reverse()
      }
      if (this.sort === 'profit-margin') {
        return this.reverse
          ? clonedClients.sort((a, b) => this.getClientProfitMargin(b) - this.getClientProfitMargin(a))
          : clonedClients.sort((a, b) => this.getClientProfitMargin(b) - this.getClientProfitMargin(a)).reverse()
      }
      return clonedClients
    }
  }
}
</script>
