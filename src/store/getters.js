// 该用法无效
// export const user = {
//   name3: state => state.mUserName,
//   password3 (state) {
//     return state.mPassWord + 'getters'
//   }
// }
export const evenInfos = (state) => {
  return state.todos.filter(todo => todo.done)
}
export const list = (state) => state.financeList
// 折线数据
export const lineData = (state) => {
  let dateR = []
  let quota = []
  let raises = state.line
  for (let r of raises) {
    if (!r) continue
    dateR.push(r.date)
    quota.push(r.quota)
  }
  return {
    dateR,
    quota
  }
}
// 柱状图数据
export const barData = (state) => {
  let date = []
  let Amount = []
  let stocks = state.bar
  for (let s of stocks) {
    if (!s) continue
    date.push(s.aDate)
    Amount.push(s.aAmount / 10000)
  }
  return {
    date,
    Amount
  }
}

