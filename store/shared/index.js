export default ({
  state: {
    loading: false,
    error: null,
    darkTheme: false
  },
  mutations: {
    'M_SET_LOADING'(state, payload) {
      state.loading = payload
    },
    'M_SET_ERROR'(state, payload) {
      state.error = payload
    },
    'M_CLEAR_ERROR'(state) {
      state.error = null
    },
    'M_THEME_CHANGE'(state) {
      state.darkTheme = !state.darkTheme
    }
  },
  actions: {
    'A_CLEAR_ERROR'({commit}) {
        commit('M_CLEAR_ERROR')
    },
    'A_THEME_CHANGE'({commit}) {
        commit('M_THEME_CHANGE')
    }
  },
  getters: {
    darkTheme (state) {
      return state.darkTheme
    },
    'G_LOADING'(state) {
        return state.loading
    },
    'G_ERROR'(state) {
        return state.error
    }
  }
})
