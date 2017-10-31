<template>
 <div class="leaseInformation">
   <ul>
	     <li>
	       <p><span>租赁总面积</span>{{ leaseInfoDisperse.leaseArea | FilterAmount }}㎡</p>
	     </li>
	     <li class="lease" v-if="leaseInfoDisperse.upperLease != null">
	       <p>
	       	<span>对上租约</span>
	       		<img src="../../assets/image/file.png" class="file" @click="upperLeaseDownload"/>
	       	<i>对上租约</i>
	       </p>
	     </li>
	     <li v-if="leaseInfoDisperse.upperLease == null">
	       <p>
	       	<span>对上租约</span>
	       	暂无文件
	       </p>
	     </li>
	     <li class="lease" v-if="leaseInfoDisperse.underLease != null">
	       <p>
	       	<span>对下租约</span>
       		<img src="../../assets/image/file.png" class="file" @click="underLeaseDownload"/>
	       	<i>对下租约</i>
	       </p>
	     </li>
	     <li v-if="leaseInfoDisperse.underLease == null">
	       <p>
	       	<span>对下租约</span>
	       	暂无文件
	       </p>
	     </li>
   </ul>
 </div>
</template>
<script>
  //ajax
  import Axios from 'axios'
  import Qs from 'qs'
  import { mapState } from 'vuex'
  //公共处理方法
  import until from '../../common/util.js'
  //声明接口访问成功状态
  const ERRORCODE_CODE = 'SUCCESS'

  export default {
    data () {
      return {
        leaseInfoDisperse: {},
        name: "对上租约"
      }
    },
    filters: {
      //千分位分隔
      FilterAmount: (value) => {
        if (!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      }
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
    },
    created () {
      this.getLeaseInfoDisperse()
    },
    mounted () {
      this.assetTypeEmit()
    },
    methods: {
      createForm: (data, target) => {
        return until.createForm(data, target)
      },
      //获取租约信息--分散式
      getLeaseInfoDisperse () {
        Axios.post('projectInfo/detailLease.do', {
          id: this.project_Id
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.leaseInfoDisperse = res.data
              }
            })
          .catch(function (error) {
            //console.log(error)
          })
      },
      assetTypeEmit (){
        this.$emit('assetTypeEmit', this.leaseInfoDisperse.assetType)
      },
      //点击下载对下租约--集中式
      underLeaseDownload () {
        const params = {
          data: {'id': this.project_Id},
          action: 'projectInfo/detailLeaseDownload.do'
        }
        this.createForm(params)
      },
      //点击下载对上租约--集中式
      upperLeaseDownload () {
      	window.location.href = until.api() + 'common/download.do?name=' + this.leaseInfoDisperse.projectName + '&value=' + this.leaseInfoDisperse.upperLease;
      }
    }
  }
</script>
<style scoped>
  .leaseInformation {
    font-size: 18px;
    color: #696969;
    text-align: left;
    padding-bottom: 140px;
  }

  .leaseInformation li {
    height: 74px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }

  .leaseInformation li.lease {
    height: 130px;
  }

  .leaseInformation li p {
    flex: 1
  }

  .leaseInformation li p span {
    width: 137px;
    display: inline-block;
  }

  .leaseInformation li p span::before {
    content: "• ";
    color: #61bfe9;
    padding-right: 4px;
    margin-left: -8px;
  }

  .leaseInformation li.lease p {
    position: relative;
  }

  .leaseInformation li p img.file {
    vertical-align: middle;
    width: 53px;
    height: 68px;
    position: absolute;
    top: -35px;
    cursor: pointer;
  }

  .leaseInformation li.lease p i {
    font-style: normal;
    position: absolute;
    top: 42px;
    left: 127px;
  }
</style>
