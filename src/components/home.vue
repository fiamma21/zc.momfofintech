<template>
  <div>
  <!--侧边栏-->
    <aside-two class="left"></aside-two>
  <!--顶部导航-->
    <div class="right">
      <div class="top">
        <top-nav></top-nav>
      </div>
    </div>
      <!--内容-->
      <div class="content">
        <transition name="fade" mode="out-in">
        <router-view class="ss"></router-view>
        </transition>
      </div>
  </div>
</template>
<script>
  import TopNav from 'components/Nav/nav'
  import AsideTwo from 'components/AsideTwo/asideTwo'
  export default {
    data () {
      return {}
    },
    components: {
      'top-nav': TopNav,
      'aside-two': AsideTwo
    }
  }
</script>
<style>
  @import url('//at.alicdn.com/t/font_9332ani52ttn8kt9.css');
  .iconfont{
    font-size:30px;
    font-weight: bold;
    transform: translate(-6px);
  }
</style>
<style scoped>
 .fade-enter-active, .fade-leave-active{
    transition: all .4s ease;
  }
  .fade-enter, .fade-leave-to{
   transform: translateX(-20px); 
   opacity: 0;
  }
  .left{
    z-index: 2;
  }
  .right{
    width: 85%;
    /*width: 1360px;*/
    position: fixed;
    left:17%;
    top:0;
    display: flex;
    flex:1;
    flex-direction: column;
    z-index: 1000;
  }
  .content{
    position: absolute;
    top:12%;
    left:20.3%;
    /*left: 200px;*/
    width: 75%;
    /*width: 1190px;*/
    padding:2.5% 0 0 1%;
    overflow-y:auto;
    overflow-x:hidden;
    background-color: #e9e9e9;
  }
  .ss{
    display: block;
  }
</style>
