import ListClass from '../index'
import { addModel, updateModel } from '~/models/reusableModelActions'

export default {
  async add ({ commit, dispatch, rootState }, data) {
    return await addModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ListClass, data, endpoint: 'projects/lists' })
  },
  async update ({ commit, dispatch, rootState }, { list, force }) {
    return await updateModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ListClass, data: list, endpoint: 'projects/lists', force })
  },
  async move ({ dispatch, rootGetters, rootState, commit }, [projectId, fromIndex, toIndex]) {
    const project = { ...rootGetters['client/project/getById'](projectId) }
    const lists = project.lists
    lists.splice(toIndex, 0, lists.splice(fromIndex, 1)[0])

    commit('client/project/update', { data: project, rootState }, { root: true })

    return await dispatch('sync', projectId)
  },
  async archive ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to archive this list?', { root: true }))) {
      return
    }
    commit('archive', { projectId, listId })
    return await dispatch('sync', projectId)
  },
  async unarchive ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to unarchive this list?', { root: true }))) {
      return
    }
    commit('unarchive', { projectId, listId })
    return await dispatch('sync', projectId)
  },
  async remove ({ commit, dispatch }, { projectId, listId }) {
    if (!(await dispatch('confirm/initialise', 'Are you sure you want to delete this list?', { root: true }))) {
      return
    }
    commit('remove', { projectId, listId })
    return await dispatch('sync', projectId)
  }
  // sync ({ commit, state, dispatch, getters, rootState }, projectId) {
  //   // Proceed with pushing the changes to the API
  //   const project = getters['client/project/getById'](projectId)
  //   // Assign the project list from the store to a new variable so we don't mutate state
  //   const projectList = Array.from(project.lists)
  //   if (JSON.stringify(project.lists)) {
  //     try {
  //       const response = await this.$api.post('https://api.galexia.agency/projects/lists',
  //         {
  //           lists: JSON.stringify(projectList),
  //           updated_at: project.updated_at,
  //           id: projectId
  //         },
  //         {
  //           headers: {
  //             Accept: 'application/json',
  //             'Content-Type': 'application/json'
  //           }
  //         }
  //       )
  //       // We update the updated_at time here with what we've fetched from the database so SSE doesn't get confused
  //       const newProject = {}
  //       Object.assign(newProject, project)
  //       newProject.updated_at = response.data[0].updated_at
  //       return commit('client/project/update', { data: newProject, rootState }, { root: true })
  //     } catch (e) {
  //       if (await e.response && await e.response.status === 429 && JSON.parse(e.response.data[0].lists)) {
  //         // Data from the database
  //         const sourceOfTruth = JSON.parse(e.response.data[0].lists)
  //         // What we're going to force push up to the database after having merged our changes with the truth
  //         const whatToForcePush = sourceOfTruth
  //         // If there are any lists
  //         if (projectList.length > 0) {
  //           // Loop through the lists
  //           for (const list of Object.keys(projectList)) {
  //             // If we have a list that is different from the source of truth
  //             if (!sourceOfTruth[list] || projectList[list].id !== sourceOfTruth[list].id) {
  //               // Add our list to what we're going to push up
  //               whatToForcePush.push(projectList[list])
  //             } else {
  //               // If the titles state don't match, open the conflict resolution modal
  //               if (whatToForcePush[list].title !== projectList[list].title) {
  //                 whatToForcePush[list].title = await dispatch('conflicts', {
  //                   title: 'List Title',
  //                   type: 'text',
  //                   before: whatToForcePush[list].title,
  //                   after: projectList[list].title
  //                 })
  //               }
  //               // If the archived state don't match, open the conflict resolution modal
  //               if (whatToForcePush[list].archived !== projectList[list].archived) {
  //                 whatToForcePush[list].archived = await dispatch('conflicts', {
  //                   title: 'List Archived State',
  //                   type: 'checkbox',
  //                   before: whatToForcePush[list].archived,
  //                   after: projectList[list].archived
  //                 })
  //               }
  //             }
  //             // If our list has items
  //             if (projectList[list].items.length > 0) {
  //               // Loop through the items in the list
  //               for (const item of Object.keys(projectList[list].items)) {
  //                 // If our item is not at the source, then add it to our force push
  //                 if (
  //                   sourceOfTruth[list].items.find((sourceItem) => {
  //                     return sourceItem.id === projectList[list].items[item].id
  //                   })
  //                 ) {
  //                   whatToForcePush[list].items.push(projectList[list].items[item])
  //                 } else {
  //                   // If the titles don't match, open the conflict resolution modal
  //                   if (whatToForcePush[list].items[item].title !== projectList[list].items[item].title) {
  //                     whatToForcePush[list].items[item].title = await dispatch('conflicts', {
  //                       title: 'Card Title',
  //                       type: 'text',
  //                       before: whatToForcePush[list].items[item].title,
  //                       after: projectList[list].items[item].title,
  //                       required: true
  //                     })
  //                   }
  //                   // If the dates don't match, open the conflict resolution modal
  //                   if (whatToForcePush[list].items[item].date !== projectList[list].items[item].date) {
  //                     whatToForcePush[list].items[item].date = await dispatch('conflicts', {
  //                       title: 'Card Due Date',
  //                       type: 'date',
  //                       before: whatToForcePush[list].items[item].date,
  //                       after: projectList[list].items[item].date
  //                     })
  //                   }
  //                   // If the assignees don't match, open the conflict resolution modal
  //                   if (whatToForcePush[list].items[item].assignee !== projectList[list].items[item].assignee) {
  //                     whatToForcePush[list].items[item].assignee = await dispatch('conflicts', {
  //                       title: 'Card Assignee',
  //                       type: 'text',
  //                       before: whatToForcePush[list].items[item].assignee,
  //                       after: projectList[list].items[item].assignee
  //                     })
  //                   }
  //                   // If the archived states don't match, open the conflict resolution modal
  //                   if (whatToForcePush[list].items[item].archived !== projectList[list].items[item].archived) {
  //                     whatToForcePush[list].items[item].archived = await dispatch('conflicts', {
  //                       title: 'Card Archived State',
  //                       type: 'checkbox',
  //                       before: whatToForcePush[list].items[item].archived,
  //                       after: projectList[list].items[item].archived
  //                     })
  //                   }
  //                   // If the descriptions don't match, open the conflict resolution modal
  //                   if (whatToForcePush[list].items[item].description !== projectList[list].items[item].description) {
  //                     whatToForcePush[list].items[item].description = await dispatch('conflicts', {
  //                       title: 'Card Description',
  //                       type: 'editor',
  //                       before: whatToForcePush[list].items[item].description,
  //                       after: projectList[list].items[item].description
  //                     })
  //                   }
  //                   whatToForcePush[list].items[item].updatedBy = 'System'
  //                   whatToForcePush[list].items[item].updatedDate = Date.now()
  //                 }
  //               }
  //             }
  //           }
  //         }
  //         // Force push the lists as all conflicts have been resolved
  //         const response = await this.$api.post('https://api.galexia.agency/projects/lists',
  //           {
  //             lists: JSON.stringify(whatToForcePush),
  //             id: projectId,
  //             force: true
  //           },
  //           {
  //             headers: {
  //               Accept: 'application/json',
  //               'Content-Type': 'application/json'
  //             }
  //           }
  //         )
  //         const updatedProject = response.data[0]
  //         updatedProject.lists = JSON.parse(updatedProject.lists)
  //         return commit('client/project/update', { data: response.data[0], rootState }, { root: true })
  //       }
  //     }
  //   }
  // }
}
