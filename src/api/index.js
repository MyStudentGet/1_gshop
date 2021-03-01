/*
包含n个接口请求函数的模块
与后台交互模块
函数的返回值：promise对象
url里加上“/api”的ajax都交给代理处理（在config/index.js内配置）
 */
import ajax from './ajax'

/**
 * 获取地址信息(根据经纬度串)
 */
export const reqAddress = geohash => ajax('/api/position/' + geohash)

/**
 * 获取msite页面食品分类列表
 */
export const reqCategorys = () => ajax('/api/index_category')

/**
 * 获取msite商铺列表(根据经纬度)
 */
export const reqShops = ({latitude, longitude}) => ajax('/api/shops', {latitude, longitude}) // 大括号括起来两个参数就变成一个参数（对象）了

/**
 * 根据关键字获取商家列表
 */
export const reqSearchGoods = (geohash, keyword) => ajax('/api/search_shops', {geohash, keyword})

/**
 * 获取图片验证码
 */
export const reqCaptchas = () => ajax('/api/captcha')

/**
 * 账号密码登录
 */
export const pwdLogin = (name, pwd, captcha) => ajax('/api/login_pwd', {
  name,
  pwd,
  captcha
}, 'POST')

/**
 * 发送短信验证码
 */
export const sendCode = phone => ajax('/api/sendcode', {phone})

/**
 * 手机号验证码登录
 */
export const smsLogin = (phone, code) => ajax('/api/login_sms', {phone, code}, 'POST')

/**
 * 获取用户信息(根据会话session)（自动登录）
 */
export const reqUser = () => ajax('/api/userinfo')

/**
 * 请求登出
 */
export const reqLogout = () => ajax('/api/logout')

/**
 * 获取商家信息（URL里没加“/api”所以不会被代理拦截）（会被mockjs(模拟数据)拦截）
 */
export const reqShopInfo = () => ajax('/shop_info')

/**
 * 获取商家评价数组（会被mockjs(模拟数据)拦截）
 */
export const reqShopRatings = () => ajax('/shop_ratings')

/**
 * 获取商家商品数组（会被mockjs(模拟数据)拦截）
 */
export const reqShopGoods = () => ajax('/shop_goods')
