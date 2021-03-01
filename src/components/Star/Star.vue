<template>
  <div class="star" :class="`star-${size}`">
<!--    star-24:设置大小（下面样式定义好的）-->
    <span class="star-item" v-for="(sc, index) in starClasses" :key="index" :class="sc"></span>
<!--    确定星星的类名-->
  </div>
</template>

<script>
  // 定义类名常量
  const CLASS_ON = 'on' // 一个满星
  const CLASS_HALF = 'half' // 一个半星
  const CLASS_OFF = 'off' // 一个空星

  export default {
    // 设计props
    props: {
      score: Number, // 评分
      size: Number // 星星的尺寸
    },
    /*
    3.4: 3 + 0 + 2
    3.5: 3 + 1 + 1
    starClasses: []
    */
    computed: { // 计算属性
      starClasses () { // 确定星星的类名
        const scs = []
        const {score} = this // 评分分数
        const scoreInteger = Math.floor(score) // 得到评分的整数
        // 添加n个类名CLASS_ON
        for (let i = 0; i < scoreInteger; i++) {
          scs.push(CLASS_ON)
        }
        // 添加0或1个类名CLASS_HALF
        if (score * 10 - scoreInteger * 10 >= 5) { // 判断小数部分是否大于0.5
          scs.push(CLASS_HALF)
        }
        // 添加n个类名CLASS_OFF
        while (scs.length < 5) { // 剩下的全部用空星填充
          scs.push(CLASS_OFF)
        }
        return scs
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl" // 引入stylus样式
  .star //2x图 3x图
    display inline-block
    font-size 0
    .star-item
      display inline-block
      background-repeat no-repeat
    &.star-48
      .star-item
        width 20px
        height 20px
        margin-right 22px
        background-size 20px 20px
        &:last-child
          margin-right: 0
        &.on
          bg-image('./images/star48_on')
        &.half
          bg-image('./images/star48_half')
        &.off
          bg-image('./images/star48_off')
    &.star-36
      .star-item
        width 15px
        height 15px
        margin-right 6px
        background-size 15px 15px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star36_on')
        &.half
          bg-image('./images/star36_half')
        &.off
          bg-image('./images/star36_off')
    &.star-24
      .star-item
        width 10px
        height 10px
        margin-right 3px
        background-size 10px 10px
        &:last-child
          margin-right 0
        &.on
          bg-image('./images/star24_on')
        &.half
          bg-image('./images/star24_half')
        &.off
          bg-image('./images/star24_off')
</style>
