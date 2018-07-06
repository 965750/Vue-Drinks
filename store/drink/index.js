import firebase from 'firebase/app'
import 'firebase/auth'
import 'firebase/database'
import 'firebase/storage'

export default ({
  state: {
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
    }
  },
  getters: {
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
