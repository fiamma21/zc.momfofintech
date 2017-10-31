// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import router from './router'
import axios from 'axios'
import store from './store/index'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-default/index.css'
import App from './App'

axios.defaults.baseURL = '/web-asset/'
//  axios.defaults.baseURL = 'http://zc.momfofintech.com/'
//  拦截响应
//  axios.interceptors.response.use(response => {
//   console.log('拦截响应main', response.data)
//   return response
// },
//   error => Promise.resolve(error.response))
Vue.use(ElementUI)
Vue.config.productionTip = false
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App }
})

