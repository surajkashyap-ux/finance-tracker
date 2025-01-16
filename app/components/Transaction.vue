<template>
  <div class="grid grid-cols-3 py-4 border-b border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-100">
    <div class="flex items-center justify-between space-x-4 col-span-2">
      <div class="flex items-center gap-2">
        <UIcon :name="icon" :class="[iconColor]"/>
        <div>{{ transaction.description }}</div>
      </div>
      <div v-if="transaction.category">
        <UBadge color="white">{{ transaction.category }}</UBadge>
      </div>
    </div>
    <div class="flex items-center justify-end gap-2">
      <div>{{ currency }}</div>
      <div>
        <UDropdown :items="items" :popper="{placement: 'bottom-start'}">
          <UButton color="white" variant="ghost" trailing-icon="i-heroicons-ellipsis-horizontal" :loading="isLoading"/>
          <TransactionModal v-model="isOpen" :transaction="transaction" @saved="emit('edited')" />
        </UDropdown>
      </div>
    </div>
  </div>

</template>

<script setup>
const { transaction } = defineProps({
  transaction: Object
})

const emit = defineEmits(['deleted', 'edited'])

const isOpen = ref(false)

// proprietà calcolate in base al tipo di transazione
const isIncome = computed(() => transaction.type.toLowerCase() ===  'income')
const icon = computed(() => isIncome.value ? 'i-heroicons-arrow-up-right' : 'i-heroicons-arrow-down-left')
const iconColor = computed(() => isIncome.value ? 'text-green-600' : 'text-red-600')

const { currency } = useCurrency(transaction.amount)

// logica per l'eliminazione di una transaction
const isLoading = ref(false)
const { toastSuccess, toastError } = useAppToast()
const supabase = useSupabaseClient()

const deleteTransaction = async () => {
  isLoading.value = true
  
  try {
    await supabase
      .from('transactions')
      .delete()
      .eq('id', transaction.id)
    toastSuccess({ title: 'Transaction deleted' })
    emit('deleted', transaction.id)
  } catch(err) {
    toastError({ title: 'Transaction deleted' })
  } finally {
    isLoading.value = false
  }
}

const items = [
  [
    {
      label: 'Edit',
      icon: 'i-heroicons-pencil-square-20-solid',
      click: () => isOpen.value = true
    },
    {
      label: 'Delete',
      icon: 'i-heroicons-trash-20-solid',
      click: deleteTransaction
    }
  ]
]
</script>