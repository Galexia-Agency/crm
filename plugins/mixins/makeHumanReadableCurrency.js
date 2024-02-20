import Vue from 'vue'

export default function makeHumanReadableCurrency (value) {
  if (parseFloat(value) + 1) {
    return parseFloat(value).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return value
}

Vue.mixin({
  methods: {
    makeHumanReadableCurrency
  }
})
