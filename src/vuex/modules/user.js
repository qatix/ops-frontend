import {getToken, setToken} from '@/utils/auth'

let userTemp = localStorage.getItem('user')
userTemp = userTemp ? JSON.parse(userTemp) : {}
const user = {
  state: {
    user: userTemp,
    name: userTemp.name,
    avatar: userTemp.avatar,
    token: getToken()
  },

  mutations: {
    SET_USER: (state, user) => {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    SET_TOKEN: (state, token) => {
      setToken(token)
      state.token = token
    },
    SET_ROLES: (state, roles) => {
      state.roles = roles
    }
  },

  actions: {
    async login({commit, dispatch}, userInfo) {
      let res = {}
      res = await this.api.newReq('api/login').post({...userInfo})
      if (res.code === 0) {
        let user = {
          id: res.data.id,
          name: res.data.username,
          roles: res.data.is_admin ? 'admin' : '',
          token: res.data.token,
          avatar: res.data.picture
        }

        commit('SET_USER', user)
        commit('SET_TOKEN', user.token)
        commit('SET_ROLES', user.roles)
      }
      return res
    },
    logout({ commit }) {
      commit('SET_USER', '')
      commit('SET_TOKEN', '')
      commit('SET_ROLES', '')
    }
  }
}

export default user
