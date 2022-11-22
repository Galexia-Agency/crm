export default {
  async addProduct ({ commit }, data) {
    const response = await this.$axios.$put('https://api.galexia.agency/products',
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
    return await commit('products', response)
  },
  async updateProduct ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.$post('https://api.galexia.agency/products',
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
      return await commit('updateProduct', response[0])
    } catch (e) {
      if (await e.response && await e.response.status === 429) {
        // Data from the database
        const sourceOfTruth = e.response.data[0]
        // What we're going to force push up to the database after having merged our changes with the truth
        const whatToForcePush = sourceOfTruth
        try {
          // If the name state doesn't match, open the conflict resolution modal
          if (whatToForcePush.name !== data.name) {
            whatToForcePush.name = await dispatch('conflicts', {
              title: 'Name',
              type: 'text',
              required: true,
              before: whatToForcePush.name,
              after: data.name
            })
          }
          // If the type state doesn't match, open the conflict resolution modal
          if (whatToForcePush.type !== data.type) {
            whatToForcePush.type = await dispatch('conflicts', {
              title: 'Type',
              type: 'select',
              options: ['One-off', 'Monthly', 'Yearly'],
              required: true,
              before: whatToForcePush.type,
              after: data.type
            })
          }
          // If the price state doesn't match, open the conflict resolution modal
          if (whatToForcePush.price !== data.price) {
            whatToForcePush.price = await dispatch('conflicts', {
              title: 'Price',
              type: 'number',
              required: true,
              prefix: '£',
              before: whatToForcePush.price,
              after: data.price
            })
          }
          // Force push the contact
          const response = await this.$axios.$post('https://api.galexia.agency/products',
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
          return await commit('updateProduct', response[0])
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
