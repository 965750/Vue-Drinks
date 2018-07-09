import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

export default({
  state: {
    user: null,
  },
  mutations: {
    'M_SET_USER'(state, payload) {
      state.user = payload
    },
    'M_ADD_FAV_FOR_USER'(state, payload) {
      const id = payload.id
      if (state.user.favDrinks.findIndex(drink => drink.id === id) >= 0) {
        return
      }
      state.user.favDrinks.push(id)
      state.user.fbKeys[id] = payload.fbKey
    },
    'M_REMOVE_FAV_FROM_USER'(state, payload) {
      const favDrinks = state.user.favDrinks
      favDrinks.splice(favDrinks.findIndex(drink => drink.id === payload), 1)
      Reflect.deleteProperty(state.user.fbKeys, payload)
    }
  },
  actions: {
    'A_ADD_FAV_FOR_USER'({commit, getters}, payload) {
      commit('M_SET_LOADING', true)
      const user = getters.G_USER
      firebase.database().ref('/users/' + user.id).child('/favorite/')
      .push(payload)
      .then(data => {
        commit('M_SET_LOADING', false)
        commit('M_ADD_FAV_FOR_USER', {id: payload, fbKey: data.key})
      })
      .catch(error => {
        console.log(error)
        commit('M_SET_LOADING', false)
      })
    },
    'A_REMOVE_FAV_FROM_USER'({commit, getters}, payload) {
      commit('M_SET_LOADING', true)
      const user = getters.G_USER
      if (!user.fbKeys) {
        return
      }
      const fbKey = user.fbKeys[payload]
      firebase.database().ref('/users/' + user.id + '/favorite').child(fbKey)
      .remove()
      .then(() => {
        commit('M_SET_LOADING', false)
        commit('M_REMOVE_FAV_FROM_USER', payload)
      })
      .catch(error => {
        console.log(error)
        commit('M_SET_LOADING', false)
      })
    },
    'A_AUTO_SIGNIN'({commit}, payload) {
      commit('M_SET_USER', {
        id: payload.uid,
        favDrinks: [],
        fbKeys: {}
      })
    },
    'A_FETCH_USER_DATA'({commit, getters}) {
      commit('M_SET_LOADING', true)
      firebase.database().ref('/users/' + getters.G_USER.id + '/favorite/').once('value')
      .then(data => {
        const dataPairs = data.val()
        let favoriteDrinks = []
        let swappedPairs = {}
        for (let key in dataPairs) {
          favoriteDrinks.push(dataPairs[key])
          swappedPairs[dataPairs[key]] = key
        }
        const updatedUser = {
          id: getters.G_USER.id,
          favDrinks: favoriteDrinks,
          fbKeys: swappedPairs
        }
        commit('M_SET_LOADING', false)
        commit('M_SET_USER', updatedUser)
      })
      .catch(error => {
        console.log(error)
        commit('M_SET_LOADING', false)
      })
    },
    'A_LOGOUT'({commit}) {
      firebase.auth().signOut()
      commit('M_SET_USER', null)
    },
    'A_SIGN_USER_IN'(context, payload) {
      context.commit('M_SET_LOADING', true)
      firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            context.commit('M_SET_LOADING', false)
            const newUser = {
              id: user.user.uid,
              favDrinks: [],
              fbKeys: {}
            }
            context.commit('M_SET_USER', newUser)
          }
        )
        .catch(
          error => {
            context.commit('M_SET_LOADING', false)
            context.commit('M_SET_ERROR', error)
          }
        )
    },
    'A_SIGN_USER_UP'({
      commit
    }, payload) {
      commit('M_SET_LOADING', true)
      commit('M_CLEAR_ERROR')
      firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
        .then(
          user => {
            commit('M_SET_LOADING', false)
            const newUser = {
              id: user.user.uid,
              favDrinks: [],
              fbKeys: {}
            }
            commit('M_SET_USER', newUser)
          }
        )
        .catch(
          error => {
            commit('M_SET_LOADING', false)
            commit('M_SET_ERROR', error)
          }
        )
    },
  },
  getters: {
    'G_USER'(state) {
      return state.user
    }
  }
})
