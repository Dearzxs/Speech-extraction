<template>
  <el-container class="back">
    <el-header class="header">
      <div style="float:left;color: #000000;margin-left: 50px;margin-top: 10px;font-size: 25px">
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
      <div class="audit2-graph-1">
        <div id="main3" style="width: 600px;height:400px;"></div>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import * as echarts from "echarts";

export default {
  data() {
    return {
      FiveMostText: [],
      TextEditNum: [],
      TextEditString: [],
    }
  },
  methods: {
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
  },
  mounted() {
    this.myTextEdit();
  },
}
</script>

<style scoped>

.back {
  /*background-image: linear-gradient(to bottom, #000209, #050092);*/
  background-color: #ffffff;
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
  color: #000000;
}

.audit2-graph-1 {
  width: 620px;
  height: 410px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%,-50%);
  background-color: #ffffff;
  border: 1px solid black;
  border-radius: 10px;

}

</style>
