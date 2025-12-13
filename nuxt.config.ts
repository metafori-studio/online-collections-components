// https://nuxt.com/docs/api/configuration/nuxt-config
import { resolve } from 'node:path'

export default defineNuxtConfig({
  modules: [
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxtjs/tailwindcss',
    '@morev/vue-transitions/nuxt',
    'vue3-carousel-nuxt',
    'floating-vue/nuxt',
    '@nuxtjs/i18n',
  ],
  components: [{
    path: resolve(__dirname, 'app/components/general'),
    prefix: 'WU',
  }, {
    path: resolve(__dirname, 'app/components/controls'),
    prefix: 'WU',
  }, {
    path: resolve(__dirname, 'app/components/controls/parts'),
    prefix: 'WU',
  }, {
    path: resolve(__dirname, 'app/components/controls/mobile'),
    prefix: 'WUMobile',
  }],
  devtools: { enabled: true },

  features: {
    inlineStyles: false,
  },
  experimental: {
    renderJsonPayloads: false,
  },
  compatibilityDate: '2024-04-03',
  vite: {
    vue: {
      script: {
        defineModel: true,
      },
    },
    optimizeDeps: { exclude: ['fsevents'], include: ['vue3-carousel'] },
    server: {
      preTransformRequests: false,
    },
  },
  carousel: {
    prefix: 'Module',
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
  i18n: {
    locales: [{ code: 'cs', file: 'cs.json' }],
    vueI18n: './i18n/i18n.config.ts',
  },
  sitemap: {
    cacheMaxAgeSeconds: process.env.NODE_ENV === 'production' ? 60 * 60 * 24 * 31 : 0,
    autoI18n: false,
    sitemaps: false,
  },
})
