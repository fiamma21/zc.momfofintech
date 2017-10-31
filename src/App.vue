<template>
  <div id="app">
      <router-view></router-view>
  </div>
</template>

<script>
  import './assets/reset.css'
  export default {
    name: 'app'
}
</script>

<style>

#app {
  font-family: PingFangSC-Regular,'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
