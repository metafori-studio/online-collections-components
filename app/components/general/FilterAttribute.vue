<template>
  <div
    v-if="label"
    class="bg-primary text-white flex items-center py-1 px-3 gap-2 rounded-3xl text-xs"
  >
    <template v-if="['has_image', 'has_iip'].includes(attribute)">
      <span class="font-bold">{{ label }}</span>
    </template>
    <template v-else>
      <span class="font-bold">{{ label }}:</span>
      {{ serializedValue }}
    </template>
  </div>
</template>

<script setup lang="ts">
import { formatAuthor } from '~/utils/formatters'

const props = defineProps<{
  attribute: string
  value: string | string[]
}>()

const { controls } = await useControls()

const label = computed(() => controls[props.attribute].label)

const serializedValue = computed(() => {
  let values = props.value
  values = Array.isArray(values) ? values : [values]

  if (props.attribute === 'author') {
    values = values.map(author => formatAuthor(author))
  }

  return values.join(', ')
})
</script>
