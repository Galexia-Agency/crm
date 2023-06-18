import { safeURL } from '~/plugins/mixins/urls'

export default {
  async addClientPandle ({ dispatch }, data) {
    const pandle = await this.$axios.$post(`${window.location.origin}/.netlify/functions/pandle_request`, {
      type: 'POST',
      url: `/companies/${this.$config.PANDLE_COMPANY_ID}/customers`,
      body: {
        customer: {
          address_attributes: {
            address_line_1: data.address.line1,
            address_line_2: data.address.line2,
            address_line_3: data.address.line3,
            county: data.address.county,
            country: data.address.country,
            postcode: data.address.postcode,
            town_city: data.address.town
          },
          nominal_account_id: 2166632,
          business_name: data.business_name,
          name: data.business_name,
          customer_ref: safeURL(data.business_shortname),
          credit_limit: 0,
          currency_id: '1',
          days_until_payment_due: 30,
          country: data.address.country,
          email: data.billing_email.toLowerCase()
        }
      }
    })
    const res = {}
    Object.assign(res, data)
    res.pandle_id = pandle.data.id
    return await dispatch('updateClient', res)
  },
  async addProjectPandle ({ dispatch }, data) {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    const pandle = await this.$axios.$post(`${window.location.origin}/.netlify/functions/pandle_request`, {
      type: 'POST',
      url: `/companies/${this.$config.PANDLE_COMPANY_ID}/projects`,
      body: {
        project: {
          name: `${data.client_name}-${safeURL(data.name)}`,
          status: 'Open',
          date_started: `${day}/${month}/${year}`
        }
      }
    })
    const res = {}
    Object.assign(res, data)
    res.pandle_id = pandle.data.id
    return await dispatch('updateProject', res)
  }
}
