import ClientClass from '../index'
import { addModel, prepareModelForUpload, updateModel } from '~/models/reusableModelActions'

export default {
  async add ({ commit, dispatch, getters, rootState }, data) {
    await addModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ClientClass, data, endpoint: 'clients' })
    if (data && data.business_shortname) {
      const newClient = getters.getByShortname(data.business_shortname)
      if (window.$nuxt.$route.params.client !== newClient.business_shortname) {
        window.$nuxt.$router.push(`/client/${newClient.business_shortname}`)
      }
    }
  },
  async update ({ commit, dispatch, getters, rootState }, { client, force }) {
    const oldClientData = getters.getById(client.id)
    await updateModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ClientClass, data: client, endpoint: 'clients', force })
    const newClientData = prepareModelForUpload(new ClientClass(getters.getById(client.id)))

    // Only update pandle if needed
    if (
      oldClientData.address_line_1 !== newClientData.address_line_1 &&
      oldClientData.address_line_2 !== newClientData.address_line_2 &&
      oldClientData.address_line_3 !== newClientData.address_line_3 &&
      oldClientData.address_county !== newClientData.address_county &&
      oldClientData.address_country !== newClientData.address_country &&
      oldClientData.address_postcode !== newClientData.address_postcode &&
      oldClientData.address_town !== newClientData.address_town &&
      oldClientData !== newClientData.business_name &&
      oldClientData.billing_email !== newClientData.billing_email &&
      newClientData.pandle_id
    ) {
      await this.$axios.$patch(`${window.location.origin}/.netlify/functions/pandle_request`, {
        type: 'PATCH',
        url: `/companies/${this.$config.PANDLE_COMPANY_ID}/customers/${newClientData.pandle_id}`,
        body: {
          customer: {
            address_attributes: {
              address_line_1: newClientData.address_line_1,
              address_line_2: newClientData.address_line_2,
              address_line_3: newClientData.address_line_3,
              county: newClientData.address_county,
              country: newClientData.address_country,
              postcode: newClientData.address_postcode,
              town_city: newClientData.address_town
            },
            business_name: newClientData.business_name,
            name: newClientData.business_name,
            email: newClientData.billing_email
          }
        }
      })
    }
    if (window.$nuxt.$route.params.client !== newClientData.business_shortname) {
      window.$nuxt.$router.push(`/client/${newClientData.business_shortname}`)
    }
  },
  async addToPandle ({ dispatch, commit, rootState }, client) {
    const pandle = await this.$axios.$post(`${window.location.origin}/.netlify/functions/pandle_request`, {
      type: 'POST',
      url: `/companies/${this.$config.PANDLE_COMPANY_ID}/customers`,
      body: {
        customer: {
          address_attributes: {
            address_line_1: client.address_line_1,
            address_line_2: client.address_line_2,
            address_line_3: client.address_line_3,
            county: client.address_county,
            country: client.address_country,
            postcode: client.address_postcode,
            town_city: client.address_town
          },
          nominal_account_id: 2166632,
          business_name: client.business_name,
          name: client.business_name,
          customer_ref: client.business_shortname,
          credit_limit: 0,
          currency_id: '1',
          days_until_payment_due: 30,
          country: client.address_country,
          email: client.billing_email
        }
      }
    })
    const data = { ...client }
    data.pandle_id = pandle.data.id
    commit('update', { data, rootState })
    return await dispatch('update', { client: data, force: true })
  }
}
