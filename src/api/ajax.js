/*
ajax请求函数模块
返回值：promise对象（异步返回的数据是：response.data）
发送ajax请求会导致跨域问题
解决方法：配置代理（在config/index.js内配置）
*/
import axios from 'axios'

export default function ajax(url = '', data = {}, type = 'GET') { // 默认暴露一个函数ajax（地址，参数（以对象的形式），请求方式）
  return new Promise(function (resolve, reject) { // 外面又套了一层promise
    // 内层promise是由axios返回的response对象，我们想要拿到里面的数据就必须通过response.data
    // 外层promise是由自己创建，如果成功就调用resolve（里面是response.data），失败就调用reject（）
    // 好处：外部调用就直接获取到自己想要的数据，而不是response对象


    // 执行异步ajax请求
    // 成功了调用resolve（）
    // 失败了调用reject（）

    let promise

    if (type === 'GET') { // get请求把参数拼到URL地址上
      // 准备url query参数数据
      let dataStr = '' //数据拼接字符串
      Object.keys(data).forEach(key => {
        dataStr += key + '=' + data[key] + '&'
      })
      if (dataStr !== '') {
        dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
        url = url + '?' + dataStr
      }
      // 发送get请求
      promise = axios.get(url)
    } else {
      // 发送post请求
      promise = axios.post(url, data)
    }

    promise.then(response => { // 成功的回调函数（axios返回的就是response）
      resolve(response.data)
    })
      .catch(error => { // 失败的回调函数
        reject(error)
      })
  })
}
