// 定义公用状态
const state = {
  baseImageUrl: 'http://192.168.1.216:8888/huoluo/',
  //baseImageUrl: 'http://image.momfofintech.com/',//生产
  baseUploadUrl: 'http://192.168.1.216:8888/web-asset/',
  financeList: [], // 测试
  mUserName: 5618929367,
  mPassWord: 'q123456',
  companyName: '',
  messageNum: '',
  isUser: '',
  todos: [
    { id: 1, text: '...', done: true },
    { id: 2, text: '...', done: false }
  ],
  projectId: '',
  productId: '',
  productName: '',
  signId: '',
  contractId: '',
  line:[],//折线图
  bar:[]
}
export default state
