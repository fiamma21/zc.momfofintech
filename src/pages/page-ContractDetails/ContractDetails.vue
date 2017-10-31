<template>
  <div class="contractDetails">
    <div class="contract-title">管理&nbsp;>&nbsp;<span style="color: #f1b954">合同管理</span></div>
    <div class="contract-main">
      <el-carousel :interval="10000" type="card" height="780px" indicator-position="none">
        <el-carousel-item v-for="(item, index) in ContractIMgList">
          <img :src="baseImageUrl+item" @click="showBIg(item)" alt="合约详情" class="contract-img">
        </el-carousel-item>
      </el-carousel>
    </div>
     <el-dialog v-model="dialogVisible" size="small">
      <img width="100%" :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from 'vuex'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        ContractIMgList: [],
        dialogImageUrl: '',
        dialogVisible: false
      }
    },
    computed: {
      ...mapState({
        contractid(state){
          if(state.contractId === ''){
            this.$store.dispatch('getLocalStorage', 'contractId')
          }
          return state.contractId
        },
         baseImageUrl:(state)=>state.baseImageUrl
      })
    },
    created() {
      this.getContractImages()
    },
    methods: {
//      合同详情图片展示
      getContractImages() {
        Axios.post('document/documentImg.do', {
          id: this.contractid
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                for (let img of res.data) {
                	//加时间戳用来解决合同图片缓存问题
                  this.ContractIMgList.push(img.address+"?t="+new Date().getTime())
                }
              }
            })
          .catch(function (error) {
            console.log(error)
          })
      },
      //放大查看
    showBIg(imageUrl){
      this.dialogVisible = true
      this.dialogImageUrl = this.baseImageUrl + imageUrl
    }
    }
  }
</script>
<style>
  .el-carousel__mask{
    background-color: #aaa !important;
  }
  .el-carousel__item--card{
  	width: 50% !important;
  }
  .el-carousel__item{
  	height: auto !important;
  }
  .el-carousel__item:nth-child(2n) {
    background-color: #f5f5f5;
    box-shadow: 2px 2px 20px #ddd;
  }
  .el-carousel__item:nth-child(2n+1) {
    background-color: #f5f5f5;
    box-shadow: 2px 2px 20px #ddd;
  }
</style>
<style scoped>
  .contract-title {
    height: 80px;
    line-height: 80px;
    background: #f7f7f7;
    font-size: 20px;
    color: #696969;
    text-align: left;
    text-indent: 45px;
    border-radius: 4px 4px 0 0;
  }
  .contract-main{
    padding:45px;
    height: 100%;
    background: #fff;
  }
  .contract-img{
    width:100%;
  }
</style>
