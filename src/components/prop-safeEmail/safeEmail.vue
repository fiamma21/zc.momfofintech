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
          <p>第二步&nbsp;修改邮箱</p>
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
              <p>已向您的手机号{{Phone}}发送验证码</p>
              <p>没有收到验证码？您可以选择<button type="button" @click="reSend">重新发送</button></p>
            </div>
          </template>
          <template v-else-if="step2">
            <div class="nowEmail">
              <span>当前邮箱:</span>{{email}}
            </div>
            <div class="modifyEmail">
              <p>请输入修改后的邮箱</p>
              <div><input type="text" v-model="modifyEmail" @blur="existEmail"> <p class="err">{{errText}}</p> </div>
            </div>

          </template>
          <template v-else-if="step3">
            <div class="phoneOK">修改成功!</div>
          </template>
        </div>
        <div class="phone-button">
          <button v-if="step1" @click="next" class="baseBtn">下一步</button>
          <button v-else-if="step2" @click="updateEmail"  class="baseBtn">提交</button>
          <button v-else-if="step3" @click="end" class="baseBtn">确认</button>
        </div>
      </div>
    </div>
</template>
<script>
  import '../../assets/propCommon.css'
  import Axios from 'axios'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    props: ['phone', 'email'],
    data () {
      return {
        errText: '',
        modifyEmail: '',
        oldCodeText: '',
        oldCode: '',
        regEmail: false, // 邮箱检验通过标识
        exist: false, // 邮箱是否存在的标识
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
        Axios.post('sms/sendMsg.do', {tel: this.phone,templateCode: '6'})
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
            if (res.errorCode === ERRORCODE_CODE) {
              this.step1 = false
              this.step2 = true
            }else{
              this.oldCodeText = '验证码检验错误'
              return false
            }
          })
      },
      //    先正则检验邮箱，再判断邮箱是否存在
      existEmail () {
        let emailReg = /^([\w-_]+(?:\.[\w-_]+)*)@((?:[a-z0-9]+(?:-[a-zA-Z0-9]+)*)+\.[a-z]{2,6})$/i
        if (!this.modifyEmail) {
          return false
        }else if(!emailReg.test(this.modifyEmail)){
          this.errText = '请输入正确格式的邮箱'
          return false
        }
        this.regEmail = true
        Axios.post('customerInfo/verdictExist.do', {
          email: this.modifyEmail
        })
          .then(
            (response) => {
              let res = response.data
              this.errText = ''
              if (res.errorCode !== ERRORCODE_CODE) {
                this.errText = '该邮箱已存在'
                this.exist = true
              }else{
                this.exist = false
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //      更新邮箱
      updateEmail () {
        if (!this.modifyEmail) {
          this.errText = '邮箱不能为空'
          return false
        }else if(!this.regEmail){
          return false
        } else if(this.exist) {
          return false
        }
        Axios.post('customerInfo/updateSecurity.do', {
          email: this.modifyEmail
        })
          .then(
            (response) => {
              let res = response.data
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
  .modifyEmail{
    display: flex;
    justify-content: center;
    align-items: baseline;
    font-size:16px;
    color:#47443d;
  }
  .modifyEmail input{
    border:1px solid #d2d2d2;
    border-radius:6px;
    width:236px;
    height:28px;
    padding-left:5px;
    margin-left: 21px;
    outline: 0;
  }
  .modifyEmail div{
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }
  .err{
    font-size: 14px;
    color: #f0b954;
    margin-top: 7px;
  }
  .oldErr{
    position: absolute;
    top: 0;
    right: 145px;
    font-size: 14px;
    color: #f0b954;
  }
  .nowEmail{
    display: flex;
    align-items: center;
    padding-left: 284px;
    font-size: 16px;
    color: #47443d;
    padding-bottom: 38px;
  }
  .nowEmail span{
    padding-right:21px;
  }
  /*第二步内容样式 end*/
</style>
