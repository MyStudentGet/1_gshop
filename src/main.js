import Vue from 'vue'
import VueResource from 'vue-resource'
import VueLazyload from 'vue-lazyload'
import { Button,Swipe, SwipeItem} from 'mint-ui' // 引入mint-ui
import VueScroller from 'vue-scroller'
import FastClick from 'fastclick'

import App from './App.vue'
import Split from "./components/Split/Split.vue"
import router from './router' // 引入路由器
import store from './store' // 注册store(vuex)
import './filters'
import './mock/mockServer'  // 加载这个模块即可（模拟数据）
import loading from './common/imgs/loading.gif'

Vue.use(VueResource) // 所有组件对象都多了一个属性: $http(发送ajax请求)
Vue.use(VueLazyload, { // 内部会定义一个全局的指令: lazy
  loading
})
Vue.use(VueScroller) // 内部定义了一个全局的组件标签<scroller>

// 注册全局组件(映射成标签)
Vue.component("Split", Split)
Vue.component(Button.name, Button) // mint-ui按钮全局标签

if ('addEventListener' in document) {
  document.addEventListener('DOMContentLoaded', function() {
    FastClick.attach(document.body);
  }, false);
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>',
  router, // 配置路由器（$router(对象),$route（数据））
  store // 使用上vuex
})
