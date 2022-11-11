// Store all pending updateProjectList requests
const LIST_REQUESTS = []

// Recursively removes an item from an array
function removeItem (array, item) {
  let i = array.length

  while (i--) {
    if (array[i] === item) {
      array.splice(array.indexOf(item), 1)
    }
  }
}

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
  updateProjectList ({ commit, state, dispatch }, projectId) {
    // Add the projectId to the queue
    LIST_REQUESTS.push(projectId)
    // Wait 1 second before executing
    window.setTimeout(async () => {
      // If there is a pending request for this projectId, then proceed
      if (LIST_REQUESTS.includes(projectId)) {
        // Remove the projectId from the array, this project has been updated
        removeItem(LIST_REQUESTS, projectId)
        // Proceed with pushing the changes to the API
        const project = state.projects.find(project => project.id === projectId)
        // Assign the project list from the store to a new variable so we don't mutate state
        const projectList = Array.from(project.lists)
        if (JSON.stringify(project.lists)) {
          try {
            const response = await this.$api.post('https://api.galexia.agency/projects/lists',
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
            const newProject = {}
            Object.assign(newProject, project)
            newProject.updated_at = response.data[0].updated_at
            return await commit('updateProject', newProject)
          } catch (e) {
            if (await e.response && await e.response.status === 429 && JSON.parse(e.response.data[0].lists)) {
              // Data from the database
              const sourceOfTruth = JSON.parse(e.response.data[0].lists)
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
                              after: projectList[list].items[item].title,
                              required: true
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
                const response = await this.$api.post('https://api.galexia.agency/projects/lists',
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
                const updatedProject = response.data[0]
                updatedProject.lists = JSON.parse(updatedProject.lists)
                return commit('updateProject', response.data[0])
              } catch (e) {
                const error = {}
                error.active = true
                error.description = e.message
                error.data = projectList
                return commit('error', { error })
              }
            } else {
              const error = {}
              error.active = true
              error.description = e.message
              error.data = projectList
              return commit('error', { error })
            }
          }
        } else {
          const error = {}
          error.active = true
          error.description = 'Cannot stringify data'
          error.data = projectList
          commit('error', { error })
        }
      }
    }, 1000)
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
  async addList ({ commit, dispatch }, { projectId, title }) {
    await commit('addList', { projectId, title })
    return await dispatch('updateProjectList', projectId)
  },
  async editList ({ commit, dispatch }, { projectId, title, id }) {
    await commit('editList', { projectId, title, id })
    return await dispatch('updateProjectList', projectId)
  },
  async moveList ({ commit, dispatch }, [projectId, fromIndex, toIndex]) {
    await commit('moveList', [projectId, fromIndex, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveList ({ commit, dispatch }, { projectId, listId }) {
    await commit('archiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveList ({ commit, dispatch }, { projectId, listId }) {
    await commit('unarchiveList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeList ({ commit, dispatch }, { projectId, listId }) {
    await commit('removeList', { projectId, listId })
    return await dispatch('updateProjectList', projectId)
  },
  async addItem ({ state, commit, dispatch, getters }, { projectId, listId, title, description, date, assignee }) {
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

    await commit('addItem', { projectId, listId, title, description, date, dateUNIX, dayNo, day, month, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
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
    await commit('updateItem', { projectId, itemId, title, description, date, dateUNIX, dayNo, day, month, createdDate, clientName, clientShortName, updatedBy, assignee })
    return await dispatch('updateProjectList', projectId)
  },
  async moveItem ({ commit, dispatch }, [projectId, fromListRef, fromIndex, toListRef, toIndex]) {
    await commit('moveItem', [projectId, fromListRef, fromIndex, toListRef, toIndex])
    return await dispatch('updateProjectList', projectId)
  },
  async archiveItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('archiveItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
  },
  async unarchiveItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('unarchiveItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
  },
  async removeItem ({ commit, dispatch }, { projectId, itemId }) {
    await commit('removeItem', { projectId, itemId })
    return await dispatch('updateProjectList', projectId)
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
    await commit('contacts', response)
    return response
  },
  async updateContact ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.$post('https://api.galexia.agency/contacts',
        {
          title: data.title,
          f_name: data.f_name,
          l_name: data.l_name,
          tel: data.tel,
          email: data.email.toLowerCase(),
          role: data.role,
          facebook: data.facebook,
          id: data.id,
          google_contact_id: data.google_contact_id,
          updated_at: data.updated_at
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      return await commit('updateContact', response)
    } catch (e) {
      if (await e.response && await e.response.status === 429) {
        // Data from the database
        const sourceOfTruth = e.response.data[0]
        // What we're going to force push up to the database after having merged our changes with the truth
        const whatToForcePush = sourceOfTruth
        try {
          // If the gender state doesn't match, open the conflict resolution modal
          if (whatToForcePush.title !== data.title) {
            whatToForcePush.title = await dispatch('conflicts', {
              title: 'Gender',
              type: 'select',
              options: ['Male', 'Female', 'Other'],
              before: whatToForcePush.title,
              after: data.title
            })
          }
          // If the first name state doesn't match, open the conflict resolution modal
          if (whatToForcePush.f_name !== data.f_name) {
            whatToForcePush.f_name = await dispatch('conflicts', {
              title: 'First Name',
              type: 'text',
              before: whatToForcePush.f_name,
              after: data.f_name,
              required: true
            })
          }
          // If the last name state doesn't match, open the conflict resolution modal
          if (whatToForcePush.l_name !== data.l_name) {
            whatToForcePush.l_name = await dispatch('conflicts', {
              title: 'Last Name',
              type: 'text',
              before: whatToForcePush.l_name,
              after: data.l_name,
              required: true
            })
          }
          // If the telephone state doesn't match, open the conflict resolution modal
          if (whatToForcePush.tel !== data.tel) {
            whatToForcePush.tel = await dispatch('conflicts', {
              title: 'Telephone',
              type: 'text',
              before: whatToForcePush.tel,
              after: data.tel,
              pattern: '[^s]+',
              noSpaces: true
            })
          }
          // If the email state doesn't match, open the conflict resolution modal
          if (whatToForcePush.email !== data.email) {
            whatToForcePush.email = await dispatch('conflicts', {
              title: 'Email',
              type: 'text',
              before: whatToForcePush.email,
              after: data.email,
              pattern: '[^s]+',
              noSpaces: true,
              required: true
            })
          }
          // If the role state doesn't match, open the conflict resolution modal
          if (whatToForcePush.role !== data.role) {
            whatToForcePush.role = await dispatch('conflicts', {
              title: 'Role',
              type: 'text',
              before: whatToForcePush.role,
              after: data.role
            })
          }
          // If the facebook state doesn't match, open the conflict resolution modal
          if (whatToForcePush.facebook !== data.facebook) {
            whatToForcePush.facebook = await dispatch('conflicts', {
              title: 'Facebook Profile Link',
              type: 'url',
              before: whatToForcePush.facebook,
              after: data.facebook
            })
          }
          // Force push the contact
          const response = await this.$axios.$post('https://api.galexia.agency/contacts',
            {
              title: whatToForcePush.title,
              f_name: whatToForcePush.f_name,
              l_name: whatToForcePush.l_name,
              tel: whatToForcePush.tel,
              email: whatToForcePush.email.toLowerCase(),
              role: whatToForcePush.role,
              facebook: whatToForcePush.facebook,
              id: whatToForcePush.id,
              google_contact_id: whatToForcePush.google_contact_id,
              updated_at: whatToForcePush.updated_at,
              force: true
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }
          )
          return await commit('updateContact', response)
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
