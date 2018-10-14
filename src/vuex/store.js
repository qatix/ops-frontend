import Vue from 'vue'
import Vuex from 'vuex'

import user from './modules/user'
import app from './modules/app'
import tagsView from './modules/tagsView'
import permission from './modules/permission'
import getters from './getters'

Vue.use(Vuex)
export default new Vuex.Store({
  modules: {
    app,
    permission,
    tagsView,
    user
  },
  getters,
  strict: true
})
