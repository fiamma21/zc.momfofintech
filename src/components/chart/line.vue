<!--折线图-->
<template>
  <div class="chart-line">
    <slot name="title"></slot>
      <!-- <chart class="line" :options="options" v-if="raise.dateR.length>0"></chart>
    <div class="line noLine" v-else>暂无数据</div>   -->
         <div class="line" ref="chart"></div>
      <div class="line noLine" v-show="!raise.dateR.length">暂无数据</div>    
  </div>
</template>
<script>
  //  引入echarts
  //import Echarts from 'vue-echarts/components/ECharts.vue'
  import echarts from 'echarts' 
  import until from '../../common/util'
  //  按需引入不同图表模块
  // import 'echarts/lib/chart/line'
  // import 'echarts/lib/component/tooltip'
  export default {
   // props: ['raise'],
    data () {
      return {
        chart:null,
      }
    },
    computed:{
      raise(){
          return this.$store.getters.lineData
        },
      option(){
        return {
          title: {
            text: ''
          },
          tooltip: {//鼠标悬浮弹窗提示
            /*  trigger: 'axis' */
            trigger: 'item',
            show: true,
            position: 'top',
            transitionDuration: 0,
            backgroundColor: '#f0b954',
            borderRadius: 4,
            borderWidth: 0,
            extraCssText: 'width:80px;height:40px;text-align: center;line-height:40px',
            formatter: function (params, ticket, callback) {
              return until.number_format(params.data,2) + 'W'
            }
          },
          xAxis: [
            {
              type: 'category',
              boundaryGap: false,
              nameTextStyle: {
                color: '#000',
                fontSize: 14
              },
              axisLine: {
                lineStyle: {
                  color: '#f0b954',
                }
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
                },
                textStyle: {
                  color: ['#000']
                }
              },

              data:[]
            }
          ],
          yAxis: [
            {
              show: true,
              type: 'value',
              boundaryGap: [0, '100%'],
              axisLine: {
                show: false
              },
              axisTick: {
                show: false
              },
//              刻度标签
              axisLabel: {
                margin: 6,
                formatter: (value, index) => {
                  let str = ''
                  if (index !== 0) {
                    str += value + 'W'
                  }
                  return str
                }
              },
              splitLine: {
                show: true,
                lineStyle: {
                  color: ['#e4e4e4']
                }
              }
            }
          ],
          series: [
            {
              type: 'line',
              symbolSize: 11,
//              拐点
              itemStyle: {
                normal: {
                  color: ['#f0b954']
                }
              },
//线条
              lineStyle: {
                normal: {
                  color: '#f0b954'
                }
              },
              smooth: true,
//              填充区域
              areaStyle: {
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
              data: []
            }
          ]
        }
      }
    },
    // components: {
    //   chart: Echarts
    // },
    methods:{
      drawChart(data={}){
        this.chart = echarts.init(this.$refs.chart);
        this.chart.setOption(this.option);
        this.chart.setOption(data)
      }
    },
    watch:{
      //  raise(){
      //  }
    },
    updated(){
        //console.log(this.raise.quota)
       this.drawChart({xAxis:[{ data: this.raise.dateR}],series:[{ data: this.raise.quota}]})
    }
  }
</script>
<style scoped>
 .chart-line{
   height: 348px;
   margin-top:60px;
   margin-bottom:40px;
   position: relative;
 }
  .line{
    width:500px;
    height: 288px;
    box-sizing: border-box;
    /*padding: 26px 22px 16px;*/
    border:1px solid #e2e2e2;
  }
  .noLine{
    background:#f3f3f3;
    display:flex;
    align-items: center;
    justify-content: center; 
     position: absolute;
    top: 58px; 
  }
</style>
