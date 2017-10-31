<template>
  <div class="businessInformation">
    <div class="business-title">
      设置&nbsp;>&nbsp;<span style="color:#f0b954">企业资料</span>
    </div>
    <div class="business-main">
        <div class="company-info">
            <h3>公司信息</h3>
             <div class="basic-info">
               <div>
               	<span>公司名称</span>
               	{{corporateName}}
               	<span class="identify">已认证</span>
               </div>
               <div style="display: flex;align-items: center">
                 <span>主营业态类型</span>
                 <div v-if="houseType" style="display: flex;">
                  <div class="business-area" v-for="text in houseTypeText">
                   <p v-show="text">{{text}}<i class="el-icon-check f0b954"></i></p>
                 </div>
                 </div>
               </div>
               <div>
                 <span>公司联系人</span>{{contactsName}}
               </div>
               </div>
        </div>
      <div class="business-info">
            <h3>工商信息</h3>
        <div class="bus-basicInfo">
          <span>基本工商信息</span>
          <div>
            <p><span>营业执照号: </span>{{businessLicense}}</p>
            <p><span>法人:</span>{{legalName}}</p>
            <p><span>注册地址:</span>{{registeredAddress}}</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import Axios from 'axios'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    data () {
      return {
        corporateName: '',
        houseType: '',
        contactsName: '',
        businessLicense: '',
        legalName: '',
        registeredAddress: ''
      }
    },
    created () {
      this.getCorporateInfo()
    },
     computed: {
      houseTypeText(){
        let Text = ['集中式公寓', '分散式公寓', '酒店', '商业产地']
        let TextArr = []
          for(let value of this.houseType.split(',')){
              TextArr.push(Text[value-1])
          }
          return TextArr
      }
    },
    methods: {
//      属性名：变量名
      getCorporateInfo () {
        Axios.post('customerInfo/corporateInfo.do')
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                const {corporateName, houseType, contactsName, businessLicense, legalName, registeredAddress,registeredProvince,registeredCity,registeredDistrict} = res.data
                this.corporateName = corporateName
                this.houseType = houseType
                this.contactsName = contactsName
                this.businessLicense = businessLicense
                this.legalName = legalName
                this.registeredAddress = registeredProvince+registeredCity+registeredDistrict+registeredAddress
              }
            }
          )
      }
    }
  }
</script>
<style scoped>
  .f0b954{
    color: #f0b954;
    font-size: 20px;
  }
  .businessInformation{
    margin-right: 30px;
    color: #696969;
    text-align: left;
  }
  .business-title{
    height: 80px;
    line-height: 80px;
    background: #f7f7f7;
    font-size: 20px;
    padding-left:46px;
  }
  .business-main{
    padding-left:46px;
    background: #fff;
    font-size: 18px;
    padding-bottom:33px;
  }
  .company-info h3,.business-info h3{
    text-indent: 15px;
    height: 84px;
    line-height: 84px;
    border-bottom:1px solid #e5e5e5;
  }
  .basic-info{
    display: flex;
    height: 190px;
    margin:24px auto 24px 15px;
    flex-direction: column;
    justify-content: space-between;
    align-items:flex-start;
    position: relative;
    width: 100%;
  }
  .basic-info span{
    display: inline-block;
    width:178px;
    text-align: left;
  }
  .basic-info .identify{
  	position: absolute;
  	top: 0;
  	right: 0;
  	color: #999999;
  }
  .business-area{
    display: flex;
  }
   .business-area p{
     margin-right:20px;
  }
  .bus-basicInfo{
    display: flex;
    margin-left:15px;
    margin-top:29px;
  }
   .bus-basicInfo span{
    display: inline-block;
     margin-right:42px;
  }
  .bus-basicInfo div{
    height: 90px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }
  .bus-basicInfo div span{
    display: inline-block;
    width:117px;
    margin-right:20px;
  }
</style>
