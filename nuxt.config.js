import colors from 'vuetify/es5/util/colors'

export default {
  // Disable server-side rendering: https://go.nuxtjs.dev/ssr-mode
  ssr: false,

  // Global page headers: https://go.nuxtjs.dev/config-head
  head: {
    titleTemplate: '%s - client',
    title: 'client',
    htmlAttrs: {
      lang: 'en'
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  // Global CSS: https://go.nuxtjs.dev/config-css
  css: [
  ],

  // Plugins to run before rendering page: https://go.nuxtjs.dev/config-plugins
  plugins: [
  ],

  // Auto import components: https://go.nuxtjs.dev/config-components
  components: true,

  // Modules for dev and build (recommended): https://go.nuxtjs.dev/config-modules
  buildModules: [
    // https://go.nuxtjs.dev/vuetify
    '@nuxtjs/vuetify',
  ],

  // Modules: https://go.nuxtjs.dev/config-modules
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/auth-next',
    //알러트
    '@nuxtjs/toast',
  ],

  //알러트 설정
  toast: {
      position: 'bottom-right',
      duration : 1000,
  },

  axios: {
    /**
      When issuing a request to baseURL that needs to pass authentication headers to
      the backend, 'credentials' should be set to 'true'
    */
    credentials: true, // default value of withCredentials is fale

    // This is where to hit the server
    baseUrl: 'http://localhost:8000'
  },

  auth: {
    //login 경로가 바뀐경우 아래처럼 리다이렉트 경로를 수정해야한다.
    redirect: {
        login: '/member/login',
        logout: '/member/login',
        callback: '/member/login',
        home: '/'
    },
    strategies: {
      'laravelSanctum': {
        provider: 'laravel/sanctum',
        url: 'http://localhost:8000',
        endpoints: {
          login : {
            url: '/api/login', method: 'post'
          },
          logout : {
            url: '/api/logout', method: 'post'
          },
          tokenRequired: false,
          tokenType: false
        }
      }
    },
    localStorage: false
  },

  // Vuetify module configuration: https://go.nuxtjs.dev/config-vuetify
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: false,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3
        }
      }
    }
  },

  // Build Configuration: https://go.nuxtjs.dev/config-build
  build: {
  },

  //폐쇄형 홈페이지 작업시 -> 아래 주석 풀면 전체 로그인해야 접근가능

  router: {
    middleware: ['auth']
  },
}
