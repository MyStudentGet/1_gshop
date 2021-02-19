<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="iconfont icon-remove_circle_outline" 
          v-show="food.count"
          @click.stop="updateFoodCount(false)"></div>
    </transition>
    <div class="cart-count" v-show="food.count">{{food.count}}</div>
    <div class="iconfont icon-add_circle" @click.stop="updateFoodCount(true, $event)"></div>
  </div>
</template>

<script>
  import PubSub from 'pubsub-js'

  export default {
    props: {
      food: Object
    },

    methods: {
      updateFoodCount (isAdd, event) {
        const {food} = this
        this.$store.dispatch('updateFoodCount', {food, isAdd})
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .cartcontrol
    font-size: 0
    .icon-remove_circle_outline
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: $green
      &.move-enter-active, &.move-leave-active
        transition all .3s
      &.move-enter, &.move-leave-active
        opacity 0
        transform translateX(30px) rotate(90deg)
    .cart-count
      display: inline-block
      vertical-align: top
      width: 12px
      padding-top: 6px
      line-height: 24px
      text-align: center
      font-size: 10px
      color: rgb(147, 153, 159)
    .icon-add_circle
      display: inline-block
      padding: 6px
      line-height: 24px
      font-size: 24px
      color: $green
</style>