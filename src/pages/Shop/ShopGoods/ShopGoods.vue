<template>
  <div class="goods-wrap">
    <div class="goods">
<!--      食物分类列表（ref：方便迅速定位到指定位置）-->
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <!--current-->   <!--currentIndex-->
          <li class="menu-item" v-for="(good, index) in goods"
              :key="index" :class="{current: currentIndex===index}" @click="clickMenu(index)">
<!--            类名确定只是不确定有没有就用这种方法-->
            <span class="text bottom-border-1px">
              <img class="icon" v-if="good.icon" :src="good.icon">
              {{good.name}}
            </span>
          </li>
        </ul>
      </div>
<!--      食物列表-->
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list food-list-hook" v-for="(good, index) in goods" :key="index">
<!--            第一层遍历（遍历分类）二维数组-->
            <h1 class="title">{{good.name}}</h1>
            <ul>
              <li class="food-item bottom-border-1px" v-for="(food, index) in good.foods"
                  :key="index" @click="showFood(food)">
<!--                第二层遍历（遍历分类里面的食物）-->
                <div class="icon">
                  <img width="57" height="57" :src="food.icon">
<!--                  food中icon是小图，image是大图-->
                </div>
                <div class="content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc">{{food.description}}</p>
                  <div class="extra">
                    <span class="count">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-if="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-wrapper">
                    <cart-control :food="food" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shop-cart />
    </div>
    <food :food="food" ref="food" />
  </div>
</template>

