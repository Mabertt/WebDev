<script setup>
import { ref, computed } from 'vue'

definePageMeta({
  title: 'Таблиця'
})

const { data: products, pending, error } = useLazyFetch('/api/products')

const q = ref('')
const page = ref(1)
const pageCount = 10

const sort = ref({
  column: 'title',
  direction: 'asc'
})

const columns = [
  {
    id: 'thumbnail',
    key: 'thumbnail',
    label: 'Фото',
    sortable: false
  },
  {
    id: 'title',
    key: 'title',
    label: 'Назва',
    sortable: true
  },
  {
    id: 'description',
    key: 'description',
    label: 'Опис',
    sortable: true
  },
  {
    id: 'price',
    key: 'price',
    label: 'Ціна',
    sortable: true
  },
  {
    id: 'rating',
    key: 'rating',
    label: 'Оцінка',
    sortable: true
  },
  {
    id: 'brand',
    key: 'brand',
    label: 'Бренд',
    sortable: true
  },
  {
    id: 'category',
    key: 'category',
    label: 'Категорія',
    sortable: true
  }
]

const filteredProducts = computed(() => {
  if (!products.value) return []
  if (!q.value) return products.value
  return products.value.filter((product) => {
    return Object.values(product).some((value) => {
      return String(value).toLowerCase().includes(q.value.toLowerCase())
    })
  })
})

const sortedProducts = computed(() => {
  const data = [...filteredProducts.value]
  const { column, direction } = sort.value

  return data.sort((a, b) => {
    const aVal = a[column]
    const bVal = b[column]

    if (aVal < bVal) return direction === 'asc' ? -1 : 1
    if (aVal > bVal) return direction === 'asc' ? 1 : -1
    return 0
  })
})

const paginatedProducts = computed(() => {
  const start = (page.value - 1) * pageCount
  const end = start + pageCount
  return sortedProducts.value.slice(start, end)
})

const total = computed(() => filteredProducts.value.length)

function getRatingColor(rating) {
  return rating >= 4.5 ? 'text-green-600' : 'text-red-600'
}
</script>

<template>
  <div class="p-8">
    <h1 class="text-2xl font-bold mb-6">Таблиця продуктів</h1>

    <div class="flex gap-4 mb-4">
      <UInput
        v-model="q"
        placeholder="Пошук..."
        icon="i-lucide-search"
        class="w-64"
      />
    </div>

    <div v-if="error" class="text-red-600 mb-4">
      Помилка завантаження: {{ error.message }}
    </div>

    <UTable
      v-model:sort="sort"
      :rows="paginatedProducts"
      :columns="columns"
      :loading="pending"
      sort-mode="manual"
      class="w-full"
    >
      <template #thumbnail-data="{ row }">
        <img
          :src="row.thumbnail"
          alt="Product thumbnail"
          class="w-[100px] h-[100px] object-cover rounded"
        >
      </template>

      <template #rating-data="{ row }">
        <span :class="getRatingColor(row.rating)">
          {{ row.rating }}
        </span>
      </template>

      <template #price-data="{ row }">
        ${{ row.price }}
      </template>
    </UTable>

    <div class="flex justify-center mt-4">
      <UPagination
        v-model:page="page"
        :total="total"
        :items-per-page="pageCount"
        show-edges
      />
    </div>
  </div>
</template>
