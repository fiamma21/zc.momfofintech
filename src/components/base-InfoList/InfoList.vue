<template>
  <div class="Info">
    <div class="title">{{ title }}</div>
    <ul class="InfoList" :style="styleObj" v-if="infoList.length>0">
      <li v-for="(info,index) in infoList"  :class="{read:status==info.status}" @click="isOpen(info,index)">
        <div class="sInfo">
          <div class="mainInfo">
            <p class="ellipsis">{{ info.messages }}</p>
            <p>{{ info.createTime }}</p>
          </div>
        </div>
      </li>
    </ul>
    <div class="empty" v-else>暂无数据</div>
  </div>
</template>
<script>
  import Axios from 'axios'
  const ERRORCODE_CODE = 'SUCCESS'
  export default {
    props: ['isProp', 'title', 'infoList'],
    data () {
      return {
        status: 1,
        beforeStatus: ''// 点击确定之前的状态
      }
    },

    computed: {
      styleObj:function(){
        return {
          height: 84*(this.infoList.length)+80+'px'
        }
      },
      financeInfoS: function () {
//        对时间进行格式话
      }
//      对消息进行阅读状态排序
//      infoLists: function () {
//        return this.infoList.sort(this.sortStatus('status'))
//      }
    },
    methods: {
//      升序
      sortStatus (name) {
        return function (o, p) {
          let a, b
          if (typeof o === "object" && typeof p === "object" && o && p) {
            a = o[name] - 0
            b = p[name] - 0
            if (a === b) {
              return 0
            }
            if (typeof a === typeof b) {
              return a < b ? -1 : 1
            }
            return typeof a < typeof b ? -1 : 1
          } else {
            throw ("error")
          }
        }
      },
      isOpen (info) {
        if (this.isProp) {
          this.open({message: info.messages, mid: info.mid}, info)
        } else {
          return false
        }
      },
      open ({message, mid}, info) {
        this.$msgbox({
          title: ' ',
          message: message,
          customClass: 'openClass',
          confirmButtonText: '确定',
          confirmButtonClass: 'confirmClass',
          beforeClose: (action, instance, done) => {
//            1 已读 0 未读
            if (status === 1) {
              done()
            }
            Axios.post('messageRecord/updateMessage.do', {
              mid: mid
            }).then(
              (response) => {
                let res = response.data
                if (res.errorCode === ERRORCODE_CODE) {
                  info.status = parseInt(res.data.status)
                  this.getUnReadNum()
                  done()
                }
              })
              .catch(function (error) {
                console.log(error)
              })
          }
        })
      },
      //      未读消息总数
      getUnReadNum() {
        Axios.post('messageRecord/unReadNum.do')
          .then(
            (response) => {
              let res = response.data
              if (res.errorCode === ERRORCODE_CODE) {
              //  console.log('未读消息总数', response.data)
                this.$store.dispatch('messageNumber', {messageNum: res.data})
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
  .el-message-box__btns {
    background: #fff;
    text-align: center !important;
  }

  .confirmClass {
    background: #f0b954 !important;
    border-radius: 8px;
    width: 240px;
    height: 42px;
    font-size: 18px !important;
    border-color: #f0b954 !important;
    margin-bottom: 40px;
  }

  .el-message-box__header {
    background: #f7f7f7;
    height: 50px;
    padding: 0 !important;
  }

  .el-message-box__content {
    padding: 49px 78px !important;
    font-size: 18px !important;
    color: #707070 !important;
    overflow-y: scroll;
  }

  .openClass {
    border-radius: 10px 8px 8px 8px;
    width: 800px !important;
  }
</style>
<style scoped>
  .read {
    color: #ddd;
  }

  .Info {
    font-size: 18px;
    color: #696969;
    overflow: hidden;
  }

  .title {
    background: #f7f7f7;
    height: 80px;
    font-size: 20px;
    padding-left: 45px;
    text-align: left;
    line-height: 80px;
  }
  .InfoList{
     height: auto;
    background-color: #fff;
  }
  .InfoList .ellipsis {
    width: 85%;
    text-overflow: ellipsis;
    overflow: hidden;
    display: -webkit-box;
    text-align: left;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 1;
  }

  .InfoList li {
    background: #fff;
  }

  .InfoList li:hover {
    cursor: pointer;
  }

  .InfoList li .sInfo {
    display: flex;
    align-items: center;
  }

  .InfoList li .sInfo::before {
    content: "• ";
    color: #61bfe9;
    padding-left: 40px;
    padding-right: 4px;
  }

  .InfoList li .mainInfo {
    height: 83px;
    display: flex;
    flex: 1;
    justify-content: space-between;
    align-items: center;
    background: #fff;
    margin-right: 45px;
    border-bottom: 1px solid #e5e5e5;
  }
</style>
