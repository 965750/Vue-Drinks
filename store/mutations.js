export const setUser = (state, payload) => {
    state.user = payload
  };
export const addFavForUser = (state, payload) => {
    const id = payload.id
    if (state.user.favDrinks.findIndex(drink => drink.id === id) >= 0) {
      return
    }
    state.user.favDrinks.push(id)
    state.user.fbKeys[id] = payload.fbKey
  };
export const removeFavFromUser = (state, payload) => {
    const favDrinks = state.user.favDrinks
    favDrinks.splice(favDrinks.findIndex(drink => drink.id === payload), 1)
    Reflect.deleteProperty(state.user.fbKeys, payload )
  };
export const setLoading = (state, payload) => {
    state.loading = payload
  };
export const setError = (state, payload) => {
    state.error = payload
  };
export const clearError = (state) => {
    state.error = null
  };
export const themeChange = (state) => {
    state.darkTheme = !state.darkTheme
  };
export const createDrink = (state, payload) => {
    state.loadedDrinks.push(payload)
  };
export const setLoadedDrinks = (state, payload) => {
    state.loadedDrinks = payload
  };
export const updateDrink = (state, payload) => {
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
  };