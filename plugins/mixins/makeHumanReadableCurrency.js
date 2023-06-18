import Vue from 'vue'

export default function makeHumanReadableCurrency (value) {
  if (parseFloat(value)) {
    return value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  }
  return value
}

Vue.mixin({
  methods: {
    makeHumanReadableCurrency
  }
})
