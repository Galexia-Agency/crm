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
  updateProjectList ({ commit, state, dispatch, getters }, projectId) {
    // Add the projectId to the queue
    LIST_REQUESTS.push(projectId)
    // Wait 1 second before executing
    window.setTimeout(async () => {
      // If there is a pending request for this projectId, then proceed
      if (LIST_REQUESTS.includes(projectId)) {
        // Remove the projectId from the array, this project has been updated
        removeItem(LIST_REQUESTS, projectId)
        // Proceed with pushing the changes to the API
        const project = getters.getProjectById(projectId)
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
                        if (
                          sourceOfTruth[list].items.find((sourceItem) => {
                            return sourceItem.id === projectList[list].items[item].id
                          })
                        ) {
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
                error.description = e
                error.data = projectList
                return commit('error', error)
              }
            } else {
              const error = {}
              error.active = true
              error.description = e
              error.data = projectList
              return commit('error', error)
            }
          }
        } else {
          const error = {}
          error.active = true
          error.description = 'Cannot stringify data'
          error.data = projectList
          commit('error', error)
        }
      }
    }, 1000)
  }
}
