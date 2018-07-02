export default ({
  state: {
    loading: false,
    error: null,
    darkTheme: false
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
    }
  },
  actions: {
    clearError({commit}) {
        commit('clearError')
    },
    themeChange({commit}) {
        commit('themeChange')
    }
  },
  getters: {
    darkTheme (state) {
      return state.darkTheme
    },
    loading (state) {
        return state.loading
    },
    error (state) {
        return state.error
    }
  }
})
