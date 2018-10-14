let app_config = localStorage.getItem('config')
app_config = app_config ? JSON.parse(app_config) : null
const app = {
  state: {
    sidebar: {
      opened: true
    },
    config: app_config
  },
  mutations: {
    TOGGLE_SIDEBAR: state => {
      state.sidebar.opened = !state.sidebar.opened
    },
    TOGGLE_DEVICE: (state, device) => {
      state.device = device
    }
    ,
    SET_CONFIG: (state, config) => {
      localStorage.setItem('config', JSON.stringify(config))
      state.config = config
    }
  },
  actions: {
    toggleSideBar({commit}) {
      commit('TOGGLE_SIDEBAR')
    },
    toggleDevice({commit}, device) {
      commit('TOGGLE_DEVICE', device)
    },
    async getBaseData({commit}) {
      let res = await this.api.newReq('sys/common/base').get()
      if(res.code == 0) {
        commit('SET_CONFIG', res.data)
        return res
      } else {
        return {};
      }
    }
  }
}

export default app
