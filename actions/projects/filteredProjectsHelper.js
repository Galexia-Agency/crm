export default {
  filteredProjectsHelper ({ state, commit }) {
    const filteredProjects = {
      'Hot Lead': [],
      'Cold Lead': [],
      Development: [],
      Paused: [],
      'In House': [],
      'On-Going': [],
      'Closed Lead': [],
      Completed: [],
      Cancelled: [],
      Other: []
    }
    state.clients.forEach((client) => {
      state.projects.forEach((project) => {
        if (project.client_id === client.id && project.status && filteredProjects[project.status]) {
          filteredProjects[project.status].push(project)
        }
      })
      if (
        filteredProjects['Hot Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['Cold Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Development.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Paused.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['In House'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['On-Going'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects['Closed Lead'].find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Completed.find((e) => e.client_id === client.id) === undefined &&
        filteredProjects.Cancelled.find((e) => e.client_id === client.id) === undefined &&
        state.claims.groups.includes('admin')
      ) {
        filteredProjects.Other.push(client)
      }
    })
    return commit('filteredProjects', filteredProjects)
  }
}
