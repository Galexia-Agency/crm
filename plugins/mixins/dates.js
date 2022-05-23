import Vue from 'vue'

Vue.mixin({
  methods: {
    daysRemaining (upcomingDate) {
      const ONE_DAY = 1000 * 60 * 60 * 24
      const differenceMs = (new Date() - upcomingDate + 1) * -1
      const days = Math.round(differenceMs / ONE_DAY)
      if (days === 1) {
        return days + ' day left'
      } else if (days > 0) {
        return days + ' days left'
      } else if (days === -1) {
        return Math.abs(days) + ' day overdue'
      } else {
        return Math.abs(days) + ' days overdue'
      }
    }
  }
})
