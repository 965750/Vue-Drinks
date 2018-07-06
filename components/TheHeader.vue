<template>
  <div>
    <!-- mobile header -->
    <v-navigation-drawer v-model="sideNav" absolute temporary>
      <v-list class="pt-0">
        <v-list-tile class="green accent-4">
          <v-list-tile-title class="title">
            <router-link tag="span" to="/">DevDrinks</router-link>
          </v-list-tile-title>
        </v-list-tile>
        <v-list-tile style="borderBottom: 1px solid rgba(25, 118, 210, 0.316)" v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-list-tile-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>{{item.title}}</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
        <v-list-tile style="borderBottom: 1px solid rgba(25, 118, 210, 0.316)" v-if="userIsAuth" @click="onLogout">
          <v-list-tile-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-tile-action>
          <v-list-tile-content>
            <v-list-tile-title>Logout</v-list-tile-title>
          </v-list-tile-content>
        </v-list-tile>
      </v-list>
    </v-navigation-drawer>
    <!-- desktop header -->
    <v-toolbar class="green accent-4">
      <v-toolbar-side-icon @click="sideNav = !sideNav" class="hidden-sm-and-up"></v-toolbar-side-icon>
      <v-toolbar-title>
        <router-link to="/" tag="span" style="cursor: pointer">DevDrinks</router-link>
      </v-toolbar-title>
      <v-spacer></v-spacer>
      <!-- menu -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn flat v-for="item in menuItems" :key="item.title" router :to="item.link">
          <v-icon class="pr-1">{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>
        <v-btn flat v-if="userIsAuth" @click="onLogout">
          <v-icon class="pr-1">exit_to_app</v-icon>
          Logout
        </v-btn>
      </v-toolbar-items>
      <v-btn class="ml-3" fab small color="light-green accent-3" @click="themeChange">
        <v-icon color="green darken-2" class="pl-3" left>highlight</v-icon>
      </v-btn> 
    </v-toolbar>
  </div>
</template>
<script>
export default {
  data () {
    return {
      sideNav: false
    }
  },
  methods: {
    onLogout () {
      this.$store.dispatch('logout')
      this.$router.push('/')
    },
    themeChange () {
      this.$store.dispatch('themeChange')
    }
  },
  computed: {
    menuItems () {
      let menuItems = [
        {icon: 'supervisor_account', title: 'View drinks', link: '/drinks'},
        {icon: 'create', title: 'Sign Up', link: '/signup'},
        {icon: 'lock_open', title: 'Sign In', link: '/signin'}
      ]
      if (this.userIsAuth) {
        menuItems = [
          {icon: 'supervisor_account', title: 'View drinks', link: '/drinks'},
          {icon: 'assignment', title: 'Create drink', link: '/drink/new'},
        ]
      } 
      return menuItems
    },
    userIsAuth () {
      return this.$store.getters.user !== null && this.$store.getters.user !== undefined
    }
  }
}
</script>
