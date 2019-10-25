import Vue from 'vue'
import Router from 'vue-router'
import router from '../router'
import routes from './routers'
import store from '@/store'
import iView from 'iview'
import { getToken, canTurnTo } from '@/libs/util'

Vue.use(Router)

export default new Router({
  routes,
  //mode: 'history'
})
const LOGIN_PAGE_NAME = 'login'

router.beforeEach((to, from, next) => {
  try{
    document.title = to.meta.sidehead || "后台管理系统";
  }catch(e){
      console.warn('load title warning!')}
      iView.LoadingBar.start()
      const token = getToken()
      if (!token && to.name !== LOGIN_PAGE_NAME) {
        // 未登录且要跳转的页面不是登录页
        next({
          name: LOGIN_PAGE_NAME // 跳转到登录页
        })
      } else if (!token && to.name === LOGIN_PAGE_NAME) {
        // 未登陆且要跳转的页面是登录页
        next() // 跳转
      } else if (token && to.name === LOGIN_PAGE_NAME) {
        // 已登录且要跳转的页面是登录页
        next({
          name: 'home' // 跳转到home页
        })
      } else {
          next()
      }
})

router.afterEach((to,from,next) => {
  iView.LoadingBar.finish()
  window.scrollTo(0, 0)

})


