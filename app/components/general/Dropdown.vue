<template>
  <VMenu
    :triggers="['click']"
    :shown="isOpen"
    :distance="6"
    placement="bottom-start"
    :aria-id="id"
    @show="isOpen = true"
    @hide="isOpen = false"
  >
    <div
      class="flex transition-all gap-3 cursor-pointer"
      :class="{ 'border-dark': isOpen, 'border-white': !isOpen }"
    >
      <div class="grow">
        <slot
          name="label"
          :label="label"
        >
          {{ label }}
        </slot>
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
        class="bg-white border-2 border-dark flex flex-col gap-3 p-4 serif overflow-y-scroll max-h-[430px] max-w-[340px]"
      >
        <div
          v-for="option in options"
          :key="option.value"
          class="flex items-center gap-2 cursor-pointer"
          @click="onSelect(option.value)"
        >
          <div>{{ option.label }}</div>
        </div>
      </div>
    </template>
  </VMenu>
</template>

<script setup lang="ts">

const props = defineProps<{
  default?: string
  options: { label: string, value: string }[]
}>()

const id = useId()

const model = defineModel<string>({
  default: '',
})

onMounted(() => {
  if (props.default) {
    model.value = props.default
  }
})

const isOpen = ref(false)

const label = computed(() => props.options.find(option => option.value === model.value)?.label)

function onSelect(value: string) {
  model.value = value
  isOpen.value = false
}
</script>
