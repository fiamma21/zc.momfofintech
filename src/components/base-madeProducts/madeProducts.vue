<template>
  <div class="madeProject">
    <div class="madeProject-basic">
      <p>已发行产品:&nbsp;{{issueInfo.pnum}}个</p>
      <p>已发行金额: &nbsp;{{issueInfo.ptotal | FilterAmount}}万元&nbsp;({{issueInfo.pers}}<span v-if="issueInfo.pers">%</span>)</p>
    </div>
    <ul class="madeProject-content" v-if="issueList!=''">
      <li v-for="issue in issueList" class="manageLi" @click="seeProductDetails({productId:issue.pid, productName: issue.productName})">
        <div class="manage-title">{{ issue.productName }}</div>
        <div class="manage-main">
          <p><span>当前状态:</span>&nbsp;{{ issue.releaseStatus | ParseReleaseStatus}}</p>
          <p><span>资金方:</span>&nbsp;{{ issue.customerName }}</p>
          <p><span>待还金额:</span>&nbsp;约{{ issue.sumAmount | FilterAmountFraction}}万元</p>
        </div>
      </li>
    </ul>
     <div class="empty" v-else>
     暂无数据
   </div>
    <pagination v-on:CurrentChange="getIssueList" :total="total" class="pager"></pagination>
  </div>
</template>
<script>
  //公共处理方法
  import until from '../../common/util.js'
  //ajax
  import Axios from 'axios'
  import { mapState } from 'vuex'
  //分页
  import Pagination from 'components/pagination/pagination'

  export default {
    data () {
      return {
        issueList: [],
        issueInfo: {},
        row: 6,
        page: 1,
        num: 0
      }
    },
    created: function () {
      //初始化已发产品列表
      this.getIssueList()
      //初始化已发产品-产品数量、产品总金额
      this.getIssueInfo()
    },
    filters: {
      //千分位分隔
      FilterAmount: (value) => {
        if (!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      },
      //数字转换成以万为单位，并且保留百千两位小数，千分位分隔
      FilterAmountFraction: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitFraction(value)
      },
      //产品发行状态(2.募集中、3.存续期、4.已结算)
      ParseReleaseStatus: (value) => {
        if (!value) return ''
        value = value.toString()
        return until.ParseReleaseStatus(value)
      }
    },
    computed: {
      ...mapState({
        project_Id (state) {
          if(state.projectId === '') {
            this.$store.dispatch('getLocalStorage', 'projectId')
          }
          return state.projectId
        }
      }),
      total () {
        return Math.ceil(this.num / this.row)
      }
    },
    components: {
      'pagination': Pagination
    },
    methods: {
      //获取已发产品列表
      getIssueList (page) {
        this.page = page
        Axios.post('productInformation/issuePage.do', {
          id: this.project_Id,
          row: this.row,
          page: this.page
        })
          .then(
            (response) => {
              let res = response.data
              this.issueList = res.data.data
              this.num = res.data.total
            }
          )
          .catch( function (error) {
//	      	console.log(error)
          })
      },
      //获取已发产品-产品数量、产品总金额
      getIssueInfo () {
        Axios.post('productInformation/issue.do', {
          id: this.project_Id
        })
          .then(
            (response) => {
              let res = response.data
              this.issueInfo = res.data
            }
          )
          .catch(function (error) {
//	      	console.log(error)
          })
      },
//      分发跳转资产端产品详情页
      seeProductDetails ({productId, productName}) {
        this.$store.dispatch('goProductDetail', {productId, productName})
      }
    }
  }
</script>
<style scoped>
  .madeProject {
    margin-right: 53px;
    padding-bottom:1px;
  }

  .madeProject-basic {
    background: #ffffff;
    border: 1px solid #e2e2e2;
    /* border-bottom: none;  */
    height: 63px;
    line-height: 63px;
    font-size: 18px;
    color: #707070;
    text-align: left;
    display: flex;
  }

  .madeProject-basic p:first-child {
    width: 455px;
    box-sizing: border-box;
    padding-left: 30px;
  }

  .madeProject-content {
    display: flex;
    flex-wrap: wrap;
    font-size: 18px;
    color: rgb(112, 112, 112);
    -webkit-box-pack: justify;
    justify-content: space-between;
    box-sizing: border-box;
    background: rgb(243, 243, 243);
    /* margin-top: 40px; */
    padding: 40px 58px 4px 40px;
  }

  .manageLi {
    /*transition: all .6s;*/
    border-radius: 10px;
    width: 355px;
    text-align: left;
    margin-bottom: 60px;
    cursor: pointer;
  }
  .manageLi:hover{
    /* animation: hoverOut .8s; */
    box-shadow: 0 0 10px #ddd;
  }
  @keyframes hoverOut {
  0%{transform:rotate(-90deg)}
  50%{transform:rotate(-270deg) scale(1.2)}
  100%{transform:scale(1) rotate(0deg)}
}
  .manage-title {
    background: #fff;
    height: 65px;
    padding-left: 30px;
    line-height: 64px;
    border-bottom: 1px solid #e7e7e7;
  }

  .manage-main {
    background: #ffffff;
    padding-top: 21px;
    padding-left: 30px;
    padding-bottom: 22px;
  }

  .manage-main p {
    margin-bottom: 15px;
  }
  .pager{
    margin:52px 0;
  }

</style>
