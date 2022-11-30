<template>
  <section>
    <h2>
      Clients with a completion
    </h2>
    <table>
      <tbody>
        <tr>
          <td>
            Completion Total
          </td>
          <td v-text="`£${completion_total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`" />
        </tr>
        <tr class="divider" />
        <template v-for="client, index in clients">
          <tr v-if="client.completion_amount" :key="`client_completion_${index}`">
            <td>
              <nuxt-link :to="`/client/${client.business_shortname.toLowerCase()}`" style="color: black" v-text="client.business_name" />
            </td>
            <td v-text="`£${client.completion_amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`" />
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState } from 'vuex'

export default {
  name: 'ClientCompletion',
  computed: {
    ...mapState([
      'clients'
    ]),
    completion_total () {
      let c = 0
      for (const client in this.clients) {
        if (this.clients[client].completion_amount !== null) {
          c = c + parseFloat(this.clients[client].completion_amount)
        }
      }
      return c
    }
  }
}
</script>
