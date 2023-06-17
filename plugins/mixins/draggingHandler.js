import Vue from 'vue'

function vibrate (num) {
  if ('vibrate' in navigator) {
    window.navigator.vibrate(num)
  }
}

function dragStartHandler () {
  vibrate(200)
  this.$store.commit('updateDragScroll', false)
}

function dragEndHandler () {
  vibrate(300)
  this.$store.commit('updateDragScroll', true)
}

Vue.mixin({
  methods: {
    dragStartHandler,
    dragEndHandler
  }
})
