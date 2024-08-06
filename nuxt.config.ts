// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },

  nitro: {
    experimental: {
      websocket: true
    }
  },

  imports: {
    dirs: [
      "utils/**",
      "models/**"
    ]
  },

  css: ['~/assets/css/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  modules: [
    "@pinia/nuxt"
  ],

  runtimeConfig: {
    public: {
      baseUrl: "localhost:3000/api/"
    }
  }
});