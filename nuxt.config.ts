// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  modules: ['@nuxt/eslint'],

  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
  ],

  css: ['~/assets/css/main.css'],

  app: {
    head: {
      title: '知能メディア工学科 | 千葉工業大学',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            '千葉工業大学 知能メディア工学科。音・AI・デザインで未来をひらく。メディア工学、知識工学、情報デザインの3つの柱で、まだないコミュニケーションをつくる。',
        },
        { property: 'og:title', content: '知能メディア工学科 | 千葉工業大学' },
        {
          property: 'og:description',
          content: '音・AI・デザインで未来をひらく。千葉工業大学 知能メディア工学科。',
        },
        { property: 'og:type', content: 'website' },
      ],
      link: [
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600&display=swap',
        },
      ],
    },
  },

  typescript: {
    strict: true,
  },
})
