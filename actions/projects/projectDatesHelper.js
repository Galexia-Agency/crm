import { diffDays } from '~/plugins/mixins/dates'
import { safeURL } from '~/plugins/mixins/urls'

export default {
  projectDatesHelper ({ state, commit, getters }) {
    const projectsToPush = [...state.projects]
    for (const project in projectsToPush) {
      const client = getters.getClientById(projectsToPush[project].client_id)
      projectsToPush[project].client_name = client.business_name
      projectsToPush[project].link = '/client/' + client.business_shortname.toLowerCase() + '#' + safeURL(projectsToPush[project].name)
      projectsToPush[project].daysToStart = 0
      projectsToPush[project].daysToComplete = 0
      projectsToPush[project].daysWithUs = 0
      if (projectsToPush[project].enquiry_date && projectsToPush[project].start_date) {
        projectsToPush[project].daysToStart = diffDays(projectsToPush[project].enquiry_date, projectsToPush[project].start_date)
        if (!projectsToPush[project].ongoing) {
          if (projectsToPush[project].completion_date) {
            projectsToPush[project].daysToComplete = diffDays(projectsToPush[project].start_date, projectsToPush[project].completion_date)
          } else {
            projectsToPush[project].daysToComplete = diffDays(projectsToPush[project].start_date, null) + '+'
          }
        }
        if (projectsToPush[project].status === 'On-Going') {
          projectsToPush[project].daysWithUs = diffDays(projectsToPush[project].start_date, null)
        }
      }
    }
    projectsToPush.sort(function (a, b) {
      const textA = a.client_name.toUpperCase()
      const textB = b.client_name.toUpperCase()
      return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
    })
    return commit('projects', projectsToPush)
  }
}
