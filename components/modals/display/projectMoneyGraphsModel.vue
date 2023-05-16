<template>
  <div class="query-form card">
    <h1>Hello</h1>
  </div>
</template>

<script>
export default {
  props: {
    project: {
      type: Object,
      required: true
    }
  },
  computed: {
    income () {
      return JSON.parse(this.project.pandle_expenses_transactions)
    },
    expenses () {
      return JSON.parse(this.project.pandle_income_transactions)
    }
  },
  mounted () {
    // Get the first and last transactions with their month and year
    const firstTransaction = this.income[0]
    const lastTransaction = this.income[this.income.length - 1]
    const firstMonth = new Date(firstTransaction.attributes.date).getMonth()
    const lastMonth = new Date(lastTransaction.attributes.date).getMonth()
    const firstYear = new Date(firstTransaction.attributes.date).getFullYear()
    const lastYear = new Date(lastTransaction.attributes.date).getFullYear()

    // Split the transactions into separate months for their year
    const transactionsByYearAndMonth = {}
    for (let year = firstYear; year <= lastYear; year++) {
      for (let month = 0; month < 12; month++) {
        if (!transactionsByYearAndMonth[year]) {
          transactionsByYearAndMonth[year] = {}
        }
        if (year === firstYear && month < firstMonth) {
          continue
        }
        if (year === lastYear && month > lastMonth) {
          continue
        }
        const transactions = this.bankTransactions.filter((transaction) => {
          const date = new Date(transaction.attributes.date)
          return date.getFullYear() === year && date.getMonth() === month
        })
        transactionsByYearAndMonth[year][month] = transactions
      }
    }

    // Output the transactions for each year and month
    for (let year = firstYear; year <= lastYear; year++) {
      for (let month = 0; month < 12; month++) {
        if (!transactionsByYearAndMonth[year][month]) {
          continue
        }
        const monthName = new Date(`${year}-${month + 1}-01`).toLocaleString('default', { month: 'long' })
        console.log(`Transactions for ${monthName} ${year}:`, transactionsByYearAndMonth[year][month])
      }
    }
  }
}
</script>
