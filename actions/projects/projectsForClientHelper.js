export default {
  projectsForClientHelper ({ state, commit }) {
    // Loop through all clients
    state.clients.forEach((client) => {
      // Get the project ids of each project associated with the client
      let projectIds = state.projects.filter((project) => project.client_id === client.id).map((project) => {
        return project.id
      })
      // Combine the current project ids (if they've already been set), with those from the database. Set creates an array of unique values
      if (Array.isArray(client.projects)) {
        projectIds = [...new Set([...client.projects, ...projectIds])]
      }
      commit('updateClient', {
        ...client,
        projects: projectIds
      })
    })
  }
}
