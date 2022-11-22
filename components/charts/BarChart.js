import { Bar, mixins } from 'vue-chartjs'
const { reactiveProp } = mixins

export default {
  extends: Bar,
  mixins: [reactiveProp],
  props: ['options'],
  mounted () {
    this.renderChart(this.chartData, {
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
              return '£' + parseFloat(tooltipItems.yLabel).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            } else {
              return '-£' + Math.abs(parseFloat(tooltipItems.yLabel).toFixed(2)).replace(/\B(?=(\d{3})+(?!\d))/g, ',')
            }
          }
        }
      }
    })
  }
}
