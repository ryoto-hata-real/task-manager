const state = () => ({
  user: null,
})

const mutations = {
  SET_USER(state, user) {
    state.user = user
  },
}

const actions = {
  async onAuthStateChangedAction(state, { authUser, claims }) {
    if (!authUser) {
      // authされていない場合
      state.commit('SET_USER', state.user)

      // リダイレクトの設定
      this.$router.push({
        path: '/auth/signin',
      })
    } else {
      // authされている場合
      const { uid, email } = authUser
      state.commit('SET_USER', {
        uid,
        email,
      })
    }
  }
}

const getters = {
  getUser(state) {
    return state.user
  },
  isAuthenticated(state) {
    // tokenがnullでないなら認証されているということ
    return state.user != null
  }
}

export default {
  state,
  mutations,
  actions,
  getters,
}