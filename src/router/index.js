import Vue from 'vue'
import Router from 'vue-router'
/* Layout */
import Layout from '../views/layout/Layout'

const _import = function (path) {
  return ()=> import(`@/views/${path}`)
}
// in development-env not use lazy-loading, because lazy-loading too many pages will cause webpack hot update too slow. so only in production use lazy-loading;
// detail: https://panjiachen.github.io/vue-element-admin-site/#/lazy-loading

Vue.use(Router)

/** note: submenu only apppear when children.length>=1
 *   detail see  https://panjiachen.github.io/vue-element-admin-site/#/router-and-nav?id=sidebar
 **/

/**
 * hidden: true                   if `hidden:true` will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu, whatever its child routes length
 *                                if not set alwaysShow, only more than one route under the children
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noredirect           if `redirect:noredirect` will no redirct in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']     will control the page roles (you can set multiple roles)
    title: 'title'               the name show in submenu and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar,
    noCache: true                if true ,the page will no be cached(default is false)
  }
 **/
export const constantRouterMap = [
  {path: '/login', component: _import('login/index'), hidden: true},
  {path: '/404', component: _import('errorPage/404'), hidden: true},
  {path: '/401', component: _import('errorPage/401'), hidden: true},
  {
    path: '',
    component: Layout,
    redirect: 'home',
    children: [{
      path: 'home',
      component: _import('common/home'),
      name: 'home',
      meta: {title: '首页', icon: '&#xe600;', noCache: true}
    }]
  }
]

export default new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({y: 0}),
  routes: constantRouterMap
})

export const asyncRouterMap = [
  {
    path: '/base',
    component: Layout,
    redirect: 'noredirect',
    name: 'baseData',
    meta: {
      title: '基础数据',
      icon: '&#xe601;'
    },
    children: [

      {
        path: 'country/list',
        component: _import("base/country/list"),
        name: 'countryList',
        meta: {title: '国家', cache: false}
      },
      {
        path: 'country/add',
        component: _import("base/country/form"),
        name: 'countryAddForm',
        meta: {title: '添加国家'},
        hidden: true
      },
      {
        path: 'country/edit/:id',
        component: _import("base/country/form"),
        name: 'countryEditForm',
        meta: {title: '编辑国家'},
        hidden: true
      },
      {
        path: 'phone/list',
        component: _import("base/phone/list"),
        name: 'phoneList',
        meta: {title: '机型信息', cache: false}
      },
      {
        path: 'phone/add',
        component: _import("base/phone/form"),
        name: 'phoneAddForm',
        meta: {title: '添加机型信息'},
        hidden: true
      },
      {
        path: 'phone/edit/:id',
        component: _import("base/phone/form"),
        name: 'phoneEditForm',
        meta: {title: '编辑机型信息'},
        hidden: true
      },
      {
        path: 'product/list',
        component: _import("base/product/list"),
        name: 'productList',
        meta: {title: '商品', cache: false}
      },
      {
        path: 'product/add',
        component: _import("base/product/form"),
        name: 'productAddForm',
        meta: {title: '添加商品'},
        hidden : true
      },
      {
        path: 'product/edit/:id',
        component: _import("base/product/form"),
        name: 'productEditForm',
        meta: {title: '编辑商品'},
        hidden : true
      },
    ]
  },
  {
    path: '/sys',
    component: Layout,
    redirect: 'noredirect',
    name: 'setting',
    meta: {
      title: '系统设置',
      icon: '&#xe6e6;'
    },
    children: [
      {
        path: 'user/list',
        component: _import('sys/user/list'),
        name: 'userList',
        meta: {title: '管理员设置', cache: true}
      },
      {
        path: 'user/add',
        component: _import('sys/user/form'),
        name: 'userAddForm',
        meta: {title: '添加员工'},
        hidden: true
      },
      {
        path: 'user/edit/:id',
        component: _import('sys/user/form'),
        name: 'userEditForm',
        meta: {title: '编辑员工'},
        hidden: true
      },
      {
        path: 'dept/list',
        component: _import('sys/dept/list'),
        name: 'deptList',
        meta: {title: '部门设置', cache: true}
      },
      {
        path: 'dept/add',
        component: _import('sys/dept/form'),
        name: 'deptAddForm',
        meta: {title: '添加部门'},
        hidden: true
      },
      {
        path: 'dept/edit/:id',
        component: _import('sys/dept/form'),
        name: 'deptEditForm',
        meta: {title: '编辑部门'},
        hidden: true
      },
      {
        path: 'role/list',
        component: _import('sys/role/list'),
        name: 'roleList',
        meta: {title: '角色设置', cache: false}
      },
      {
        path: 'role/add',
        component: _import('sys/role/form'),
        name: 'roleAddForm',
        meta: {title: '添加角色'},
        hidden: true
      },
      {
        path: 'role/edit/:id',
        component: _import('sys/role/form'),
        name: 'roleEditForm',
        meta: {title: '编辑角色'},
        hidden: true
      },
      {
        path: 'log/list',
        component: _import('sys/log/list'),
        name: 'logList',
        meta: {title: '系统Log', cache: false}
      },
    ]
  },
  {path: '*', redirect: '/404', hidden: true}
]

