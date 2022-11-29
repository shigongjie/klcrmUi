import router from './router'
import store from './store'
import {
  Message
} from 'element-ui'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'
import {
  getToken,
  setToken
} from '@/utils/auth'
import {
  isRelogin
} from '@/utils/request'

NProgress.configure({
  showSpinner: false
})

const whiteList = ['/login', '/auth-redirect', '/bind', '/register', '/loginh5','/rechargeSuccess']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (to.path == '/home' || to.path == '/publicSaleh5' || to.path == '/AIlisth5'
    || to.path == '/phonelogsh5' || to.path == '/phoneTaskDetailh5'
    || to.path == '/customerh5' || to.path == '/saleleadh5' || to.path == '/seacustomerh5') {
    var token = to.query.token;
    if(token) {
      setToken(token)
      store.commit('SET_TOKEN', token)
    }
    /*if (to.fullPath.split("?")[1]) {
      to.fullPath.split("?")[1].split('=')[1]
      setToken(to.fullPath.split("?")[1].split('=')[1])
      store.commit('SET_TOKEN', to.fullPath.split("?")[1].split('=')[1])
    }*/
  }
  if (document.documentElement.clientWidth > 750) {
    if (getToken()) {
      to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
      /* has token*/
      if (to.path === '/login') {
        next({
          path: '/'
        })
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) {
          isRelogin.show = true
          // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetInfo').then(() => {
            isRelogin.show = false
            store.dispatch('GenerateRoutes').then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({
                ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成
            })
          }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({
                path: '/'
              })
            })
          })
        } else {
          next()
        }
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/login?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  } else {
    if (getToken()) {
      to.meta.title && store.dispatch('settings/setTitle', to.meta.title)
      /* has token*/
      if (to.path === '/loginh5') {
        next({
          path: '/home'
        })
        NProgress.done()
      } else {
        if (store.getters.roles.length === 0) {
          isRelogin.show = true
          // 判断当前用户是否已拉取完user_info信息
          store.dispatch('GetInfo').then(() => {
            isRelogin.show = false
            store.dispatch('GenerateRoutes').then(accessRoutes => {
              // 根据roles权限生成可访问的路由表
              router.addRoutes(accessRoutes) // 动态添加可访问路由表
              next({
                ...to,
                replace: true
              }) // hack方法 确保addRoutes已完成
            })
          }).catch(err => {
            store.dispatch('LogOut').then(() => {
              Message.error(err)
              next({
                path: '/loginh5'
              })
            })
          })
        } else {
          // store.dispatch('LogOut').then(() => {
          next()
          // })
        }
      }
    } else {
      // 没有token
      if (whiteList.indexOf(to.path) !== -1) {
        // 在免登录白名单，直接进入
        next()
      } else {
        next(`/loginh5?redirect=${to.fullPath}`) // 否则全部重定向到登录页
        NProgress.done()
      }
    }
  }


})

router.afterEach(() => {
  NProgress.done()
})
