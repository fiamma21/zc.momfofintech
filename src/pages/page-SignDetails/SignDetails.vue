<template>
  <div class="Sign">
    <div class="Sign-title">合同列表&nbsp;>&nbsp;<span style="color: #f1b954">合同提交</span></div>
    <div class="argWrap">
      <!--合同签约页部分-->
      <div class="signTxtBox">
        <swiper :options="swiperOption" ref="mySwiper">
          <swiper-slide v-for="x in documentImgList">
            <img :src="baseImageUrl+x.address" style="width: 100%;"/>
          </swiper-slide>
          <div class="swiper-button-prev" slot="button-prev"></div>
          <div class="swiper-button-next" slot="button-next"></div>
        </swiper>
      </div>
      <!--右侧签章部分-->
      <div class="signatureBox">
        <div class="signatureWrap">
          <span class="btntext">签章</span>
          <div class="signImgBox">
            <div class="signImgWrap">
              <div class="signImg" v-for="(y,index) in stampList" draggable="true">
                <div class="signatureBg">
                  <i @click="sendPhoneCode('22','showStampDelete',y.uid),stampId = y.uid, _index = index"></i>
                  <img :src="baseImageUrl + y.address" :data-id='y.uid'/>
                </div>
              </div>
            </div>
            <div class="addImgBtn" id="uploadForm">
              <input class="file" @change="handleFiles(stampList,$event)" id="file" type="file" multiple
                accept="image/jpg,image/bmp,image/gif,image/jpeg,image/png">
              <img src="../../assets/image/addBg.png" />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="submitArg">
      <input name="btnReturn" @click="sendPhoneCode('22','showSign')" type="button" value="提交协议" class="argBtn">
    </div>
    <!--提交合同--弹框-->
    <el-dialog v-model="showSign" customClass="sign-dialog" title="签约确认" size="tiny" top="10%">
      <prop-sign v-if="showSign" v-on:end="close" :signId="signid" :phone="phone"></prop-sign>
    </el-dialog>
    <!--删除印章--弹框-->
    <el-dialog v-model="showStampDelete" customClass="sign-dialog" title="删除签章" size="tiny" top="10%">
      <prop-stampDelete v-if="showStampDelete" ref="propDelete" v-on:end="close" :phone="phone" :index="_index" :stampId="stampId" :stampList="stampList"></prop-stampDelete>
    </el-dialog>
  </div>
