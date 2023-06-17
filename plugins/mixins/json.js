import Vue from 'vue'

export function isJsonString (str) {
  // Check to see if the value is defined
  if (!str) {
    return false
  }
  // Check to see if the value is an array
  if (Array.isArray(str)) {
    return false
  }
  // Try to parse the JSON
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
