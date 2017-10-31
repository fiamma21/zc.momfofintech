<template>
  <div class="loginWrap">
    <div class="logo"></div>
    <div class="login">
      <img src="../../assets/image/logo.png" alt="魔方金服">
      <form>
        <p>魔方金服资产管理系统</p>
        <input type="text" v-model="name" placeholder="请输入用户名或手机号" class="userInput">
        <p class="info">{{messageInfo}}</p>
        <p class="info">{{uInfo}}</p>
        <input type="password" @blur="checkPassword" v-model="password" placeholder="输入密码" class="userInput">
        <p class="info">{{passwordInfo}}</p>
        <p class="forget" @click="setPwd">忘记密码？</p>
        <button type="button" @click="checkName" class="baseBtn orangeGrad btnNormal">登录</button>
        <button type="button" class="baseBtn grayGrad btnNormal" @click="goMomfo">加入魔方金服合作伙伴</button>
      </form>
      <div class="loginUser"></div>
      <img src="../../assets/image/circle.png" alt="魔方金服">
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import Qs from 'qs'
import { mapState, mapGetters } from 'vuex'
const ERRORCODE_OK = 'SUCCESS'

export default {
  data() {
    return {
      isDisabled: true,
      name: '',
      password: '',
      num: 0,
      messageInfo: '',
      passwordInfo: '',
      uInfo: '',
      isUser: false
    }
  },
  methods: {
      //加入魔方
      goMomfo: function(){
        location.href="http://www.momfofintech.com/#/apply"
      },
    //      登陆用户验证
    checkName: function() {
      this.uInfo = ''
      if (!this.name) {
        this.messageInfo = '用户名不能为空'
      } else {
        this.messageInfo = ''
        Axios({
          url: 'login/check.do',
          method: 'post',
          data: {
            username: this.name
          }
        })
          .then(
          (response) => {
            let data = response.data
            if (data.errorCode === ERRORCODE_OK) {
              this.uInfo = ''
              this.isUser = true
              this.login()
            } else {
              this.uInfo = '输入的用户名错误'
              return false
            }
          })
          .catch(function(error) {
            console.log(error)
          })
      }
    },
    checkPassword: function() {
      if (!this.password) {
        this.passwordInfo = '密码不能为空'
      } else {
        this.passwordInfo = ''
      }
    },
    login() {
      if (!this.password) {
        this.passwordInfo = '密码不能为空'
        return false
      }
      Axios({
        url: 'logincheck.do',
        method: 'post',
        data: {
          mUserName: this.name,
          mPassWord: this.password
        },
        transformRequest: [function(data) {
          data = Qs.stringify(data)
          return data
        }],
        headers: {
          //            form表单请求
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
        .then(
        (response) => {
          let data = response.data
          if (data.errorCode === ERRORCODE_OK) {
            this.$store.dispatch('goIndex', { name: this.name })
          } else {
            this.passwordInfo = '输入密码错误'
            this.password = ''
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    //      忘记密码 isUser验证登陆用户 为true才可以改密码
    setPwd() {
      this.$store.dispatch('forgetPwd', { isUser: true })
    }
  },
  computed: {
    //      ...mapMutations ...mapActions类似用法 { 别名1：处理函数，别名2：'状态库中对应的字符串'} 或者['状态库中的属性']
    ...mapState({
      name2(state) {
        return state.mUserName
      },
      pwd: 'mPassWord'
    }),
    ...mapGetters({
      arr: 'evenInfos'
    })
  }
}
</script>
<style scoped>
.info {
  text-align: left;
  font-size: 13px;
  color: orange;
}

.btnNormal {
  padding: 0;
  outline: 0;
  border: 0;
}

.loginWrap {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
  z-index: 2000;
  background: rgba(0, 0, 0, 0.30);
  background: #e9e9e9 url('../../assets/image/bgbottom.png') no-repeat bottom;
}

.logo {
  /*background-color: ;*/
  height: 40%;
  width: 100%;
  background: #32363d url('../../assets/image/bgtop.png') no-repeat;
  background-size: cover;
}

.forget {
  cursor: pointer;
}

.forget:hover {
  color: #ea9a72;
}

.login {
  width: 370px;
  height: 344px;
  background: #fff;
  box-sizing: border-box;
  box-shadow: 0 0 2px #ddd;
  border-radius: 6px;
  padding: 50px 66px;
  position: relative;
  margin: -62px auto;
}

.login img:nth-of-type(1) {
  position: absolute;
  top: -100px;
  left: 16%;
}

.login img:nth-of-type(2) {
  position: absolute;
  bottom: 0;
  right: 0;
}

.login p:nth-of-type(1) {
  font-size: 20px;
  color: #32363d;
  font-weight: bold;
  padding-bottom: 20px;
}

.login p:nth-of-type(5) {
  text-align: right;
  font-size: 14px;
}

.userInput {
  width: 240px;
  display: inline-block;
  text-indent: 10px;
  height: 30px;
  line-height: 38px;
  border: 1px solid #d2d2d2;
  margin: 6px 0;
  border-radius: 6px;
  outline: none;
}

.userInput:focus {
  border: 1px solid #f0b954;
}

.baseBtn {
  width: 100%;
  height: 35px;
  font-size: 18px;
  color: #fff;
  border-radius: 6px;
}

.baseBtn:hover {
  cursor: pointer;
  box-shadow: 0 0 20px darkgrey inset;
  -webkit-transform: scale(1.05);
  -moz-transform: scale(1.05);
  -ms-transform: scale(1.05);
  -o-transform: scale(1.05);
  transform: scale(1.05);
}

.orangeGrad {
  font-size: 14px;
  margin-top: 15px;
  background-image: linear-gradient(90deg, #f5c170 0%, #ea9a72 100%);
}

.grayGrad {
  font-size: 14px;
  margin-top: 15px;
  background-image: linear-gradient(90deg, #bababa 0%, #9f9f9f 100%);
}

.loginUser {
  position: absolute;
  top: -33px;
  left: 155px;
  width: 66px;
  height: 66px;
  border-radius: 50%;
  box-shadow: 0 5px 4px #e9e9e9;
  background: #fff url('../../assets/image/person.png') no-repeat center;
  background-size: 50% 50%;
}
</style>
