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
          <p>第二步&nbsp;修改手机号码</p>
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
             <p>没有收到验证码？您可以选择<button type="button" style="cursor: pointer;" @click="reSend">重新发送</button></p>
           </div>
         </template>
         <template v-else-if="step2">
                <div class="modifyPhone">
                    <p>请输入修改后的手机号码</p>
                  <div><input type="tel" maxlength="11" v-model="modifyPhone" @blur="existPhone"><p class="err">{{errText}}</p> </div>
                  <send_Code class="codeBtn" @click.native="sendCode" :disabled="disabled" :phone="modifyPhone" ref="btn" :second="60"></send_Code>
                </div>
                <div class="modifyCode">
                  <p>请输入验证码</p>
                  <input type="text" required v-model="code" maxlength="6" onkeyup="this.value = this.value.replace(/[^\d.]/g, '')">
                  <p class="err" style="margin-left:10px;">{{codeText}}</p>
                </div>
         </template>
         <template v-else-if="step3">
                <div class="phoneOK">已修改成功!</div>
         </template>
       </div>
        <div class="phone-button">
          <button v-if="step1" @click="next" class="baseBtn">下一步</button>
          <button v-else-if="step2" :disabled="update" @click="updatePhone" class="baseBtn">提交</button>
          <button v-else-if="step3" @click="end" class="baseBtn">确认</button>
        </div>
      </div>
    </div>
</template>
<script>
  import '../../assets/propCommon.css'
  import Axios from 'axios'
  import SendCode from 'components/base-sendCode/sendCode'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    props: ['phone'],
    data () {
      return {
        errText: '',
        codeText: '',
        oldCodeText: '',
        modifyPhone: '',
        code: '',
        oldCode: '',
        exist: false, // 是否存在的标识
        disabled: false,
        update: false,
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
    components: {
      'send_Code': SendCode
    },
    methods: {
//      重新发送验证码
      reSend(){
        Axios.post('sms/sendMsg.do', {tel: this.phone,templateCode: '21'})
          .then(response =>{
            let res = response.data
//            if (res.errorCode === ERRORCODE_CODE){}
          })
      },
      next(){
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
// 关闭弹窗
      end () {
        this.$emit('end', 0)
      },
//      判断手机号是否存在
      existPhone () {
        if (!this.modifyPhone) {
          return false
        }
        Axios.post('customerInfo/verdictExist.do', {
          signTelephone: this.modifyPhone
        })
          .then(
            (response) => { 
            	this.disabled = false
              let res = response.data
              this.errText = ''
	              if (res.errorCode == ERRORCODE_CODE) {
//	                this.errText = '该手机号已存在'
	                	this.exist = true
	              	}
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
//     新手机号发送验证码
      sendCode() {
      	let regPhone = /^1[3|4|5|7|8][0-9]\d{8}$/;
      	if(!this.modifyPhone) {
      		this.errText = '手机号不能为空'
      	} else if(!regPhone.test(this.modifyPhone)) {
      		this.errText = '手机号格式错误'
      	} else if(!this.exist) {
      		this.errText = '该手机号已存在'
      		//        this.disabled = true
      	} else {
      		this.disabled = true
      		setTimeout(this.sended, 100)
      	}
      },//      启动 发送验证码倒计时
      sended() {
      		this.disabled = false
      		this.$refs.btn.run()
      	},
      	//      更新手机号
      	updatePhone() {
      		if(!this.modifyPhone) {
      			this.errText = '手机号不能为空'
      			return false
      		} else if(!this.exist) { // 手机号已存在
      			return false
      		} else if(!this.code) {
      			this.codeText = '验证码不能为空'
      			return false
      		}//        校验新手机号发送的验证码
        Axios.post('sms/checkIdentifyCode.do', {
          tel: this.modifyPhone,
          code: this.code
        }).then(response => {
          let res = response.data
          if(res.errorCode === ERRORCODE_CODE) {
            this.errText = ''
            this.codeText = ''
            Axios.post('customerInfo/updateSecurity.do', {
              signTelephone: this.modifyPhone
            })
              .then(
                (response) => {
                  let res = response.data
                  if (res.errorCode === ERRORCODE_CODE) {
                    this.step2 = false
                    this.step3 = true
                  }
                })
              .catch((error) => { console.log(error) })
          }else{
            this.codeText = '验证码校验错误'
            return false
          }
        })
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
  .modifyPhone{
    display: flex;
    justify-content: center;
    align-items: baseline;
    font-size:16px;
    color:#47443d;
  }
  .modifyPhone input{
    border:1px solid #d2d2d2;
    border-radius:6px;
    width:236px;
    height:28px;
    padding-left:5px;
    margin-left: 21px;
    outline: 0;
  }
  .modifyPhone div{
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
  .codeBtn{
    background:#d8d8d8;
    border-radius:4px;
    width:88px;
    height:24px;
    font-size:14px;
    border:none;
    outline: 0;
    margin-left:18px;
  }
  .codeBtn:hover{
    cursor: pointer;
    color: #f1b954;
  }
  .modifyCode{
    display: flex;
    align-items: center;
    padding-left: 208px;
    padding-top:17px;
    font-size:16px;
    color:#47443d;
  }
  .modifyCode input{
    border:1px solid #d2d2d2;
    border-radius:6px;
    width:103px;
    height:28px;
    margin-left: 21px;
    outline: 0;
    padding-left:5px;
  }

  /*第二步内容样式 end*/
</style>
