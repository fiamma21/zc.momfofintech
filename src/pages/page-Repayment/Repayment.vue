<template>
  <div class="manage">
    <div class="manageTitle">金融&nbsp;>&nbsp;<span style="color: #f0b954;">还款</span></div>
    <div class="manageTab">
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部" name="3" ></el-tab-pane>
        <el-tab-pane label="待还款" name="0"></el-tab-pane>
        <el-tab-pane label="已还款" name="1"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="empty" v-if="managesList==''">
      暂无数据
    </div>
    <ul class="manageContent" v-if="managesList!=''">
      <li v-for="manage in managesList" class="manageLi">
        <div class="manage-title">{{ manage.productName }}</div>
        <div class="manage-main">
          <p><span>还款金额:</span>&nbsp;{{ manage.amount | FilterAmount}}元&nbsp;<span style="color: #f0b954;">({{manage.period | Num}}/{{ manage.total | Num}}期)</span></p>
          <p><span>还款日期:</span>&nbsp;{{ manage.repayDate | Time}}</p>
          <button type="button" v-show="showPayBtn({hide: manage.hide,status: manage.status})" :disabled="payed({hide: manage.hide,status: manage.status})"   class="manage-btn btnNormal"
                  @click="showPropPay(manage)">
            {{ pay.Text }}
          </button>
        </div>
      </li>
    </ul>
    <pagination v-on:CurrentChange="getManagesList" :total="total" class="pager"></pagination>
    <el-dialog v-model="showPay" customClass="dialog" title="还款" size="tiny" top="10%">
      <prop-pay v-if="showPay" v-on:end="close" :financeType="financeType" :id="id"></prop-pay>
    </el-dialog>
    <el-dialog v-model="showVoucher" customClass="dialog" title="还款" size="tiny" top="10%">
      <prop-voucher v-if="showVoucher" v-on:end="close" :productId="productId"></prop-voucher>
    </el-dialog>
  </div>
</template>
<script>
  import until from '../../common/util.js'
  import Axios from 'axios'
  import Pagination from 'components/pagination/pagination'
  //魔房宝还款
  import PropPay from 'components/prop-pay/pay'
  //外部未对接还款
  import PropVoucher from 'components/prop-voucher/voucher'
  export default {
    data () {
      return {
        activeName: '3',
        managesList: [],
        showPay: false,
        showVoucher: false,
        row: 6,
        num: 0,
        page: 1,
        pay: {},
        financeType: '',//融资类型
        id:'',//还款id
        productId:''//还款凭证id
      }
    },
    created: function(){
	    this.getManagesList()
    },
    computed: {
      total () {
        return Math.ceil(this.num / this.row)
      }
    },
    filters: {
      FilterAmount: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)

      },
      Num: (num) => {
        return !num  ? '-' : num
      },
      Time: (time) => {
          return until.forMate(time)
      }
    },
    methods: {
//      关闭弹窗
      close(flag){
        if(flag === 0){
          this.showPay = false
          this.showVoucher = false
          this.getManagesList(this.page )
        }
      },
      payed: function ({hide, status}) {
        if( hide === '1' && status === '0'){
            this.pay.Text= '还款审核中'
          return true
        }else if(hide === '1' && status === '1'){
           this.pay.Text = ''
          return true
        }else{
           this.pay.Text= '还款'
          return false
        }
      },
       //还款按钮显示
      showPayBtn:function({hide, status}){
       if(hide === '1' && status === '1'){
          return false
       }
          return true
      },
      showPropPay: function (manage) {
        if( manage.hide==='0' || (manage.hide === '1' && manage.status === '2')){
          this.showVoucher = true
        //  this.showPay = false
          this.productId = manage.id
        }else{
        //  this.showPay = true
          this.showVoucher = false
          this.id = manage.id
        }
      },
      handleClick(tab, event) {
        this.getManagesList(this.page)
      },
      getManagesList (page) {
        this.page = page
      	Axios.post('productOperation/page.do',{
       		status:this.activeName,
	        row: this.row,
	        page: this.page
      	})
	      .then(
		        (response) => {
		        	let res = response.data;
		        	this.managesList = res.data.data
              this.num = res.data.total
		        }
	        )
	      .catch(function (error) {
//	      	console.log(error)
	      })
      }
    },
    components: {
      'pagination': Pagination,
      'prop-pay': PropPay,
      'prop-voucher': PropVoucher
    }
  }
</script>
<style>
  .el-tabs__item.is-active {
    color: #f0b954 !important;
  }
  .el-tabs__active-bar{
    width: 88px;
    transform: translateX(20px);
    background-color: #f0b954 !important;
  }
  .el-tabs__header{
    margin:0 !important;
    border:none !important;
  }
  /*弹出框样式修改*/
  .dialog{
    border-radius:10px 8px 8px 8px;
    width:800px !important;
    height:500px;
  }
  .el-dialog__header{
    height:50px;
    line-height: 50px;
    padding-top: 0 !important;
    background: #f7f7f7;

  }
  .el-dialog__title{
    font-family:PingFangSC-Regular;
    font-weight:normal !important;
    letter-spacing: 1px;
    color: #696969 !important;
    font-size: 20px !important;
  }
  .el-dialog__body{
    padding:0 !important;
  }
</style>
<style scoped>
  .btnNormal{
    padding: 0;
    outline: 0;
    border: 0;
  }
  .manage{
    background: #fff;
    border-radius:6px;
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
    padding:0 32px 52px 40px;
  }
  .manageLi{
    transition: all .6s;
    height:266px;
    border-radius: 10px;
     width:355px;
    text-align: left;
    margin-top:40px;
    margin-right:4%
  }
  .manage-title{
    background:#fff;
    height:65px;
    padding-left:30px;
    line-height: 64px;
    border-bottom:1px solid #e7e7e7;
  }
  .manage-main{
    background:#ffffff;
    padding-top:21px;
    padding-left:30px;
    padding-bottom:22px;
    height:115px;
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
    cursor: pointer;
  }
  .manage-btn:hover{
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }
  .pager{
    margin: 52px 0 27px 0;
  }
</style>
