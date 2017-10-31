<template>
  <button :style="textColor" type="button" :disabled="disabled || time >0">
    {{ errText }}
  </button>
</template>
<script>
  import Axios from 'axios'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    props: {
      second: {
        type: Number,
        default: 60
      },
      phone: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data () {
      return {
        time: 0,
        col: '#47443d'
      }
    },
    computed: {
      errText () {
        return this.time > 0 ? this.time + 's' : '发送验证码'
      },
      textColor () {
        if (this.errText !== '发送验证码') {
          this.col = '#f1b954'
        }else{
          this.col = '#47443d'
        }
        return {
          color: this.col
        }
      }
    },
    methods: {
      run () {
        this.time = this.second
        this.timer()
//        调用发送验证码接口
        Axios.post('sms/sendMsg.do', {
          templateCode: '21',
          tel: this.phone
        })
          .then(response =>{
            let res = response.data
            if (res.errorCode === ERRORCODE_CODE){
//            console.log('成功')
            }
          })
      },
      timer () {
          if(this.time > 0) {
            this.time--
            setTimeout(this.timer, 1000)
          }
      }
    }
  }
</script>
<style scoped>
  .btn{
    color: #f1b954;
  }
</style>
