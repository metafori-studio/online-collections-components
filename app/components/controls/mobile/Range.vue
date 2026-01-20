<template>
  <div class="flex flex-col gap-3 mx-3 serif max-h-[430px]">
    <Slider
      v-model="sliderModel"
      v-bind="{ ...sliderOptions }"
    />
    <div
      class="flex"
    >
      <input
        v-model="sliderModel[0]"
        class="w-[50%] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        pattern="-?\d*"
      >
      <input
        v-model="sliderModel[1]"
        class="w-[50%] text-right [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        type="number"
        pattern="-?\d*"
      >
    </div>
  </div>
</template>

<script setup lang="ts">
import Slider from '@vueform/slider'

import '@vueform/slider/themes/default.css'

const props = defineProps<{
  name: string
  label: string
  default?: string[]
  extra: {
    rangeKeys: { min: string, max: string }
  }
}>()

const { model, options } = await useControls()
const keyMin = props.extra.rangeKeys.min
const keyMax = props.extra.rangeKeys.max

const sliderModel = computed({
  get: () => [
    model[props.name].min ?? options.value?.[keyMin],
    model[props.name].max ?? options.value?.[keyMax],
  ],
  set: (value) => {
    model[props.name] = {
      min: value[0]!,
      max: value[1]!,
    }
  },
})

const sliderOptions = computed(() => ({
  lazy: true,
  min: options.value?.[keyMin],
  max: options.value?.[keyMax],
  tooltips: false,
}))
</script>
