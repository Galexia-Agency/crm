import { safeURL } from '~/plugins/mixins/urls'

export default {
  async addClient ({ commit, dispatch }, data) {
    data.business_shortname = safeURL(data.business_shortname)
    data.address = JSON.stringify(data.address)
    const response = await this.$axios.$put('https://api.galexia.agency/clients',
      {
        ...data
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    await commit('clients', response.sort(function (a, b) {
      const textA = a.business_shortname.toUpperCase()
      const textB = b.business_shortname.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    }))
    await dispatch('updateClientPandleDataHelper')
    return await dispatch('filteredProjectsHelper')
  },
  async updateClient ({ commit, dispatch }, data) {
    async function updatePandle ($axios, $config) {
      if (data.pandle_id) {
        try {
          await $axios.$patch(window.location.origin + '/.netlify/functions/pandle_request', {
            type: 'PATCH',
            url: `/companies/${$config.PANDLE_COMPANY_ID}/customers/${data.pandle_id}`,
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
                business_name: data.business_name,
                name: data.business_name,
                email: data.billing_email
              }
            }
          })
        } catch (e) {
          const error = {}
          error.active = true
          error.description = e
          return commit('error', error)
        }
      }
    }
    try {
      data.business_shortname = safeURL(data.business_shortname)
      data.address = JSON.stringify(data.address)
      const response = await this.$axios.$post('https://api.galexia.agency/clients',
        {
          ...data
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      await commit('updateClient', response[0])
      await updatePandle(this.$axios, this.$config)
      return response
    } catch (e) {
      if (await e.response && await e.response.status === 429 && JSON.parse(e.response.data[0].address)) {
        // Data from the database
        const sourceOfTruth = e.response.data[0]
        // What we're going to force push up to the database after having merged our changes with the truth
        const whatToForcePush = sourceOfTruth
        whatToForcePush.address = JSON.parse(whatToForcePush.address)
        try {
          // If the business_name state doesn't match, open the conflict resolution modal
          if (whatToForcePush.business_name !== data.business_name) {
            whatToForcePush.business_name = await dispatch('conflicts', {
              title: 'Business Name',
              type: 'text',
              before: whatToForcePush.business_name,
              after: data.business_name,
              required: true
            })
          }
          // If the business_shortname state doesn't match, open the conflict resolution modal
          if (whatToForcePush.business_shortname !== data.business_shortname) {
            whatToForcePush.business_shortname = await dispatch('conflicts', {
              title: 'Business Shortname',
              type: 'text',
              before: whatToForcePush.business_shortname,
              after: data.business_shortname,
              required: true
            })
          }
          // If the about state doesn't match, open the conflict resolution modal
          if (whatToForcePush.about !== data.about) {
            whatToForcePush.about = await dispatch('conflicts', {
              title: 'About The Business',
              type: 'textarea',
              before: whatToForcePush.about,
              after: data.about
            })
          }
          // If the billing_email state doesn't match, open the conflict resolution modal
          if (whatToForcePush.billing_email !== data.billing_email) {
            whatToForcePush.billing_email = await dispatch('conflicts', {
              title: 'Billing Email',
              type: 'email',
              before: whatToForcePush.billing_email,
              after: data.billing_email
            })
          }
          // If the address.line1 state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.line1 !== data.address.line1) {
            whatToForcePush.address.line1 = await dispatch('conflicts', {
              title: 'Address Line 1',
              type: 'text',
              before: whatToForcePush.address.line1,
              after: data.address.line1
            })
          }
          // If the address.line2 state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.line2 !== data.address.line2) {
            whatToForcePush.address.line2 = await dispatch('conflicts', {
              title: 'Address Line 2',
              type: 'text',
              before: whatToForcePush.address.line2,
              after: data.address.line2
            })
          }
          // If the address.line3 state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.line3 !== data.address.line3) {
            whatToForcePush.address.line3 = await dispatch('conflicts', {
              title: 'Address Line 3',
              type: 'text',
              before: whatToForcePush.address.line3,
              after: data.address.line3
            })
          }
          // If the address.town state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.town !== data.address.town) {
            whatToForcePush.address.town = await dispatch('conflicts', {
              title: 'Town / City',
              type: 'text',
              before: whatToForcePush.address.town,
              after: data.address.town
            })
          }
          // If the address.county state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.county !== data.address.county) {
            whatToForcePush.address.county = await dispatch('conflicts', {
              title: 'County',
              type: 'text',
              before: whatToForcePush.address.county,
              after: data.address.county
            })
          }
          // If the address.postcode state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.postcode !== data.address.postcode) {
            whatToForcePush.address.postcode = await dispatch('conflicts', {
              title: 'Postcode',
              type: 'text',
              before: whatToForcePush.address.postcode,
              after: data.address.postcode
            })
          }
          // If the address.country state doesn't match, open the conflict resolution modal
          if (whatToForcePush.address.country !== data.address.country) {
            whatToForcePush.address.country = await dispatch('conflicts', {
              title: 'Country',
              type: 'text',
              before: whatToForcePush.address.country,
              after: data.address.country
            })
          }
          // If the source state doesn't match, open the conflict resolution modal
          if (whatToForcePush.source !== data.source) {
            whatToForcePush.source = await dispatch('conflicts', {
              title: 'Source',
              type: 'text',
              before: whatToForcePush.source,
              after: data.source
            })
          }
          whatToForcePush.business_shortname = safeURL(whatToForcePush.business_shortname)
          const response = await this.$axios.$post('https://api.galexia.agency/clients',
            {
              ...whatToForcePush,
              force: true
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }
          )
          await commit('updateClient', response[0])
          await updatePandle(this.$axios, this.$config)
          return response
        } catch (e) {
          const error = {}
          error.active = true
          error.description = e
          error.data = data
          return commit('error', error)
        }
      } else {
        const error = {}
        error.active = true
        error.description = e
        error.data = data
        return commit('error', error)
      }
    }
  }
}
