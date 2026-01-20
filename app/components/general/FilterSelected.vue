<template>
  <TransitionExpand>
    <div
      v-if="selectedFilters.length"
      class="flex flex-wrap gap-3 pt-6"
    >
      <div
        v-for="item in selectedFilters"
        :key="`${item?.key}-${item?.value}`"
        class="bg-primary text-white flex items-center py-1 px-3 gap-2 cursor-pointer rounded-3xl"
        @click="controls[item.key].toggle(item.value)"
      >
        <div class="text-xs">
          {{ item.label }}: {{ item?.value }}
        </div>
        <Icon
          name="close"
          class="w-3"
        />
      </div>

      <div class="flex flex-wrap gap-3">
        <div
          v-if="selectedFilters.length"
          class="flex py-1 px-3 gap-2 border-2 border-dark items-center cursor-pointer rounded-3xl"
          @click="resetFilters"
        >
          <Icon
            class="w-4 h-4"
            name="rotate"
          />
          <div class="text-xs">
            {{ t('controls.filter.reset') }}
          </div>
        </div>
      </div>
    </div>
  </TransitionExpand>
</template>

<script setup lang="ts">

const { resetFilters, selectedFilters, controls } = await useControls()
const { t } = useI18n()
</script>
