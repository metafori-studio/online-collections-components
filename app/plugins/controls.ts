import { watchDebounced } from '@vueuse/core'
import type { InjectionKey } from 'vue'

import Item from '~/models/Item'
import { useBaseFetch } from '~/composables/fetch'

export const ControlsSymbol: InjectionKey<ReturnType<typeof controlsService>> = Symbol('controls')

interface IFilterConfig {
  sortBy: string
  sortDirection?: 'asc' | 'desc'
  perPage: number
}

interface Response {
  data: Item[]
  total: number
  current_page: number
  last_page: number
}

export interface ISetupOptions {
  key: string
  label: string
  type: string
  defaultValue?: boolean
  extra?: {
    rangeKeys?: { min: string, max: string }
  }
}

const controlsService = async (
  options: IFilterConfig = {
    sortBy: 'updated_at',
    sortDirection: 'desc',
    perPage: 12,
  },
  t: (key: string) => string,
) => {
  const route = useRoute()
  const router = useRouter()

  const indicator = useLoadingIndicator()
  const items = ref<Item[]>([])
  const controls = reactive<Record<string, any>>({})
  const model = reactive<Record<string, any>>({})
  const page = ref(route.query.page ? Number(route.query.page) : 1)
  const sortBy = ref(route.query.sortBy ? String(route.query.sortBy) : options.sortBy)
  const sortDirection = ref(
    route.query.sortDirection ? String(route.query.sortDirection) : options.sortDirection,
  )

  const sortOptions = ref([
    { label: t('item.sortOptions.updatedAt'), value: 'updated_at', direction: 'desc' },
    { label: t('item.sortOptions.createdAt'), value: 'created_at', direction: 'asc' },
    { label: t('item.sortOptions.title'), value: 'title', direction: 'asc' },
    { label: t('item.sortOptions.dateEarliest'), value: 'date_earliest', direction: 'asc' },
    { label: t('item.sortOptions.viewCount'), value: 'view_count', direction: 'desc' },
    { label: t('item.sortOptions.random'), value: 'random', direction: 'asc' },
  ])

  //
  // Components setup
  //

  const controlsComponents = {
    search: ({ key, label }: ISetupOptions) => {
      return {
        type: 'search',
        key,
        label,
        initModel: route.query[key] ? String(route.query[key]) : null,
        resetModel: undefined,
        filter: (value: string) => (value ? { q: value } : undefined),
        route: () => ({ [key]: model[key] }),
        selected: () => model[key]
          ? [{ key, value: model[key], label }]
          : null,
        toggle: () => model[key] = undefined,
      }
    },

    boolean: ({ key, label, defaultValue }: ISetupOptions) => {
      const aggKey = `terms[${key}]`
      const filterKey = `filter[${key}]`

      return {
        type: 'boolean',
        key,
        label,
        aggKey,
        filterKey,
        initModel: route.query[key] === 'true' ? true : (defaultValue ?? false),
        resetModel: defaultValue ?? false,
        filter: (value: boolean) => (value ? { [filterKey]: true } : undefined),
        route: (value: boolean) => (value ? { [key]: true } : undefined),
        aggregation: () => ({ [aggKey]: key }),
      }
    },

    select: ({ key, label }: ISetupOptions) => {
      const aggKey = `terms[${key}]`
      const filterKey = `filter[${key}][]`
      const routeDefault = route.query[key] ? String(route.query[key]) : null

      return {
        type: 'select',
        key,
        label,
        aggKey,
        filterKey,
        initModel: routeDefault ? String(route.query[key]).split('|') : [],
        resetModel: [],
        filter: (value: string[]) => value.length ? { [filterKey]: value } : undefined,
        route: (value: string[]) => (value.length ? { [key]: value.join('|') } : undefined),
        aggregation: () => ({ [aggKey]: key }),

        selected: () => model[key].length
          ? model[key].map((value: string) => ({ key, value, label }))
          : null,
        toggle: (value: string) => {
          const exists = model[key].indexOf(value)
          if (exists > -1) {
            model[key] = model[key].filter((item: string) => item !== value)
          }
          else {
            model[key] = [...model[key], value]
          }
        },
      }
    },

    range: ({ key, label, extra }: ISetupOptions) => {
      const rangeKeys = extra?.rangeKeys ?? { min: 'min', max: 'max' }
      const aggKey = `terms[${key}]`
      const filterKey = `filter[${key}]`
      const routeDefault = route.query[key]
        ? {
            min: Number(route.query[key].split('/')[0]),
            max: Number(route.query[key].split('/')[1]),
          }
        : null

      return {
        type: 'range',
        key,
        extra,
        label,
        aggKey,
        filterKey,
        initModel: routeDefault ? routeDefault : { min: null, max: null },
        resetModel: { min: null, max: null },
        filter: (value: any) => ({
          ...(value.min ? { [`filter[${rangeKeys.min}][gte]`]: value.min } : undefined),
          ...(value.max ? { [`filter[${rangeKeys.max}][lte]`]: value.max } : undefined),
        }),
        route: (value: any) => {
          if (!value.min && !value.max) return undefined

          return {
            [key]: `${value.min}/${value.max}`,
          }
        },
        aggregation: () => ({
          [`min[${rangeKeys.min}]`]: rangeKeys.min,
          [`max[${rangeKeys.max}]`]: rangeKeys.max,
        }),
        selected: () => {
          if (!model[key].min && !model[key].max) return null

          return [
            { key, value: `${model[key].min} <> ${model[key].max}`, label },
          ]
        },
        toggle: () => {
          model[key] = { min: null, max: null }
        },
      }
    },

    hidden: ({ key, defaultValue, label }: ISetupOptions) => {
      const aggKey = `terms[${key}]`
      const filterKey = `filter[${key}]`

      return {
        type: 'hidden',
        key,
        label,
        aggKey,
        filterKey,
        initModel: route.query[key] ? String(route.query[key]) : (defaultValue ?? ''),
        resetModel: defaultValue ?? '',
        selected: () => model[key]
          ? { key, value: model[key], label }
          : null,
        filter: (value: string) => (value ? { [filterKey]: value } : undefined),
        route: (value: string) => (value ? { [key]: value } : undefined),
        aggregation: () => ({ [aggKey]: key }),
        // todo split to set and unset
        toggle: (value: string) => model[key] = (model[key] ? undefined : (value ? value : undefined)),
      }
    },

    hr: (key: string) => {
      return {
        key,
        type: 'hr',
      }
    },
  }

  //
  // Fetch queries
  //

  const aggregationQuery = computed(() => {
    const agg = {}

    for (const key in controls) {
      const control = controls[key]
      if (control.aggregation) {
        Object.assign(agg, control.aggregation())
      }
    }

    return {
      ...filtersQuery.value,
      ...agg,
      size: 1000,
    }
  })

  const filtersQuery = computed(() => {
    const filters = Object.keys(controls).reduce((acc, key) => {
      const control = controls[key]
      if (control.filter) {
        Object.assign(acc, control.filter(model[key]))
      }
      return acc
    }, {})

    return {
      page: page.value,
      size: options.perPage,
      [`sort[${sortBy.value}]`]: sortDirection.value,
      ...filters,
    }
  })

  //
  // Filter
  //

  const hasFilters = computed(() => {
    for (const key in controls) {
      if (controls[key].filter && controls[key].filter(model[key])) {
        return true
      }
    }

    return false
  })

  const selectedFilters = computed(() => {
    const filters = []

    for (const key in controls) {
      const control = controls[key]

      if (control.selected) {
        const selected = control.selected()

        filters.push(selected ?? [])
      }
    }

    return filters.flat()
  })

  function resetFilters() {
    for (const key in model) {
      model[key] = controls[key].resetModel
    }
  }

  //
  // Routing
  //

  const routerParams = computed(() => {
    const params: Record<string, any> = {}

    for (const key in model) {
      const control = controls[key]
      Object.assign(params, control.route(model[key]))
    }

    if (sortBy.value !== options.sortBy) {
      params['sortBy'] = sortBy.value
    }
    if (sortDirection.value !== options.sortDirection) {
      params['sortDirection'] = sortDirection.value
    }

    return params
  })

  watchDebounced(
    [model, page, sortBy, sortDirection],
    () => {
      router.push({
        query: routerParams.value,
      })
    },
    {
      debounce: 500,
      maxWait: 1000,
      deep: true,
      immediate: true,
    },
  )

  //
  // Fetching & data handling
  //

  let itemsDataFetch: any = null
  let aggDataFetch: any = null

  async function init(
    { components, sortBy: initSortBy, sortDirection: initSortDirection, sortOptions: initSortOptions }:
    {
      components: ISetupOptions[]
      sortOptions?: {
        label: string
        value: string
        direction: string
      }[]

      sortBy?: string
      sortDirection?: string
    }) {
    if (initSortBy) {
      sortBy.value = initSortBy
    }
    if (initSortDirection) {
      sortDirection.value = initSortDirection
    }

    if (initSortOptions) {
      sortOptions.value = initSortOptions
    }

    components.forEach((option) => {
      const control = controlsComponents[option.type](option)

      controls[option.key] = control

      if (control.initModel) {
        model[option.key] = control.initModel
      }
    })

    const streams = await Promise.all([
      useBaseFetch<Response>('api/v1/items', {
        query: filtersQuery,
        watch: [model, page, sortBy, sortDirection],
        deep: true,
      }),

      useBaseFetch<Record<string, { count: number, value: string }[]>>(
        'api/v1/items/aggregations',
        {
          query: aggregationQuery,
          watch: [model, page, sortBy, sortDirection],
          deep: true,
        },
      ),
    ])

    itemsDataFetch = streams[0]
    aggDataFetch = streams[1]

    watch(
      itemsDataFetch.data,
      () => {
        const newItems = itemsDataFetch.data.value?.data?.map((data: any) => new Item(data)) ?? []

        if (page.value == 1) {
          items.value = newItems
        }
        else {
          items.value = [...items.value, ...newItems]
        }
      },
      {
        deep: true,
        immediate: true,
      },
    )

    watch(isLoading, () => {
      if (isLoading.value) {
        indicator.start()
      }

      else {
        setTimeout(() => {
          indicator.finish()
        }, 5000)
      }
    })
  }

  watch(
    [model, sortBy, sortDirection],
    () => {
      items.value = []
      page.value = 1
    },
    {
      deep: true,
    },
  )

  const isLoading = computed(() =>
    itemsDataFetch?.status.value === 'pending' || aggDataFetch?.status.value === 'pending',
  )

  const feedItems = computed(() => {
    if (isLoading.value) {
      const skeletons = Array.from({ length: 12 }, () => ({ skeleton: true }))

      return items.value.length ? [...items.value, ...skeletons] : skeletons
    }

    return items.value
  })

  const reset = (key?: string, value?: string) => {
    items.value = []
    page.value = 1
    sortBy.value = options.sortBy
    sortDirection.value = options.sortDirection ?? 'desc'

    if (!key) return

    for (const key in model) {
      model[key] = controls[key].resetModel
    }

    if (controls[key])
      controls[key].toggle(value)
  }

  return {
    init,
    model,
    controls,

    page,
    items: feedItems,
    sortBy,
    sortDirection,
    sortOptions,
    isLoading,
    total: computed(() => itemsDataFetch?.data.value?.total ?? 0),
    lastPage: computed(() => itemsDataFetch?.data.value?.last_page ?? 0),

    hasFilters,
    resetFilters,
    selectedFilters,
    filterParams: computed(() => Object.entries(routerParams.value).map(([key, value]) => `${key}=${value}`).join('&')),

    options: computed(() => aggDataFetch?.data.value),

    reset,
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.provide(ControlsSymbol, controlsService(undefined, nuxtApp.$i18n.t))

  return {}
})
