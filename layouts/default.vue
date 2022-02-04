<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>

    </v-navigation-drawer>
    <v-app-bar
      :clipped-left="clipped"
      fixed
      app
    >
    <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    <v-spacer />
    <router-link to="/">
      <v-img
      src="/img/logo.png"
      max-width="140"
      ></v-img>
    </router-link>
    <v-spacer />
    <v-menu
      transition="slide-y-transition"
      bottom
    >
      <template v-slot:activator="{ on, attrs }">
        <v-btn
          dark
          icon
          color="#aaa"
          v-bind="attrs"
          v-on="on"
        >
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-if="$auth.loggedIn">
          <v-list-item-title><v-icon>mdi-account</v-icon> {{ $auth.user.name }}</v-list-item-title>
        </v-list-item>
        <v-list-item v-if="$auth.loggedIn" @click="logout">
          <v-list-item-title><v-icon>mdi-logout-variant</v-icon> 로그아웃</v-list-item-title>
        </v-list-item>
        <!-- <v-list-item v-if="$auth.loggedIn" :to="/member/_id" router>
          <v-list-item-title>회원정보수정</v-list-item-title>
        </v-list-item> -->
      </v-list>
    </v-menu>

    </v-app-bar>
    <v-main>
      <v-container>
        <Nuxt />
      </v-container>
    </v-main>
    <v-footer
      :absolute="!fixed"
      app
    >
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  name: 'DefaultLayout',
  data () {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: 'mdi-account',
          title: '회원관리',
          to: '/basic'
        },
        {
          icon: 'mdi-calendar-check',
          title: '스케줄관리',
          to: '/scheduler'
        },
      ],
      miniVariant: false,
    }
  },
  methods: {
    async logout () {
      await this.$auth.logout()
      this.$router.push('/member/login')
    },
  },

}
</script>
