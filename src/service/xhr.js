import axios from 'axios'
import Vue from 'vue'
import store from '../vuex/store'
import {getToken} from '@/utils/auth'

axios.defaults.timeout = 15000000
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded; charset=UTF-8'
axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest'

axios.interceptors.request.use((config) => {
  if (store.getters.token) {
    config.headers['X-token'] = store.getters.token
  }

  return config
}, (error) => {
  console.log('xhr:req:error')
  console.log(error)
  return Promise.reject(error)
})


axios.interceptors.response.use(
  response => {
    if (response.status == 302) {
      console.log('302 response')
      console.log(response.headers)
      console.log('new location:')
      console.log(response.headers.location)
    }

    if (response.status === 200) {
      let data = response.data
      return data
    } else if (response.status == 401) {
      Vue.prototype.$message({
        showClose: true,
        message: data.error,
        type: 'warning',
        onClose: () => {
          store.dispatch('logout').then(() => {
            location.reload()
          })
        }
      })
    } else {
      console.log('response error')
      return Promise.reject('error')
    }
  },
  error => {
    console.log('resp error:')
    console.log(error)
    // console.log(response)
    console.dir(error)
    console.log('code:' + error.response.status)
    if (error.response.status == 401) {
      if (error.response.data.message == "not_logged_in") {
        console.log('try to logout')
        store.dispatch('logout').then(() => {
          location.reload()
        })
      }
    }

    Vue.prototype.$message({
      showClose: true,
      message: error.message || '网络错误!',
      type: 'warning'
    })
    return Promise.reject(error)
  })
export default class XHR {
  constructor(url) {
    this.url = url
    this.post = this.post.bind(this)
    this.get = this.get.bind(this)
    this.upload = this.upload.bind(this)
  }

  async get(data = {}) {
    return await axios.get(this.url, {params: {...data}})
  }

  async post(data = {}) {
    return await axios.post(this.url, data)
  }

  async upload(data = {}) {
    let file = data.file
    let param = new FormData()
    param.append('file', file, file.name)

    console.log(param.get('file'))
    let config = {
      headers: {'Content-Type': 'multipart/form-data'}
    }
    return await axios.post(this.url, param, config)
  }
}
