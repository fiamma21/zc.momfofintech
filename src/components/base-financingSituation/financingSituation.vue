<template>
  <div class="financingSituation">
    <div class="financing-basic">
      <p>授信额度:&nbsp;{{detailFinancing.creditLine | FilterAmount}}万元</p>
      <p>待还金额: &nbsp;约{{detailFinancing.psum | FilterAmountFraction}}万元</p>
    </div>
    <div class="financing-chart">
      <div class="chart">
        <chart-line>
          <div slot="title" class="line-title">已募集资金</div>
        </chart-line>
        <chart-bar>
          <div slot="title" class="bar-title">项目融资存量</div>
        </chart-bar>
      </div>
      <div class="column"></div>
    </div>
    <ul class="financing-content">
      <li><span>融资需求</span>{{detailFinancing.quota | FilterAmount}}万元</li>
      <li><span>融资用途</span>{{detailFinancing.financingPurpose}}</li>
      <li><span>融资费用</span>{{detailFinancing.cost}}%</li>
      <li>
        <span>可接受还款方式</span>
        <el-radio-group v-model="radio1">
          <el-radio :label="3" v-for="method in repaymentMethod">{{method.repay | ParseRepaymentMethod}}
          </el-radio>
        </el-radio-group>
      </li>
      <li>
        <span>可接受期限种类</span>
        <el-radio-group v-model="radio2">
          <el-radio :label="6"  v-for="term in investmentTerm">{{term.invest | ParseInvestmentTerm}}
          </el-radio>
        </el-radio-group>
      </li>
    </ul>
  </div>
</template>
<script>
  //ajax
  import Axios from 'axios'
  import { mapState } from 'vuex'
  //公共处理方法
  import until from '../../common/util.js'
  import Bar from 'components/chart/bar'
  import Line from 'components/chart/line'
  //声明接口访问成功状态
  const ERRORCODE_CODE = 'SUCCESS'

  export default {
    data () {
      return {
        repaymentMethod: [],
        investmentTerm: [],
        detailFinancing: {},
        stock: [],
        radio1: 3,
        radio2: 6,
        //初始化已募集资金
        raise: [
        //  {date: "2017-08-30", quota: 300},
        //  {date: "2017-08-30", quota: 3000},
          // {date: "2017-08-30", quota: 3000},
          // {date: "2017-08-30", quota: 3000},
        ],
        //初始化项目融资存量
        stocks: [
         // {aDate: "2017-08-30", aAmount: 8333.33}
        ]
      }
    },
    created () {
      this.getDetailFinancing()
    },
    components: {
      'chart-bar': Bar,
      'chart-line': Line
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
    filters: {
    	//数字强制转换为以万元为单位
    	FilterThousandBit:(value) =>{
        if (!value) return '0.00'
        return until.thousandBitInt(value)
    	},
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
      //项目状态转换
      creditState: (state) => {
        return until.creditState(state)
      },
      //可接受还款方式
      ParseRepaymentMethod: (str) => {
        return until.ParseRepaymentMethod(str)
      },
      // 可接受投资期限
      ParseInvestmentTerm: (str) => {
        return until.ParseInvestmentTerm(str)
      }
    },
    methods: {
      //获取项目列表消息
      getDetailFinancing (page) {
        Axios.post('projectInfo/detailFinancing.do', {
          id: this.project_Id
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.detailFinancing = res.data
                this.stocks = res.data.stock
                this.raise = res.data.raise
                // 将数据存放在vuex库中，在updated周期，解决异步数据加载图表问题
                this.$store.dispatch('chartData', {line: res.data.raise,bar:res.data.stock})
                let methodArr = res.data.repaymentMethod.split(",")
                let termArr = res.data.investmentTerm.split(",")
                for (let i = 0, len1 = methodArr.length; i < len1; i++) {
                  this.repaymentMethod.push({'repay': methodArr[i]})
                }
                for (let j = 0, len2 = termArr.length; j < len2; j++) {
                  this.investmentTerm.push({'invest': termArr[j]})
                }
              }
            })
          .catch(function (error) {
          	
          })
      }
    }
  }
</script>
<style>
  .el-radio {
    font-size: 18px !important;
    /*width: 166px;*/
  }

  .el-radio__label {
    font-size: 18px !important;
    color: #696969;
  }

  .el-radio__input.is-checked .el-radio__inner {
    border-color: #d3d3d3 !important;
    background: #d3d3d3 !important;
  }

  .echarts {
    height: 300px;
  }
</style>
<style scoped>
  .financing-basic {
    background: #ffffff;
    border: 1px solid #e2e2e2;
    height: 63px;
    line-height: 63px;
    font-size: 18px;
    color: #707070;
    text-align: left;
    display: flex;
  }

  .financing-basic p:first-child {
    width: 455px;
    box-sizing: border-box;
    padding-left: 30px;
  }
  .financing-chart{
  display: flex;
  }
  .chart{
    font-family:PingFangSC-Regular;
    display: flex;
    justify-content: space-around;
    flex:1;
  }
  .line-title,.bar-title{
    font-size: 18px;
    color: #696969;
    background: #f7f7f7;
    border: 1px solid #e2e2e2;
    text-align: left;
    border-bottom: none;
    border-radius: 4px 4px 0 0;
    height: 58px;
    line-height: 58px;
    text-indent: 22px;
  }
  .financing-content {
    text-align: left;
    padding-bottom: 110px;
    font-size: 18px;
    color: #696969;
  }

  .financing-content li {
    height: 70px;
    line-height: 70px;
    padding-left: 16px;
    border-bottom: 1px solid #e5e5e5;
  }

  .financing-content li span {
    display: inline-block;
    width: 200px;
  }
</style>
