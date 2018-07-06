import Vue from 'vue'
import Vuex from 'vuex'

import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

// import drink from './drink'
// import user from './user'
// import shared from './shared'

// import * as actions from './actions'
// import * as mutations from './mutations'
// import * as getters from './getters'

Vue.use(Vuex)

export const store = new Vuex.Store({
  state: {
    user: null,
    loading: false,
    error: null,
    darkTheme: false,
    loadedDrinks: [],
    ingredients: [{
        text: "lemon"
      },
      {
        text: "lime"
      },
      {
        text: "grapefruit"
      },
      {
        text: "kiwi"
      },
      {
        text: "berry"
      },
      {
        text: "strawberry"
      },
      {
        text: "orange juice"
      },
      {
        text: "grape juice"
      },
      {
        text: "grapefruit juice"
      }
    ]
  },
  mutations: {
    setLoading(state, payload) {
      state.loading = payload
    },
    setError(state, payload) {
      state.error = payload
    },
    clearError(state) {
      state.error = null
    },
    themeChange(state) {
      state.darkTheme = !state.darkTheme
    },
    createDrink(state, payload) {
      state.loadedDrinks.push(payload)
    },
    setLoadedDrinks(state, payload) {
      state.loadedDrinks = payload
    },
    updateDrink(state, payload) {
      const drink = state.loadedDrinks.find(drink => {
        return drink.id === payload.id
      })
      if (payload.title) {
        drink.title = payload.title
      }
      if (payload.description) {
        drink.description = payload.description
      }
      if (payload.date) {
        drink.date = payload.date
      }
      if (payload.ingredients) {
        drink.ingredients = payload.ingredients
      }
    },
    removeFavFromUser(state, payload) {
      const favDrinks = state.user.favDrinks
      favDrinks.splice(favDrinks.findIndex(drink => drink.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    },
    setUser(state, payload) {
      state.user = payload
    },
    addFavForUser (state, payload) {
      const id = payload.id
      if (state.user.favDrinks.findIndex(drink => drink.id === id) >= 0) {
        return
      }
      state.user.favDrinks.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    removeFavFromUser (state, payload) {

      const favDrinks = state.user.favDrinks
      favDrinks.splice(favDrinks.findIndex(drink => drink.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload )
    }
  },
  actions: {
    updateDrinkData({
      commit
    }, payload) {
      commit('setLoading', true)
      const updateObj = {}
      if (payload.title) {
        updateObj.title = payload.title
      }
      if (payload.description) {
        updateObj.description = payload.description
      }
      if (payload.date) {
        updateObj.date = payload.date
      }
      if (payload.ingredients) {
        updateObj.ingredients = payload.ingredients
      }
      firebase.database().ref('drinks').child(payload.id).update(updateObj)
        .then(() => {
          commit('setLoading', false)
          commit('updateDrink', payload)
        })
        .catch(error => {
          console.log(error)
          commit('setLoading', false)
        })
    },
    loadDrinks(context) {
      context.commit('setLoading', true)
      firebase.database().ref('drinks').once('value')
        .then((data) => {
          const drinks = []
          const obj = data.val()
          for (let key in obj) {
            drinks.push({
              id: key,
              title: obj[key].title,
              description: obj[key].description,
              ingredients: obj[key].ingredients,
              imageUrl: obj[key].imageUrl,
              date: obj[key].date,
              bar: obj[key].bar,
              creatorId: obj[key].creatorId
            })
          }
          context.commit('setLoadedDrinks', drinks)
          context.commit('setLoading', false)
        })
        .catch((error) => {
          console.log(error)
          context.commit('setLoading', false)
        })
    },
    createDrink({
      commit,
      getters
    }, payload) {
      const drink = {
        title: payload.title,
        bar: payload.bar,
        description: payload.description,
        ingredients: payload.ingredients,
        date: payload.date.toISOString(),
        creatorId: getters.user.id
      }
      let imageUrl
      let key
      firebase.database().ref('drinks').push(drink)
        .then((data) => {
          key = data.key
          return key
        })
        .then(key => {
          const filename = payload.image.name
          const ext = filename.slice(filename.lastIndexOf('.'))
          return firebase.storage().ref('drinks/' + key + ext).put(payload.image)
        })
        .then(fileData => {
          fileData.ref.getDownloadURL()
            .then(url => {
              imageUrl = url
              return firebase.database().ref('drinks').child(key).update({
                imageUrl: url
              })
            })
        })
        .then(() => {
          commit('createDrink', {
            ...drink,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    },
    clearError({commit}) {
      commit('clearError')
  },
  themeChange({commit}) {
      commit('themeChange')
  },
    addFavForUser ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      firebase.database().ref('/users/' + user.id).child('/favorite/')
      .push(payload)
      .then(data => {
        commit('setLoading', false)
        commit('addFavForUser', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    removeFavFromUser ({commit, getters}, payload) {
      commit('setLoading', true)
      const user = getters.user
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/favorite').child(fbKey)
      .remove()
      .then(() => {
        commit('setLoading', false)
        commit('removeFavFromUser', payload)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    autoSignIn ({commit}, payload) {
      commit('setUser', {
        id: payload.uid,
        favDrinks: [],
        fbKeys: {}
      })
    },
    fetchUserData ({commit, getters}) {
      commit('setLoading', true)
      firebase.database().ref('/users/' + getters.user.id + '/favorite/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let favoriteDrinks = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          favoriteDrinks.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updatedUser = {
          id: getters.user.id,
          favDrinks: favoriteDrinks,
          fbKeys: swappedPairs
        }
        commit('setLoading', false)
        commit('setUser', updatedUser)
      })
      .catch(error => {
        console.log(error)
        commit('setLoading', false)
      })
    },
    logout ({commit}) {
      firebase.auth().signOut()
      commit('setUser', null)
    },
    signUserIn(context, payload) {
      context.commit('setLoading', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            context.commit('setLoading', false)
            const newUser = {
              id: user.user.uid,
              favDrinks: [],
              fbKeys: {}
            }
            context.commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            context.commit('setLoading', false)
            context.commit('setError', error)
          }
        )
    },
    signUserUp({
      commit
    }, payload) {
      commit('setLoading', true)
      commit('clearError')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('setLoading', false)
            const newUser = {
              id: user.user.uid,
              favDrinks: [],
              fbKeys: {}
            }
            commit('setUser', newUser)
          }
        )
        .catch(
          error => {
            commit('setLoading', false)
            commit('setError', error)
          }
        )
    },
  },
  getters: {
    user(state) {
      return state.user
    },
    darkTheme (state) {
      return state.darkTheme
    },
    loading (state) {
        return state.loading
    },
    error (state) {
        return state.error
    },
    ingredients(state) {
      return state.ingredients
    },
    loadedDrinks(state) {
      return state.loadedDrinks.sort((drinkA, drinkB) => {
        return drinkA.date > drinkB.date
      })
    },
    newdrinks(state, getters) {
      return getters.loadedDrinks
    },
    loadedDrink(state) {
      return (drinkId) => {
        return state.loadedDrinks.find((drink) => {
          return drink.id == drinkId
        })
      }
    }
  }
})
