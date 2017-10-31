/**
 * vuex分模块处理
 * 金融模块 on 2017/5/15.
 */
import Api from '../api'
import * as types from '../mutation-types'
const state = {
  homeData: {}, // 首页数据
  messageList: [], // 系统消息
  total: 0, // 系统消息总条数
  managesList: [], // 还款列表
  mTotal: 0
}
const getters = {}

const actions = {
  // 系统消息
  async getMessageLists ({commit}, {row, page}) {
    let res = await Api.getMessageList({row, page})
    let {data, total} = res
    if (data.length) {
      commit(types.LIST, {data, total})
    }
  },
  // 首页数据
  async getIndex ({commit}) {
    let res = await Api.getIndexData('')
    let {repay, pNum, cNum} = res
    commit(types.HOMEDATA, {repay, pNum, cNum})
  },
  // 还款列表
  async getManagesLists ({commit}, {status, row, page}) {
    let res = await Api.getManagesList({status, row, page})
    let {data, total} = res
    if (data.length) {
      commit(types.MANAGESLIST, {data, total})
    }
  }
}
const mutations = {
  [types.LIST] (state, {data, total}) {
    state.messageList = data
    state.total = total
  },
  [types.HOMEDATA] (state, {repay, pNum, cNum}) {
    state.homeData = {repay, pNum, cNum}
  },
  [types.MANAGESLIST] (state, {data, total}) {
    state.managesList = data
    state.mTotal = total
  }
}
export default {
  state,
  getters,
  actions,
  mutations
}
