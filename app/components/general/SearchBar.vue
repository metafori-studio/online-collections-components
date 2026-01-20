<template>
  <div class="wu-searchbar relative">
    <Search
      v-model="q"
      prepend-icon
      css="py-2 px-5"
      @focus="isOpen = true"
      @blur="isOpen = false"
      @keydown.enter="submit"
    />
    <transition-fade>
      <div
        v-if="isOpen && items.length"
        class="wu-results bg-white absolute top-100% w-full p-4 z-30"
      >
        <div>{{ t('item.title') }}</div>
        <div
          class="wu-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
          @click="isOpen = false"
        >
          <NuxtLink
            v-for="item in items"
            :key="item.id"
            :to="item.link"
            class="flex mt-4 wu-item"
          >
            <Image
              :url="item.image"
              class="!w-[56px] h-[56px] object-cover mr-4"
            />
            <div>
              <div class="font-serif font-medium">{{ item.content.author.join(', ') }}</div>
              <div>{{ item.content.title }}</div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </transition-fade>
  </div>
</template>

<script setup lang="ts">
import Item from '~/models/Item'

const props = defineProps<{
  name: string
}>()

const { model } = await useControls()

const q = ref(model[props.name])
const isOpen = ref(false)

const { data } = await useBaseFetch<{
  data: any[]
}>('api/v1/items/suggestions', {
  params: {
    q,
    size: 9,
  },
  watch: [q],
})

const { t } = useI18n()

const submit = () => {
  model[props.name] = q.value
  isOpen.value = false
}

watch(
  () => model[props.name],
  (value) => { q.value = value }
)

const items = computed(() => data.value?.data.map(item => new Item(item)) ?? [])
</script>
