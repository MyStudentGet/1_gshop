import Mock from 'mockjs' // 引入mockjs
import data from './data.json' // 引入数据模板

// console.log('mockServer')
// 使用mockjs提供模拟数据接口
// 安装 npm install --save mockjs
// main.js里引入这个文件
// 指定监听的url和对应的json数据模板
// 数据格式不变，值可以变

// 返回shop_goods的接口(南瓜粥的价格使用了随机数据)
Mock.mock('/shop_goods', { // 拦截ajax请求/shop_goods
  code: 0,
  data: data.goods
})

// 返回shop_ratings的接口
Mock.mock('/shop_ratings', {
  code: 0,
  data: data.ratings
})

// 返回shop_info的接口
Mock.mock('/shop_info', {
  code: 0,
  data: data.info
})

// export default xxx  不需要向外暴露任何数据，只需要保证执行即可
