<template>
  <VDropdown
    class="shrink-0"
    :disabled="isDisabled"
    :distance="6"
    placement="bottom-start"
    :aria-id="name"
    @show="isOpen = true"
    @hide="isOpen = false"
  >
    <div
      class="wu-dropdown flex transition-all gap-3 py-2 md:py-3 px-3 md:px-4  serif  cursor-pointer"
      :class="cssClasses"
    >
      <div class="grow font-serif">
        {{ label }}
        <span
          v-if="internalModel.length"
          class="font-bold"
        >({{ internalModel.length }})</span>
        <span
          v-if="model.length"
          class="font-sans font-bold"
        >({{ model.length }})</span>
      </div>
      <div
        :class="{ 'rotate-180 text-primary': isOpen }"
        class="transition-all duration-300 ease-out flex"
      >
        <Icon
          name="arrow"
          class="w-3"
        />
      </div>
    </div>

    <template #popper>
      <div
        class="bg-white border-2 border-dark flex flex-col p-3 serif overflow-y-scroll max-h-[430px] max-w-[340px]"
      >
        <Search
          v-model="searchString"
          css="m-3 p-0"
        />

        <div
          v-if="sortedOptions.length"
          v-for="option in sortedOptions"
          :key="option.value"
          class="wu-dropdown-item flex items-center py-1.5 px-3 gap-2 cursor-pointer"
          @click="onToggle(option.value)"
        >
          <div
            class="wu-check text-primary w-6 h-6 border flex items-center"
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
        <div v-else class="py-1.5 px-3">
          {{ $t('controls.select.noResults') }}
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">

const props = defineProps<{
  name: string
  label: string
  default?: string[]
}>()

const { model, options } = await useControls()

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

const isOpen = ref(false)
const searchString = ref('')

const cssClasses = computed(() => ({
  'is--active': internalModel.value.length,
  'is--disabled': isDisabled.value,
  'is--open': isOpen.value,
}))

const isDisabled = computed(() => !options.value?.[props.name]?.length)

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
