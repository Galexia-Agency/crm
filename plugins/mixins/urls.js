import Vue from 'vue'

export function validURL (str) {
  const pattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)
  return !!pattern.test(str)
}

export function formatURL (str) {
  try {
    const url = new URL(str)
    return url.host
  } catch (e) {
    return str
  }
}

export function safeURL (str) {
  return encodeURIComponent(str.replaceAll(' ', '-').toLowerCase())
}

Vue.mixin({
  methods: {
    validURL,
    formatURL,
    safeURL
  }
})
