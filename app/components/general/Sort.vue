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
import Dropdown from '~/components/general/Dropdown.vue'
import { useControls } from '~/composables/controls'

const { sortBy, sortDirection, sortOptions } = await useControls()
const { t } = useI18n()

const model = ref<string>(
  sortOptions.value.find(option => option.value === sortBy.value)?.value ?? sortOptions.value[0]!.value,
)

const onUpdate = (value: string) => {
  const option = sortOptions.value.find(option => option.value === value)

  if (option) {
    sortBy.value = option.value
    sortDirection.value = option.direction
  }
}
</script>
