import Vue from 'vue'

export function isJsonString (str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}

Vue.mixin({
  methods: {
    isJsonString
  }
})
