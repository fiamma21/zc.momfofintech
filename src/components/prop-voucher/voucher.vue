<template>
  <div class="dialogContent">
    <div class="progress">
      <div class="progressOut">
        <div class="progressInt" :class="{gradient_1:step1,gradient_2:!step1}">1</div>
        <p>第一步&nbsp;上传还款凭证</p></div>
      <div class="progressLine"></div>
      <div class="progressOut">
        <div class="progressInt" :class="{gradient_1:step2,gradient_2:!step2}">2</div>
        <p>第二步&nbsp;提交审核</p>
      </div>
    </div>
    <div class="progressMain">
      <template v-if="step1">
        <p>该产品当前仅支持线下还款,&nbsp;请在线下完成还款后上传还款凭证</p>
        <div class="progressTime"><span>还款日期</span>
          <el-date-picker
            align="right"
            type="date"
            v-model="time"
            @change="timeErr"
            placeholder="选择日期">
          </el-date-picker>
          <span class="err">{{timeErrText}}</span>
        </div>
        <div class="repaymentVoucher">
          <span>还款凭证</span>
          <div class="uploadFile">
            <el-upload class="upload" accept="image/jpeg,image/png,image/jpeg,application/pdf" :action="baseUploadUrl"
                       :on-success="uploadSuccess"
                       :on-change="uploadChange"
                       :on-error="uploadError"
                       :file-list="fileUpload"
                       :on-remove="removeFile"
            >
              <i class="iconfont icon-shangchuan" style="margin-right: 5px;"></i>
            </el-upload>
          </div>
          <span class="err2">{{errText}}</span>
        </div>
      </template>
      <template v-else-if="step2">
        <div class="voucher-success">已成功提交审核,请等待审核结果</div>
      </template>
    </div>
    <div class="dialogFooter">
      <button type="button" class="btn1" v-if="step1" @click="submitOne">提交</button>
      <button type="button" class="btn1" v-if="step2" @click="end">确定</button>
    </div>
  </div>

</template>
<script>
  import Axios from 'axios'
  import '../../common/date.js'
  import until from '../../common/util'
  import { mapState } from 'vuex'
  const ERRORCODE_CODE = 'SUCCESS'

  export default {
    props: ['productId'],
    data () {
      return {
        time: '',
        step1: true,
        step2: false,
        fileUpload: [],
        errText: '',
        timeErrText: '',
        address: '',
        fileName: '',
        baseUploadUrl: '/'+until.projectName()+'common/upload.do'
      }
    },
      computed: {
      ...mapState({
        //接口跨域
         baseUploadUrl2:(state)=>state.baseUploadUrl+'common/upload.do'
      })
    },
    methods: {
      timeErr(){
        this.timeErrText = ''
      },
//      删除文件
      removeFile(file, fileList){
        this.fileUpload = fileList
      },
      submitOne () {
        if (!this.time) {
          this.timeErrText = '请输入日期'
          return false
        } else if (this.fileUpload.length < 1) {
          this.errText = '请上传凭证'
          return false
        }
        Axios.post('productOperation/repay.do', {
          id: this.productId,
          createTime: (this.time).pattern('yyyy-MM-dd'),
          address: this.address,
          fileName: this.fileName
        })
          .then(
            (response) => {
              let res = response.data
              this.errText = ''
              this.timeErrText = ''
              if (res.errorCode === ERRORCODE_CODE) {
                this.step1 = false
                this.step2 = true
              }
            }
          )
          .catch(
            error => console.log(error)
          )
      },
      end () {
        this.$emit('end', 0)
      },
      uploadSuccess (response, file, fileList) {
        let res = response.data
        this.address = res[0].value
        this.fileName = res[0].name
        this.errText = ''
      },
      uploadError (err, file, fileList) {
      },
      uploadChange (file, fileList) {
        this.fileUpload = fileList.slice(-1)
      }
    }
  }
</script>
<style>
  .el-date-editor.el-input {
    width: 296px !important;
    border-radius: 6px;
  }
</style>
<style scoped>
  .err {
    padding-left: 12px;
    font-size: 14px;
    color: #f0b954;
  }

  .err2 {
    margin-left: 310px;
    font-size: 14px;
    color: #f0b954;
  }

  .dialogContent {
    height: 380px;
    display: flex;
    flex-direction: column;
    color: #707070;
    font-size: 16px;
  }

  .dialogFooter {
    height: 70px;
    background: #f7f7f7;
    position: absolute;
    bottom: 0;
    width: 100%;
    line-height: 70px;
  }

  .btn1 {
    font-size: 16px;
    text-align: center;
    background: #9b9b9b;
    border-radius: 8px;
    width: 160px;
    height: 31px;
    border-width: 1px;
    outline: 0;
    color: #fff;
    padding: 0 !important;
    cursor: pointer;
  }
  .btn1:hover{
    box-shadow:0 0  20px  #fff  inset;
    -webkit-transform: scale(1.05);
    -moz-transform: scale(1.05);
    -ms-transform: scale(1.05);
    -o-transform: scale(1.05);
    transform: scale(1.05);
  }

  /*进程图标样式*/
  .progress {
    display: flex;
    height: 54px;
    margin-top: 24px;
    justify-content: center;
    align-items: center;
  }

  .progressOut {
    background: #f7f7f7;
    width: 54px;
    height: 54px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 24px;
    color: #fff;
    position: relative;
  }

  .progressOut p {
    position: absolute;
    top: 65px;
    width: 150px;
    color: #707070;
    font-size: 16px;
  }

  .progressLine {
    background: #f7f7f7;
    width: 196px;
    height: 6px;
  }

  .progressInt {
    width: 42px;
    height: 42px;
    border-radius: 100%;
    line-height: 42px;
  }

  .gradient_1 {
    background-image: radial-gradient(50% 100%, #f8ce6d 0%, #f4bc6f 100%);
  }

  .gradient_2 {
    background: #d2d2d2
  }

  .voucher-success {
    margin-top: 50px;
    font-size: 20px;
    color: #707070;
  }

  .progressMain {
    margin-top: 65px;
  }

  .progressTime {
    display: flex;
    align-items: center;
    margin: 62px auto 31px 177px;
  }

  .repaymentVoucher {
    display: flex;
    align-items: center;
    margin-left: 177px;
  }

  .progressTime span, .repaymentVoucher span {
    margin-right: 28px;
  }

  .uploadFile {
    font-size: 29px;
    text-align: left;
    position: absolute;
    left: 340px;
  }

  .upload {
    display: flex;
    align-items: center;
  }
</style>

