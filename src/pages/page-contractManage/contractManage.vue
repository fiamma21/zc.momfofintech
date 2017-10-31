<template>
  <!-- <transition :name="transitionName"> -->
  <router-view></router-view>
  <!-- </transition> -->
</template>
<script>
  export default {
    data () {
      return {
        transitionName: 'fade'
      }
    }
//    watch: {
//      '$route' (to, from) {
//        const toDepth = to.path.split('/').length
//        const fromDepth = from.path.split('/').length
//        this.transitionName = toDepth < fromDepth ? 'fade' : 'left'
//      }
//    }
  }
</script>
<style scoped>
  .left-enter-active,  .left-leave-active, .fade-enter-active, .fade-leave-active{
    transition: opacity .5s;
  }
  .fade-enter, .fade-leave-to{
    /* transform: translateX(-10px) scale(.5); */
    opacity:  0;
  }
  .left-enter, .left-leave-to{
    transform: scale(1.2);
    opacity:  0;
  }
</style>

