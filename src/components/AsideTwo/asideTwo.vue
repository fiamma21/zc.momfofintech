<template>
  <div class="leftAside">
    <div class="logo" @click="goIndex"><img src="../../assets/image/logo.png" alt="魔方金服"></div>
    <ul class="metaAside fontCol" :class="{nowActive: activeIndex === 0}" @click="active(0)">
      <li @click.self.stop><i class="iconfont icon-jinrong"></i>&nbsp;金融</li>
      <router-link to="/home/repayment">
        <li class="secondtit">还款</li>
      </router-link>
      <router-link to="/home/signManage">
        <li class="secondtit">签约</li>
      </router-link>
    </ul>
    <ul class="metaAside fontCol" :class="{nowActive: activeIndex === 1}" @click="active(1)">
      <li @click.self.stop><i class="iconfont icon-shebei_wenjianjia"></i>&nbsp;管理</li>
      <router-link to="/home/manage">
        <li class="secondtit">项目管理</li>
      </router-link>
      <router-link to="/home/contractManage">
        <li class="secondtit">合同管理</li>
      </router-link>
    </ul>
    <ul class="metaAside fontCol" :class="{nowActive: activeIndex === 2}" @click="active(2)">
      <li @click.self.stop><i class="iconfont icon-shezhi1"></i>&nbsp;设置</li>
      <router-link to="/home/businessInformation">
        <li class="secondtit">企业资料</li>
      </router-link>
      <router-link to="/home/safeCenter">
        <li class="secondtit">安全中心</li>
      </router-link>
      <router-link to="/home/messageCenter">
        <li class="secondtit">消息中心</li>
      </router-link>
    </ul>
  </div>
</template>
<script>
  import bus from '../../store/eventBus'

  function siblings (elm) {
    let a = []
    let p = elm.parentNode.children
    for (let i = 0, pl = p.length; i < pl; i++) {
      if (p[i] !== elm) a.push(p[i])
    }
    return a
  }

  export default {
    data () {
      return {
        beforeUl: '',
        activeIndex: 0
      }
    },
    mounted () {
//          let parents = document.querySelectorAll('.metaAside')
//          for (let i = 0, len = parents.length; i < len; i++) {
//            parents[i].addEventListener('click', function (ev) {
//              if (ev.target && ev.target.nodeName.toUpperCase() === 'LI') {
//                this.activeIndex = i
//            let otherArr = siblings(parents[i])
//           for (let o of otherArr) {
//             o.classList.remove('nowActive')
//           }
//           parents[i].classList.add('nowActive')
//              }
//            })
//          }
      bus.$on('activeClass', (num) => {
        this.active(num)
      })
    },
    methods: {
      active (i) {
        this.activeIndex = i
      },
      goIndex () {
        this.$router.push({name: 'Finance'})
      }
    }
  }
</script>
<style>
  .nowActive {
    background: #f5f5f5;
    position: relative;
  }

  .nowActive::after {
    content: '';
    display: inline-block;
    width: 0;
    height: 0;
    border-top: 15px solid transparent;
    border-left: 30px solid #f5f5f5;
    border-bottom: 15px solid transparent;
    filter: drop-shadow(5px 0px 2px #ddd);
    z-index: 1000;
    position: absolute;
    left: 100%;
    top: 11.5%;
  }

  .logo {
    padding: 30px 39px;
    box-sizing: border-box;
    /*width:352px;*/
    /*width:100%;*/
    /*height:98px;*/
    height: 8%;
    /*background:url('/static/img/logo@1x.png') no-repeat center;*/
    /*background-size:85%;*/
    background-color: #f1b954;
    cursor: pointer;
  }

  .logo img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    margin: 5px;
  }

  .leftAside {
    position: fixed;
    left: 0;
    top: 0;
    background: #f5f5f5;
    /*width:352px;*/
    width: 17%;
    height: 1176px;
    /*flex:0 0 352px;*/
    /*box-shadow: 5px 2px 7px #ddd;*/
    min-width: 200px;
    z-index: 1100;
  }

  /*路由ul*/
  .router-link-active {
    color: #f0b954;
    display: flex;
    align-items: center;
    position: relative;
  }

  .metaAside {
    border-bottom: 1px solid #e4e4e4;
    text-align: left;
    padding: 15% 0;
  }

  .metaAside li {
    width: 100%;
    padding-left: 25%;
    text-align: center;
    font-size: 1.5rem;
  }

  .metaAside li.secondtit {
    font-size: 1rem;
  }

  /*.metaAside li:nth-of-type(1){*/
  /*font-size: 1.5rem;*/
  /*}*/

  .metaAside li:first-child i {
    margin-left: -33px;
  }

  .metaAside li i {
    font-size: 1.5rem;
  }

  .metaAside li:first-child span {
    margin-left: 7px;
  }

  .metaAside:nth-of-type(3) {
    height: 20%;
    border-bottom: none;
  }

  .metaAside li {
    display: flex;
    align-items: center;
    height: 20px;
    font-size: 18px;
    line-height: 18px;
    margin-left: 14px;
    padding-bottom: 20px;
  }
</style>
