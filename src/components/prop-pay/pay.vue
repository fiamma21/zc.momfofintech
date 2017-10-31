<template>
  <div class="dialogContent">
    <div class="progress">
      <div class="progressOut">
        <div class="progressInt" :class="{gradient_1:step1,gradient_2:!step1}">1</div>
        <p>第一步&nbsp;在线支付</p></div>
      <div class="progressLine"></div>
      <div class="progressOut">
        <div class="progressInt" :class="{gradient_1:step2,gradient_2:!step2}">2</div>
        <p>第二步&nbsp;还款成功</p>
      </div>
    </div>
    <div class="progressMain">
      <template v-if="step1">
        <div class="manText">请前往<a>{{ financeText }}</a>还款</div>
        <button type="button" class="progressMainBtn">前往还款</button>
        <p class="payErr">您还没有完成还款,&nbsp;请重新尝试还款</p>
      </template>
      <template v-else-if="step2">
        <div class="paySuccess">已成功还款</div>
      </template>
    </div>
    <div class="dialogFooter">
      <button type="button" class="btn btn1" v-if="step1" @click="next">已完成付款，请跳转下一步</button>
      <button type="button" class="btn btn2" v-if="step2" @click="end">确定</button>
    </div>
  </div>
</template>
<script>
  export default {
    props: ['financeType', 'id'],
    data () {
      return {
        step1: true,
        step2: false
      }
    },
    computed: {
      financeText(){
//        1 魔方宝 2 xx金服
        let type = this.financeType || 2
        return type === 1 ? '魔方宝个人账户' : 'XX金服'
      }
    },
    methods: {
      next () {
        this.step1 = false
        this.step2 = true
      },
      end () {
        this.$emit('end', 0)
      }
    }
  }
</script>
<style scoped>
  .dialogContent {
    height: 380px;
    display: flex;
    flex-direction: column;
    color: #707070;
    font-size: 16px;
  }

  .dialogFooter {
    height: 70px;
    background: #f7f7f7;
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 70px;
  }

  .btn {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    text-align: center;
    background: #9b9b9b;
    border-radius: 8px;
    height: 31px;
    border-width: 1px;
    outline: 0;
    color: #fff;
    padding: 0 !important;
  }
  .btn:hover{
    cursor: pointer;
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }
  .btn1 {
    width: 241px;
  }

  .btn2 {
    width: 160px;
  }

  .progress {
    display: flex;
    height: 54px;
    margin-top: 24px;
    justify-content: center;
    align-items: center;
  }

  .progressMain {
    margin-top: 102px;
  }
  .manText a {
    color: #62aee9;
  }
  .progressMainBtn {
    background: #f0b954;
    border-radius: 8px;
    width: 240px;
    height: 41px;
    color: #fff;
    font-size: 22px;
    text-align: center;
    border: 0;
    margin-top: 20px;
    margin-bottom: 37px;
    margin-left: 275px;
  }
  .progressMainBtn:hover{
    cursor: pointer;
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }
  .progressOut {
    background: #f7f7f7;
    width: 54px;
    height: 54px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #fff;
    position: relative;
  }

  .progressOut p {
    position: absolute;
    top: 65px;
    width: 150px;
    color: #707070;
    font-size: 16px;
  }

  .progressLine {
    background: #f7f7f7;
    width: 196px;
    height: 6px;
  }

  .progressInt {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    line-height: 42px;
  }

  .gradient_1 {
    background-image: radial-gradient(50% 100%, #f8ce6d 0%, #f4bc6f 100%);
  }

  .gradient_2 {
    background: #d2d2d2
  }

  .paySuccess {
    margin-top: 50px;
    font-size: 20px;
    color: #707070;
  }
  .payErr{
    color: #f0b954;
    margin-bottom: 11px;
  }
</style>
