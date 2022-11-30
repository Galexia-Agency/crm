<style lang="scss">
  .netdata {
    width: 100%;
    iframe {
      min-height: 200px;
      margin: 1rem 0
    }
    a {
      display: block;
      text-align: center
    }
  }
</style>
<template>
  <main>
    <div class="netdata">
      <h2>
        Digital Ocean Server Overview
      </h2>
      <iframe src="https://netdata.galexia.agency/bos-dashboard.html" width="100%" />
      <a href="https://netdata.galexia.agency/" target="_blank">View full stats here</a>
    </div>
  </main>
</template>

<script>
export default {
  name: 'NetData',
  mounted () {
    this.$el.querySelector('.netdata iframe').addEventListener('DOMContentLoaded', this.updateIframeHeight)
    window.addEventListener('resize', this.updateIframeHeight)
    window.addEventListener('orientationchange', this.updateIframeHeight)
    screen.orientation.addEventListener('change', this.updateIframeHeight)
  },
  methods: {
    updateIframeHeight () {
      // NEED TO DEBOUNCE
      this.$el.querySelector('.netdata iframe').style.height = this.$el.querySelector('.netdata iframe').contentWindow.document.body.offsetHeight + 'px'
    }
  }
}
</script>
