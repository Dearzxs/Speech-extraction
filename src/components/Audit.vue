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
        <el-link :underline="false">{{ name }}</el-link>
      </div>
    </el-header>
    <el-main>
      <div class="audit-left">
        <div class="audit-video">
          <div class="audit-line-1">
            <div class="audit-line-text">上传视频总数（次）</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{videoNum}}</div>
          <div class="audit-line-3">
            <el-button @click="viewData1()">点击查看统计图</el-button>
          </div>
        </div>
        <div class="audit-text">
          <div class="audit-line-1">
            <div class="audit-line-text">编辑视频总次数</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{textNum}}</div>
          <div class="audit-line-3">
            <el-button @click="viewData2()">点击查看统计图</el-button>
          </div>
        </div>
        <div class="audit-edit">
          <div class="audit-line-1">
            <div class="audit-line-text">文本编辑情况</div>
            <div class="audit-line-date">{{time}}</div>
          </div>
          <div class="audit-line-2">{{editPeo}}</div>
          <div class="audit-line-3">
            <el-button @click="dialogTableVisible = true">点击查看详情</el-button>
          </div>
        </div>
      </div>
      <div class="audit-right">
        <div class="audit-graph-1">
          <div id="main1" style="height:420px;" v-show="isShowGraph1"></div>
        </div>
        <div class="audit-graph-2">
          <div id="main2" style="height:300px;" v-show="isShowGraph2"></div>
        </div>
      </div>
    </el-main>
    <el-dialog title="文本修改总次数" width='45%' :visible.sync="dialogTableVisible" @open='myTextEdit()' @close='clearText()' :append-to-body="true">
      <div class="audit-graph-3">
        <div id="main3" style="width: 600px;height:400px;"></div>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      name: "admin",
      time: "2021/2/9",//显示当前时间
      textNum: '', //编辑视频总次数
      editPeo: '', //文本编辑情况
      videoNum: '',//上传视频总数（次）

      tewDayNum: [],//日编辑人数数据
      DayNumDay: [],
      DayNumNum: [],

      mostFiveVideo: [],//编辑次数最多的5个视频
      VideoCutId: [],
      VideoCutNum: [],

      isShowGraph1: true,
      isShowGraph2: true,

      FiveMostText: [],
      TextEditNum: [],
      TextEditString: [],
      dialogTableVisible: false,

    }
  },
  methods:{
    myDayEdit(){
      // 基于准备好的dom，初始化echarts实例
      const myChart1 = echarts.init(document.getElementById('main1'));

      // 指定图表的配置项和数据
      const option1 = {
        title: {
          text: '日编辑人数',
          textStyle: {
            fontSize: 18,
            fontWeight: 'bolder',
            color: 'white'          // 主标题文字颜色
          },
        },
        tooltip: {},
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
              color: '#ffffff',
              width: 2,
              type: 'solid'
            }
          },
          data:[],
        },
        // 声明一个 Y 轴，数值轴。
        yAxis: {
          type:'value',
          splitLine: {           // 分隔线
            show: true,        // 默认显示，属性show控制显示与否
            // onGap: null,
            lineStyle: {       // 属性lineStyle（详见lineStyle）控制线条样式
              color: ['#ffffff'],
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
              color: '#ffffff',
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
            },
            data:[],
          },
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart1.setOption(option1);

      myChart1.showLoading();

      setTimeout(()=>{  //未来让加载动画效果明显,这里加入了setTimeout,实现2s延时
        myChart1.hideLoading(); //没有加载出来隐藏加载动画
        myChart1.setOption({  //动画的配置
          xAxis: [{
            data: this.DayNumDay
          }],
          series: [{
            data: this.DayNumNum //这里数据是一个数组的形似
          }]
        })
      }, 2000 );

      console.log("日编辑数据加载完成");
    },
    myVideoEdit(){
      // 基于准备好的dom，初始化echarts实例
      const myChart2 = echarts.init(document.getElementById('main2'));
      // 指定图表的配置项和数据
      const option2 = {
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
          data: [],
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
          data: [],
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
      myChart2.setOption(option2);

      myChart2.showLoading();

      setTimeout(()=>{  //未来让加载动画效果明显,这里加入了setTimeout,实现2s延时
        myChart2.hideLoading(); //没有加载出来隐藏加载动画
        myChart2.setOption({  //动画的配置
          yAxis: [{
            data: this.VideoCutId
          }],
          series: [{
            data: this.VideoCutNum //这里数据是一个数组的形似
          }]
        })
      }, 2000 );

      console.log("视频编辑数据加载完成");
    },
    myTextEdit() {
      // 基于准备好的dom，初始化echarts实例
      const myChart3 = echarts.init(document.getElementById('main3'));

      // 指定图表的配置项和数据
      const option3 = {
        title: {
          text: '文本编辑次数',
          subtext: '取前五项'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          },
          formatter: function (params) {
            return params[0].name;
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'value',
          boundaryGap: [0, 0.01]
        },
        yAxis: {
          axisLabel: {show: false,},
          type: 'category',
          data: []
        },
        series: [
          {
            name: '总编辑次数',
            type: 'bar',
            data: [],
            barWidth: 30,
            itemStyle: {
              emphasis: {
                barBorderRadius: 20
              },
              normal: {
                barBorderRadius: 20
              }
            },
          },
        ]
      };

      // 使用刚指定的配置项和数据显示图表。
      myChart3.setOption(option3);

      myChart3.showLoading();

      this.$axios.get('http://localhost:8181/audit/page2').then((res) => {
        this.FiveMostText = res.data.FiveMostText;
        const sourceData = this.FiveMostText;
        for (const item in sourceData) {
          this.TextEditNum.push(sourceData[item].repeats);
          this.TextEditString.push(sourceData[item].text);
        }
        setTimeout(() => {  //未来让加载动画效果明显,这里加入了setTimeout,实现2s延时
          myChart3.hideLoading(); //没有加载出来隐藏加载动画
          myChart3.setOption({  //动画的配置
            yAxis: [{
              data: this.TextEditString,  //这里数据是一个数组的形似
            }],
            series: {
              data: this.TextEditNum,
            }
          })
        }, 2000)
      })
        .catch((err) => {
          console.log(err);
        })
    },
    clearText(){
      this.TextEditNum=[];
      this.TextEditString=[];
    },
    getAllData(){
      this.$axios.get('http://localhost:8181/audit/page1')
        .then((res)=>{
          this.textNum=res.data.textNum;
          this.editPeo=res.data.editPeo;
          this.videoNum=res.data.videoNum;

          this.tewDayNum=res.data.tewDayNum;
          this.mostFiveVideo=res.data.mostFiveVideo;


          const sourceData1 = this.tewDayNum;
          for (const index in sourceData1) {
            this.DayNumDay.push(sourceData1[index].time);
            this.DayNumNum.push(sourceData1[index].num);
          }

          const sourceData2 = this.mostFiveVideo;
          for (const index in sourceData2) {
            this.VideoCutId.push('视频'+sourceData2[index].video_id);
            this.VideoCutNum.push(sourceData2[index].repeats);
          }

          console.log("数据加载完成");

        })
        .catch((err)=>{
          console.log(err);
        })
    },
    viewData1(){
      this.isShowGraph1=true;
    },
    viewData2(){
      this.isShowGraph2=true;
    }
  },
  created() {
    this.getAllData();
  },
  mounted() {
    this.myVideoEdit();
    this.myDayEdit();;
  }
}

