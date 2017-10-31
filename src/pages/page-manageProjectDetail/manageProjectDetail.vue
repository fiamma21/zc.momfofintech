<template>
 <div class="projectDetails">
   <div class="projectTitle">{{ProjectInfo.projectName}}</div>
   <div class="project-main">
     <div class="project-title">管理&nbsp;>&nbsp;<span style="color: #f1b954">项目详情</span></div>
        <div class="project-tab">
          <el-tabs v-model="activeName">
            <el-tab-pane label="融资情况" name="financingSituation"></el-tab-pane>
            <el-tab-pane label="项目资料" :name="ProjectInfo.assetType!=2?'ProjectInformation':'ProjectInfoDisperse'"></el-tab-pane>
            <el-tab-pane label="租约信息" :name="ProjectInfo.assetType!=2?'LeaseInfoFocus':'LeaseInfoDisperse'"></el-tab-pane>
            <el-tab-pane label="已发产品" name="madeProducts"></el-tab-pane>
            <el-tab-pane label="资产信息" name="assetInformation"></el-tab-pane>
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
  //融资情况
  import FinancingSituation from 'components/base-financingSituation/financingSituation'
  //项目资料--集中式
  import ProjectInformation from 'components/base-ProjectInformation/ProjectInformation'
  //项目资料--分散式
  import ProjectInfoDisperse from 'components/base-ProjectInformation/projectInfoDisperse'
  //租约信息--集中式
  import LeaseInfoFocus from 'components/base-leaseInformation/leaseInfoFocus'
  //租约信息--分散式
  import LeaseInfoDisperse from 'components/base-leaseInformation/leaseInfoDisperse'
  //已发产品
  import MadeProducts from 'components/base-madeProducts/madeProducts'
  //资产信息
  import AssetInformation from 'components/base-assetInformation/assetInformation'
  //ajax
  import Axios from 'axios'
  //公共处理方法
  import until from '../../common/util.js'
  //状态库
  import { mapState } from 'vuex'
  //声明接口访问成功状态
  const ERRORCODE_CODE = 'SUCCESS'

  export default {
    data () {
      return {
      	activeName:'financingSituation',
        ProjectInfo: {}
      }
    },
    computed: {
      ...mapState({
        project_Id(state) {
          if(state.projectId === '') {
            this.$store.dispatch('getLocalStorage', 'projectId')
          }
          return state.projectId
        }
      })
    },
    created () {
      this.getProjectInformation()
    },
    methods: {
      getProjectInformation () {
        Axios.post('projectInfo/detailProject.do', {
         id: this.project_Id
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.ProjectInfo = res.data
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      }
    },
    components: {
       //融资情况
      'financingSituation': FinancingSituation,
      //项目资料--集中式
      ProjectInformation,
      //项目资料--分散式
      ProjectInfoDisperse,
      //租约信息--集中式
      'LeaseInfoFocus': LeaseInfoFocus,
      //租约信息--分散式
      'LeaseInfoDisperse': LeaseInfoDisperse,
      //已发产品
      'madeProducts': MadeProducts,
      //资产信息
      'assetInformation': AssetInformation
    }
  }
</script>
<style>
  .el-tabs__item{
    font-size: 18px !important;
  }
</style>
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
    font-size:24px;
    color:#696969;
    margin-bottom: 30px;
    margin-top:-23px;
  }
  .project-main{
    background: #fff;
    padding-left:45px;
    padding-right:43px;
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
