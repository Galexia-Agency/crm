const actions = {
  /* Projects */
  async updateProjectList ({ commit, state }, projectId) {
    if (JSON.stringify(state.projects.find(project => project.id === projectId).lists)) {
      try {
        await this.$axios.post('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/projects/lists',
          {
            lists: JSON.stringify(state.projects.find(project => project.id === projectId).lists),
            id: projectId
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )
      } catch (e) {
        const error = {}
        error.active = true
        error.description = e
        error.data = state.projects.find(project => project.id === projectId).lists
        commit('error', { error })
      }
    }
  },
  async addProject ({ commit }, data) {
    const response = await this.$axios.$put('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/projects',
      {
        client_id: data.client_id,
        name: data.name,
        status: data.status,
        hosting: data.hosting,
        github_url: data.github_url,
        drive_url: data.drive_url,
        project_url: data.project_url,
        project_login_url: data.project_login_url,
        pandle_id: data.pandle_id,
        completion_amount: data.completion_amount,
        bb_revenue: data.bb_revenue,
        bb_expenses: data.bb_expenses,
        viewer: data.viewer,
        contributor: data.contributor,
        admin: data.admin
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    response.forEach((project, index) => {
      if (project.lists) {
        response[index].lists = JSON.parse(project.lists)
      }
    })
    commit('projects', response)
    return response
  },
  async updateProject ({ commit }, data) {
    const response = await this.$axios.$post('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/projects',
      {
        id: data.id,
        name: data.name,
        status: data.status,
        hosting: data.hosting,
        github_url: data.github_url,
        drive_url: data.drive_url,
        project_url: data.project_url,
        project_login_url: data.project_login_url,
        pandle_id: data.pandle_id,
        completion_amount: data.completion_amount,
        bb_revenue: data.bb_revenue,
        bb_expenses: data.bb_expenses,
        viewer: data.viewer,
        contributor: data.contributor,
        admin: data.admin
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    commit('updateProject', data)
    return response
  },
  addList ({ commit, dispatch }, { projectId, title }) {
    commit('addList', { projectId, title })
    dispatch('updateProjectList', projectId)
  },
  editList ({ commit, dispatch }, { projectId, title, id }) {
    commit('editList', { projectId, title, id })
    dispatch('updateProjectList', projectId)
  },
  moveList ({ commit, dispatch }, [projectId, fromIndex, toIndex]) {
    commit('moveList', [projectId, fromIndex, toIndex])
    dispatch('updateProjectList', projectId)
  },
  archiveList ({ commit, dispatch }, { projectId, listId }) {
    commit('archiveList', { projectId, listId })
    dispatch('updateProjectList', projectId)
  },
  unarchiveList ({ commit, dispatch }, { projectId, listId }) {
    commit('unarchiveList', { projectId, listId })
    dispatch('updateProjectList', projectId)
  },
  removeList ({ commit, dispatch }, { projectId, listId }) {
    commit('removeList', { projectId, listId })
    dispatch('updateProjectList', projectId)
  },
  addItem ({ commit, dispatch }, { projectId, listId, title, description, date }) {
    commit('addItem', { projectId, listId, title, description, date })
    dispatch('updateProjectList', projectId)
  },
  updateItem ({ commit, dispatch }, { projectId, itemId, title, description, date, createdDate }) {
    commit('updateItem', { projectId, itemId, title, description, date, createdDate })
    dispatch('updateProjectList', projectId)
  },
  moveItem ({ commit, dispatch }, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    commit('moveItem', [projectId, fromListRef, fromIndex, toListRef, toIndex])
    dispatch('updateProjectList', projectId)
  },
  archiveItem ({ commit, dispatch }, { projectId, itemId }) {
    commit('archiveItem', { projectId, itemId })
    dispatch('updateProjectList', projectId)
  },
  unarchiveItem ({ commit, dispatch }, { projectId, itemId }) {
    commit('unarchiveItem', { projectId, itemId })
    dispatch('updateProjectList', projectId)
  },
  removeItem ({ commit, dispatch }, { projectId, itemId }) {
    commit('removeItem', { projectId, itemId })
    dispatch('updateProjectList', projectId)
  },

  /* Contacts */
  async addContact ({ commit }, data) {
    const response = await this.$axios.$put('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/contacts',
      {
        client_id: data.client_id,
        f_name: data.f_name,
        l_name: data.l_name,
        tel: data.tel,
        email: data.email.toLowerCase(),
        role: data.role,
        facebook: data.facebook,
        org: data.org,
        title: data.title
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    commit('contacts', response)
    return response
  },
  async updateContact ({ commit }, data) {
    const response = await this.$axios.$post('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/contacts',
      {
        f_name: data.f_name,
        l_name: data.l_name,
        tel: data.tel,
        email: data.email.toLowerCase(),
        role: data.role,
        facebook: data.facebook,
        id: data.id,
        google_contact_id: data.google_contact_id,
        org: data.org,
        title: data.title
      },
      {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json'
        }
      }
    )
    commit('updateContact', response)
    return response
  },
  /* Clients */
  async addClient ({ commit }, data) {
    const response = await this.$axios.$put('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/clients',
      {
        business_name: data.business_name,
        business_shortname: encodeURIComponent(data.business_shortname.toLowerCase()),
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
    commit('clients', response)
    return response
  },
  async updateClient ({ commit }, data) {
    let adr = {}
    try {
      adr = JSON.parse(data.address)
      adr = JSON.stringify(data.address)
    } catch (e) {
      adr = JSON.stringify(data.address)
    }
    const response = await this.$axios.$post('https://cors-wanker.joebailey.workers.dev/https://api.galexia.agency/clients',
      {
        business_name: data.business_name,
        business_shortname: encodeURIComponent(data.business_shortname.toLowerCase()),
        about: data.about,
        address: adr,
        source: data.source,
        id: data.id,
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
    let pandle
    if (data.pandle_id) {
      pandle = await this.$axios.patch(window.location.origin + '/.netlify/functions/request', {
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
    }
    commit('updateClient', response)
    return { response, pandle }
  },
  /* Pandle */
  async addClientPandle ({ dispatch }, data) {
    console.log(data)
    const pandle = await this.$axios.post(window.location.origin + '/.netlify/functions/request', {
      type: 'POST',
      url: '/companies/46972/customers',
      body: {
        customer: {
          address_attributes: {
            address_line_1: JSON.parse(data.address).line1,
            address_line_2: JSON.parse(data.address).line2,
            address_line_3: JSON.parse(data.address).line3,
            county: JSON.parse(data.address).county,
            country: JSON.parse(data.address).country,
            postcode: JSON.parse(data.address).postcode,
            town_city: JSON.parse(data.address).town
          },
          nominal_account_id: 2166632,
          business_name: data.business_name,
          name: data.business_name,
          customer_ref: encodeURIComponent(data.business_shortname.toLowerCase()),
          credit_limit: 0,
          currency_id: '1',
          days_until_payment_due: 30,
          country: JSON.parse(data.address).country,
          email: data.billing_email.toLowerCase()
        }
      }
    })
    const res = {}
    Object.assign(res, data)
    res.pandle_id = pandle.data.data.id
    dispatch('updateClient', res)
    return pandle
  },
  async addProjectPandle ({ dispatch }, data) {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    const pandle = await this.$axios.post(window.location.origin + '/.netlify/functions/request', {
      type: 'POST',
      url: '/companies/46972/projects',
      body: {
        project: {
          name: data.client_name + '-' + data.name,
          status: 'Open',
          date_started: day + '/' + month + '/' + year
        }
      }
    })
    const res = {}
    Object.assign(res, data)
    res.pandle_id = pandle.data.data.id
    dispatch('updateProject', res)
    return pandle
  }
}

export default actions
