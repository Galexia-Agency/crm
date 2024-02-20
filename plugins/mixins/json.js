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

export function flattenObject (object, prefix = '') {
  const flattened = {}

  for (const key in object) {
    const value = object[key]
    const flattenedKey = prefix ? `${prefix}.${key}` : key

    if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
      const nestedFlattened = flattenObject(value, flattenedKey)
      Object.assign(flattened, nestedFlattened)
    } else {
      flattened[flattenedKey] = value
    }
  }

  return flattened
}

export function unflattenObject (object) {
  const result = {}

  for (const key in object) {
    const value = object[key]
    const keys = key.split('.')

    let nestedObject = result
    for (let i = 0; i < keys.length - 1; i++) {
      const nestedKey = keys[i]
      if (!nestedObject[nestedKey] || typeof nestedObject[nestedKey] !== 'object') {
        nestedObject[nestedKey] = {}
      }
      nestedObject = nestedObject[nestedKey]
    }

    nestedObject[keys[keys.length - 1]] = value
  }

  return result
}

Vue.mixin({
  methods: {
    isJsonString,
    flattenObject,
    unflattenObject
  }
})