<script>
  import BScroll from 'better-scroll' // 引入第三方库better-scroll UI滑动（屏幕拉动回弹）
  import {mapState} from 'vuex'

  import CartControl from '../../../components/CartControl/CartControl.vue' //
  import ShopCart from '../../../components/ShopCart/ShopCart.vue'
  import Food from '../../../components/Food/Food.vue'

  export default {
    data() {
      return {
        scrollY: 0, //右侧滑动的y坐标
        tops: [], // 所有右侧分类li标签的top所组成数组
        food: {}
      }
    },
    mounted() {
      this.$store.dispatch('getShopGoods', () => { // 传了一个数据（箭头函数）
        // 从后台获取的数据已更新到状态中, 但界面还没有更新(界面的更新是异步的)
        /*setTimeout(() => {
          new BScroll(this.$refs.menuWrapper)
        }, 20)*/
        // 在状态更新之后执行
        this.$nextTick(() => { // 回调函数在界面更新之后立即执行
          this._initScroll()
          this._initTops()
        })
      })
    },

    methods: {
      // 初始化滚动
      _initScroll () {
        // 控制左侧列表滑动的scroll
        new BScroll(this.$refs.menuWrapper, { // new一个better-scroll对象并添加配置（this.$refs.menuWrapper：ref找到元素节点的方法）
          click: true  // 分发点击事件（better-scroll默认会阻止浏览器的原生click事件，最新版的就不会了，但还是写上比较好）
        })

        // 控制右侧列表滑动的scroll
        this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
          // startY: -100
          probeType: 1, //会在滑动(手指触摸)过程中实时派发scroll事件
          click: true // 分发点击事件
        })

        // 监视右侧列表的滚动
        this.foodsScroll.on('scroll', (event) => { // event（事件对象）里包括x和y   on:绑定事件（事件名称是固定的官方文档可查）
          // 获取滚动的y坐标
          // console.log('scroll', event.y)
          this.scrollY = Math.abs(event.y) // 获取y的绝对值
        })

        // 监视右侧列表的滚动结束（防止因惯性滑动无法被监听到）
        this.foodsScroll.on('scrollEnd', (event) => {
          // 获取滚动的y坐标
          // console.log('scrollEnd', event.y)
          this.scrollY = Math.abs(event.y)
        })
      },

      // 找到每一个类别的位置
      _initTops () {
        // 找到所有li
        const lis = this.$refs.foodsWrapper.getElementsByClassName('food-list-hook')
        // 统计top
        const tops = [] // 储存类别位置的数组
        let top = 0
        tops.push(top) // 放入第一个类别
        Array.prototype.slice.call(lis).forEach(li => { // 把伪数组lis转换成真数组，然后遍历
          top += li.clientHeight // clientHeight: 可理解为内部可视区高度，样式的height+上下padding
          tops.push(top) // 放入下一个类别
        })
        // 更新状态
        this.tops = tops
        // console.log(tops)
      },

      // 左侧分类点击事件（右侧滑动到指定位置）
      clickMenu (index) {
        // console.log('clickMenu()')

        // 立即更新scrollY, 立即让currentIndex重新计算
        this.scrollY = this.tops[index]
        // 让右侧列表平滑滚动到指定位置
        this.foodsScroll.scrollTo(0, -this.tops[index], 300) // scrollTo：滚动到指定位置（x轴坐标，y轴坐标，滚动动画执行的时长）
      },

      showFood (food) {
        // 更新food
        this.food = food
        // 显示food组件
        this.$refs.food.toggleShow()
      }
    },

    computed: {
      ...mapState(['goods']),

      /*
      1. 分析出相关的数据
          scrollY: 右侧滑动的y坐标（滑动过程中实时在变化）
          tops: 所有右侧分类li标签的top所组成数组（列表第一次显示后就不再变化）
      2. 分析计算逻辑
          tops = [0, 10, 15, 18, 15]
          scrollY =      14, 17, 20
          currentIndex = 1, 2, 3
          scrollY>=top && scrollY<nextTop
      计算属性什么就会执行?: 相关的数据发生了变化
       */
      // 计算属性返回下标（scrollY（右侧滑动的y坐标）一旦变化计算属性重新执行）
      currentIndex () {
        // 得到条件数据
        const {tops, scrollY} = this
        console.log('currentIndex', scrollY)
        return tops.findIndex((top, index) => { // findIndex() 方法为数组中的每个元素都调用一次函数执行,如符合条件则返回当前元素的下标
          return scrollY>=top && scrollY<tops[index+1] // scrollY的值要大于或等于当前top并且要小于下一个top
        })
      },
    },

    components: {
      CartControl,
      ShopCart,
      Food
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../../common/stylus/mixins.styl"
  .goods
    display: flex
    position: absolute
    top: 195px
    bottom: 46px
    width: 100%
    background: #fff;
    overflow: hidden
    .menu-wrapper
      flex: 0 0 80px
      width: 80px
      background: #f3f5f7
      .menu-item
        display: table
        height: 54px
        width: 56px
        padding: 0 12px
        line-height: 14px
        &.current
          position: relative
          z-index: 10
          margin-top: -1px
          background: #fff
          color: $green
          font-weight: 700
          .text
            border-none()
        .icon
          display: inline-block
          vertical-align: top
          width: 12px
          height: 12px
          margin-right: 2px
          background-size: 12px 12px
          background-repeat: no-repeat
        .text
          display: table-cell
          width: 56px
          vertical-align: middle
          bottom-border-1px(rgba(7, 17, 27, 0.1))
          font-size: 12px
    .foods-wrapper
      flex: 1
      .title
        padding-left: 14px
        height: 26px
        line-height: 26px
        border-left: 2px solid #d9dde1
        font-size: 12px
        color: rgb(147, 153, 159)
        background: #f3f5f7
      .food-item
        display: flex
        margin: 18px
        padding-bottom: 18px
        bottom-border-1px(rgba(7, 17, 27, 0.1))
        &:last-child
          border-none()
          margin-bottom: 0
        .icon
          flex: 0 0 57px
          margin-right: 10px
        .content
          flex: 1
          .name
            margin: 2px 0 8px 0
            height: 14px
            line-height: 14px
            font-size: 14px
            color: rgb(7, 17, 27)
          .desc, .extra
            line-height: 10px
            font-size: 10px
            color: rgb(147, 153, 159)
          .desc
            line-height: 12px
            margin-bottom: 8px
          .extra
            .count
              margin-right: 12px
          .price
            font-weight: 700
            line-height: 24px
            .now
              margin-right: 8px
              font-size: 14px
              color: rgb(240, 20, 20)
            .old
              text-decoration: line-through
              font-size: 10px
              color: rgb(147, 153, 159)
          .cartcontrol-wrapper
            position: absolute
            right: 0
            bottom: 12px
</style>
