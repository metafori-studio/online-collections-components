<template>
  <div class="flex gap-2 cursor-pointer items-center">
    <input
      :id="name"
      v-model="internalModel"
      type="checkbox"
      class="text-primary p-3 focus:ring-0"
    >

    <label :for="name">{{ label }}</label>
  </div>
</template>

<script setup lang="ts">

const props = withDefaults(
  defineProps<{
    name: string
    label: string
    default?: boolean
  }>(),
  {
    default: false,
  },
)

const { model } = await useControls()

const internalModel = computed({
  get: () => model[props.name] ?? props.default,
  set: value => model[props.name] = value,
})
</script>
