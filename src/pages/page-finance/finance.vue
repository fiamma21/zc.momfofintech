
<template>
  <div>
    <div class="financeAd">
      <finance-list v-for="(list,index) in homeData" :list="list" :index="index"></finance-list>
    </div>
    <div class="financeInfoS">
      <finance-info :infoList="systemInformation" :isProp="true" :title="title"></finance-info>
    </div>
    <pagination v-on:CurrentChange="getSystemInformation" :total="total" class="pager"></pagination>
    <p>{{IndexData.repay}}</p>
  </div>
</template>
<script>
import Axios from 'axios'
import { mapState } from 'vuex'
import until from '../../common/util'
import FinanceList from 'components/financeList/financeList'
import FinanceInfo from 'components/base-InfoList/InfoList'
import Pagination from 'components/pagination/pagination'

const ERRORCODE_CODE = 'SUCCESS'

export default {
  name: 'Finance',
  data() {
    return {
      loading: false,
      isProp: false,
      isProp2: false,
      homeData: [
        { amount: 0, each: '元', text: '30天内待还' },
        { amount: 0, each: '', text: '融资项目数' },
        { amount: 0, each: '', text: '待签合同' }
      ],
      //        num: 0,
      row: 3,
      title: '系统消息',
      num: 0,
      systemInformation: []
    }
  },
  mounted() {
    //      // 测试
    this.getSystemInformation(1)
    this.getHomeData()
  },
  computed: {
    ...mapState({
      //   systemInformation: (state) => state.finance.messageList,
      //  num: (state) => state.finance.total,
      IndexData: (state) => state.finance.homeData
    }),
    total() {
      return Math.ceil(this.num / this.row)
    }
  },
  directives: {
    //      自定义指令的钩子函数有：bind, inserted, update， componentUpdate, unbind
    bg: {
      inserted(el, binding, vnode) {
        el.style.backgroundColor = binding.value
      }
    }
  },
  methods: {
    //      获取系统消息
    getSystemInformation(page) {
      // this.$store.dispatch('getMessageLists', {row: this.row, page: page})
      this.page = page
      Axios.post('messageRecord/homePage.do', {
        row: this.row,
        page: this.page
      })
        .then(
        (response) => {
          let res = response.data
          if (res.errorCode === ERRORCODE_CODE) {
            this.systemInformation = res.data.data
            this.num = res.data.total
          }
        })
    },
    getHomeData() {
      Axios.post('messageRecord/homeData.do')
        .then(
        (response) => {
          let res = response.data
          if (res.errorCode === ERRORCODE_CODE) {
            // res.data.repay
            this.homeData[0].amount = res.data.repay
            this.homeData[1].amount = res.data.pNum
            this.homeData[2].amount = res.data.cNum
            this.$store.dispatch('companyName', { companyName: res.data.name })
          }
        }
        )
    }
  },
  components: {
    'finance-list': FinanceList,
    'finance-info': FinanceInfo,
    'pagination': Pagination
  }
}
</script>
<style>
.empty {
  width: 100%;
  height: 500px;
  font-size: 20px;
  color: #9b9b9b;
  text-align: center;
  line-height: 500px;
  border-top: 1px solid #ddd;
  background-color: #f7f7f7;
}
</style>
<style scoped>
.financeAd {
  display: flex;
  justify-content: space-between;
}

.financeInfoS {
  border: 1px solid #ddd;
  margin-top: 60px;
}

.pager {
  margin: 52px 0;
}
</style>
