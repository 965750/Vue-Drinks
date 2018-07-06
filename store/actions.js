export const addFavForUser = ({commit, getters}, payload) => {
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
  };
export const removeFavFromUser = ({commit, getters}, payload) => {
    commit('setLoading', true)
    const user = getters.user
    if (!user.fbKeys) {
      
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
  };
export const autoSignIn = ({commit}, payload) => {
    commit('setUser', {
      id: payload.uid,
      favDrinks: [],
      fbKeys: {}
    })
  };
export const fetchUserData = ({commit, getters}) => {
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
  };
export const logout = ({commit}) => {
    firebase.auth().signOut()
    commit('setUser', null)
  };
export const signUserIn = (context, payload) => {
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
  };
export const signUserUp = ({
    commit
  }, payload) => {
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
  };
export const clearError = ({commit}) => {
    commit('clearError')
};
export const themeChange = ({commit}) => {
    commit('themeChange')
};
export const updateDrinkData = ({
    commit
  }, payload) => {
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
  };
export const loadDrinks = (context) => {
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
};
export const createDrink = ({
    commit,
    getters
  }, payload) => {
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
  };