import { Bar, mixins } from 'vue-chartjs'
import makeHumanReadableCurrency from '~/plugins/mixins/makeHumanReadableCurrency'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  mounted () {
    this.renderChart(this.chartData, {
      maintainAspectRatio: false,
      scales: {
        yAxes: [{
          ticks: {
            stepSize: 250,
            reverse: false,
            beginAtZero: true
          }
        }]
      },
      legend: {
        display: false
      },
      tooltips: {
        enabled: true,
        mode: 'single',
        callbacks: {
          label (tooltipItems, data) {
            if (parseFloat(tooltipItems.yLabel) > 0) {
              return `£${makeHumanReadableCurrency(tooltipItems.yLabel)}`
            }
            return `-£${makeHumanReadableCurrency(Math.abs(tooltipItems.yLabel))}`
          }
        }
      }
    })
  }
}
