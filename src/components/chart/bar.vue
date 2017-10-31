<!--柱状图 max 8-9条-->
<template>
  <div class="chart-bar">
    <slot name="title"></slot>
      <!-- <chart class="bar"  :options="option" v-if="stock.Amount.length>0"></chart>
      <div class="bar noBar" v-else>暂无数据</div>  -->
     <div class="bar" ref="bar"></div>
    <div class="bar noBar" v-show="!stock.Amount.length">暂无数据</div>  
  </div>
</template>
<script>
  //  引入echarts
  // import Echarts from 'vue-echarts/components/ECharts.vue'
  import echarts from 'echarts' 
  import until from '../../common/util'
  //  按需引入不同图表模块
  // import 'echarts/lib/chart/bar'
  // import 'echarts/lib/component/tooltip'
  export default {
    //props: ['stock'],
    data () {
      return {
        chart:null,
      }
    },
    computed:{
        stock(){
          return this.$store.getters.barData
        },
        option(){
         return {
          //    网格
          grid: {
            show: true,
            borderWidth: 0,
            backgroundColor: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [{
                offset: 0, color: '#f8ecd6' // 0% 处的颜色
              }, {
                offset: 1, color: '#fff4e5' // 100% 处的颜色
              }],
              globalCoord: false // 缺省为 false
            }
          },
          // 鼠标悬浮弹窗提示
          tooltip: {
            trigger: 'item',
            show: true,
            position: 'top',
            transitionDuration: 0,
            backgroundColor: '#f0b954',
            borderRadius: 4,
            borderWidth: 0,
            extraCssText: 'width:80px;height:40px;text-align: center;line-height:40px',
            formatter: function (params, ticket, callback) {
//               console.log(params);
              return until.number_format(params.data,2) + 'W'
            }
          },
          xAxis: [
            {
              type: 'category',
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
//              格式刻度标签
              axisLabel: {
                formatter: (value, index) => {
                  let newStr = ''
                  if (value.length > 3) {
                    newStr = value.substring(0, 4) + '\n' + value.substring(5)
                  }
                  return newStr
                }
              },
              nameTextStyle: {
                color: '#696969',
                fontSize: 14
              },
              data: []
            }
          ],
          yAxis: [
            {
              show: true,
              type: 'value',
              axisLine: {
                show: false
              },
              splitNumber: 5,
//              max: 500,
              axisTick: {
                show: false
              },
//              刻度标签
              axisLabel: {
                margin: 8,
                formatter: (value, index) => {
                  let str = ''
                  if (index !== 0) {
                    str += value + 'W'
                  }
                  return str
                }
              },
              splitLine: {
                show: false
              },
              splitArea: {
//                show: true,
                areaStyle: {
                  // color: ['red']
                }
              }
            }
          ],
//          柱条
          series: [
            {
              name: '',
              type: 'bar',
              barWidth: 36,
              itemStyle: {
                normal: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#ffbd39' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#ffd682' // 100% 处的颜色
                    }],
                    globalCoord: false // 缺省为 false
                  }
                }

              },
              data:  []
            }
          ]
        }
        }
    },
    methods:{
      drawChart(data={}){
        this.chart = echarts.init(this.$refs.bar);
        this.chart.setOption(this.option);
        this.chart.setOption(data)
      }
    },
    watch:{
      // stock(){
      
      // }
    },
    updated(){
    // console.log(this.stock)
      this.drawChart({xAxis:[{ data: this.stock.date}],series:[{ data: this.stock.Amount}]})
    },
    // components: {
    //   chart: Echarts
    // },
  }
</script>
<style scoped>
  .chart-bar{
    position: relative;
    height: 348px;
    margin-top:60px;
    margin-bottom:40px;
  }
  .bar{
    width:500px;
    height: 288px;
    box-sizing: border-box;
    /*padding: 26px 22px 16px;*/
    border:1px solid #e2e2e2;
  }
    .noBar{
    background:#f3f3f3;
    display:flex;
    align-items: center;
    justify-content: center; 
     position: absolute; 
     top: 58px; 
  } 
</style>
