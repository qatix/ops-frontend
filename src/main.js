import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import api from './service/index'
import xhr from './service/xhr'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import './errorLog' // error log
import './permission' // permission control

Vue.config.productionTip = false

Vue.use(ElementUI)
store.api = api
store.xhr = xhr

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {App},
  template: '<App/>'
})
