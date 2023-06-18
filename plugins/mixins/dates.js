import Vue from 'vue'

export function daysRemaining (upcomingDate) {
  const ONE_DAY = 1000 * 60 * 60 * 24
  const differenceMs = (new Date() - upcomingDate + 1) * -1
  const days = Math.round(differenceMs / ONE_DAY)
  if (days > 0) {
    return `${days + 1} days left`
  } else if (days === -1) {
    return 'Due today'
  } else if (days === 0) {
    return '1 day left'
  } else {
    return `${Math.abs(days)} days overdue`
  }
}

export function diffDays (startDate, endDate) {
  let diffTime
  if (!endDate) {
    diffTime = Math.abs(new Date(startDate) - new Date())
  } else {
    diffTime = Math.abs(new Date(startDate) - new Date(endDate))
  }
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24))
}

export function humanReadableDate (date) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

Vue.mixin({
  methods: {
    daysRemaining,
    diffDays,
    humanReadableDate
  }
})
