<!--资产端产品详情-->
<template>
  <div class="productDetails">
    <div class="projectTitle">{{productName}}</div>
    <div class="project-main">
      <div class="project-title">管理&nbsp;>&nbsp;<span style="color: #f1b954">项目管理</span></div>
      <div class="project-tab">
        <el-tabs v-model="activeName">
          <el-tab-pane label="资金情况" name="capitalSituation"></el-tab-pane>
          <el-tab-pane label="产品详情" name="productDetails"></el-tab-pane>
          <el-tab-pane label="资产明细" name="assetDetails"></el-tab-pane>
        </el-tabs>
      </div>
      <div class="project-content">
        <transition name="component-fade" mode="out-in">
          <keep-alive>
            <component :is="activeName">
              <!-- 非活动组件将被缓存！ -->
            </component>
          </keep-alive>
        </transition>
      </div>
    </div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
//  资金情况
  import CapitalSituation from 'components/base-capitalSituation/capitalSituation'
// 产品详情
  import ProductDetails from 'components/base-productDetails/productDetails'
// 资产明细
  import AssetDetails from 'components/base-assetDetails/assetDetails'

  export default {
    data () {
      return {
        activeName: 'capitalSituation'
      }
    },
    computed: {
      ...mapState({
        productName(state) {
          if(state.productName === ''){
            this.$store.dispatch('getLocalStorage', 'productName')
          }
          return state.productName
        }
      })
    },
    components: {
      'capitalSituation': CapitalSituation,
      'productDetails': ProductDetails,
      'assetDetails': AssetDetails
    }
  }
</script>
<style scoped>
  /*过渡效果*/
  .component-fade-enter-active, .component-fade-leave-active {
    transition: all .4s ease;
  }
  .component-fade-enter, .component-fade-leave-active {
    opacity: 0;
    transform: translate(10px);
  }
  .projectTitle{
    font-size:26px;
    color:#696969;
    margin-bottom: 30px;
    margin-top:-23px;
  }

  .project-main{
    background: #fff;
    padding:0 43px 42px 45px;
  }
  .project-title{
    height: 80px;
    line-height: 80px;
    background: #f7f7f7;
    font-size: 20px;
    color: #696969;
    text-align: left;
    margin-left:-45px;
    margin-right:-43px;
    padding-left:45px;
  }
  .project-tab{
    height: 60px;
    line-height: 60px;
  }
  .project-content{
    margin-top:20px;
  }
</style>
