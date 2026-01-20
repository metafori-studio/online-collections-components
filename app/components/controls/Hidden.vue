<template>
  <input
    v-model="internalModel"
    type="hidden"
  >
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    name: string
    default?: string
  }>(),
  {
    default: '',
  },
)

const { model } = await useControls()

const internalModel = computed({
  get: () => model[props.name] ?? props.default,
  set: value => model[props.name] = value,
})
</script>
