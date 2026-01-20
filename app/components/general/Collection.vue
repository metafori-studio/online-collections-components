<template>
  <NuxtLink
    :to="collection.link"
    class="group"
  >
    <Image
      :url="collection.header_image_src"
      :disable-lazy="true"
      :srcset="collection.header_image_srcset"
      sizes="300px"
      class="w-full"
    />
    <div class="mt-4 mb-10 font-bold text-xl group-hover:underline">
      {{ collection.name }}
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import type Collection from '~/models/Collection'


defineProps<{
  collection: Collection
}>()
</script>
