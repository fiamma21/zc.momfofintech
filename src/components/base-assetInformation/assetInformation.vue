<template>
  <div class="assetInformation">
    <el-table :data="assetInfoList"  style="width: 100%">
      <el-table-column prop="houseName" label="房间号" ></el-table-column>
      <el-table-column prop="perationState" :formatter="stateText" label="状态"></el-table-column>
      <el-table-column prop="financingBody" label="发行产品"></el-table-column>
      <el-table-column prop="address" width="200" label="物业地址"></el-table-column>
      <el-table-column prop="layout" label="房型"></el-table-column>
      <el-table-column prop="area" :formatter="Area" label="面积(㎡)"></el-table-column>
      <el-table-column prop="ownerName" label="业主"></el-table-column>
      <el-table-column prop="projectStartDate" :formatter="time" label="运营起始日"></el-table-column>
    </el-table>
    <pagination v-on:CurrentChange="getAssetInfo" :total="total" class="assetPag"></pagination>
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
        page:1,
        assetInfoList: [],
      }
    },
    components: {
      'pagination': Pagination
    },
    computed: {
      ...mapState({
        project_Id(state) {
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
    created () {
      this.getAssetInfo()
    },
    methods: {
      stateText( row, column) {
        return until.perationText(row.perationState)
      },
      time(row) {
        return until.forMate(row.projectStartDate)
      },
      Area(row) {
        return until.thousandBitSeparatorInt(row.area)
      },
      getAssetInfo(page){
        this.page = page
        Axios.post('houseInfo/focus.do',{
          pid: this.project_Id,
          row: this.row,
          page: this.page
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.assetInfoList = res.data.data
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
<style>
  .el-table{
    color: #696969 !important;
    border:0 !important;
  }
  .el-table::after{
    width:0 !important;
  }
  .el-table .cell, .el-table__header-wrapper {
    overflow: hidden;
    text-align: center;
  }
  .el-table th {
    background-color: #fff !important;
  }
  .el-table tr {
    height: 85px;
    font-size: 18px;
  }
  .el-table__fixed-header-wrapper thead div, .el-table__header-wrapper thead div {
    color: #696969 !important;
    background-color: #fff !important;
    font-size: 18px;
  }
  .el-table__empty-text{
  	font-size: 18px;
  }
</style>
<style scoped>
  .assetInformation{
    padding-bottom:42px;
    text-align: left;
  }
  .assetPag{
    text-align: center;
    margin: 42px 0;
  }
</style>
