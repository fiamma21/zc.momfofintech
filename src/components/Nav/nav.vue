<template>
<div class="topNav">
  <div class="content">
     <h3>{{ company_name }}</h3>
      <i class="iconfont icon-xiaoxitishi" @click="viewMessage"><span class="messageNum" v-if="messageTotal !== ''">{{messageTotal}}</span></i>
      <i class="iconfont icon-weibiaoti--" @click="loginOut"></i>
  </div>
</div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from 'vuex'
  import bus from '../../store/eventBus'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {

      }
    },
    computed: {
      ...mapState({
        messageTotal (state) {
          return state.messageNum
        },
        company_name(state) {
          if(state.companyName === '') {
            this.$store.dispatch('getLocalStorage', 'companyName')
          }
          return state.companyName
        }
      })
    },
    created() {
      this.getUnReadNum()
    },
    methods: {
//      未读消息总数
      getUnReadNum() {
        Axios.post('messageRecord/unReadNum.do')
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.$store.dispatch('messageNumber', {messageNum: res.data})
              }
            })
          .catch( function (error) {
//          console.log(error)
          })
      },
//      退出
      loginOut() {
        Axios.post('login/logoutSuccess.do')
          .then(response => {
            let res = response.data
            if (res.errorCode === ERRORCODE_CODE) {
              this.$router.push({path: '/login'})
            }
          })
      },
      viewMessage () {
        bus.$emit('activeClass', 2)
        this.$router.push({path: '/home/MessageCenter'})
      }
    }
  }
</script>
<style scoped>
  .topNav {
    height: 94px;
    background: #32353e;
    font-size: 20px;
    display: flex;
    justify-content: flex-end;
    padding-right: 120px;
  }
  .content{
    /*width: 420px;*/
    display: flex;
    flex-direction: row;
    justify-content:space-between;
    align-items: center;
    color: #fff;
    padding-right:48px;
  }
    .warn {
      margin-right: 25px;
      margin-left: 44px;
    }
  .icon-small{
    border-radius: 2px;
    height: 16px;
    line-height: 16px;
    padding: 2px;
  }
  .icon-xiaoxitishi{
    margin: 0 40px;
    cursor: pointer;
  }
  .icon-weibiaoti--{
    cursor: pointer;
  }
  .messageNum{
    position: absolute;
    right: -10px;
    top: -10px;
    display: block;
    content: "";
    width: 20px;
    height: 20px;
    background-color: red;
    border-radius: 3px;
    font-size: 12px;
    line-height: 20px;
    text-align: center;
  }
</style>
