<template>
  <div>
    <div class="font-bold" :class="[color]">{{ props.title }}</div>

    <div class="text-2xl font-extrabold text-black dark:text-white mb-2">
      <USkeleton class="h-8 w-full" v-if="props.loading"/>
      <div v-else>{{ currency }}</div>
    </div>
    <div>
      <USkeleton class="h-6 w-full" v-if="props.loading" />
      <div v-else class="flex space-x-1 items-center text-sm">
        <UIcon :name="icon" class="w-6 h-6" :class="color"/>
        <div class="text-gray-500 dark.text-gray-400">
          {{ percentageTrend }} vs last period
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: String,
  amount: Number,
  lastAmount: Number,
  loading: Boolean
})

const { amount } = toRefs(props)

const trendingUp = computed(() => amount >= props.lastAmount)

//Icona calcolata in base al trend
const icon = computed(() => trendingUp.value ? 'i-heroicons-arrow-trending-up' : 'i-heroicons-arrow-trending-down')

//Colore calcolato in base al tren
const color = computed(() => trendingUp.value ? 'green' : 'red')

//Percentuale in discesa / salita in base agli amount
const percentageTrend = computed(() => {
  if (props.amount === 0 || props.lastAmount === 0) return '∞%'

  const bigger = Math.max(props.amount, props.lastAmount)
  const lower = Math.min(props.amount, props.lastAmount)

  const ratio = ((bigger - lower) / lower) * 100

  return `${Math.ceil(ratio)}%`
})

const { currency } = useCurrency(amount)
</script>

<style scoped>
.green {
  @apply text-green-600 dark:text-green-400
}
.red {
  @apply text-red-600 dark:text-red-400
}
</style>