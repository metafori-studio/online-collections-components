<template>
  <div class="flex flex-col gap-3 serif">
    <Search v-model="searchString" />
    <div
      v-for="option in sortedOptions"
      :key="option.value"
      class="flex items-center gap-2 cursor-pointer"
      @click="onToggle(option.value)"
    >
      <div
        class="text-primary w-6 h-6 border flex items-center transition-all"
        :class="{ 'bg-primary-light border-primary': internalModel.includes(option.value) }"
      >
        <Icon
          v-if="internalModel.includes(option.value)"
          class="text-primary w-8 h-8"
          name="check"
        />
      </div>
      <div>
        {{ option.label }} <span class="font-sans font-bold">({{ option.count }})</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">

const props = defineProps<{
  name: string
  label: string
  default?: string[]
}>()

const { model, options } = await useControls()
const searchString = ref('')

const internalModel = computed<string[]>({
  get: () => model[props.name] ?? [],
  set: value => (model[props.name] = value),
})

const onToggle = (value: string) => {
  if (internalModel.value.includes(value)) {
    internalModel.value = internalModel.value.filter(v => v !== value)
  }
  else {
    internalModel.value = [...internalModel.value, value]
  }
}

const sortedOptions = computed(() => {
  const o = options.value?.[props.name]?.map((l: any) => ({
    label: l.value,
    value: l.value,
    count: l.count,
  }))

  if (!o) {
    return []
  }

  if (!searchString.value) {
    return o
  }

  function removeAccents(string: string): string {
    return string
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
  }

  return o.filter((l: any) => removeAccents(l.label).includes(removeAccents(searchString.value)))
})
</script>
