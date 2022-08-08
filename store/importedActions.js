export default {
  /* Projects */
  conflicts ({ commit, state }, data) {
    // Commit data to conflicts and set reveal to true to open the modal
    commit('conflicts', { ...data, reveal: true })
    // Delay promise shim - need to wait for 1 second before the above data is committed and we can listen for the promise
    function delay (t, v) {
      return new Promise(function (resolve) {
        setTimeout(resolve.bind(null, v), t)
      })
    }
    // Return a promise so we can await it
    return new Promise((resolve) => {
      return delay(1000).then(async function () {
        return resolve(await state.conflicts.promise)
      })
    })
  },
  async updateProjectList ({ commit, state, dispatch }, projectId) {
    const project = state.projects.find(project => project.id === projectId)
    const projectList = JSON.parse(JSON.stringify(project.lists))
    if (JSON.stringify(projectList)) {
      try {
        const response = await this.$axios.$post('https://api.galexia.agency/projects/lists',
          {
            lists: JSON.stringify(projectList),
            updated_at: project.updated_at,
            id: projectId
          },
          {
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json'
            }
          }
        )
        const list = response[0]
        list.lists = JSON.parse(response[0].lists)
        commit('updateProject', list)
      } catch (e) {
        if (await e.response.status === 429 && JSON.parse(e.response.lists)) {
          // Data from the database
          const sourceOfTruth = JSON.parse(e.response.lists)
          // What we're going to force push up to the database after having merged our changes with the truth
          const whatToForcePush = sourceOfTruth
          try {
            // If there are any lists
            if (projectList.length > 0) {
              // Loop through the lists
              for (const list of Object.keys(projectList)) {
                // If we have a list that is different from the source of truth
                if (!sourceOfTruth[list] || projectList[list].id !== sourceOfTruth[list].id) {
                  // Add our list to what we're going to push up
                  whatToForcePush.push(projectList[list])
                } else {
                  // If the titles state don't match, open the conflict resolution modal
                  if (whatToForcePush[list].title !== projectList[list].title) {
                    whatToForcePush[list].title = await dispatch('conflicts', {
                      title: 'List Title',
                      type: 'text',
                      before: whatToForcePush[list].title,
                      after: projectList[list].title
                    })
                  }
                  // If the archived state don't match, open the conflict resolution modal
                  if (whatToForcePush[list].archived !== projectList[list].archived) {
                    whatToForcePush[list].archived = await dispatch('conflicts', {
                      title: 'List Archived State',
                      type: 'checkbox',
                      before: whatToForcePush[list].archived,
                      after: projectList[list].archived
                    })
                  }
                }
                // If our list has items
                if (projectList[list].items.length > 0) {
                  // Loop through the items in the list
                  for (const item of Object.keys(projectList[list].items)) {
                    // If our item is not at the source, then add it to our force push
                    if (!sourceOfTruth[list].items[item] || projectList[list].items[item].id !== sourceOfTruth[list].items[item].id) {
                      whatToForcePush[list].items.push(projectList[list].items[item])
                    } else {
                      // If the titles don't match, open the conflict resolution modal
                      if (whatToForcePush[list].items[item].title !== projectList[list].items[item].title) {
                        whatToForcePush[list].items[item].title = await dispatch('conflicts', {
                          title: 'Card Title',
                          type: 'text',
                          before: whatToForcePush[list].items[item].title,
                          after: projectList[list].items[item].title
                        })
                      }
                      // If the dates don't match, open the conflict resolution modal
                      if (whatToForcePush[list].items[item].date !== projectList[list].items[item].date) {
                        whatToForcePush[list].items[item].date = await dispatch('conflicts', {
                          title: 'Card Due Date',
                          type: 'date',
                          before: whatToForcePush[list].items[item].date,
                          after: projectList[list].items[item].date
                        })
                      }
                      // If the assignees don't match, open the conflict resolution modal
                      if (whatToForcePush[list].items[item].assignee !== projectList[list].items[item].assignee) {
                        whatToForcePush[list].items[item].assignee = await dispatch('conflicts', {
                          title: 'Card Assignee',
                          type: 'text',
                          before: whatToForcePush[list].items[item].assignee,
                          after: projectList[list].items[item].assignee
                        })
                      }
                      // If the archived states don't match, open the conflict resolution modal
                      if (whatToForcePush[list].items[item].archived !== projectList[list].items[item].archived) {
                        whatToForcePush[list].items[item].archived = await dispatch('conflicts', {
                          title: 'Card Archived State',
                          type: 'checkbox',
                          before: whatToForcePush[list].items[item].archived,
                          after: projectList[list].items[item].archived
                        })
                      }
                      // If the descriptions don't match, open the conflict resolution modal
                      if (whatToForcePush[list].items[item].description !== projectList[list].items[item].description) {
                        whatToForcePush[list].items[item].description = await dispatch('conflicts', {
                          title: 'Card Description',
                          type: 'editor',
                          before: whatToForcePush[list].items[item].description,
                          after: projectList[list].items[item].description
                        })
                      }
                      whatToForcePush[list].items[item].updatedBy = 'System'
                      whatToForcePush[list].items[item].updatedDate = Date.now()
                    }
                  }
                }
              }
            }
            // Force push the lists as all conflicts have been resolved
            const response = await this.$axios.$post('https://api.galexia.agency/projects/lists',
              {
                lists: JSON.stringify(whatToForcePush),
                id: projectId,
                force: true
              },
              {
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json'
                }
              }
            )
            const updatedProject = response[0]
            updatedProject.lists = JSON.parse(updatedProject.lists)
            commit('updateProject', response[0])
          } catch (e) {
            const error = {}
            error.active = true
            error.description = e.message
            error.data = projectList
            commit('error', { error })
          }
        } else {
          const error = {}
          error.active = true
          error.description = e.message
          error.data = projectList
          commit('error', { error })
        }
      }
    } else {
      const error = {}
      error.active = true
      error.description = 'Cannot stringify data'
      error.data = projectList
      commit('error', { error })
    }
  },
  async addProject ({ commit }, data) {
    const response = await this.$axios.$put('https://api.galexia.agency/projects',
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
    const response = await this.$axios.$post('https://api.galexia.agency/projects',
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
  addItem ({ state, commit, dispatch, getters }, { projectId, listId, title, description, date, assignee }) {
    assignee = assignee || state.claims.email
    let dayNo, day, month, dateUNIX
    if (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const JSdate = new Date(date)
      dayNo = JSdate.getDate()
      day = days[JSdate.getDay()]
      month = months[JSdate.getMonth()]
      dateUNIX = Number(new Date(date))
    }
    const clientName = getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    const clientShortName = getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.claims.email

    commit('addItem', { projectId, listId, title, description, date, dateUNIX, dayNo, day, month, clientName, clientShortName, updatedBy, assignee })
    dispatch('updateProjectList', projectId)
  },
  async updateItem ({ state, commit, dispatch, getters }, { projectId, itemId, title, description, date, createdDate, clientName, clientShortName, assignee }) {
    assignee = assignee || state.claims.email
    clientName = clientName || getters.getClientById(getters.getProjectById(projectId).client_id).business_name
    clientShortName = clientShortName || getters.getClientById(getters.getProjectById(projectId).client_id).business_shortname
    const updatedBy = state.claims.email
    let dayNo, day, month, dateUNIX
    if (date) {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
      const JSdate = new Date(date)
      dayNo = JSdate.getDate()
      day = days[JSdate.getDay()]
      month = months[JSdate.getMonth()]
      dateUNIX = Number(new Date(date))
    }
    commit('updateItem', { projectId, itemId, title, description, date, dateUNIX, dayNo, day, month, createdDate, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
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
    const response = await this.$axios.$put('https://api.galexia.agency/contacts',
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
    const response = await this.$axios.$post('https://api.galexia.agency/contacts',
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
    const response = await this.$axios.$post('https://api.galexia.agency/clients',
      {
        business_name: data.business_name,
        business_shortname: encodeURIComponent(data.business_shortname.replaceAll(' ', '-').toLowerCase()),
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
      pandle = await this.$axios.$patch(window.location.origin + '/.netlify/functions/request', {
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
    const pandle = await this.$axios.$post(window.location.origin + '/.netlify/functions/request', {
      type: 'POST',
      url: '/companies/46972/customers',
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
          customer_ref: encodeURIComponent(data.business_shortname.replaceAll(' ', '-').toLowerCase()),
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
    dispatch('updateClient', res)
    return pandle
  },
  async addProjectPandle ({ dispatch }, data) {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    const pandle = await this.$axios.$post(window.location.origin + '/.netlify/functions/request', {
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
    res.pandle_id = pandle.data.id
    dispatch('updateProject', res)
    return pandle
  }
}
