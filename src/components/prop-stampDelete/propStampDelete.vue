<template>
  <div class="dialogContent">
    <div class="progressMain">
      <div class="phone-content">
        <template v-if="step1">
          <div class="sendCode" style="position: relative;">
            <input type="text" placeholder="请输入验证码" v-model="oldCode" maxlength="6" onkeyup='this.value=this.value.replace(/\D/gi,"")'>
            <p class="oldErr">{{oldCodeText}}</p>
          </div>
          <div class="resSend">
            <p>已向您的手机号{{phone|phone}}发送验证码</p>
            <p>没有收到验证码？您可以选择
              <button type="button" @click="reSend" style="cursor: pointer">重新发送</button>
            </p>
          </div>
        </template>
        <template v-else="step2">
          <div class="phoneOK">已成功删除签章!</div>
        </template>
      </div>
      <div class="phone-button">
        <button v-if="step1" @click="next" class="baseBtn">下一步</button>
        <button v-else="step2" @click="end" class="baseBtn">确定</button>
      </div>
    </div>
  </div>
</template>
<script>
//ajax
import Axios from 'axios'
//导入jq
import $ from 'jquery'
//公共方法
import until from '../../common/util'
const ERRORCODE_CODE = 'SUCCESS'
export default {
  props: ['stampId', 'stampList', 'index', 'phone'],
  data() {
    return {
      oldCodeText: '',
      oldCode: '',
      step1: true,
      step2: false
    }
  },
  filters: {
    phone(phone) {
      return phone.substring(0, 3) + "****" + phone.substring(7, phone.length);
    }
  },
  methods: {
    //重新发送验证码
    reSend() {
      Axios.post('sms/sendMsg.do', { templateCode: '22' })
        .then(response => {
          let res = response.data
          alert(res.message)
        })
    },
    //点击下一步删除签章
    next() {
      if (!this.oldCode) {
        this.oldCodeText = '验证码不能为空!'
        return false
      }
      Axios.post('stamp/stampDelete.do', {
        'uid': this.stampId,
        'verificationCode': this.oldCode
      })
        .then(
        (response) => {
          let res = response.data
          if (res.errorCode === 'SUCCESS') {
            this.stampList.splice(this.index, 1)
            this.step1 = false
            this.step2 = true
          } else if (res.errorCode === 'MA-1015'){
            this.oldCodeText = res.message;
          } else if (res.errorCode === 'MA-1103'){
          	this.$parent.visible=false
          	this.$msgbox({
		          title: ' ',
		          message: res.message,
		          customClass: 'openClass',
		          confirmButtonText: '确定',
		          confirmButtonClass: 'confirmClass',
		        })
          }
        })
        .catch(
        (error) => { console.log(error) }
        )
    },
    end() {
      this.$emit('end', 0)
    }
  }
}
</script>
<style scoped>
.oldErr{
    position: absolute;
    top: 7px;
    width: 210px;
    left: 425px;
    font-size: 14px;
    color: #f0b954;
    text-align: left;
  }

.baseBtn:hover {
  cursor: pointer;
  box-shadow: 0 0 20px #fff inset;
  -webkit-transform: scale(1.05);
  -moz-transform: scale(1.05);
  -ms-transform: scale(1.05);
  -o-transform: scale(1.05);
  transform: scale(1.05);
}

.dialogContent {
  font-family: PingFangSC-Regular;
  height: 300px;
  display: flex;
  flex-direction: column;
  color: #707070;
  font-size: 16px;
  text-align: center;
}

.progressMain {
  margin-top: 102px;
  display: flex;
  height: 200px;
  flex-direction: column;
  justify-content: space-between;
}


/*第一步内容样式 start*/

.sendCode {
  height: 30px;
  font-size: 16px;
  margin-bottom: 30px;
  line-height: 30px;
  color: #47443d;
}

.sendCode input {
  border: 1px solid #979797;
  border-radius: 8px;
  width: 140px;
  height: 38px;
  padding-left: 10px;
  margin-left: 0;
  text-align: center;
}

.sendCode span {
  color: rgb(241, 185, 84);
  margin-left: 10px;
  display: none;
}

.resSend p {
  margin-top: 3px;
}

.resSend button {
  color: #5aaae7;
  border: none;
  background: #fff;
  font-size: 16px;
  outline: 0;
}


/*第一步内容样式 end*/


/*第三步内容样式 start*/

.phoneOK {
  font-size: 20px;
  color: #707070;
  margin-top: 64px;
}

.phone-button button {
  background: #f0b954;
  border-radius: 8px;
  width: 241px;
  height: 42px;
  font-size: 22px;
  color: #fff;
  border: none;
  outline: 0;
}
</style>
