/*
vuex的actions模块
 */
import {
  reqAddress,
  reqCategorys,
  reqShops,
  reqUser,
  reqShopGoods,
  reqShopRatings,
  reqShopInfo,
  reqSearchGoods,
  reqLogout
} from '../api' // 引入发送ajax请求的接口

import {
  RECEIVE_ADDRESS,
  RECEIVE_CATEGORYS,
  RECEIVE_SHOPS,
  RECEIVE_USER_INFO,
  RECEIVE_INFO,
  RESET_USER_INFO,
  RECEIVE_RATINGS,
  RECEIVE_SEARCH_SHOPS,
  RECEIVE_GOODS,
  INCRMENT_FOOD_COUNT,
  DECRMENT_FOOD_COUNT,
  CLEAR_CART,
} from './mutation-types' // 引入定义好的变量

export default {
  // 异步获取地址
  async getAddress({commit, state}) { // async异步：这个AJAX代码运行中的时候其他代码一样可以运行
    // 把经纬度通过“，”连接起来（reqAddress方法需要这个参数）
    const geohash = state.latitude + ',' + state.longitude
    // 调用api里的函数发送异步ajax请求
    const result = await reqAddress(geohash)
    // 把响应的数据
    commit(RECEIVE_ADDRESS, {address: result.data})
  },

  // 异步获取分类列表
  async getCategorys({commit}) {
    const result = await reqCategorys()
    commit(RECEIVE_CATEGORYS, {categorys: result.data})
  },

  // 异步获取商家列表
  async getShops({commit, state}) {
    const {latitude, longitude} = state
    const result = await reqShops({latitude, longitude})
    commit(RECEIVE_SHOPS, {shops: result.data})
  },

  //异步搜索商家列表
  async searchShop({commit, state}, keyword) {
    const {latitude, longitude} = state
    const result = await reqSearchGoods(latitude+','+longitude, keyword)
    commit(RECEIVE_SEARCH_SHOPS, {searchShops: result.data})
  },

  //同步记录用户信息
  recordUserInfo({commit}, userInfo) {
    commit(RECEIVE_USER_INFO, {userInfo})
  },

  // 异步获取用户信息（自动登录）
  async getUserInfo({commit}) {
    const result = await reqUser()
    if(result.code===0) {
      commit(RECEIVE_USER_INFO, {userInfo: result.data})
    }
  },

  // 异步登出
  async logout({commit}) {
    const result = await reqLogout()
    if(result.code===0) {
      commit(RESET_USER_INFO) // 重置用户信息
    }
  },

  // 异步获取商家信息
  async getShopInfo({commit}, cb) {
    const result = await reqShopInfo()
    if(result.code===0) {
      const info = result.data
      info.score = 3.5
      commit(RECEIVE_INFO, {info})

      cb && cb()
    }
  },

  // 异步获取商家评价列表
  async getShopRatings({commit}, cb) {
    const result = await reqShopRatings()
    if(result.code===0) {
      const ratings = result.data
      commit(RECEIVE_RATINGS, {ratings})

      cb && cb()
    }
  },

  // 异步获取商家商品列表
  async getShopGoods({commit}, cb) {
    const result = await reqShopGoods()
    if(result.code===0) {
      const goods = result.data
      commit(RECEIVE_GOODS, {goods})
      // 如果组件中传递了接收消息的回调函数, 数据更新后, 调用回调通知调用的组件
      cb && cb() // 传过来函数就执行不然就不执行
    }
  },

  // 增加/减少指定食物的数量
  updateFoodCount ({commit}, {food, isAdd}) {
    if(isAdd) {
      commit(INCRMENT_FOOD_COUNT, {food})
    } else {
      commit(DECRMENT_FOOD_COUNT, {food})
    }
  },

  // 清空购物车
  clearCart ({commit}, foods) {
    commit(CLEAR_CART, {foods})
  },
}
