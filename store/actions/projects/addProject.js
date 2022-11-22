export default {
  async addProject ({ commit }, data) {
    const response = await this.$axios.$put('https://api.galexia.agency/projects',
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
    response.forEach((project, index) => {
      if (project.lists) {
        response[index].lists = JSON.parse(project.lists)
      }
    })
    commit('projects', response)
    return response
  }
}
