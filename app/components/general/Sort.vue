<template>
  <div class="border-b-2 border-black">
    <Dropdown
      v-model="model"
      :options="sortOptions"
      @update:model-value="onUpdate"
    >
      <template #label="{ label }">
        {{ t('item.sortBy') }} {{ label }}
      </template>
    </Dropdown>
  </div>
</template>

<script lang="ts" setup>

const { sortBy, sortDirection } = await useControls()
const { t } = useI18n()

const sortOptions = [
  { label: t('item.sortOptions.updatedAt'), value: 'updated_at', direction: 'desc' },
  { label: t('item.sortOptions.createdAt'), value: 'created_at', direction: 'asc' },
  { label: t('item.sortOptions.title'), value: 'title', direction: 'asc' },
  { label: t('item.sortOptions.dateEarliest'), value: 'date_earliest', direction: 'asc' },
  { label: t('item.sortOptions.viewCount'), value: 'view_count', direction: 'desc' },
  { label: t('item.sortOptions.random'), value: 'random', direction: 'asc' },
] as const

const model = ref<(typeof sortOptions)[number]['value']>(
  sortOptions.find(option => option.value === sortBy.value)?.value ?? sortOptions[0].value,
)

const onUpdate = (value: string) => {
  const option = sortOptions.find(option => option.value === value)

  if (option) {
    sortBy.value = option.value
    sortDirection.value = option.direction
  }
}
</script>
