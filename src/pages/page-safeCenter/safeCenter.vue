<template>
  <div>
  <div class="safeCenter">
    <div class="safe-title">
      设置&nbsp;>&nbsp;<span style="color:#f0b954">安全中心</span>
    </div>
    <ul class="safe-content">
     <li>
       <div><span>手机号</span> <p>{{ Phone }}</p></div>
       <button type="button" @click="sendPhoneCode('21','showPhone')">修改</button>
     </li>
     <li>
       <div><span>邮箱</span> <p>{{ email }}</p></div>
       <button type="button" @click="sendPhoneCode('6','showEmail')">修改</button>
     </li>
     <li>
       <div><span>修改密码</span></div>
       <button type="button" @click="sendPhoneCode('3','showPassword')">修改</button>
     </li>
   </ul>
  </div>
    <el-dialog v-model="showPhone" customClass="dialog" title="修改手机号" size="tiny" top="20%">
      <prop-safePhone  v-on:end="close"  v-if="showPhone" :phone="phone"></prop-safePhone>
    </el-dialog>
    <el-dialog v-model="showEmail" customClass="dialog" title="修改邮箱" size="tiny" top="20%">
      <prop-safeEmail v-if="showEmail" v-on:end="close" :phone="phone" :email="email"></prop-safeEmail>
    </el-dialog>
    <el-dialog v-model="showPassword" customClass="dialog" title="修改密码" size="tiny" top="20%">
      <prop-safePassword v-if="showPassword" v-on:end="close" :phone="phone"></prop-safePassword>
    </el-dialog>
  </div>
</template>
<script>
  import Axios from 'axios'
  import PropSafePhone from 'components/prop-safePhone/safePhone'
  import PropSafeEmail from 'components/prop-safeEmail/safeEmail'
  import PropSafePassword from 'components/prop-safePassword/safePassword'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        showPhone: false,
        showEmail: false,
        showPassword: false,
        telPhone:'',
        email:'',
        password:'',
        safe: {}
      }
    },
    created () {
      this.getConnect()
    },
    mounted(){
      this.close()
    },
    computed: {
      phone() {
        return this.telPhone
      },
       Phone(){
        return this.telPhone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2")
      } 
    },
    components: {
      'prop-safePhone': PropSafePhone,
      'prop-safeEmail': PropSafeEmail,
      'prop-safePassword': PropSafePassword
    },
    watch: {

    },
    methods:{
      close(flag){
        if(flag === 0){
          this.showPhone = false
          this.showEmail = false
          this.showPassword = false
          this.getConnect()
        }
      },
      getConnect () {
        Axios.post('customerInfo/securityCenter.do')
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.telPhone = res.data.signTelephone
                this.email = res.data.email
              }
            })
          .catch(function (error) {
            console.log(error)
          })
      },
//      只要点击修改立即发送验证码,并无论成功与否都要弹出prop(产品需求如此)
      sendPhoneCode(templateId, propShow) {
        Axios.post('sms/sendMsg.do',{tel:this.telPhone,templateCode: templateId})
          .then(response =>{
             this[propShow] = true
            let res = response.data
//            if (res.errorCode === ERRORCODE_CODE){}
          })
      }
    }
  }
</script>
<style>
  .dialog{
    border-radius:10px 8px 8px 8px;
    width:800px !important;
    height:500px;
  }
  .el-dialog__header{
    height:50px;
    line-height: 50px;
    padding-top: 0 !important;
    background: #f7f7f7;

  }
  .el-dialog__title{
    font-family:PingFangSC-Regular;
    font-weight:normal !important;
    letter-spacing: 1px;
    color: #696969 !important;
    font-size: 20px !important;
  }
  .el-dialog__body{
    padding:0 !important;
  }
</style>
<style scoped>
  .safeCenter{
    font-family:PingFangSC-Regular;
    width:100%;
    border-right:6px;
    text-align: left;
    color: #696969;
    padding:0 0 10px 0;
    border-radius: 6px;
    min-height: 600px;
    background: #ffffff;
  }
  .safe-title{
    background:#f7f7f7;
    height:80px;
    line-height: 80px;
    font-size: 20px;
    padding-left:37px;

  }
  .safe-content{
    background: #fff;
    padding:0 37px 20px;
    font-size: 18px;
  }
   .safe-content li{
     height: 80px;
     display: flex;
     justify-content: space-between;
     align-items: center;
     border-bottom: 1px solid #e9e9e9;
     padding-left:5px;
     padding-right:42px;
   }
  /*.safe-content li:last-child{
    border-bottom: none;
  }*/
  .safe-content li span{
    display: inline-block;
    padding-bottom:5px;
  }
  .safe-content li span::before{
    content: "• ";
    color: #61bfe9;
    margin-left: -16px;
  }
  .safe-content li button{
    border: none;
    background: #fff;
    color: #696969;
    font-size: 18px;
    outline: 0;
  }
  .safe-content li button:hover{
    cursor: pointer;
    color: #f1b954;
    outline: 0;
  }
</style>
