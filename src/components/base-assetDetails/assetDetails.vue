<!--资产明细-->
<template>
<div class="assetDetails">
  <el-table :data="assetList" style="width: 100%">
    <el-table-column prop="houseName" label="房间号" ></el-table-column>
    <el-table-column prop="perationState" :formatter="stateText2" label="运营状态"></el-table-column>
    <el-table-column prop="monthlyRent" label="月租金(元)"></el-table-column>
    <el-table-column prop="layout" label="房型"></el-table-column>
    <el-table-column prop="area" label="面积(㎡)"></el-table-column>
  </el-table>
  <pagination v-on:CurrentChange="getAssetDetail" :total="total" class="assetPag"></pagination>
</div>
</template>
<script>
  import Axios from 'axios'
  import {mapState} from 'vuex'
  import until from '../../common/util'
  import Pagination from 'components/pagination/pagination'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        num: 0,
        row: 3,
        page: 1,
        assetList: []
      }
    },
    components: {
      'pagination': Pagination
    },
    filters: {
      stateText( state) {
        return until.perationText(state)
      }
      },
    computed: {
      total () {
        return Math.ceil(this.num / this.row)
      },
      ...mapState({
        product_Id(state) {
          if(state.productId === '') {
            this.$store.dispatch('getLocalStorage', 'productId')
          }
          return state.productId
        }
      }),
    },
    created () {
      this.getAssetDetail()
    },
    methods: {
      stateText2( row, column) {
        return until.perationText(row.perationState)
      },
      getAssetDetail(page){
        this.page = page
        Axios.post('productInformation/asset.do',{
          id: this.product_Id,
          row: this.row,
          page: this.page
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.assetList = res.data.data
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
  .assetDetails{
    text-align: left;
  }
  .assetPag{
    text-align: center;
    margin-top: 42px;
  }
</style>

