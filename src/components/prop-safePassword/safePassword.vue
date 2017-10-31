<template>
    <div class="dialogContent">
      <div class="progress">
        <div class="progressOut">
          <div :class="{gradient_1:step1,gradient_2:!step1}">1</div>
          <p>第一步&nbsp;验证身份</p>
        </div>
        <div class="progressLine"></div>
        <div class="progressOut">
          <div :class="{gradient_1:step2,gradient_2:!step2}">2</div>
          <p>第二步&nbsp;修改密码</p>
        </div>
        <div class="progressLine"></div>
        <div class="progressOut">
          <div :class="{gradient_1:step3,gradient_2:!step3}">3</div>
          <p>第三步&nbsp;修改成功</p>
        </div>
      </div>
      <div class="progressMain">
        <div class="phone-content">
          <template v-if="step1">
            <div class="sendCode" style="position: relative;">
              <span>请输入验证码</span>
              <input type="text" v-model="oldCode" maxlength="6" onkeyup="this.value = this.value.replace(/[^\d.]/g, '')">
              <p class="oldErr">{{oldCodeText}}</p>
            </div>
            <div class="resSend">
              <p>已向您的手机号{{ Phone }}发送验证码</p>
              <p>没有收到验证码？您可以选择<button type="button" @click="reSend">重新发送</button></p>
            </div>
          </template>
          <template v-else-if="step2" >
            <div class="modifyCode"><p>请输入修改后的密码</p><input type="text" v-model="password"> <span class="err">{{errText}}</span></div>
            <div class="modifyCode"><p>请确认修改后的密码</p><input type="text" v-model="confirmPwd" @blur="secondPwd"> <span class="err">{{secondText}}</span></div>
          </template>
          <template v-else="step3">
            <div class="phoneOK">修改成功!</div>
          </template>
        </div>
        <div class="phone-button">
          <button v-if="step1" @click="next" class="baseBtn">下一步</button>
          <button v-else-if="step2" @click="updatePassword" class="baseBtn">提交</button>
          <button v-else="step3" @click="end" class="baseBtn">确认</button>
        </div>
      </div>
    </div>
</template>
<script>
  import '../../assets/propCommon.css'
  import Axios from 'axios'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    props: ['phone'],
    data () {
      return {
        password: '',
        confirmPwd: '',
        errText: '',
        secondText: '',
        oldCodeText: '',
        oldCode: '',
        step1: true,
        step2: false,
        step3: false
      }
    },
     computed:{
      Phone(){
        return this.phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
      } 
    },
    methods: {
      //      重新发送验证码
      reSend(){
        Axios.post('sms/sendMsg.do', {tel: this.phone,templateCode: '3'})
          .then(response =>{
            let res = response.data
//            if (res.errorCode === ERRORCODE_CODE){}
          })
      },
      next () {
        if(!this.oldCode){
          this.oldCodeText = '验证码不能为空'
          return false
        }
        // 校验验证码
        Axios.post('sms/checkIdentifyCode.do', {
            tel: this.phone,
          code: this.oldCode
        })
          .then(response => {
            let res = response.data
            this.step1 = false
            this.step2 = true
            if (res.errorCode === ERRORCODE_CODE) {

            }else{
              this.oldCodeText = '验证码检验错误'
              return false
            }
          })
      },
// 二次密码确认
      secondPwd () {
        if (!this.confirmPwd) {
          this.secondText = '*确认密码不能为空'
          return false
        } else if (this.password !== this.confirmPwd) {
          this.secondText = '*两次密码输入不一致'
          return false
        }
      },
//      更新密码
      updatePassword () {
        if (!this.password) {
          this.errText = '*修改密码不能为空'
          return false
        } else if (!this.confirmPwd) {
          this.secondText = '*确认密码不能为空'
          return false
        } else if (this.password !== this.confirmPwd) {
          return false
        }
        Axios.post('customerInfo/updateSecurity.do', {
          password: this.password
        })
          .then(
            (response) => {
              let res = response.data
              this.secondText = ''
              this.errText = ''
              if (res.errorCode === ERRORCODE_CODE) {
                this.step2 = false
                this.step3 = true
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      end () {
        this.$emit('end', 0)
      }
    }
  }
</script>
<style scoped>
  .baseBtn:hover {
    cursor: pointer;
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }
  /*第二步内容样式 start*/
  .modifyCode{
   display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom:30px;
  }
  .modifyCode input{
    font-size:16px;
    color:#47443d;
    border:1px solid #d2d2d2;
    border-radius:6px;
    width:236px;
    height:28px;
    padding-left:5px;
    margin-left: 21px;
    outline: 0;
  }
  .err{
    font-size: 14px;
    color: #f0b954;
    position: absolute;
    transform: translateX(275px);
  }
  .oldErr{
    position: absolute;
    top: 0;
    right: 145px;
    font-size: 14px;
    color: #f0b954;
  }
  /*第二步内容样式 end*/
</style>
