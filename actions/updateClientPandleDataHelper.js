export default {
  updateClientPandleDataHelper ({ commit, state, getters }) {
    const clientsToPush = [...state.clients]
    for (const client in clientsToPush) {
      // Set default values
      clientsToPush[client].expenses = 0
      clientsToPush[client].revenue = 0
      clientsToPush[client].profit = 0
      clientsToPush[client].completion_amount = 0
      const projects = []
      getters.getProjectsForClient(clientsToPush[client]).forEach((projectId) => {
        projects.push(getters.getProjectById(projectId))
      })
      if (projects.length > 0) {
        for (const project in projects) {
          // Set client expenses
          if (projects[project].bb_expenses) {
            clientsToPush[client].expenses += parseFloat(projects[project].bb_expenses)
          }
          if (projects[project].pandle_expenses) {
            clientsToPush[client].expenses += Math.abs(parseFloat(projects[project].pandle_expenses))
          }
          // Set client revenue
          if (projects[project].bb_revenue) {
            clientsToPush[client].revenue += parseFloat(projects[project].bb_revenue)
          }
          if (projects[project].pandle_income) {
            clientsToPush[client].revenue += parseFloat(projects[project].pandle_income)
          }
          // Set client completion amount
          if (projects[project].completion_amount !== null) {
            clientsToPush[client].completion_amount += parseFloat(projects[project].completion_amount)
          }
        }
      }
      // Set client profit
      if (clientsToPush[client].revenue !== undefined && clientsToPush[client].expenses !== undefined) {
        clientsToPush[client].profit = parseFloat(clientsToPush[client].revenue) - parseFloat(clientsToPush[client].expenses)
        if (clientsToPush[client].profit > 0) {
          clientsToPush[client].profit_margin = (clientsToPush[client].profit / clientsToPush[client].revenue) * 100
        } else {
          clientsToPush[client].profit_margin = 0
        }
      }
    }
    return commit('clients', clientsToPush)
  }
}
