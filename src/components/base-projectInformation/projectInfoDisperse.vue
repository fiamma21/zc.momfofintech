<template>
 <div class="projectInformation">
   <ul>
     <li>
       <p><span>项目名称</span>{{ Project.projectName }}</p>
       <p><span>项目地址</span>{{ Project.address }}</p>
     </li>
     <li class="aroundSit">
       <p><span>项目类型</span>{{ assetText }}</p>
       <p class="text-wrap"><span style="width: 200px;">周边商业及配套情况</span><small>{{ Project.describeInfo }}</small></p>
     </li>
     <li>
       <p><span>装修标准</span>{{ Project.decorationStandards }}</p>
       <p><span>房间数量</span>{{ Project.houseNum }}间</p>
     </li>
     <li class="lease" v-if="Project.other != null">
       <p>
       	<span>其他资料</span>
		<div>
			<figure v-for="other in otherList">
				<img src="../../assets/image/file.png" class="file" @click="upperLeaseDownload(other)"/>
				<figcaption>{{other.fileName}}</figcaption>
			</figure>
		</div>
       </p>
     </li>
     <li v-if="Project.other == null">
       <p>
       	<span>对下租约</span>
       	暂无文件
       </p>
     </li>
   </ul>

 </div>
</template>
<script>
  import Axios from 'axios'
  import { mapState } from 'vuex'
  import until from '../../common/util'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        otherList: [],
        Project: {},
        assetType: '',
        landProperty: '',
        housingType: ''
      }
    },
    created () {
      this.getProjectInformation()
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
      assetText () {
        return until.assetTypeText(this.assetType)
      },
      landPropertyText () {
        return until.landPropertyTypeText(this.landProperty)
      },
      housingText () {
        return until.housingTypeText(this.housingType)
      }
    },
    filters: {
      StartDate (time) {
        return until.forMate(time)
      },
      //千分位分隔
      FilterAmount: (value) => {
        if(!value) return '0.00'
        value = value.toString()
        return until.thousandBitSeparatorInt(value)
      }
    },
    methods: {
      getProjectInformation () {
        Axios.post('projectInfo/detailProject.do', {
          id: this.project_Id
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                let data = res.data
                this.Project = data
                this.assetType = data.assetType
                this.landProperty = data.landProperty
                this.housingType = data.housingType
                this.otherList = data.other
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //点击下载相关资料
      upperLeaseDownload (info) {
      	window.location.href = until.api() +'common/download.do?name=' + info.fileName + '&value=' + info.address;
      }
    }
  }
</script>
<style scoped>
  .projectInformation{
    font-size: 18px;
    color: #696969;
    text-align: left;
    padding-bottom: 50px;
  }
  .projectInformation .aroundSit{
  	height: auto;
  	min-height: 54px;
  	padding: 10px 0;
  }
  .aroundSit .text-wrap{
  	display: flex;
  	justify-content: space-between;
  	align-items: center;
  }
  .aroundSit .text-wrap span{
  	flex: 0.7;
  }
  .aroundSit .text-wrap small{
  	flex: 1;
  	font-size: 16px;
  	line-height: 18px;
  }
  .projectInformation li{
    height: 74px;
    display: flex;
    align-items: center;
    border-bottom: 1px solid #e5e5e5;
  }
  .projectInformation li p{
    flex:1
  }
  .projectInformation li p span{
    width: 137px;
    display: inline-block;
  }
  .projectInformation li p span::before{
    content: "• ";
    color: #61bfe9;
    padding-right: 4px;
    margin-left: -8px;
  }
  .projectInformation li.lease{
  	height: auto;
    padding-top: 20px;
    padding-bottom:20px;
  }
  .projectInformation li.lease figure{
  	position: relative;
  	float: left;
  	margin-bottom: 20px;
  }
  img.file{
    width: 53px;
    height: 68px;
    cursor: pointer;
  }
  .projectInformation li.lease p{
    flex: 0 !important;
  }
  .projectInformation li.lease figure figcaption{
  	margin-top: 10px;
  }
  .projectInformation li.lease figure{
  	display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 20px;
  }
</style>
