<template>
  <div class="login-container">
    <el-form class="login-form" autoComplete="on" :model="loginForm" :rules="loginRules" ref="loginForm"
             label-position="left">
      <div class="title-container">
        <img src="static/logo.png" height="60"/>
        <div style="display: inline-block;font-size:42px;margin-left: 10px;color:#fff;">Data Studio</div>
      </div>
      <el-form-item prop="username">
        <span class="svg-container svg-container_login">
          <Icon content="&#xe602;"/>
        </span>
        <el-input name="username" type="text" v-model="loginForm.username" autoComplete="on"
                  placeholder="用户名/手机号/邮箱">
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <span class="svg-container">
          <Icon content="&#xe662;"/>
        </span>
        <el-input name="password" type="password" v-model="loginForm.password" autoComplete="on"
                  placeholder="请输入密码..."></el-input>
      </el-form-item>
      <el-button type="primary" :loading="loading" @click.native.prevent="handleLogin" style="width: 100%">登录
      </el-button>
    </el-form>
  </div>
</template>

<script>
  import {isMobile, isValid} from '@/utils/validate'
  import Icon from '@/components/Icon'

  export default {
    components: {Icon},
    name: 'login',
    data () {
      const validateMobile = (rule, value, callback) => {
        // if (!isMobile(value)) {
        //   callback(new Error('请输入正确的手机号'))
        // } else {
        callback()
        // }
      }

      const validatePassword = (rule, value, callback) => {
        if (!isValid(value)) {
          callback(new Error('密码不能为空'))
        } else {
          callback()
        }
      }
      return {
        loginForm: {
          username: 'admin',
          password: '123456'
        },
        loginRules: {
          username: [{required: true, trigger: 'blur', validator: validateMobile}],
          password: [{required: true, trigger: 'blur', validator: validatePassword}],
        },
        loading: false,
      }
    },
    methods: {
      handleLogin () {
        this.$refs.loginForm.validate(async (valid) => {
          if (valid) {
            this.loading = true
            let res = await this.$store.dispatch('login', this.loginForm)
            this.loading = false
            if (res.code === 0) {
              this.$router.push({path: '/'})
            } else {
              this.$message({
                message: '登录失败!',
                type: 'warning'
              })
            }
          } else {
            return false
          }
        })
      }
    }
  }
</script>

<style rel="stylesheet/scss" lang="scss">
  $bg: #2d3a4b;
  $light_gray: #eee;

  /* reset element-ui css */
  .login-container {
    .el-input {
      display: inline-block;
      height: 47px;
      width: 85%;
      input {
        background: transparent;
        border: 0px;
        -webkit-appearance: none;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $light_gray;
        height: 47px;
        &:-webkit-autofill {
          -webkit-box-shadow: 0 0 0px 1000px $bg inset !important;
          -webkit-text-fill-color: #fff !important;
          background-color: transparent !important;
        }
      }
    }
    .el-form-item {
      border: 1px solid rgba(255, 255, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 5px;
      color: #454545;
    }
  }
</style>

<style rel="stylesheet/scss" lang="scss" scoped>
  $bg: #2d3a4b;
  $dark_gray: #889aa4;
  $light_gray: #eee;
  .login-container {
    position: fixed;
    height: 100%;
    width: 100%;
    background-color: $bg;
    .login-form {
      position: absolute;
      left: 0;
      right: 0;
      width: 520px;
      padding: 35px 35px 15px 35px;
      margin: 120px auto;
    }
    .tips {
      font-size: 14px;
      color: #fff;
      margin-bottom: 10px;
      span {
        &:first-of-type {
          margin-right: 16px;
        }
      }
    }
    .svg-container {
      padding: 6px 5px 6px 15px;
      color: $dark_gray;
      vertical-align: middle;
      width: 30px;
      display: inline-block;
      &_login {
        font-size: 20px;
      }
    }
    .title-container {
      position: relative;
      text-align: center;
      padding-bottom: 25px;
    }
    .show-pwd {
      position: absolute;
      right: 10px;
      top: 7px;
      font-size: 16px;
      color: $dark_gray;
      cursor: pointer;
      user-select: none;
    }
    .thirdparty-button {
      position: absolute;
      right: 35px;
      bottom: 28px;
    }
  }
</style>
