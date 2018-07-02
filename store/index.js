import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase/app'
import drink from './drink'
import user from './user'
import shared from './shared'

Vue.use(Vuex)

export const store = new Vuex.Store({
  modules: {
    drink: drink,
    user: user,
    shared: shared
  }
})
