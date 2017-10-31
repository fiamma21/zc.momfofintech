import Vue from 'vue'
import Router from 'vue-router'
import Home from 'components/home'
import Finance from 'pages/page-finance/finance'
// 异步懒加载,按需优化
// const Finance = resolve => require(['pages/page-finance/finance'], resolve)
// 金融--还款-签约
import Repayment from 'pages/page-Repayment/Repayment'
// 签约二级路由
import Signmanage from 'pages/page-Signmanage/Signmanage'
import SignList from 'pages/page-SignList/SignList'
import SignDetails from 'pages/page-SignDetails/SignDetails'
// 登陆及忘记密码
import Login from 'pages/page-login/login'
import ForgetPassword from 'pages/page-forgetPassword/forgetPassword'
// 项目管理三级嵌套路由
// webpack1写法懒加载按组打包同个异步chunk中
// const ProjectManage = r => require.ensure([], () => r(require('pages/page-ProjectManage/projectManage')), 'group-foo')
// const ManageProjectDetail = r => require.ensure([], () => r(require('pages/page-manageProjectDetail/manageProjectDetail')), 'group-foo')
// const AssetProductDetails = r => require.ensure([], () => r(require('pages/page-assetProductDetails/assetProductDetails')), 'group-foo')
// webpack2 懒加载写法
// const ProjectManage = () => System.import('pages/page-ProjectManage/projectManage')
import ManageTotal from 'pages/page-manageTotal/manageTotal'
import Manage from 'pages/page-manage/manage'
import ProjectManage from 'pages/page-ProjectManage/projectManage'
import ManageProjectDetail from 'pages/page-manageProjectDetail/manageProjectDetail'
import AssetProductDetails from 'pages/page-assetProductDetails/assetProductDetails'
// 合同管理二级路由
import ContractManage from 'pages/page-contractManage/contractManage'
import ContractList from 'pages/page-ContractList/ContractList'
import ContractDetails from 'pages/page-ContractDetails/ContractDetails'
// 设置
import BusinessInformation from 'pages/page-businessInformation/businessInformation'
import MessageCenter from 'pages/page-messageCenter/messageCenter'
import SafeCenter from 'pages/page-safeCenter/safeCenter'

Vue.use(Router)
//  路由跳转滚动行为的设置
const scrollBehavior = (to, from, savedPosition) => {
  // 浏览器前进后退
  if (savedPosition) {
    return savedPosition
  } else {
    const position = {}
    // 锚点
    if (to.hash) {
      position.selector = to.hash
    }
    position.x = 0
    position.y = 0
    return position
  }
}
export default new Router({
  // mode: 'history',
  scrollBehavior,
  routes: [
    {
      path: '/login',
      alias: '/',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          component: Finance
        },
        {
          path: 'Finance',
          name: 'Finance',
          // beforeEnter: (to, from, next) => {
          //   console.log('跳转的路由=>', to)
          //   next()
          // },
          meta: {requiresUser: true},
          component: Finance
        },
        {
          path: 'repayment',
          name: 'repayment',
          component: Repayment
        },
        {
          path: 'signManage',
          component: Signmanage,
          children: [
            {path: '', component: SignList},
            { name: 'signList', path: 'signList', component: SignList },
            { name: 'signDetail', path: 'signDetail', component: SignDetails }
          ]
        },
        {
          path: 'manage',
          component: ManageTotal,
          children: [
            {path: '', component: Manage},
            {
              path: 'projectManage',
              component: ProjectManage,
              children: [
                {path: '', component: ManageProjectDetail},
                { name: 'ProjectDetail', path: 'ProjectDetail', component: ManageProjectDetail },
                { name: 'ProductDetail', path: 'ProductDetail', component: AssetProductDetails }
              ]
            }
          ]
        },
        {
          path: 'contractManage',
          component: ContractManage,
          children: [
            {path: '', component: ContractList},
            { name: 'contractList', path: 'contractList', component: ContractList },
            { name: 'contractDetails', path: 'contractDetails', component: ContractDetails }
          ]
        },
        {
          path: 'set',
          component: AssetProductDetails
        },
        {
          path: 'businessInformation',
          name: 'businessInformation',
          component: BusinessInformation
        },
        {
          path: 'safeCenter',
          component: SafeCenter
        }, {
          path: 'messageCenter',
          component: MessageCenter
        }
      ]
    },
    {
      path: '/forgetPassword',
      name: 'forgetPassword',
      component: ForgetPassword
    }
  ]
})
