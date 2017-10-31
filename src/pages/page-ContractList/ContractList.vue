<template>
  <div class="contractManage">
    <div class="manageTitle">管理&nbsp;>&nbsp;<span style="color: #f0b954;">合约管理</span></div>
    <div class="contract-tab">
      <el-tabs v-model="activeName"  @tab-click="handleClick">
        <el-tab-pane label="全部" name=""></el-tab-pane>
        <el-tab-pane label="待确认" name="1"></el-tab-pane>
        <el-tab-pane label="已生效" name="2"></el-tab-pane>
      </el-tabs>
    </div>
    <div class="contract-list">
      <ul class="InfoList" v-if="ContractList.length>0">
        <li v-for="(contract,index) in ContractList" @click="seeContractDetails(contract.id)">
          <div class="sInfo">
            <div class="mainInfo">
              <p class="ellipsis">{{ contract.contractName }}</p>
              <p>{{ contract.signDate | formatDate }}</p>
            </div>
          </div>
        </li>
      </ul>
      <div class="empty" v-else>
        暂无数据
      </div>
    </div>
    <pagination v-on:CurrentChange="getContractList" :total="total" class="contract-page"></pagination>
  </div>
</template>
<script>
  import Axios from 'axios'
  import date from '../../common/date'
  import ContractList from 'components/base-InfoList/InfoList'
  import Pagination from 'components/pagination/pagination'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        activeName: '',
        num: 0,
        row: 5,
        page: 1,
        ContractList: []
      }
    },
    filters: {
      formatDate(time){
        return new Date(time).pattern('yyyy.MM.dd')
      }
    },
    computed: {
      total () {
        return Math.ceil(this.num / this.row)
      }
    },
    created(){
      this.getContractList(1)
    },
    methods: {
			//点击跳转合同详情
      seeContractDetails (contractId) {
        this.$store.dispatch('goContractDetails', {contractId})
      },
			//tab切换
      handleClick(tab, event) {
        this.getContractList(this.page)
      },
			//获取合同列表
      getContractList (page){
        this.page = page
        let status = this.activeName === '0'? '': this.activeName
        Axios.post('document/documentPersonPage.do', {
          status: status,
          page: this.page,
          row:this.row
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.ContractList = res.data.data
                this.num = res.data.total
              }
            })
          .catch(function (error) {
          })
      }
    },
    components: {
      'contract-list': ContractList,
      'pagination': Pagination
    }
  }
</script>
<style scoped>
  .contractManage{
    background: #fff;
    border-radius:6px;
    padding-bottom:50px;
  }
  .contract-list{
    font-size: 18px;
    color: #696969;
    overflow: hidden;
  }
  .contract-page{
    text-align: center;
    margin: 42px 0;
  }
  .contract-tab{
    background-color: #fff;
    padding-left:37px;
    display:flex;
    padding-top: 25px;
    padding-bottom:20px;
  }
  .manageTitle{
    background: whitesmoke;
    height: 80px;
    text-align: left;
    line-height: 80px;
    font-size:20px;
    color: #696969;
    padding-left:45px;
    padding-right:45px;
  }
  /*合同列表样式*/
  .title{
    background: #f7f7f7;
    height: 20px;
    font-size: 16px;
    line-height: 20px;
    border-radius: 4px 4px 0 0;
  }
  .InfoList .ellipsis {
    width: 85%;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .InfoList li {
    background: #fff;
  }

  .InfoList li:hover {
    cursor: pointer;
  }

  .InfoList li .sInfo {
    display: flex;
    align-items: center;
  }

  .InfoList li .sInfo::before {
    content: "• ";
    color: #61bfe9;
    padding-left: 40px;
    padding-right: 4px;
  }

  .InfoList li .mainInfo {
    height: 83px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    margin-right: 45px;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
