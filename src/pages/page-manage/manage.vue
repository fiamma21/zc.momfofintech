<template>
 <div class="manage">
   <div class="manageTitle">管理&nbsp;>&nbsp;<span style="color: #f0b954;">项目管理</span></div>
   <div class="manageTab">
     <el-tabs v-model="activeName" @tab-click="handleClick">
       <el-tab-pane label="全部" name="0"></el-tab-pane>
       <el-tab-pane label="集中式公寓" name="1"></el-tab-pane>
       <el-tab-pane label="分散式公寓" name="2"></el-tab-pane>
       <el-tab-pane label="酒店" name="3"></el-tab-pane>
       <el-tab-pane label="商业地产" name="4"></el-tab-pane>
     </el-tabs>
   </div>
   <transition-group tag="ul" name="list" class="manageContent" v-if="projectList!=''">
     <li v-for="project in projectList" :key='project.id' class="manageLi" @click="seeDetail(project.id)">
       <div class="manage-title">{{ project.projectName }}</div>
       <div class="manage-main">
         <p><span>授信状态:</span>&nbsp;{{ project.creditState | creditState}}</p>
         <p><span>授信额度:</span>&nbsp;{{ project.creditLine | FilterAmount}}万元</p>
         <p><span>待还金额:</span>&nbsp;约{{ project.psum | FilterAmountFraction}}万元</p>
         <button type="button" class="manage-btn btnNormal">查看详情</button>
       </div>
     </li>
   </transition-group>
   <div class="empty" v-else>
     暂无数据
   </div>
   <pagination v-on:CurrentChange="getProjectInfo" :total="total" class="pager"></pagination>
 </div>
</template>
<script>
  import Axios from 'axios'
  import until from '../../common/util.js'
  import Pagination from 'components/pagination/pagination'

  const ERRORCODE_CODE = 'SUCCESS'

  export default {
    data () {
      return {
        activeName: '0',
        projectList: [],
        row: 6,
        num: 0,
        page: 1,
        projectId: ''
      }
    },
    created () {
      this.getProjectInfo(1)
    },
    components: {
      'pagination': Pagination
    },
    computed: {
      total () {
        return Math.ceil(this.num / this.row)
      }
    },
    filters: {
      //千分位分隔
      FilterAmount: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      },
      //数字转换成以万为单位，并且保留百千两位小数，千分位分隔
      FilterAmountFraction: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitFraction(value)
      },
      //项目状态转换
      creditState:(state) => {
      	return until.creditState(state)
      }
    },
    methods: {
	  handleClick(tab, event) {
        this.getProjectInfo(this.page)
      },
	  //获取项目列表消息
      getProjectInfo (page) {
	    this.page = page
        Axios.post('projectInfo/page.do', {
    	  assetType:this.activeName,
          row: this.row,
          page: this.page
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.projectList = res.data.data
                this.num = res.data.total
              }
            })
          .catch(function (error) {
            //console.log(error)
          })
      },
//      跳转查看项目详情
      seeDetail(projectId){
        this.$store.dispatch('goProjectDetail', {id: projectId})
      }
    }
  }
</script>
<style scoped>
  .list-enter-active, .list-leave-active {
    transition: opacity 1s;
  }
  .list-enter, .list-leave-active {
    opacity: 0;
    transform: translateY(20px);
  }
  .list-move{
    transition: transform 1s;
  }
  .btnNormal{
    padding: 0;
    outline: 0;
    border: 0;
    cursor: pointer;
  }
  .manage{
    background: #fff;
    border-radius:6px;
    padding-bottom:1px;
  }
  .manageTitle{
    background: #f7f7f7;
    height: 80px;
    text-align: left;
    line-height: 80px;
    font-size:20px;
    color: #696969;
    padding-left:45px;
    padding-right:45px;
  }
  .manageTab{
    color: #b9b9b9;
    padding-left:37px;
    display:flex;
    margin-top: 25px;
    margin-bottom:20px;
  }
  .manageContent{
    background:#f3f3f3;
    display: flex;
    flex-wrap: wrap;
    font-size:18px;
    color: #707070;
    justify-content: flex-start;
    box-sizing: border-box;
    margin: auto 45px 0 37px;
    padding:0 27px 52px 46px;
  }
  .manageLi{
    transition: all .8s;
    /*height:266px;*/
    border-radius: 10px;
    width:355px;
    text-align: left;
    margin-top:40px;
    margin-right:4%;
    box-sizing: border-box;
  }
  .manageLi:hover{
    cursor: pointer;
    transform: scale(1.1);
    box-shadow: 0 0 10px #f0b954;
    /*animation: hoverInt 2s;*/
  }
  @keyframes hoverInt {
    0%{transform:translate(5px,5px)}
    50%{transform: scale(1.2) rotate(360deg) skew(5deg,5deg);}
    100%{transform: scale(1)  skew(-5deg,-5deg);}
  }
  .manage-title{
    background:#fff;
    height:65px;
    padding-left:30px;
    line-height: 64px;
    border-bottom:1px solid #e7e7e7;
    box-sizing: border-box;
  }
  .manage-main{
    background:#ffffff;
    padding-top:21px;
    padding-left:30px;
    padding-bottom:22px;
    box-sizing: border-box;
  }
  .manage-main p{
    margin-bottom:15px;
  }
  .manage-btn{
    background: #f0b954;
    border-radius: 6px;
    width: 116px;
    height: 33px;
    line-height: 32px;
    font-size: 18px;
    color: #fff;
    margin-top: 16px;
    margin-left: 25%;
  }
  .pager{
    margin:52px 0;
  }

</style>
