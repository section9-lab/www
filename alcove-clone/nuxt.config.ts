export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: false },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt'],
  css: ['~/assets/css/main.css'],
  app: {
    head: {
      title: 'Alcove — Dynamic Island for your Mac',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'An entirely new way to experience Mac' },
        { name: 'keywords', content: 'macos, swift, macos app, app, dynamic, island, notch, media, controls, hud, interface' }
      ],
      link: [
        { rel: 'icon', href: 'https://cdn.tryalcove.com/images/icon.png' }
      ]
    }
  }
})
