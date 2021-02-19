<template>
  <div class="loginContainer">
    <div class="loginInner">
      <div class="login_header">
        <h2 class="login_logo">硅谷外卖</h2>
        <div class="login_header_title">
          <a href="javascript:;" @click="setLoginWay(true)" :class="{on: loginWay}">短信登录</a>
          <a href="javascript:;" @click="setLoginWay(false)" :class="{on: !loginWay}">密码登录</a>
        </div>
      </div>
      <div class="login_content">
        <form @submit.prevent="login">
          <div :class="{on: loginWay}">
            <section class="login_message">
              <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
              <button class="get_verification"
                      v-if="!computedTime"
                      :class="{right_phone_number:rightPhoneNumber}"
                      @click.prevent="getVerifyCode">获取验证码
              </button>
              <button disabled="disabled" class="get_verification" v-else>已发送({{computedTime}}s)</button>
            </section>
            <section class="login_verification">
              <input type="text" maxlength="8" placeholder="验证码" v-model="code">
            </section>
            <section class="login_hint">
              温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
              <a href="javascript:;">《用户服务协议》</a>
            </section>
          </div>
          <div :class="{on: !loginWay}">
            <section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
              </section>
              <section class="login_verification">
                <input type="password" placeholder="密码" v-model="pwd" v-if="!showPassword">
                <input type="text" placeholder="密码" v-model="pwd" v-else>

                <div class="switch_button" :class="showPassword ? 'on' : 'off'"
                     @click="changePassWordType">
                  <div class="switch_circle" :class="{right: showPassword}"></div>
                  <span class="switch_text">{{showPassword?'abc':''}}</span>
                </div>

              </section>
              <section class="login_message">
                <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                <img ref="captcha" class="get_verification" src="http://localhost:3000/captcha" alt="captcha" @click="getCaptchaCode">
              </section>
            </section>
          </div>
          <input type="submit" value="登录" class="login_submit"></input>
        </form>
        <a href="javascript:;" class="about_us">关于我们</a>
      </div>
      <span href="javascript:" class="go_back" @click="$router.back()">
<!--      $router.back():  点箭头返回  -->
        <i class="iconfont icon-jiantou2"></i>
      </span>
    </div>
    <alert-tip v-if="showAlert"
               @closeTip="closeTip"
               :alertText="alertText"/>
  </div>
</template>

<script>
  import {mapActions} from 'vuex'
  import {reqCaptchas, sendCode, smsLogin, pwdLogin} from '../../api'
  import AlertTip from '../../components/AlertTip/AlertTip.vue'

  export default {
    data() {
      return {
        loginWay: false, //登录方式，false代表密码登录, true代表短信登陆
        showPassword: false, // 是否显示密码
        computedTime: 0, //倒数记时
        phone: '', //电话号码
        code: '', //短信验证码
        name: '', //用户名
        pwd: '', //密码
        captcha: '', // 验证码
        captchaImg: null, //验证码图片
        showAlert: false, //显示提示组件
        alertText: null, //提示的内容
      }
    },

    computed: {
      //判断手机号码
      rightPhoneNumber: function () {
        return /^1\d{10}$/.test(this.phone)
      }
    },

    methods: {
      ...mapActions([
        'recordUserInfo',
      ]),

      // 设置登录方式
      setLoginWay(loginWay) {
        this.loginWay = loginWay
      },
      //是否显示密码
      changePassWordType() {
        this.showPassword = !this.showPassword
      },
      // 获取图形验证码
      getCaptchaCode() {
        this.$refs.captcha.src = 'http://localhost:3000/captcha?time='+new Date()
      },

      // 获取短信验证码
      async getVerifyCode() {
        if (this.rightPhoneNumber) {
          this.computedTime = 30
          this.intervalId = setInterval(() => {
            this.computedTime--
            if (this.computedTime == 0) {
              clearInterval(this.intervalId)
            }
          }, 1000)
          //发送短信验证码
          let result = await sendCode(this.phone)
          if (result.code===1) {
            this.showAlert = true
            this.alertText = result.msg
          }
        }
      },

      // 发送登录信息
      async login() {
        // debugger
        if (this.loginWay) {
          if (!this.phone) {
            this.showAlert = true;
            this.alertText = '手机号码不正确'
            return
          } else if (!(/^\d{6}$/gi.test(this.code))) {
            this.showAlert = true;
            this.alertText = '短信验证码不正确'
            return
          }

          //手机号短信登录
          const result = await smsLogin(this.phone, this.code);
          if(result.code===0) {
            this.userInfo = result.data
          } else {
            this.userInfo = {
              msg: '登陆失败, 手机号或验证不正确'
            }
          }

        } else {
          if (!this.name) {
            this.showAlert = true
            this.alertText = '请输入手机号/邮箱/用户名'
            return
          } else if (!this.pwd) {
            this.showAlert = true;
            this.alertText = '请输入密码'
            return
          } else if (!this.captcha) {
            this.showAlert = true
            this.alertText = '请输入验证码'
            return
          }

          //用户名登录
          const result = await pwdLogin(this.name, this.pwd, this.captcha)
          if(result.code===0) {
            this.userInfo = result.data
          } else {
            this.userInfo = {
              msg: result.msg
            }
          }
        }
        //如果返回的值不正确，则弹出提示框，返回的值正确则返回上一页
        if (!this.userInfo._id) {
          this.showAlert = true
          this.alertText = this.userInfo.msg
          if (!this.loginWay) {
            this.getCaptchaCode()
          }
        } else {
          this.recordUserInfo(this.userInfo)
          this.$router.back()
        }
      },
      // 关系提示框
      closeTip() {
        this.showAlert = false
      }
    },

    components: {
      AlertTip
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" scoped>
  @import "../../common/stylus/mixins.styl"
  .loginContainer // 登录与注册
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          > a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        > form
          > div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone_number
                  color #000
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s, border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                > .switch_circle
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0, 0, 0, .1)
                  transition transform .3s
                  &.right
                    transform translateX(27px)

            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              > a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        > .iconfont
          font-size 20px
          color #999
</style>
