<template>
  <div
    class="flex bg-white border border-dark gap-3 px-3"
    :class="css"
  >
    <Icon
      v-if="prependIcon"
      name="search"
      class="w-5 mr-2"
    />
    <input
      v-bind="attrs"
      v-model="model"
      :placeholder="t('controls.search.placeholder')"
      class="w-full focus:ring-0 px-0 border-none"
    >
    <Icon
      v-if="!prependIcon"
      name="search"
      class="w-5"
    />
  </div>
</template>

<script setup lang="ts">

withDefaults(
  defineProps<{
    prependIcon?: boolean
    css?: string
  }>(),
  {
    prependIcon: false,
  },
)

const model = defineModel<string>({
  default: '',
})

const attrs = useAttrs()
const { t } = useI18n()
</script>
