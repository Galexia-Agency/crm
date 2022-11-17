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
                return await commit('updateProject', response.data[0])
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
        php: data.php,
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
        admin: data.admin,
        enquiry_date: data.enquiry_date,
        start_date: data.start_date,
        ongoing: data.ongoing,
        completion_date: data.completion_date
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
  async updateProject ({ commit, dispatch }, data) {
    try {
      const response = await this.$axios.$post('https://api.galexia.agency/projects',
        {
          id: data.id,
          name: data.name,
          status: data.status,
          hosting: data.hosting,
          php: data.php,
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
          admin: data.admin,
          updated_at: data.updated_at,
          enquiry_date: data.enquiry_date,
          start_date: data.start_date,
          ongoing: data.ongoing,
          completion_date: data.completion_date
        },
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
          }
        }
      )
      // Don't update lists
      delete response[0].lists
      return await commit('updateProject', response[0])
    } catch (e) {
      if (await e.response && await e.response.status === 429) {
        // Data from the database
        const sourceOfTruth = e.response.data[0]
        // Don't update lists
        delete sourceOfTruth.lists
        // What we're going to force push up to the database after having merged our changes with the truth
        const whatToForcePush = sourceOfTruth
        try {
          // If the name state doesn't match, open the conflict resolution modal
          if (whatToForcePush.name !== data.name) {
            whatToForcePush.name = await dispatch('conflicts', {
              title: 'Name',
              type: 'text',
              before: whatToForcePush.name,
              after: data.name,
              required: true
            })
          }
          // If the status state doesn't match, open the conflict resolution modal
          if (whatToForcePush.status !== data.status) {
            whatToForcePush.status = await dispatch('conflicts', {
              title: 'Status',
              type: 'select',
              before: whatToForcePush.status,
              after: data.status,
              options: ['Hot Lead', 'Cold Lead', 'Development', 'Paused', 'In House', 'On-Going', 'Closed Lead', 'Completed', 'Cancelled'],
              required: true
            })
          }
          // If the project_url state doesn't match, open the conflict resolution modal
          if (whatToForcePush.project_url !== data.project_url) {
            whatToForcePush.project_url = await dispatch('conflicts', {
              title: 'Project URL',
              type: 'url',
              before: whatToForcePush.project_url,
              after: data.project_url
            })
          }
          // If the project_login_url state doesn't match, open the conflict resolution modal
          if (whatToForcePush.project_login_url !== data.project_login_url) {
            whatToForcePush.project_login_url = await dispatch('conflicts', {
              title: 'Project Login URL',
              type: 'url',
              before: whatToForcePush.project_login_url,
              after: data.project_login_url
            })
          }
          // If the hosting state doesn't match, open the conflict resolution modal
          if (whatToForcePush.hosting !== data.hosting) {
            whatToForcePush.hosting = await dispatch('conflicts', {
              title: 'Hosting',
              type: 'text',
              before: whatToForcePush.hosting,
              after: data.hosting
            })
          }
          // If the php state doesn't match, open the conflict resolution modal
          if (whatToForcePush.php !== data.php) {
            whatToForcePush.php = await dispatch('conflicts', {
              title: 'PHP Version',
              type: 'select',
              before: whatToForcePush.php,
              after: data.php,
              options: ['7.3', '7.4', '8.0', '8.1']
            })
          }
          // If the github_url state doesn't match, open the conflict resolution modal
          if (whatToForcePush.github_url !== data.github_url) {
            whatToForcePush.github_url = await dispatch('conflicts', {
              title: 'GitHub Link',
              type: 'url',
              before: whatToForcePush.github_url,
              after: data.github_url
            })
          }
          // If the drive_url state doesn't match, open the conflict resolution modal
          if (whatToForcePush.drive_url !== data.drive_url) {
            whatToForcePush.drive_url = await dispatch('conflicts', {
              title: 'Google Drive Link',
              type: 'url',
              before: whatToForcePush.drive_url,
              after: data.drive_url
            })
          }
          // If the viewer state doesn't match, open the conflict resolution modal
          if (whatToForcePush.viewer !== data.viewer) {
            whatToForcePush.viewer = await dispatch('conflicts', {
              title: 'Project Viewers',
              type: 'text',
              before: whatToForcePush.viewer,
              after: data.viewer,
              noSpaces: true,
              pattern: '[^s]+'
            })
          }
          // If the contributor state doesn't match, open the conflict resolution modal
          if (whatToForcePush.contributor !== data.contributor) {
            whatToForcePush.contributor = await dispatch('conflicts', {
              title: 'Project Contributors',
              type: 'text',
              before: whatToForcePush.contributor,
              after: data.contributor,
              noSpaces: true,
              pattern: '[^s]+'
            })
          }
          // If the admin state doesn't match, open the conflict resolution modal
          if (whatToForcePush.admin !== data.admin) {
            whatToForcePush.admin = await dispatch('conflicts', {
              title: 'Project Admins',
              type: 'text',
              before: whatToForcePush.admin,
              after: data.admin,
              noSpaces: true,
              pattern: '[^s]+'
            })
          }
          // If the completion_amount state doesn't match, open the conflict resolution modal
          if (whatToForcePush.completion_amount !== data.completion_amount) {
            whatToForcePush.completion_amount = await dispatch('conflicts', {
              title: 'Completion Total',
              type: 'number',
              before: whatToForcePush.completion_amount,
              after: data.completion_amount
            })
          }
          // If the bb_revenue state doesn't match, open the conflict resolution modal
          if (whatToForcePush.bb_revenue !== data.bb_revenue) {
            whatToForcePush.bb_revenue = await dispatch('conflicts', {
              title: 'Before Business Revenue',
              type: 'number',
              before: whatToForcePush.bb_revenue,
              after: data.bb_revenue
            })
          }
          // If the bb_expenses state doesn't match, open the conflict resolution modal
          if (whatToForcePush.bb_expenses !== data.bb_expenses) {
            whatToForcePush.bb_expenses = await dispatch('conflicts', {
              title: 'Before Business Expenses',
              type: 'number',
              before: whatToForcePush.bb_expenses,
              after: data.bb_expenses
            })
          }
          // If the enquiry_date state doesn't match, open the conflict resolution modal
          if (whatToForcePush.enquiry_date !== data.enquiry_date) {
            whatToForcePush.enquiry_date = await dispatch('conflicts', {
              title: 'Date of Enquiry',
              type: 'date',
              before: whatToForcePush.enquiry_date,
              after: data.enquiry_date
            })
          }
          // If the start_date state doesn't match, open the conflict resolution modal
          if (whatToForcePush.start_date !== data.start_date) {
            whatToForcePush.start_date = await dispatch('conflicts', {
              title: 'Date of Project Start',
              type: 'date',
              before: whatToForcePush.start_date,
              after: data.start_date
            })
          }
          // If the ongoing state doesn't match, open the conflict resolution modal
          if (whatToForcePush.ongoing !== data.ongoing) {
            whatToForcePush.ongoing = await dispatch('conflicts', {
              title: new Date(whatToForcePush.start_date) > new Date() ? 'Is' : 'Was' + 'this an ongoing project?',
              type: 'checkbox',
              before: whatToForcePush.ongoing,
              after: data.ongoing
            })
          }
          // If the completion_date state doesn't match, open the conflict resolution modal
          if (whatToForcePush.completion_date !== data.completion_date) {
            whatToForcePush.completion_date = await dispatch('conflicts', {
              title: 'Date of Project Completion',
              type: 'date',
              before: whatToForcePush.completion_date,
              after: data.completion_date
            })
          }
          // Force push the contact
          const response = await this.$axios.$post('https://api.galexia.agency/projects',
            {
              id: whatToForcePush.id,
              name: whatToForcePush.name,
              status: whatToForcePush.status,
              hosting: whatToForcePush.hosting,
              php: whatToForcePush.php,
              github_url: whatToForcePush.github_url,
              drive_url: whatToForcePush.drive_url,
              project_url: whatToForcePush.project_url,
              project_login_url: whatToForcePush.project_login_url,
              pandle_id: whatToForcePush.pandle_id,
              completion_amount: whatToForcePush.completion_amount,
              bb_revenue: whatToForcePush.bb_revenue,
              bb_expenses: whatToForcePush.bb_expenses,
              viewer: whatToForcePush.viewer,
              contributor: whatToForcePush.contributor,
              admin: whatToForcePush.admin,
              updated_at: whatToForcePush.updated_at,
              enquiry_date: data.enquiry_date,
              start_date: data.start_date,
              ongoing: data.ongoing,
              completion_date: data.completion_date,
              force: true
            },
            {
              headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
              }
            }
          )
          // Don't update lists
          delete response[0].lists
          return await commit('updateProject', response[0])
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
    return await commit('contacts', response)
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
      return await commit('updateContact', response[0])
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
          return await commit('updateContact', response[0])
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
    return await commit('clients', response)
  },
  async updateClient ({ commit, dispatch }, data) {
    let adr = {}
    try {
      adr = JSON.parse(data.address)
      adr = JSON.stringify(data.address)
    } catch (e) {
      adr = JSON.stringify(data.address)
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
    return await dispatch('updateClient', res)
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
    return await dispatch('updateProject', res)
  }
}
