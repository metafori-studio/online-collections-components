<template>
  <NuxtLink
    v-if="featured"
    :to="featured.link"
    class="relative flex min-h-[200px] items-center justify-center overflow-hidden bg-cover bg-center py-8 md:min-h-[300px] lg:min-h-[400px]"
    :style="{ backgroundImage: `url(${featured.header_image_src})` }"
  >
    <div
      class="absolute -bottom-4 right-[5%] flex h-[72px] w-[72px] -rotate-[15deg] items-center justify-center rounded-full bg-yellow text-center text-primary lg:-bottom-10 lg:h-[180px] lg:w-[180px]"
    >
      <div class="lg:mt-[16px]">
        <span
          class="text-2xl uppercase max-lg:hidden whitespace-pre-line"
          v-html="t('featuredCollection.label')"
        ></span
        >&NewLine;
        <Icon name="arrow-down" class="mx-auto h-8 w-8 -rotate-90" />
      </div>
    </div>
    <div
      class="isolate w-2/3 text-center text-3xl text-white [text-shadow:0_0.05em_0.2em_rgba(0,0,0,0.8)] [text-wrap:balance] md:text-5xl lg:text-6xl"
    >
      {{ featured.name }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import Collection from '~/models/Collection'

interface Response {
  data: Collection[]
}

const { t } = useI18n()
const collections = await useBaseFetch<Response>('api/collections', {
  query: { featured: true },
  transform: (response) => ({
    ...response,
    data: response.data.map((data) => new Collection(data)),
  }),
})

const featured = computed(() => collections.data.value?.data[0] ?? null)
</script>
