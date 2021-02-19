<template>
  <div id="app">
<!--    上面是路由组件，下面是导航栏-->
    <router-view></router-view>
    <FooterGuide v-show="$route.meta.showFooter"></FooterGuide>
<!--   $route： 当前路由组件。判断导航栏是否要显示（注册界面不需要显示导航栏，所以要加个判断）-->
  </div>
</template>

<script>
// 引入导航组件
  import FooterGuide from './components/FooterGuide/FooterGuide.vue'

  export default {

    created () {
      // 异步获取address
      this.$store.dispatch('getAddress')
      // 异步获取登陆用户信息
      this.$store.dispatch('getUserInfo')
      this.$store.dispatch('getShopInfo')
    },

    components: {
      FooterGuide // 映射成标签
    }
  }
</script>

<!--  stylus:当前主流的css预编译期之一下面这段是它的语法 -->
<style lang="stylus" rel="stylesheet/stylus">
  #app
    width 100%
    height 100%
    position relative
</style>
