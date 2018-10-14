import router from './router'
import store from './vuex/store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style

NProgress.configure({showSpinner: false})// NProgress Configuration

function hasPermission(roles, permissionRoles) {
  // console.log({roles, permissionRoles})
  if (roles === 'admin') return true
  if (!permissionRoles) return true
  return roles.some(role => permissionRoles.indexOf(role) >= 0)
}

const whiteList = ['/login']// no redirect whitelist
let is_init_router = false
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
    next()
  } else {
    if (store.getters.token) {
      if (to.path === '/login') {
        next({path: '/'})
        NProgress.done()
      } else {
        if (!is_init_router) {
          console.log('persmission:getBaseData')
          let res = await store.dispatch('getBaseData')
          console.log('get res')
          console.log(res)
          if (res.code === 0) {
            await store.dispatch('GenerateRoutes', {roles: store.getters.roles})
            is_init_router = true
            router.addRoutes(store.getters.addRouters)
            next({...to, replace: true})
          } else if (res.status == 401) {
            console.log('not loggin -> login')
            next('/login')
            NProgress.done()
          } else {
            Message.error(res.msg || '初始化数据失败')
          }
        }
        if (hasPermission(store.getters.roles, to.meta.roles)) {
          next()
        } else {
          next({path: '/401', replace: true, query: {noGoBack: true}})
        }
      }
    } else {
      next('/login')
      NProgress.done() // if current page is login will not trigger afterEach hook, so manually handle it
    }
  }
})

router.afterEach(() => {
  NProgress.done()
})
