<template>
  <div class="msite">
    <HeaderTop :title="address.name">
      <router-link slot="search" to="/search" class="header_search">
        <i class="iconfont icon-sousuo"></i>
      </router-link>

      <router-link slot="login" :to="userInfo._id?'/userinfo':'/login'" class="header_login">
        <span class="header_login_text" v-if="!userInfo._id">登录|注册</span>
        <span class="header_login_text " v-else>
          <i class="iconfont icon-person"></i>
        </span>
      </router-link>
    </HeaderTop>

    <div class="miste-content-wrapper">
      <div class="miste-content">
        <!--首页导航-->
        <nav class="msite_nav border-1px">
          <div class="swiper-container" v-if="categorysArr.length>0">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for="(cs, index) in categorysArr" :key="index">
                <a href="javascript:" class="link_to_food" v-for="(c, index2) in cs" :key="index2">
                  <div class="food_container">
                    <img :src="imgBaseUrl+c.image_url">
                  </div>
                  <span>{{c.title}}</span>
                </a>
              </div>
            </div>
            <!-- Add Pagination -->
            <div class="swiper-pagination"></div>
          </div>
          <img src="./images/msite_back.svg" v-else>
        </nav>
        <!--首页附近商家-->
        <div class="msite_shop_list border-1px">
          <div class="shop_header">
            <i class="iconfont icon-xuanxiang"></i>
            <span class="shop_header_title">附近商家</span>
          </div>
          <ShopList />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import BScroll from 'better-scroll'
  import Swiper from 'swiper' // 引入swiper.js（轮播）
  import 'swiper/dist/css/swiper.min.css' // 引入swiper.css
  import HeaderTop from '../../components/HeaderTop/HeaderTop.vue' // 引入固定头部组件
  import ShopList from '../../components/ShopList/ShopList.vue'

  export default {

    data () {
      return {
        imgBaseUrl: 'https://fuss10.elemecdn.com'
      }
    },

    mounted () {
      this.$store.dispatch('getCategorys')
      this.$store.dispatch('getShops')
    },

    computed: {
      ...mapState(['address', 'categorys', 'userInfo']),

      categorysArr () {
        const max = 8
        const arr = []
        const {categorys} = this
        let tempArr = null
        categorys.forEach((c, index) => {
          if(!tempArr) {
            tempArr = []
            arr.push(tempArr)
          }
          if(tempArr.length<max) {
            tempArr.push(c)
          }
          if(tempArr.length===max) {
            tempArr = null
          }
        })

        return arr
      }
    },

    watch: {

    },

    watch: {
      categorys(value) {
        this.$nextTick(() => {
          new Swiper('.swiper-container', {
            pagination: {
              el: '.swiper-pagination',
            },
            loop: true
          })

          new BScroll('.miste-content-wrapper', {
            click: true
          })
        })
      },
    },

    components: { // 映射成标签
      HeaderTop,
      ShopList
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl" // 引入mixins
  .msite // 首页
    width 100%
    height: 100%
    .miste-content-wrapper
      position fixed
      top: 45px
      bottom: 46px
      width: 100%
    .msite_nav
      bottom-border-1px(#e4e4e4)
      height 200px
      background #fff
      .swiper-container
        width 100%
        height 100%
        .swiper-wrapper
          width 100%
          height 100%
          .swiper-slide
            display flex
            justify-content center
            align-items flex-start
            flex-wrap wrap
            .link_to_food
              width 25%
              .food_container
                display block
                width 100%
                text-align center
                padding-bottom 10px
                font-size 0
                img
                  display inline-block
                  width 50px
                  height 50px
              span
                display block
                width 100%
                text-align center
                font-size 13px
                color #666
        .swiper-pagination
          >span.swiper-pagination-bullet-active
            background #02a774
    .msite_shop_list
      top-border-1px(#e4e4e4)
      margin-top 10px
      background #fff
      .shop_header
        padding 10px 10px 0 10px
        .shop_icon
          margin-left 5px
          color #999
        .shop_header_title
          color #999
          font-size 14px
          line-height 20px


</style>
