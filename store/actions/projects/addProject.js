export default {
  async addProject ({ commit }, data) {
    data.completion_amount = parseFloat(data.completion_amount).toFixed(2)
    data.bb_revenue = parseFloat(data.bb_revenue).toFixed(2)
    data.bb_expenses = parseFloat(data.bb_expenses).toFixed(2)
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
