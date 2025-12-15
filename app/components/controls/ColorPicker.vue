<template>
  <VDropdown
    class="shrink-0"
    :distance="6"
    placement="bottom-start"
    :aria-id="name"
    @show="isOpen = true"
    @hide="isOpen = false"
  >
    <div
      class="wu-dropdown flex transition-all gap-3 py-2 md:py-3 px-3 md:px-4 serif cursor-pointer"
      :class="cssClasses"
    >
      <div class="grow flex items-center gap-2">
        {{ label }}
        <div
          v-if="selectedColor"
          class="flex gap-1 items-center"
        >
          <div
            class="w-4 h-4 border-2 border-gray-300"
            :style="getSwatchStyle(selectedColor.value)"
          />
          <span class="font-bold">{{ selectedColor.label }}</span>
        </div>
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
      <div class="bg-white border-2 border-dark flex flex-col p-4">
        <div class="flex flex-col gap-3">
          <div
            v-for="color in colors"
            :key="color.value ?? ''"
            class="cursor-pointer flex items-center gap-2"
            @click="onToggle(color.value ?? '')"
          >
            <div
              class="w-6 h-6 border-2 border-gray-300"
              :style="getSwatchStyle(color.value)"
            />
            <div class="text-xs">
              {{ color.label }}
            </div>
          </div>
        </div>
      </div>
    </template>
  </VDropdown>
</template>

<script setup lang="ts">
import Icon from '~/components/general/Icon.vue'
import { useControls } from '~/composables/controls'

const props = defineProps<{
  name: string
  label: string
  default?: string
}>()

const { model } = await useControls()

const colors = [
  { label: 'Bílá', value: 'FFFFFF' },
  { label: 'Černá', value: '000000' },
  { label: 'Modrá', value: '0000FF' },
  { label: 'Červená', value: 'FF0000' },
  { label: 'Zelená', value: '00FF00' },
  { label: 'Všetky', value: null },
]

const getSwatchStyle = (value: string | null) => {
  if (!value) {
    return {
      backgroundImage: 'linear-gradient(45deg, rgb(255,0,0), rgba(255,255,0), rgba(0,255,0)',
    }
  }
  return {
    backgroundColor: `#${value}`,
  }
}

const internalModel = computed<string>({
  get: () => model[props.name] ?? '',
  set: value => (model[props.name] = value),
})

const onToggle = (value: string) => {
  if (internalModel.value === value) {
    internalModel.value = ''
  }
  else {
    internalModel.value = value
  }
}

const isOpen = ref(false)

const selectedColor = computed(() => {
  return colors.find(color => internalModel.value === color.value)
})

const cssClasses = computed(() => ({
  'is--active': !!internalModel.value,
  'is--open': isOpen.value,
}))
</script>