</template>
<script>
  //ajax
  import Axios from 'axios'
  //导入jq
  import $ from 'jquery'
  //公共方法
  import until from '../../common/util'
  //拖拽
  import Drag from '../../common/drag'
  //导入vue-awesome-swiper
  import { swiper, swiperSlide } from 'vue-awesome-swiper'
  //提交合同--弹框
  import PropSign from 'components/prop-sign/propSign'
  //删除印章--弹框
  import propStampDelete from 'components/prop-stampDelete/propStampDelete'
  //从本地存储获取id，解决刷新页面合同图片丢失问题
  import { mapState } from 'vuex'
  const ERRORCODE_CODE = 'SUCCESS'

  let drag = {}

  export default {
    data () {
      return {
        phone: '',
        stampId: '',
        _index: 0,
        showSign: false,
        showStampDelete: false,
        documentImgList: [],
        stampList: [],
        message: [],
        //轮播图实例
        swiperOption: {
          prevButton: '.swiper-button-prev',
          nextButton: '.swiper-button-next',
          onInit: function (swiper) {

          }
        }
      }
    },
    //实例化、初始化拖拽
    mounted () {
			if (drag.constructor != "Drag") {
	  		drag = new Drag()
	  		drag.init()
	  	}
    },
    //方法调用
    created () {
      this.getDocumentImgList()
      this.getStampList()
      this.getCustomerInfo()
    },
    computed: {
    	//获取合同ID
			...mapState({
		    signid(state){
		      if(state.signId === ''){
		        this.$store.dispatch('getLocalStorage', 'signId')
		      }
		      return state.signId
        },
         baseImageUrl:(state)=>state.baseImageUrl
		  })
    },
    components: {
    	//组件
      'prop-sign': PropSign,
      'prop-stampDelete': propStampDelete,
      //swiper
      swiper,
      swiperSlide
    },
    methods: {
			//关闭弹窗
      close(flag,type){
        if(flag === 0){
          this.showSign = false
          this.showStampDelete = false;
          if(type){
          	this.$router.push({name: 'signList'})
          }
        }
      },
       close2(flag){
       	console.log(flag)
        if(flag === 0){
        	console.log("@")
          this.showStampDelete = false;
        }
      },
      //获取用户手机号信息
      getCustomerInfo () {
        Axios.post('customerInfo/getCustomerInfo.do', {

        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.phone = res.data.signTelephone;
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //获取合同图片信息
      getDocumentImgList () {
        Axios.post('document/documentImg.do', {
          id: this.signid
        })
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.documentImgList = res.data
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //获取合同印章列表图片信息
      getStampList () {
        Axios.post('stamp/stampList.do', {})
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
                this.stampList = res.data
              }
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //点击添加印章
      handleFiles (list,e) {
        var htmlImage = ''
        var formData = new FormData();
        formData.append('stamp', $('#file')[0].files[0]);
        //限制仅支持上传png格式的图片
				var _index = $('#file')[0].files[0].name.indexOf(".");
				var ex = $('#file')[0].files[0].name.substring(_index+1);
				if(!(ex == "png" || ex == "PNG")){
					alert("请上传png格式的图片！");
					return false;
				}
				if(list.length == 5){
					alert("最多上传5张签章图片！");
					return false;
				}
        Axios.post('stamp/stampUpload.do', formData, {})
          .then(
            (response) => {
            	let result = response.data.data
	            //通过向签章列表添加数据实现印章上传
	            list.push(result)
            })
          .catch(
            (error) => { console.log(error) }
          )
      },
      //点击删除签章和提交协议弹框
      sendPhoneCode(templateId, propShow,uid) {
      	//签约
      	if(propShow == 'showSign'){
      		if($('.cloneSignImg img').length == 0){
	      		alert("请先完成签约后再提交协议！");
						return false;
      		}else {
		        Axios.post('sms/sendMsg.do',{tel:this.phone,templateCode: templateId})
		          .then(response =>{
		            this[propShow] = true
		            let res = response.data
		          })
      		}
      		//删除签章
      	}else if(propShow == 'showStampDelete'){
      		//验证签章是否正在使用中
	        Axios.post('stamp/verdictSeal.do',{uid:uid})
	          .then(response =>{
		          let res = response.data
		          if (res.errorCode === 'SUCCESS') {
		          	//验证签章未正在使用中时，发送验证码
				        Axios.post('sms/sendMsg.do',{tel:this.phone,templateCode: templateId})
				          .then(response =>{
				            this[propShow] = true
				            let res = response.data
				          })
		          } else {
		          	this.$msgbox({
				          title: ' ',
				          message: res.message,
				          customClass: 'openClass',
				          confirmButtonText: '确定',
				          confirmButtonClass: 'confirmClass',
				        })
		          }
	          })
      	}
      }
    }
  }
</script>
<style type="text/css">
  .sign-dialog{
    border-radius:10px 8px 8px 8px;
    width:694px !important;
    height:408px!important;
    text-align: left;
  }
  /*拖拽*/
  .signImg i {
    display: block;
    width: 13%;
    height: 25px;
    position: absolute;
    top: -9px;
    right: -5%;
    background: url(../../assets/image/delSign.png) no-repeat center;
    background-size: 100%;
    cursor: pointer;
  }
	.btntext{
		margin-left: 20px;
	}
  .signImgBox {
    clear: both;
    overflow: hidden;
    display: flex;
    flex-wrap: wrap;
    padding-left: 20px;
    padding-right: 10px;
  }
	.signImgWrap{
		width: 100%;
	}
  .signImg, .addImgBtn {
    float: left;
    text-align: center;
    width: 100%;
    background: #f5f5f5;
    position: relative;
    margin-top: 10px;
  }

  .addImgBtn {
  	
  }

  .signImg img {
  	width: 100%;
    max-width: 164.4px;
    cursor: pointer;
    vertical-align: middle;
  }

  .addImgBtn img {
    width: 66%;
    cursor: pointer;
    margin: 0 auto;
  }

  .cloneSignImg, .stampImg {
    position: absolute;
    width: 17.6%;
    z-index: 100;
  }

  .cloneSignImg img, .stampImg img {
    width: 100%;
    height: 100%;
  }

  .cloneSignImg i {
    display: block;
    width: 25px;
    height: 25px;
    position: absolute;
    top: -12px;
    right: -12px;
    background: url(../../assets/image/delSign.png) no-repeat center;
    background-size: 100%;
    cursor: pointer;
  }

  .addImgBtn .file {
    opacity: 0;
    cursor: pointer;
    width: 50px;
    height: 50px;
    position: absolute;
    top: 25%;
    margin: 0 auto;
    left: 0;
    right: 0;
    z-index: 100;
  }

  .argBtn {
    background: #f0b954;
    border-radius: 8px;
    width: 190px;
    height: 40px;
    color: #ffffff;
    cursor: pointer;
    margin-top: 30px;
  }

  .submitArg {
    clear: both;
    width: 190px;
    margin-left: 390px;
  }

  .signatureBg {
  	background: #ffffff;
    width: 87%;
    max-width: 164.4px;
    margin: 10px auto;
  }
</style>
<style scoped>
  .Sign {
    max-height: 1400px;
    font-size: 18px;
    color: #696969;
    overflow: hidden;
    background: #ffffff;
    padding-bottom: 50px;
    margin-bottom: 50px;
  }

  .Sign-pagination {
    margin-top: 30px;
  }

  .Sign-title {
    height: 80px;
    line-height: 80px;
    background: #f7f7f7;
    font-size: 20px;
    color: #696969;
    text-align: left;
    padding-left: 45px;
  }

  .signTxtBox {
    border-radius: 6px;
    margin: 35px 0 0 70px;
    width: 65%;
    max-width: 794px;
    float: left;
    padding: 20px;
    background: #f5f5f5;
  }

  .signatureWrap {
    text-align: left;
  }

  .signatureBox {
    position: fixed;
    top: 30%;
    right: 10%;
    height: 52%;
    width: 12%;
    max-height: 630px;
    overflow-y: auto;
    max-width: 230px;
    padding-bottom: 20px;
  }
</style>
