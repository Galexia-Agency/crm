import Vue from 'vue'

Vue.mixin({
  methods: {
    validate () {
      this.$validator
        .validate()
        .then((state) => {
          if (state) {
            return this.submit()
          }
          this.message = 'Please complete the required fields!'
        })
    },
    getError (name) {
      if (this.errors) {
        return (this.errors.first(name) || '').replace(/The .+ field/, 'This field')
      } else {
        return null
      }
    }
  }
})
