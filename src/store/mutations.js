import * as types from './mutation-types.js'
export default {
  // 登录
  [types.M_USERNAME] (state, {name}) {
    state.mUserName = name
  },
  // 忘记密码
  [types.FORGETPWD] (state, {isUser}) {
    state.isUser = isUser
  },
  // 消息数量
  [types.MESSAGENUM] (state, {messageNum}) {
    state.messageNum = messageNum
  },
  // 导航公司名称
  [types.COMPANYNAME] (state, {companyName}) {
    state.companyName = companyName
  },
  // 项目详情状态id
  [types.SEE_PROJECT] (state, {projectId}) {
    state.projectId = projectId
  },
  // 资产端产品详情状态id,产品名称
  [types.SEE_PRODUCT] (state, {productId, productName}) {
    state.productId = productId
    state.productName = productName
  },
  // 签约详情id
  [types.SEE_SIGNDETAILS] (state, {signId}) {
    state.signId = signId
  },
  // 合同管理详情id
  [types.SEE_CONTRACTDETAIL] (state, {contractId}) {
    state.contractId = contractId
  },
  // line 折线图 bar 柱图
  [types.CHART] (state, {line, bar}) {
    state.line = line
    state.bar = bar
  },
  // 本地存储重新赋值给 state，type => state的属性
  [types.GETLOCALSTROAGE] (state, {Type}) {
    const prop = JSON.parse(localStorage.getItem(Type))
    state[Type] = prop
  }
}

