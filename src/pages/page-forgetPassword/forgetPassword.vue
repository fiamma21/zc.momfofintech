<template>
  <div class="loginWrap">
    <div class="logo"></div>
    <div class="forgetPassword">
      <div class="forgetProgress">
        <div :class="{gradient_1:step1,gradient_2:!step1}" style="position: relative;color: #fff;">第一步&nbsp;&nbsp;重置登录密码</div>
        <div class="arrow" :class="{gradient_1:step2,gradient_2:!step2}">第二步&nbsp;&nbsp;重置成功</div>
      </div>
      <div>
        <template v-if="step1">
          <ul class="forgetPasswordFrom">
            <li>
              <span>请输入手机号码</span> <input type="tel" maxlength="11" @blur="checkTel" v-model="tel" class="userInput"></li>
            <p class="info">{{telInfo}}</p>
            <li>
              <span>请输入验证码</span><input type="text" maxlength="6" @blur="checkCode" v-model="authenticode" class="userInput">
              <send_Code class="orangeGrad baseBtn " @click.native="sendCode" :disabled="disabled" :phone="tel" ref="btn" :second="60"></send_Code>
            </li>
            <p class="info">{{oldCodeText}}</p>
            <li>
              <span>请输入密码</span><input type="password" maxlength="8" @blur="checkPassword" v-model="password" class="userInput"></li>
            <p class="info">{{ errText }}</p>
            <li>
              <span>请再次输入密码</span><input type="password" @blur="secondCheck" v-model="confirmpassword" class="userInput"></li>
            <p class="info">{{secondText}}</p>
            <li>
              <button type="button" class="baseBtn orangeGrad btnNormal" v-if="step1" @click="checkedCode">下一步</button>
            </li>
          </ul>
        </template>
        <template v-else="step2">
          <div class="setSuccess">重置密码成功</div>
        </template>
      </div>
      <div class="dialogFooter">
        <button type="button" class="baseBtn orangeGrad btnNormal" v-if="step2" @click="end">点击进入系统</button>
      </div>

      <img src="../../assets/image/circle.png" alt="魔方金服">
    </div>
  </div>
