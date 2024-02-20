import ProjectClass from '../index'
import { safeURL } from '~/plugins/mixins/urls'
import { addModel, updateModel } from '~/models/reusableModelActions'

export default {
  async add ({ commit, dispatch, rootState }, data) {
    return await addModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ProjectClass, data, endpoint: 'projects' })
  },
  async update ({ commit, dispatch, rootState }, { project, force }) {
    delete project.lists
    return await updateModel({ axios: this.$axios, commit, dispatch, rootState, ClassType: ProjectClass, data: project, endpoint: 'projects', force })
  },
  async moveProject ({ dispatch, getters }, [clientId, fromIndex, toIndex]) {
    const client = getters['client/getById'](clientId)
    const updatedClient = { ...client }
    const projects = getters.getForClient(client)
    projects.splice(toIndex, 0, projects.splice(fromIndex, 1)[0])
    updatedClient.projects = projects
    return await dispatch('client/update', { client: updatedClient }, { root: true })
  },
  async addToPandle ({ dispatch, commit, rootState }, project) {
    const dateObj = new Date()
    const month = dateObj.getUTCMonth() + 1
    const day = dateObj.getUTCDate()
    const year = dateObj.getUTCFullYear()

    const pandle = await this.$axios.$post(`${window.location.origin}/.netlify/functions/pandle_request`, {
      type: 'POST',
      url: `/companies/${this.$config.PANDLE_COMPANY_ID}/projects`,
      body: {
        project: {
          name: `${project.client_name}-${safeURL(project.name)}`,
          status: 'Open',
          date_started: `${day}/${month}/${year}`
        }
      }
    })
    const data = { ...project }
    data.pandle_id = pandle.data.id
    commit('update', { data, rootState })
    return await dispatch('update', { project: data, force: true })
  }
}
