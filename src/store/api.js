import axios from 'axios'
// 进度展示
// import NProgress from 'nprogress'
import qs from 'qs'
// 拦截请求
axios.interceptors.request.use(config => {
  // NProgress.start()
  return config
}, error => {
  return Promise.reject(error)
})
// 拦截响应
axios.interceptors.response.use(response => response,
  error => Promise.resolve(error.response))

// 处理来自网络或服务器的错误
function checkStatus (response) {
  // NProgress.done()
  if (response.status === 200 || response.status === 304) {
    return response.data
  }
  return {
    code: -404,
    message: response.statusText,
    data: response.statusText
  }
}
// 处理code异常
function checkCode (res) {
  if (res.errorCode !== 'SUCCESS') {
    console.log('code', res.message)
  }
  return res.data
}
// 开发环境下路径
axios.defaults.baseURL = '/web-asset/'

const api = {
  fromPost (url, data) {
    return axios({
      method: 'post',
      url,
      data: qs.stringify(data),
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkStatus).then(checkCode)
  },
  post (url, data) {
    return axios.post(url, data)
      .then(checkStatus).then(checkCode)
  },
  get (url, params) {
    return axios({
      method: 'get',
      url,
      params,
      timeout: 30000,
      headers: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    }).then(checkStatus).then(checkCode)
  }
}
export default {
// 系统消息
  getMessageList: (data) => api.post('messageRecord/homePage.do', data),
// 首页数据
  getIndexData: (data) => api.post('messageRecord/homeData.do', data),
 // 还款列表
  getManagesList: data => api.post('productOperation/page.do', data)
}
