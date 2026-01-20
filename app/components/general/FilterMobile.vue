<template>
  <div
    v-show="width < 768"
    class="flex py-2 w-full justify-center items-center gap-3 text-dark border border-dark"
    @click="onCloseMenu"
  >
    <Icon
      class="w-5 h-5"
      name="filter"
    />
    <span class="uppercase">{{ t('controls.filter.show') }}</span>
  </div>

  <TransitionSlide>
    <div
      v-if="isOpened"
      class="fixed inset-0 top-10 flex flex-col bg-white z-50"
    >
      <div class="flex flex-col h-full">
        <div class="flex p-6">
          <TransitionSlide
            group
            mode="out-in"
            class="grow"
          >
            <div
              v-if="!submenu"
              class="text-lg font-bold"
            >
              {{ t('controls.filter.title') }}
            </div>
            <div
              v-else
              class="flex items-center grow text-lg font-bold"
              @click="submenu = null"
            >
              <Icon
                name="back"
                class="w-4 mr-2"
              />
              <span>{{ submenu.label }}</span>
            </div>
          </TransitionSlide>
          <div
            v-if="hasFilters"
            class="flex py-1 px-3 gap-2 border-2 border-dark items-center cursor-pointer rounded-3xl mr-3"
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
          <Icon
            name="close"
            class="w-4"
            @click="onCloseMenu"
          />
        </div>
        <TransitionSlide
          group
          mode="out-in"
          class="overflow-y-scroll pb-24"
        >
          <div v-if="!submenu">
            <template
              v-for="(item, i) in controls"
              :key="i"
            >
              <div
                v-if="mobileControls.includes(item.type)"
                class="flex items-center px-6 py-4 border-b border-[#CDCDCD]"
                @click="submenu = item"
              >
                <span class="grow">{{ item.label }}
                  <span
                    v-if="model[item.key].length"
                    class="font-bold"
                  >({{ model[item.key].length }})</span>
                </span>
                <Icon
                  name="arrow"
                  class="w-3 -rotate-90"
                />
              </div>
            </template>
            <div class="flex flex-col p-6 py-6 gap-6">
              <template
                v-for="(item, i) in controls"
                :key="i"
              >
                <BooleanComponent
                  v-if="bottomControls.includes(item.type)"
                  :key="item.key"
                  :name="item.key"
                  :label="item.label"
                />
              </template>
            </div>
          </div>
          <div
            v-else
            class="px-6"
          >
            <component
              :is="selectedFilter"
              v-if="selectedFilter && submenu"
              :key="submenu.key"
              :name="submenu.key"
              :label="submenu.label"
              :extra="submenu.extra"
            />
          </div>
        </TransitionSlide>
      </div>
      <div class="flex absolute inset-0 top-auto bg-white justify-center drop-shadow-2xl py-4 px-6">
        <button
          type="button"
          class="uppercase bg-dark text-white w-full py-3"
          @click="onCloseMenu"
        >
          {{ t('controls.filter.submit') }} <span class="font-bold">({{ total }})</span>
        </button>
      </div>
    </div>
  </TransitionSlide>
</template>

<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'


defineProps<{
  isOpened: object | boolean
}>()

const emit = defineEmits<{
  toggleMenu: [$event: MouseEvent]
}>()

const components = {
  boolean: BooleanComponent,
  select: Select,
  range: Range,
  hr: Hr,
}

const { t } = useI18n()
const { width } = useWindowSize()
const submenu = ref<null | { type: string, label: string, key: string, extra: any }>(null)
const { total, hasFilters, controls, resetFilters, model } = await useControls()

const mobileControls = ['select', 'range']
const bottomControls = ['boolean']

const selectedFilter = computed(() => components[submenu.value?.type as keyof typeof components])

const onCloseMenu = ($event: MouseEvent) => {
  submenu.value = null
  emit('toggleMenu', $event)
}
</script>

<style scoped lang="scss"></style>