</template>
<script>
import Axios from 'axios'
import Qs from 'qs'
import SendCode from 'components/base-sendCode/sendCode'
const ERRORCODE_CODE = 'SUCCESS'
export default {
  data() {
    return {
      step1: true,
      step2: false,
      disabled: false,
      tel: '',
      password: '',
      authenticode: '',
      confirmpassword: '',
      telInfo: '',
      errText: '',
      secondText: '',
      oldCodeText: ''
    }
  },
  methods: {
    //     新手机号发送验证码
    sendCode() {
      let regPhone = /^1[3|4|5|7|8][0-9]\d{8}$/;
      if (!this.tel) {
        this.telInfo = '手机号不能为空'
      } else if (!regPhone.test(this.tel)) {
        this.telInfo = '手机号格式错误'
      }
      else {
        this.disabled = true
        setTimeout(this.sended, 100)
      }
    },
    //      启动 发送验证码倒计时
    sended() {
      this.disabled = false
      this.$refs.btn.run()
    },
    //  检验验证码是否正确
    checkedCode() {
      if (!this.tel) {
        this.telInfo = '手机号不能为空'
        return false
      } else if (!this.authenticode) {
        this.oldCodeText = '验证码不能为空'
        return false
      }
      Axios.post('sms/checkIdentifyCode.do', {
        tel: this.tel,
        code: this.authenticode
      }).then(response => {
        let res = response.data
        if (res.errorCode === ERRORCODE_CODE) {
          this.updatePassword()
        } else {
          this.oldCodeText = '验证码错误'
          return false
        }
      })
    },
    end() {
      Axios({
        url: 'logincheck.do',
        method: 'post',
        data: {
          mUserName: this.tel,
          mPassWord: this.password
        },
        transformRequest: [function(data) {
          data = Qs.stringify(data)
          return data
        }],
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      })
        .then(
        (response) => {
          let data = response.data
          if (data.errorCode === ERRORCODE_CODE) {
            this.$store.dispatch('goIndex', { name: this.tel })
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    //      重置密码
    updatePassword() {
      if (!this.password) {
        this.errText = '密码不能为空'
        return false
      } else if (!this.confirmpassword) {
        this.secondText = '确认密码不能为空'
        return false
      } else if (this.password !== this.confirmpassword) {
        return false
      }
      Axios.post('login/reSetPassword.do', {
        tel: this.tel,
        code: this.authenticode,
        password: this.password
      })
        .then(
        (response) => {
          let res = response.data
          this.errText = ''
          this.secondText = ''
          if (res.errorCode === ERRORCODE_CODE) {
            this.step1 = false
            this.step2 = true
          } else {
            this.telInfo = res.message
          }
        })
        .catch(
        (error) => { console.log(error) }
        )
    },
    checkTel: function() {
      let regPhone = /^1[3|4|5|7|8][0-9]\d{8}$/
      if (!this.tel) {
        this.telInfo = '手机号码不能为空'
      } else if (!regPhone.test(this.tel)) {
        this.telInfo = '手机号格式错误'
      } else {
        this.telInfo = ''
      }
    },
    checkCode() {
      let regCode = /\d{6}/
      if (!this.authenticode) {
        this.oldCodeText = '验证码不能为空'
      } else if (!regCode.test(this.authenticode)) {
        this.oldCodeText = '验证码格式错误'
      }
      else {
        this.oldCodeText = ''
      }
    },
    checkPassword: function() {
      let regPwd = /\w{4,8}/
      if (!this.password) {
        this.errText = '密码不能为空'
      } else if (!regPwd.test(this.password)) {
        this.errText = '密码不能有特殊字符'
      }
      else {
        this.errText = ''
      }
    },
    secondCheck: function() {
      if (!this.confirmpassword) {
        this.secondText = '确认密码不能为空'
      } else if (this.password !== this.confirmpassword) {
        this.secondText = '两次密码输入不一致'
      } else {
        this.secondText = ''
      }
    }
  },
  components: {
    'send_Code': SendCode
  }
}
</script>
<style scoped>
.info {
  text-align: center;
  font-size: 13px;
  color: orange;
}

.dialogFooter button {
  margin: 150px 0 0 130px;
}

.setSuccess {
  text-align: center;
  margin-top: 150px;
  font-size: 16px;
}

.gradient_1 {
  background-image: linear-gradient(90deg, #f8ce6d 0%, #ea9073 100%);
  z-index: 200;
}

.gradient_2 {
  background-color: #ddd;
}

.btnNormal {
  padding: 0;
  outline: 0;
  border: 0;
}

.logo {
  height: 40%;
  width: 100%;
  background: #32363d url('../../assets/image/bgtop.png') no-repeat;
  background-size: cover;
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
  background: #e9e9e9 url('../../assets/image/bgbottom.png')no-repeat bottom;
}

.forgetProgress {
  background: #e9e9e9;
  margin-top: 20px;
  margin-bottom: 30px;
  height: 32px;
  display: flex;
}

.forgetPassword img {
  position: absolute;
  bottom: 0;
  right: 0;
}

.forgetProgress div {
  width: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #303030;
  position: relative;
}

.forgetProgress div:first-child:after {
  position: absolute;
  z-index: 4;
  content: '';
  border-bottom: 16px solid transparent;
  border-left: 16px solid #ea9073;
  border-top: 16px solid transparent;
  width: 0;
  height: 0;
  right: -16px;
  top: 0;
}

.arrow::after {
  position: absolute;
  right: 0;
  top: 0;
  content: '';
  display: block;
  border: 16px solid #ddd;
  border-left-color: transparent;
  width: 0;
  height: 0;
}

.forgetProgress div:nth-of-type(2):before {
  position: absolute;
  z-index: 4;
  content: '';
  border-bottom: 16px solid transparent;
  border-left: 16px solid #ddd;
  border-top: 16px solid transparent;
  width: 0;
  height: 0;
  left: 0;
  top: 0;
}

.forgetPassword {
  font-size: 14px;
  width: 500px;
  height: 454px;
  background: #fff;
  color: #303030;
  box-sizing: border-box;
  box-shadow: 0 0 2px #ddd;
  border-radius: 6px;
  position: relative;
  text-align: left;
  margin: -62px auto;
  padding-top: 5px;
}

.forgetPasswordFrom li {
  display: flex;
  align-items: center;
  /*margin-bottom:16px;*/
}

.forgetPasswordFrom li:nth-of-type(2) button {
  width: 98px;
  font-size: 14px;
  padding: 0;
  outline: 0;
  border: 0;
  height: 30px;
  margin-left: 20px;
}

.forgetPasswordFrom input[type=text] {
  width: 120px;
}

.forgetPasswordFrom li:last-child {
  justify-content: center;
  margin-top: 35px;
}

.forgetPasswordFrom li span {
  display: inline-block;
  width: 188px;
  text-align: right;
  padding-right: 10px;
  font-size: 16px;
  color: #303030;
}

.userInput {
  width: 238px;
  display: inline-block;
  text-indent: 10px;
  height: 32px;
  line-height: 38px;
  border: 1px solid #d2d2d2;
  border-radius: 6px;
  margin: 8px 0;
  outline: none;
}

.userInput:focus {
  border: 1px solid #f0b954;
}

.baseBtn {
  width: 240px;
  height: 40px;
  font-size: 18px;
  color: #fff !important;
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
  background-image: linear-gradient(90deg, #f8ce6d 0%, #ea9073 100%);
}
</style>
