// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Meta from 'vue-meta'
import BootstrapVue from 'bootstrap-vue'
import './assets/scss/custom.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import bFormSlider from 'vue-bootstrap-slider'
import 'bootstrap-slider/dist/css/bootstrap-slider.css'
import 'vue-awesome/icons/asterisk.js'
import 'vue-awesome/icons/info-circle.js'
import 'vue-awesome/icons/closed-captioning'
import 'vue-awesome/icons/file.js'
import 'vue-awesome/icons/clipboard.js'
import Icon from 'vue-awesome/components/Icon.js'
import router from './router'
import '@/assets/main.css'
import { Slider, Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VeeValidate from 'vee-validate'
import VueClipboard from 'vue-clipboard2'
import axios from 'axios'
import VueAxios from 'vue-axios'
import VueAuth from './auth'
import auth from './auth/drivers/auth/bearer.js'
import http from './auth/drivers/http/axios.1.x.js'
import routerDriver from './auth/drivers/router/vue-router.2.x.js'
import 'babel-polyfill'
import MathJax from './MathJax.js'

Vue.use(Meta)
Vue.use(BootstrapVue)
Vue.use(bFormSlider)
Vue.use(Slider)
Vue.prototype.$message = Message
Vue.use(VeeValidate, { fieldsBagName: 'veeFields' })
Vue.use(VueClipboard)
Vue.use(VueAxios, axios)
Vue.router = router
Vue.config.productionTip = false
Vue.prototype.MathJax = MathJax

Vue.use(VueAuth, {
  auth: auth,
  http: http,
  router: routerDriver
})

Vue.component('icon', Icon)

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
