export default {
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
  }
}
