/*
路由器模块
 */
 // 引入vue和vue-router（路由组件）
import Vue from 'vue'
import VueRouter from 'vue-router'

import Msite from '../pages/Msite/Msite.vue' // 首页
import Search from '../pages/Search/Search.vue' // 搜索页
import Order from '../pages/Order/Order.vue' // 订单
import Profile from '../pages/Profile/Profile.vue' // 个人中心
import Login from '../pages/Login/Login.vue' // 登录
import Shop from '../pages/Shop/Shop.vue' // 商品页
import ShopGoods from '../pages/Shop/ShopGoods/ShopGoods.vue' // 点餐（子路由）
import ShopRatings from '../pages/Shop/ShopRatings/ShopRatings.vue' // 评价（子路由）
import ShopInfo from '../pages/Shop/ShopInfo/ShopInfo.vue' // 商家（子路由）

// 声明使用插件
Vue.use(VueRouter)

 // 配置所有路由（数组，每个对象就是一个路由）
export default new VueRouter({
  routes: [
    {
      path: '/',
      redirect: '/msite' // 默认路由
    },
    {
      path: '/msite',
      component: Msite,
      meta: { // 给路由添加一个属性（后面会用他做判断是否显示组件，通过$route就可以得到）
        showFooter: true
      }
    },
    {
      path: '/search',
      component: Search,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/order',
      component: Order,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/profile',
      component: Profile,
      meta: {
        showFooter: true
      }
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/shop',
      component: Shop,
      children: [
        {
          path: '/shop/goods',
          component: ShopGoods
        },
        {
          path: '/shop/ratings',
          component: ShopRatings
        },
        {
          path: '/shop/info',
          component: ShopInfo
        },
        {
          path: '', // 默认路由
          redirect: '/shop/goods'
        }
      ]
    }
  ]
})

