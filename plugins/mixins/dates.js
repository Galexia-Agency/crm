import Vue from 'vue'

Vue.mixin({
  methods: {
    daysRemaining (upcomingDate) {
      const ONE_DAY = 1000 * 60 * 60 * 24
      const differenceMs = Math.abs(new Date() - upcomingDate + 1)
      const days = Math.round(differenceMs / ONE_DAY)
      if (days === 1) {
        return days + ' days left'
      } else {
        return days + ' day left'
      }
    }
  }
})
