export default {
  async addClient ({ commit }, data) {
    const response = await this.$axios.$put('https://api.galexia.agency/clients',
      {
        business_name: data.business_name,
        business_shortname: encodeURIComponent(data.business_shortname.replaceAll(' ', '-').toLowerCase()),
        about: data.about,
        address: JSON.stringify(data.address),
        source: data.source,
        pandle_id: data.pandle_id,
        billing_email: data.billing_email
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    return await commit('clients', response)
  },
  async updateClient ({ commit, dispatch }, data) {
    let adr = {}
    if (data.address) {
      try {
        adr = JSON.parse(data.address)
        adr = JSON.stringify(data.address)
      } catch (e) {
        adr = JSON.stringify(data.address)
      }
    }
    async function updatePandle () {
      if (data.pandle_id) {
        try {
          await this.$axios.$patch(window.location.origin + '/.netlify/functions/request', {
            type: 'PATCH',
            url: `/companies/46972/customers/${data.pandle_id}`,
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
          error.description = e.message
          return commit('error', { error })
        }
      }
    }
    try {
      const response = await this.$axios.$post('https://api.galexia.agency/clients',
        {
          business_name: data.business_name,
          business_shortname: encodeURIComponent(data.business_shortname.replaceAll(' ', '-').toLowerCase()),
          about: data.about,
          address: adr,
          source: data.source,
          id: data.id,
          pandle_id: data.pandle_id,
          billing_email: data.billing_email,
          updated_at: data.updated_at
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      await commit('updateClient', response[0])
      await updatePandle()
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
          const response = await this.$axios.$post('https://api.galexia.agency/clients',
            {
              business_name: data.business_name,
              business_shortname: encodeURIComponent(data.business_shortname.replaceAll(' ', '-').toLowerCase()),
              about: data.about,
              address: adr,
              source: data.source,
              id: data.id,
              pandle_id: data.pandle_id,
              billing_email: data.billing_email,
              updated_at: data.updated_at,
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
          await updatePandle()
          return response
        } catch (e) {
          const error = {}
          error.active = true
          error.description = e.message
          error.data = data
          return commit('error', { error })
        }
      } else {
        const error = {}
        error.active = true
        error.description = e.message
        error.data = data
        return commit('error', { error })
      }
    }
  }
}