</script>

<style scoped>

.back {
  background-image: linear-gradient(to right, #0f0c29, #302b63, #24243e);
  /*background-color: #262626;*/
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.header {
  height: 40px;
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
}

.el-button {
  background-color: #6074b3;
  color: #FFFFFF;
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
  border: solid 1px #ffffff;
  /*background-color: #ffffff;*/
  border-radius: 10px;
  /*filter: drop-shadow(10px 10px 10px rgba(203, 200, 200, 0.5));*/
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
  border: solid 1px #ffffff;
  /*background-color: #ffffff;*/
  border-radius: 10px;
}

.audit-edit {
  margin-top: 40px;
  margin-left: 30px;
  width: 400px;
  height: 190px;
  border: solid 1px #ffffff;
  /*background-color: #ffffff;*/
  border-radius: 10px;
}

.audit-graph-1 {
  width: 920px;
  height: 380px;
  /*background-color: #ffffff;*/
  /*border: 1px solid #ffffff;*/
  border-radius: 10px;
}

.audit-graph-2 {
  margin-top: 30px;
  width: 920px;
  height: 250px;
  /*background-color: #ffffff;*/
  border: 1px solid #ffffff;
  border-radius: 10px;
}

.audit-graph-3 {
  width: 620px;
  height: 410px;
  /*transform: translate(-50%,-50%);*/
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 10px;
}

</style>
