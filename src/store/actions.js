// 分发actions,页面的actions同意dispatch到此进行逻辑处理
import * as types from './mutation-types'
import VueRouter from '../router/index.js'
// * 组合异步actions
// 登陆成功跳转到首页
export const goIndex = ({commit}, {name}) => {
  if (name) {
    commit(types.M_USERNAME, {name})
    VueRouter.push({name: 'Finance'})
  }
}
// 忘记密码 验证用户
export const forgetPwd = ({commit}, {isUser}) => {
  if(isUser){
    commit(types.FORGETPWD, {isUser})
    VueRouter.push({name: 'forgetPassword'})
  }
}
// 阅读的消息数量
export const messageNumber = ({commit}, {messageNum}) => {
    commit(types.MESSAGENUM, {messageNum})
    localStorage.setItem('messageNum', JSON.stringify(messageNum))
}
// 顶部导航公司名称
export const companyName = ({commit}, {companyName}) => {
  if(companyName) {
    commit(types.COMPANYNAME, {companyName})
    localStorage.setItem('companyName', JSON.stringify(companyName))
  }
}
// 跳转查看项目详情
export const goProjectDetail = ({commit}, {id}) => {
  if (id) {
    commit(types.SEE_PROJECT, {projectId: id})
    localStorage.setItem('projectId', JSON.stringify(id))
    VueRouter.push({name: 'ProjectDetail'})
  }
}
// 跳转查看资产端产品详情
export const goProductDetail = ({commit}, {productId, productName}) => {
  if (productId) {
    commit(types.SEE_PRODUCT, {productId, productName})
    localStorage.setItem('productId', JSON.stringify(productId))
    localStorage.setItem('productName', JSON.stringify(productName))
    VueRouter.push({name: 'ProductDetail'})
  }
}
// 跳转查看签约详情(默认1，后期需删除)
export const goSignDetails = ({commit}, {signId = 1}) => {
  if (signId) {
    commit(types.SEE_SIGNDETAILS, {signId})
    localStorage.setItem('signId', JSON.stringify(signId))
    VueRouter.push({name: 'signDetail'})
  }
}
// 跳转查看合同详情
export const goContractDetails = ({commit}, {contractId = 1}) => {
  if (contractId) {
    commit(types.SEE_CONTRACTDETAIL, {contractId})
    localStorage.setItem('contractId', JSON.stringify(contractId))
    VueRouter.push({name: 'contractDetails'})
  }
}
// 处理异步数据折线图
export const chartData = ({commit}, {line, bar}) => {
  if(line){
    commit(types.CHART, {line, bar})
  }
}
// 从本地存储得到,Type => 需要的属性类型(必需)
export const getLocalStorage = ({commit}, Type) => {
  if (Type) {
    commit(types.GETLOCALSTROAGE, {Type})
  }
}
