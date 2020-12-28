import HardSourceWebpackPlugin from 'hard-source-webpack-plugin';

export default {
  head: {
    title: 'マインスイーパー',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
    ],
    link: [
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  },

  css: [
    '~/assets/scss/style.scss',
  ],

  plugins: [
    { src: '~/plugins/sessionStorage.js', ssr: false },
  ],

  components: true,

  buildModules: [
    '@nuxtjs/eslint-module',
    ['@nuxtjs/fontawesome', { component: 'fontAwesome', suffix: true }],
  ],

  fontawesome: {
    icons: {
      solid: [
        'faSmile',
        'faLaughBeam',
        'faDizzy',
        'faTimes',
        'faFlag',
        'faBomb',
      ],
      regular: [],
      brands: [],
    },
  },

  modules: [
    '@nuxtjs/pwa',
  ],

  build: {
    extend (config) {
      config.plugins.push(new HardSourceWebpackPlugin());
    }
  },

  server: {
    host: '0.0.0.0',
    port: 8080,
  },

  // PWA 設定
  manifest: {
    name: 'マインスイーパー',
    short_name: 'マインスイーパー',
    lang: 'ja',
    title: 'マインスイーパー',
    'og-title': 'マインスイーパー',
    description: '地雷を避けながらマスをすべて開けよう！',
    'og-description': '地雷を避けながらマスをすべて開けよう！',
    theme_color: '#333333',
    background_color: '#ffffff',
  },
};
