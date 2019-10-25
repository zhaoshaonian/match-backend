// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import iView from 'iview'
import config from '@/config'
import importDirective from '@/directive'
import 'iview/dist/styles/iview.css'
import './index.less'
import '@/assets/icons/iconfont.css'
import './libs/iview-cfg'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

import Navigation from './assets/js/vue-navigation.esm'
Vue.use(Navigation, { router })

Vue.use(iView)
Vue.use(ElementUI)
Vue.config.productionTip = false

//  添加bus属性，组件间通信
Vue.prototype.$bus = new Vue()
/**
 * @description 全局注册应用配置
 */
Vue.prototype.$config = config
/**
 * 注册指令
 */
importDirective(Vue)
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
