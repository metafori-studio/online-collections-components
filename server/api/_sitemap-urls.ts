export default defineEventHandler(async () => {
  const { data: collections } = await $fetch<any>('api/collections?size=1000', {
    baseURL: process.env.APP_URL,
  })

  const now = new Date().toISOString()
  const config = useRuntimeConfig()

  const pages = [
    {
      url: '/',
      updatedAt: now,
    },
    {
      url: '/collections',
      updatedAt: now,
    },
    {
      url: '/about',
      updatedAt: now,
    },
  ]

  const fetchAllItems = async () => {
    const res = await $fetch<any>(`${process.env.API_URL}/v2/items?size=1000`, {
      headers: {
        'X-Frontend': config.public.APP_X_FRONTEND as string,
        'Accept-Language': 'cs',
      },
    })

    let page = 1
    const items: any[] = []
    const lastPage = res.meta.last_page

    for (page; page <= lastPage; page++) {
      const { data: pageItems } = await $fetch<any>(
        `${process.env.API_URL}/v2/items?size=1000&page=${page}`,
        {
          headers: {
            'X-Frontend': config.public.APP_X_FRONTEND as string,
            'Accept-Language': 'cs',
          },
        },
      )

      items.push(
        ...pageItems.map((i: any) => ({
          url: `/items/${i.id}`,
          updatedAt: now,
        })),
      )
    }

    return items
  }

  const items = await fetchAllItems()
  // const items = []

  return [
    ...pages,
    ...items,
    ...collections.map((i: any) => ({
      url: `/collections/${i.id}`,
      updatedAt: now,
    })),
  ].map(i => ({
    url: i.url,
    lastmod: i.updatedAt,
    changefreq: 'monthly',
    priority: 0.8,
  }))
})
