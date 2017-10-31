<template>
  <div class="capitalSituation">
    <div class="loanInformation">
      <h3>放款信息</h3>
      <div class="loan-basic">
        <p>募集金额:&nbsp;{{recruitmentScale | FilterAmount}}元</p>
        <p>状态: &nbsp;{{ loanText }}</p>
      </div>
    </div>
    <div class="repaymentInformation">
      <h3>还款信息</h3>
      <el-table :data="capitalInfoList"  class="assetDetails" style="width: 100%">
        <el-table-column prop="status" :formatter="sText" width="140" label="状态"></el-table-column>
        <el-table-column prop="repayDate" :formatter="repayTime" label="还款日期"></el-table-column>
        <el-table-column prop="repayAmount" :formatter="rePay" label="还款金额(元)"></el-table-column>
      </el-table>
    </div>
    <pagination v-on:CurrentChange="getCapitalInfo" :total="total" class="assetPag"></pagination>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from 'vuex'
  import until from '../../common/util'
  import Pagination from 'components/pagination/pagination'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        num: 0,
        row: 5,
        page: 1,
        capitalInfoList: [],
        recruitmentScale: '',
        loanStatus:0
      }
    },
    components: {
      'pagination': Pagination
    },
    computed: {
      ...mapState({
        product_Id(state) {
          if(state.productId === '') {
            this.$store.dispatch('getLocalStorage', 'productId')
          }
          return state.productId
        }
      }),
      total () {
        return Math.ceil(this.num / this.row)
      },
      loanText() {
        return this.loanStatus == 2?'已放款':'未放款'
      }
    },
    created () {
      this.getFinancial()
      this.getCapitalInfo()
    },
    filters: {
      //千分位分隔
      FilterAmount: (value) => {
        if (!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      }
    },
    methods: {
      sText(row) {
        return row.status == 1? '已还清' : '未还清'
      },
      repayTime(row) {
        return until.forMate(row.repayDate)
      },
      rePay(row){
        return until.thousandBitSeparatorInt(row.repayAmount)
      },
      getFinancial() {
        Axios.post('productInformation/financial.do',{
          pid: this.product_Id
        }).then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.recruitmentScale = res.data.recruitmentScale * 10000
                this.loanStatus = res.data.loanStatus
              }
            })
          .catch(
            (error) => {console.log(error)}
          )
      },
      getCapitalInfo(page){
        this.page = page
        Axios.post('productCapitalInfo/page.do',{
          productId: this.product_Id,
          row: this.row,
          page: this.page
        }).then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.capitalInfoList = res.data.data
                this.num = res.data.total
              }
            })
          .catch(function (error) {
            console.log(error)
          })
      }
    }
  }
</script>
<style scoped>
  .capitalSituation{
    font-size: 18px;
    color: #696969;
  }
  .loanInformation{
    margin-bottom:55px;
  }
  .loanInformation h3{
    background: #f7f7f7;
    border: 1px solid #d2d2d2;
    height: 58px;
    text-align: left;
    font-size: 18px;
    box-sizing: border-box;
    padding-left: 40px;
    line-height: 58px;
    border-radius: 4px 4px 0 0;
  }
  .repaymentInformation h3{
    background:#f7f7f7;
    border:1px solid #d2d2d2;
    text-align: left;
    font-size: 18px;
    box-sizing: border-box;
    height:58px;
    padding-left: 53px;
    line-height: 58px;
    border-radius: 4px 4px 0 0;
  }
  .loan-basic{
    background:#ffffff;
    border:1px solid #e2e2e2;
    height:63px;
    line-height:63px;
    font-size: 18px;
    color: #707070;
    text-align: left;
    display: flex;
  }
  .loan-basic p:first-child{
    width:455px;
    box-sizing: border-box;
    padding-left:30px;
  }
  .assetDetails{
    text-align: left;
  }
  .assetPag{
    text-align: center;
    margin-top: 42px;
  }
</style>
