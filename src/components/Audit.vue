<template>
  <el-container class="back">
    <el-header class="header">
      <div style="float:left;color: #FFFFFF;margin-left: 50px;margin-top: 10px;font-size: 25px">
        文思海辉
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">教程</el-link>
        <el-link :underline="false">模板库</el-link>
        <el-link :underline="false">管理</el-link>
        <el-link :underline="false">{{ name }}管理员,欢迎你</el-link>
      </div>
    </el-header>
    <el-main>
      <div class="audit-left">
        <div class="audit-video">
          <div class="audit-line-1">
            <div class="audit-line-text">视频剪辑总次数（次）</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{tvc}}</div>
          <div class="audit-line-3">
            <el-button>点击查看统计图</el-button>
          </div>
        </div>
        <div class="audit-text">
          <div class="audit-line-1">
            <div class="audit-line-text">文本修改总次数</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{tmt}}</div>
          <div class="audit-line-3">
            <el-button>点击查看统计图</el-button>
          </div>
        </div>
        <div class="audit-edit">
          <div class="audit-line-1">
            <div class="audit-line-text">编辑总人数</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{tme}}</div>
          <div class="audit-line-3">
            <el-button>点击查看详情</el-button>
          </div>
        </div>
      </div>
      <div class="audit-right">
        <div class="audit-graph-1">
          <div id="main1" style="height:420px"></div>
        </div>
        <div class="audit-graph-2">
          <div id="main2" style="height:300px"></div>
        </div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  name: "Audit",
  data() {
    return {
      name: "思白",
      time: "2021/2/9",
      tvc: "1320",
      tmt: "3750",
      tme: "934"
    }
  },
  methods:{
    myDayEdit(){
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main1'));

      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '日编辑人数',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'white'          // 主标题文字颜色
          },
        },
        tooltip: {},
        dataset: {
          // 提供一份数据。
          source: [
            ['time'],
            ['2/1', 43],
            ['2/2', 56],
            ['2/3', 79],
            ['2/4', 136],
            ['2/5', 86],
            ['2/6', 53],
            ['2/7', 67],
            ['2/8', 46],
            ['2/9', 84],
            ['2/10', 79],
            ['2/11', 121],
            ['2/12', 92]
          ]
        },
        // 声明一个 X 轴，类目轴（category）。默认情况下，类目轴对应到 dataset 第一列。
        xAxis: {
          type: 'category',
          axisTick: {
            show: false
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'white'
            }
          },
          axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
              color: '#000080',
              width: 2,
              type: 'solid'
            }
          },
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          splitLine: {           // 分隔线
            show: true,        // 默认显示，属性show控制显示与否
            // onGap: null,
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: ['#000080'],
              width: 1,
              type: 'solid'
            },
            axisTick: {
              show: false
            }
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'white'
            }
          },
          axisLine: {            // 坐标轴线
            show: true,        // 默认显示，属性show控制显示与否
            lineStyle: {       // 属性lineStyle控制线条样式
              color: '#000080',
              width: 2,
              type: 'solid'
            }
          },
        },
        // 声明多个 bar 系列，默认情况下，每个系列会自动对应到 dataset 的每一列。
        series: [
          {
            type: 'line',
            smooth: true,
            lineStyle: {
              width: 4,
              type: 'solid',
              shadowColor: 'rgba(0,0,0,0)', //默认透明
              shadowBlur: 5,
              shadowOffsetX: 3,
              shadowOffsetY: 3
            }
          },
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    },
    myVideoEdit(){
      // 基于准备好的dom，初始化echarts实例
      const myChart = echarts.init(document.getElementById('main2'));
      // 指定图表的配置项和数据
      const option = {
        title: {
          text: '视频编辑总次数',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'white'          // 主标题文字颜色
          },
        },
        tooltip: {},
        legend: {
          data: ['次数'],
          textStyle: {
            color: 'white'          // 图例文字颜色
          }
        },
        xAxis: {
          type: "value",
          axisLine: {
            show: false
          },
          splitLine: {show: false},
          axisTick: {
            show: false
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'white'
            }
          },
        },
        yAxis: {
          type: "category",
          data: ["视频5", "视频4", "视频3", "视频2", "视频1"],
          splitLine: {show: false},
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          offset: 10,
          nameTextStyle: {
            fontSize: 15
          },
          axisLabel: {           // 坐标轴文本标签，详见axis.axisLabel
            show: true,
            interval: 'auto',
            rotate: 0,
            margin: 8,
            // formatter: null,
            textStyle: {       // 其余属性默认使用全局文本样式，详见TEXTSTYLE
              color: 'white'
            }
          },
        },
        series: [{
          name: '次数',
          type: 'bar',
          data: [35, 41, 64, 67, 86],
          barWidth: 14,
          itemStyle: {
            emphasis: {
              barBorderRadius: 7
            },
            normal: {
              barBorderRadius: 7
            }
          },
          color: '#4169E1',
        }
        ]
      };
      // 使用刚指定的配置项和数据显示图表。
      myChart.setOption(option);
    }
  },
  mounted() {
    this.myVideoEdit();
    this.myDayEdit();
  }
}

</script>

<style scoped>

.back {
  /*background-image: linear-gradient(to bottom, #000209, #050092);*/
  background-color: #b8bab8;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.header {
  height: 40px;
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-link {
  margin-top: 20px;
  margin-right: 80px;
  margin-bottom: 20px;
  font-size: 17px;
  color: #FFFFFF;
}

.audit-left {
  float: left;
  width: 450px;
  height: 620px;
  color: #FFFFFF;
}

.audit-right {
  float: left;
  margin-left: 50px;
  width: 950px;
  height: 620px;
}

.audit-video {
  margin-left: 30px;
  width: 400px;
  height: 190px;
  background-color: #100f0f;
  border-radius: 10px;
}

.audit-line-1 {
  height: 40px;
}

.audit-line-text {
  float: left;
  margin-top: 10px;
  margin-left: 60px;
}

.audit-line-date {
  float: right;
  margin-top: 10px;
  margin-right: 60px;
}

.audit-line-2 {
  font-size: 50px;
  margin-top: 10px;
  text-align: center;
}

.audit-line-3 {
  margin-top: 20px;
  text-align: center;
}

.audit-text {
  margin-top: 40px;
  margin-left: 30px;
  width: 400px;
  height: 190px;
  background-color: #100f0f;
  border-radius: 10px;
}

.audit-edit {
  margin-top: 40px;
  margin-left: 30px;
  width: 400px;
  height: 190px;
  background-color: #100f0f;
  border-radius: 10px;
}

.audit-graph-1 {
  width: 920px;
  height: 380px;
  background-color: #ffc3a0;
  border-radius: 10px;
}

.audit-graph-2 {
  margin-top: 30px;
  width: 920px;
  height: 250px;
  background-color: #ffc3a0;
  border-radius: 10px;
}

</style>
