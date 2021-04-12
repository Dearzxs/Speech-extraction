<template>
  <el-container class="back">
    <el-header>
      <div class="el-icon-coin"></div>
      <div class="project-name">
        {{ projectName }}
      </div>
      <div class="project-icon">
        <i class="el-icon-edit-outline"></i>
      </div>
      <div class="nav">
        <el-button size="medium" round class="project-button1" @click="login()">admin</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="project-main1">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsline="false" :options="playerOptions"></video-player>
      </div>
      <div class="project-main2">
        <el-table
          :data="tableData"
          style="width: 99%"
          max-height="500">
          <el-table-column
            label="时间(mm:ss:SSS)"
            width="200">
            <template slot-scope="scope">
              <span>{{ scope.row.bgTime }}-{{ scope.row.edTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="文本"
            >
            <template slot-scope="scope">
              <input class="edit-cell" v-if="showEdit[scope.$index]" v-model="scope.row.textPara.text">
              <span v-if="!showEdit[scope.$index]">{{ scope.row.textPara.text }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="edit(scope.row, scope.$index)" v-if="!showBtn[scope.$index]">
                编辑
              </el-button>
              <el-button size="mini" type="success" @click="save(scope.row, scope.$index)"
                         v-if="showBtn[scope.$index]">保存
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-footer>
      <el-button  @click="submitForm" round icon="el-icon-upload" class="project-button2">提交</el-button>
    </el-footer>
    <el-dialog title="上传进度" :visible.sync="uploadVisible" width="40%" :modal-append-to-body='false'>
      <span>{{ processInfo }}</span>
      <div>
        <k-progress :percent="percent" :color="getColor" active></k-progress>
      </div>
    </el-dialog>
  </el-container>
</template>

<script>

export default {
  data() {
    return {
      projectName: "我的项目",
      tableData: [],
      rawData: [],
      editData: [],
      showEdit: [], //显示编辑框
      showBtn: [],  //显示编辑按钮
      VideoAddress: '',
      videoId: '1',

      uploadVisible: false,
      processInfo: "文本上传成功",
      percent: 0,
      ifUp: true,

      playerOptions: {
        playbackRates: [0.7, 1.0, 1.5, 2.0], // 播放速度
        autoplay: false, // 如果true,浏览器准备好时开始回放。
        muted: false, // 默认情况下将会消除任何音频。
        loop: false, // 导致视频一结束就重新开始。
        preload: 'auto', // 建议浏览器在<video>加载元素后是否应该开始下载视频数据。auto浏览器选择最佳行为,立即开始加载视频（如果浏览器支持）
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/mp4', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: './static/video/java.mp4' // url地址
        }],
        poster: '', // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,
          durationDisplay: true,
          remainingTimeDisplay: false,
          fullscreenToggle: true // 全屏按钮
        }
      }
    }
  },
  mounted() {
    this.getData();
    const timer = setInterval(() =>{
      if (this.ifUp) {
        this.percent = this.percent + 1
        if(this.percent === 5) this.processInfo="文本修改已记录"
        if(this.percent === 10) this.processInfo="正在语音合成"
        if(this.percent === 30) this.processInfo="正在进行音视频转换"
        if(this.percent === 95) this.processInfo="正在存储视频"
        if(this.percent === 100){
          this.processInfo = "视频存储完成"
          this.ifUp = false
        }
      }
      // else {
      //   this.percent = 0
      //   this.processInfo = "正在进行视频语音提取"
      //   this.ifUp = true
      // }
    }, 500);
    this.$once('hook:beforeDestroy', () => clearInterval(timer));
  },
  methods: {
    login() {
      this.$router.push('/Login');
    },
    getData() {
      const userJsonStr = sessionStorage.getItem('sourceText');
      this.tableData=JSON.parse(userJsonStr);
      console.log(this.tableData);
      this.rawData = JSON.parse(JSON.stringify(this.tableData));//深拷贝
    },
    submitForm(){
      this.uploadVisible=true;
      this.diffFormData();
      this.$axios.post('/syn/speech',this.editData).then((res) => {
        if (res.status === 200) {
          this.VideoAddress=res.data;
          this.$message({
            message: '视频处理完成',
            type: 'success'
          });
          this.uploadVisible=false;
          this.$router.push({
            path: '/playVideo',
            query: {
              VideoAddress: this.VideoAddress
            }
          })
        }
        else {
          this.uploadVisible=false;
          this.$message({
            type: "error",
            message: "视频处理失败"
          });
        }
      }).catch(err => {
        console.log(err);
        this.uploadVisible=false;
        this.$message({
          type: "error",
          message: "视频处理失败"
        });
      });
    },

    edit(row, index) {
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.$set(this.showEdit, index, true)
      this.$set(this.showBtn, index, true)
    },
    save(row, index){
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
    },
    diffFormData () {
      for (let k in this.rawData) {
        if(this.rawData.hasOwnProperty(k)){
          if (this.rawData[k].textPara.text !== this.tableData[k].textPara.text) {
            const jsonStr = {
              'textId':this.tableData[k].textPara.textId,
              'text':this.tableData[k].textPara.text,
              'beginTime':this.tableData[k].textPara.beginTime,
              'endTime':this.tableData[k].textPara.endTime,
              'videoId':this.tableData[k].textPara.videoId,
              'textNum':this.tableData[k].textPara.textNum,
            };
            this.editData.push(jsonStr)
          }
        }
      }
    },

    getColor(percent) {
      if(percent < 40){
        return '#9CECFB';
      } else if(percent < 60) {
        return '#65C7F7';
      } else if(percent < 80) {
        return '#007991';
      } else {
        return '#78ffd6';
      }
    }
  },
}
</script>

<style lang="less">

.back {
  background-color: #262626;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.el-header {
  margin-top: 20px;
}

.el-icon-coin {
  float: left;
  font-size: 35px;
  color: #FFFFFF;
}

.project-name {
  font-family: "Microsoft YaHei", "微软雅黑", Arial, sans-serif;
  float: left;
  margin-left: 600px;
  width: 200px;
  height: 40px;
  font-size: 25px;
  color: #FFFFFF;
}

.project-icon {
  float: left;
  margin-left: 60px;
  width: 200px;
  height: 40px;
  font-size: 30px;
  color: #FFFFFF;
}

.nav {
  float: left;
  margin-left: 250px;
  width: 100px;
  height: 40px;
}

.project-button1 {
  background-color: transparent;
  margin-right: 25px;
  font-size: 15px;
  color: #FFFFFF;
  width: 100px;
  height: 40px;
}

.el-main {
  padding: 0 30px 2px 30px;
}

.project-main1 {
  margin-top: 1%;
  float: left;
  width: 45%;
  height: 90%;
  border: solid 1px #faf5f5;
  background-color: #000000;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.video-player {
  margin-top: 8%;
  margin-bottom: 4%;
}

.project-main2 {
  margin-top: 1%;
  margin-left: 5px;
  float: right;
  width: 50%;
  height: 90%;
  background-color: #ffffff;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.el-table {
  margin-top: 5px;
  margin-left: 5px;
}

.video-js .vjs-icon-placeholder {
  display: block;
}

.el-footer {
  text-align: center;
}

.project-button2 {
  width: 150px;
  height: 50px;
  font-size: 18px;
}
</style>
