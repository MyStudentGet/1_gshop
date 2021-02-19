<template>
  <footer class="footer_guide border-1px">
    <div class="guide_item" @click="goto('/msite')" :class="{on: isCurrent('/msite')}">
<!--     :class="{on: isCurrent('/msite')}"  如果路径是‘/msite’就添加类名on（效果：点击哪个路由就变色）-->
      <span class="item_icon">
        <i class="iconfont icon-waimai"></i>
      </span>
      <span>首页</span>
    </div>
    <div class="guide_item" @click="goto('/search')" :class="{on: isCurrent('/search')}">
      <span class="item_icon">
        <i class="iconfont icon-search"></i>
      </span>
      <span>搜索</span>
    </div>
    <div class="guide_item" @click="goto('/order')" :class="{on: isCurrent('/order')}">
      <span class="item_icon">
        <i class="iconfont icon-dingdan"></i>
      </span>
      <span>订单</span>
    </div>
    <div class="guide_item" @click="goto('/profile')" :class="{on: isCurrent('/profile')}">
      <span class="item_icon">
        <i class="iconfont icon-geren"></i>
      </span>
      <span>我的</span>
    </div>
  </footer>
</template>

<script>
  export default {
    methods: { // 方法
      goto(path) { // 点击转换路由
        // replace:   跳转到指定url路径，但是history栈中不会有记录，点击返回会跳转到上上个页面
        this.$router.replace(path)
      },
      isCurrent(path) { // 点击切换路由样式
        // console.log(this.$route.path)
        return this.$route.path === path
      }
    }
  }
</script>

<!-- 层次缩进结构很重要-->
<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl" // 引入stylus定义的边框样式模板
  .footer_guide
    top-border-1px(#e4e4e4) // 定义stylus样式模板（一像素上边框）
    position fixed
    z-index 100
    left 0
    right 0
    bottom 0
    background-color #fff
    width 100%
    height 50px
    display flex
    .guide_item
      display flex
      flex 1
      text-align center
      flex-direction column
      align-items center
      margin 5px
      color #999999
      &.on
        color #02a774
      span
        font-size 12px
        margin-top 2px
        margin-bottom 2px
        .iconfont
          font-size 22px
</style>
