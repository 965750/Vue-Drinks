// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'
import {
  store
} from './store'
import firebase from 'firebase'
import DateFilter from './filters/date'
import LongText from './filters/longText'
import FavoritesDialog from './components/favorites/FavoritesDialog'

Vue.use(Vuetify)
Vue.config.productionTip = false

Vue.filter('date', DateFilter)
Vue.filter('longText', LongText)

Vue.component('app-favorites-dialog', FavoritesDialog)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>',
  created() {
    var config = {
      apiKey: "___",
      authDomain: "drinks-dea37.firebaseapp.com",
      databaseURL: "https://drinks-dea37.firebaseio.com",
      projectId: "drinks-dea37",
      storageBucket: "drinks-dea37.appspot.com",
      messagingSenderId: "___"
    }

    const firebaseApp = firebase.initializeApp(config)
   
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.$store.dispatch('autoSignIn', user)
        this.$store.dispatch('fetchUserData')
      }
      this.$store.dispatch('loadDrinks')
    })
  }
})
