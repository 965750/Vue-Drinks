import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

export default ({
  state: {
    loadedDrinks: [],
    ingredients: [
        "lemon",
        "lime",
        "grapefruit",
        "kiwi",
        "berry",
        "strawberry",
        "orange juice",
        "grape juice",
        "grapefruit juice"
    ]
  },
  mutations: {
    'M_CREATE_DRINK'(state, payload) {
      state.loadedDrinks.push(payload)
    },
    'M_SET_LOADED_DRINKS'(state, payload) {
      state.loadedDrinks = payload
    },
    'M_UPDATE_DRINK'(state, payload) {
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
  },
  actions: {
    'A_UPDATE_DRINK_DATA'({
      commit
    }, payload) {
      commit('M_SET_LOADING', true)
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
          commit('M_SET_LOADING', false)
          commit('M_UPDATE_DRINK', payload)
        })
        .catch(error => {
          console.log(error)
          commit('M_SET_LOADING', false)
        })
    },
    'A_LOAD_DRINKS'(context) {
      context.commit('M_SET_LOADING', true)
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
          context.commit('M_SET_LOADED_DRINKS', drinks)
          context.commit('M_SET_LOADING', false)
        })
        .catch((error) => {
          console.log(error)
          context.commit('M_SET_LOADING', false)
        })
    },
    'A_CREATE_DRINK'({
      commit,
      getters
    }, payload) {
      const drink = {
        title: payload.title,
        bar: payload.bar,
        description: payload.description,
        ingredients: payload.ingredients,
        date: payload.date.toISOString(),
        creatorId: getters.G_USER.id
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
          commit('M_CREATE_DRINK', {
            ...drink,
            imageUrl: imageUrl,
            id: key
          })
        })
        .catch((error) => {
          console.log(error)
        })
    }
  },
  getters: {
    'G_INGREDIENTS'(state) {
      return state.ingredients
    },
    'G_LOADED_DRINKS'(state) {
      return state.loadedDrinks.sort((drinkA, drinkB) => {
        return drinkA.date > drinkB.date
      })
    },
    'G_NEW_DRINKS'(state, getters) {
      return getters.G_LOADED_DRINKS
    },
    'G_LOADED_DRINK'(state) {
      return (drinkId) => {
        return state.loadedDrinks.find((drink) => {
          return drink.id == drinkId
        })
      }
    }
  }
})
