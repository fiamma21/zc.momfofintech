<template>
  <div class="Info">
	  <div class="title">{{ title }}&nbsp;>&nbsp;<span class="colF">签约</span></div>
    <div class="empty" v-if="signLists==''">
      暂无数据
    </div>
	  <ul class="InfoList">
	    <li  v-for="Sign in signLists" @click="seeDetails(Sign.id)">
	      <div class="sInfo">
	        <div class="mainInfo">
	          <p class="ellipsis">{{ Sign.contractName }}</p>
	          <p>{{ Sign.startDate | formatDate }}</p>
	        </div>
	      </div>
	    </li>
	  </ul>
      <pagination v-on:CurrentChange="getSignList" :total="total" class="sign-page"></pagination>
  </div>
</template>
<script>
  import Axios from 'axios'
//  import date from '../../common/date'
  import Pagination from 'components/pagination/pagination'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        title: '金融',
        num: 0,
        row: 5,
        page: 1,
        signLists: []
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
      this.getSignList(1)
    },
    methods: {
			//点击跳转签约详情
      seeDetails (signId) {
        this.$store.dispatch('goSignDetails', {signId})
      },
      // 获取待签合同列表
      getSignList (page){
        this.page = page
        Axios.post('document/documentWaitPage.do', {
          page: this.page,
          row: this.row
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.signLists = res.data.data
                this.num = res.data.total
              }
            })
          .catch(function (error) {
            console.log(error)
          })
      }
    },
    components: {
      'pagination': Pagination
    }
  }
</script>
<style scoped>
  .colF{
    color: #f0b954;
  }
  .sign-page{
    text-align: center;
    margin: 42px 0;
  }
  .Info{
    font-size:18px;
    color:#696969;
    overflow: hidden;
    background: #ffffff;
    padding-bottom: 50px;
  }
  .title{
    background:#f7f7f7;
    height:80px;
    font-size:20px;
    padding-left:45px;
    text-align: left;
    line-height: 80px;
  }
  .InfoList .ellipsis{
    width: 90%;
    text-overflow:ellipsis;
    overflow: hidden;
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
  }
  .InfoList li{
    background: #fff;
  }
  .InfoList li:hover{
    cursor: pointer;
  }
  .InfoList li .sInfo{
    display: flex;
    align-items: center;
  }
  .InfoList li .sInfo::before{
    content: "• ";
    color: #61bfe9;
    padding-left:40px;
    padding-right:4px;
  }
  .InfoList li .mainInfo{
    height: 83px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    margin-right: 45px;
    border-bottom:1px solid #e5e5e5;
  }
</style>
