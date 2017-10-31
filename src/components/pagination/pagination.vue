<!--@params 参数说明：
 page-size: 	每页显示条目个数,
current-page:当前页数
page-sizes：每页显示个数选择器的选项设置
  layout="total, sizes, prev, pager, next, jumper"
@event 事件说明
size-change：pageSize 改变时会触发
current-change：currentPage 改变时会触发
-->

<template>
 <div class="paginationAmount" v-if="total">
   <el-pagination
     @size-change="handleSizeChange"
     @current-change="CurrentChange"
     :current-page="currentPage"
     :page-sizes="[1, 2, 3, 4]"
     :page-size="1"
     layout="prev, pager, next"
     :total="total">
   </el-pagination>
 </div>
</template>
<script>
  export default {
    props: {
      total: {
        type: Number
      }
    },
    data () {
      return {
        currentPage: 1
      }
    },
    methods: {
      handleSizeChange (val) {
      },
      CurrentChange (val) {
        this.currentPage = val
        this.$emit('CurrentChange', val)
      }
    }
  }
</script>
<style>
  .el-pager li.active {
    border-color: #f0b954 !important;
    background-color: #f0b954 !important;
  }
  .el-pager li{
    margin:0 10px !important;
    border:1px solid #b9b9b9 !important;
    border-radius:4px;
    background: #e9e9e9 !important;
  }
  .el-pager li:hover{
    cursor: pointer;
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }
   .el-pagination{
    padding-bottom: 18px !important;
  }
  .el-pager li.btn-quicknext, .el-pager li.btn-quickprev{
    border:none !important;
  }
  .el-pagination .btn-next,.el-pagination .btn-prev {
    border-radius:4px;
    background: #e9e9e9 !important;
    border:1px solid #b9b9b9 !important;
  }
</style>

