import Vue from 'vue'

Vue.mixin({
  methods: {
    validURL (str) {
      const pattern = new RegExp(/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/)
      return !!pattern.test(str)
    },
    formatURL (str) {
      try {
        const url = new URL(str)
        return url.host
      } catch (e) {
        return str
      }
    }
  }
})
