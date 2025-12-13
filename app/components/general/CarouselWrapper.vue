<template>
  <div>
    <ModuleCarousel
      ref="carousel"
      v-model="index"
      :items-to-show="itemsToShow"
      snap-align="start"
      :mouse-drag="false"
    >
      <ModuleSlide
        v-for="(item, i) in items"
        :key="i"
        @click="click"
      >
        <component :is="item" />
      </ModuleSlide>
      <template
        v-if="items.length > 1"
        #addons
      >
        <ModulePagination />

        <transition-fade>
          <div
            v-if="index > 0"
            class="flex items-center justify-center absolute top-[-56px] left-auto right-[50px] md:right-auto md:left-0 md:top-[50%] rounded-full w-8 h-8 !bg-gray-400"
            @click="carousel.prev()"
          >
            <Icon
              name="arrow-left"
              class="w-3 h-3"
            />
          </div>
        </transition-fade>
        <div
          v-if="index < items.length - itemsToShow"
          class="flex items-center justify-center absolute top-[-56px] md:top-[50%] right-0 rounded-full w-8 h-8 !bg-gray-400 !rotate-180"
          @click="carousel.next()"
        >
          <Icon
            name="arrow-left"
            class="w-3 h-3"
          />
        </div>
      </template>
    </ModuleCarousel>
  </div>
</template>

<script setup lang="ts">
import Icon from '~/components/general/Icon.vue'
import type { ModuleCarousel } from '#components'

withDefaults(
  defineProps<{
    itemsToShow?: number
  }>(),
  {
    itemsToShow: 1,
  },
)

const index = ref(0)
const carousel = ref<InstanceType<typeof ModuleCarousel> | null>(null)
const slots = useSlots()
const items = computed(() => (slots.default!()[0]?.children || []) as VNode[])
const click = computed(() => items.value[index.value]?.props?.onClick)
</script>
