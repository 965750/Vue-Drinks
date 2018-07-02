import * as firebase from 'firebase/app'

export default({
  state: {
    user: null,
  },
  mutations: {
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
    }
  }
})
