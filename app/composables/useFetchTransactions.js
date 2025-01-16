export const useFetchTransactions = (period) => {
  const supabase = useSupabaseClient()
  const transactions = ref([])
  const pending = ref(false)

  const fetchTransactions = async () => {
    pending.value = true
    try {
      const { data } = await useAsyncData(`transactions-${period.value.from.toDateString()}-${period.value.to.toDateString()}`, async () => {
        const { data, error } = await supabase
          .from('transactions')
          .select()
          .gte('created_at', period.value.from.toISOString())
          .lte('created_at', period.value.to.toISOString())
          .order('created_at', { ascending: false })
      
          if (error) {
            console.error("Error fetching transactions:", error.message)
            return []
          }
          return data
      }) 
      return data.value || []
      
    } catch(err) {
      console.error("An error occurred:", err.message)
      return []
    } finally {
      pending.value = false
    }
  }

  const refresh = async () => transactions.value = await fetchTransactions()
  watch(period, async () => await refresh())

  const income = computed(
    () => transactions.value.filter((t) => t.type === 'Income')
  )
  
  const expence = computed(
    () => transactions.value.filter((t) => t.type === 'Expense')
  )
  
  
  const incomeCount = computed(() => income.value.length)
  const expenseCount = computed(() => expence.value.length)
  
  const incomeTotal = computed(
    () => income.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )
  
  const expenseTotal = computed(
    () => expence.value.reduce((sum, transaction) => sum + transaction.amount, 0)
  )

  const transactionsGroupByDate = computed(() => {
    let grouped = {}
  
    if(transactions.length !== 0) {
      for(const transaction of transactions.value) {
        const date = transaction.created_at.split('T')[0]
  
        if(!grouped[date]) {
          grouped[date] = []
        }
  
        grouped[date].push(transaction)
      }
    }
  
    return grouped
  })

  return {
    transactions: {
      all: transactions,
      grouped: {
        byDate: transactionsGroupByDate
      },
      income,
      expence,
      incomeTotal,
      expenseTotal,
      incomeCount,
      expenseCount
    },
    refresh,
    pending
  }
}

  /**
   * Metodo front-end side per ordinare 
   * le transaction per data dalla più recente
   * 
   * const sortedKeys = Object.keys(grouped).sort().reverse()
   * const sortedGroup = {}
   * 
   * for(const key of sortedKeys) {
   *  sortedGrouped[key] = groped[key]
   * }
   * 
   * return sortedGroup
   */