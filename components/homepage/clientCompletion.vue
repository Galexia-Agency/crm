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
          <td v-text="`£${completion_total}`" />
        </tr>
        <tr class="divider" />
        <template v-for="client, index in clients">
          <tr v-if="getClientCompletionAmount(client)" :key="`client_completion_${index}`">
            <td>
              <NuxtLink :to="`/client/${client.business_shortname.toLowerCase()}`" style="color: black">
                {{ client.business_name }}
              </NuxtLink>
            </td>
            <td v-text="getClientCompletionAmount(client, true)" />
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script>
import { mapState, mapGetters } from 'vuex'

export default {
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
        getClientCompletionAmount: 'getCompletionAmount'
      }
    ),
    completion_total () {
      let completionTotal = 0
      this.clients.forEach((client) => {
        completionTotal += this.getClientCompletionAmount(client)
      })
      return this.makeHumanReadableCurrency(completionTotal)
    }
  }
}
</script>
