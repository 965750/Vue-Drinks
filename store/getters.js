export const user = (state) => {
    return state.user
  };
export const darkTheme = (state) => {
    return state.darkTheme
  };
export const loading = (state) => {
      return state.loading
  };
export const  error = (state) => {
      return state.error
  };
export const  ingredients = (state) => {
    return state.ingredients
  };
export const loadedDrinks = (state) => {
    return state.loadedDrinks.sort((drinkA, drinkB) => {
      return drinkA.date > drinkB.date
    })
  };
export const  newdrinks = (state, getters) => {
    return getters.loadedDrinks
  };
export const  loadedDrink = (state) => {
    return (drinkId) => {
      return state.loadedDrinks.find((drink) => {
        return drink.id == drinkId
      })
    }
  };
