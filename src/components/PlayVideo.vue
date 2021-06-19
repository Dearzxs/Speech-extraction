<template>
  <div class="play-back">
    <el-container>
    <el-header height="70">
      <div style="float:left;">
        <h1 style="color: #FFFFFF;margin-left: 50px">NVOPS</h1>
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">使用教程</el-link>
        <el-button size="medium" round class="play-button1" style="background-color: transparent;margin-right: 70px">
          admin
        </el-button>
      </div>
    </el-header>
    <el-container>
      <el-aside width="40%">
        <live2d style="margin-top: 40px;margin-left: 20px"
          :style="style"
          :model="[1, 53]"
          :direction="direction"
          :size="500"
        ></live2d>
      </el-aside>
      <el-main>
        <div class="play-video">
          <video-player class="video-player vjs-custom-skin"
                        ref="videoPlayer"
                        :playsline="true"
                        :options="playerOptions"
                        @play="onPlayerPlay($event)"
                        @pause="onPlayerPause($event)"
          >
          </video-player>
        </div>
        <el-button class="play-button2" size="medium" round @click="dialogVisible = true">完成</el-button>
      </el-main>
    </el-container>
    </el-container>
    <el-dialog title="我的项目" :visible.sync="dialogVisible" width="30%" :modal-append-to-body='false'>
      <span>{{ videoInfo }}</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="newVideo();dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>

import live2d from 'vue-live2d'

export default {
  components: {
    live2d
  },
  data() {
    return {
      playVideoUrl: '',
      playerOptions: {
        playbackRates: [1.0], // 播放速度
        autoplay: false, // 是否自动播放
        muted: false, // 是否静音
        loop: false, // 是否开启循环播放
        preload: 'auto', // 自动预加载
        language: 'zh-CN',
        aspectRatio: '16:9', // 将播放器置于流畅模式，并在计算播放器的动态大小时使用该值。值应该代表一个比例 - 用冒号分隔的两个数字（例如"16:9"或"4:3"）
        fluid: true, // 当true时，Video.js player将拥有流体大小。换句话说，它将按比例缩放以适应其容器。
        sources: [{
          type: 'video/webm', // 这里的种类支持很多种：基本视频格式、直播、流媒体等，具体可以参看git网址项目
          src: './static/video/jdwy.webm' // url地址
        }],
        poster: '', // 你的封面地址
        width: document.documentElement.clientWidth, // 播放器宽度
        notSupportedMessage: '此视频暂无法播放，请稍后再试', // 允许覆盖Video.js无法播放媒体源时显示的默认信息。
        controlBar: {
          timeDivider: true,  //是否显示当前时间和持续时间的分隔符，"/"
          durationDisplay: true,  // 是否显示持续时间
          remainingTimeDisplay: false,  // 是否显示剩余时间
          fullscreenToggle: true // 全屏按钮
        }
      },


      direction: 'left',
      style: '',
      width: 750,
      height: 750,
      tips: {
        mouseover: [{
          selector: '.vue-live2d',
          texts: ['你好，我是AI主播小舞']
        }]
      },


      dialogVisible: false,
      videoInfo: '还有视频文件未处理，是否处理下一文件'
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted() {
    // this.testData();
  },
  methods: {
    // 获取数据
    testData() {
      this.$axios.get('http://localhost:8081/static/json/test.json')
        .then(res => {
          this.jsonData = res.data;
          this.jsonLength = this.jsonData.length;
          console.log("sentences:" + this.jsonLength);
        }).catch((error) => {
        console.log(error);
      });

    },

    // 播放回调
    onPlayerPlay(player) {
      if (this.firstFlag === true) {
        this.firstFlag = false;
        console.log('player first play!')
      } else {
        this.stopFlag = 0;
        this.beginText(this.lastPlace);
        console.log('player play!')
      }

    },
    // 暂停回调
    onPlayerPause(player) {
      this.stopFlag = 1;
      // console.log('player pause!', player)
      console.log('player pause!')
    },

    newVideo(){
      this.$message({
        type: "success",
        message: "视频已处理好，可修改"
      });
    }
  }
}
</script>

<style scoped lang="less">

.play-back {
  background-image: linear-gradient(to right, #56CCF2, #2F80ED);
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.el-header {
  margin-top: 20px;
}

.el-link {
  margin-top: 20px;
  margin-right: 80px;
  margin-bottom: 20px;
  font-size: 16px;
  color: #FFFFFF;
}

.play-button1 {
  width: 140px;
  height: 45px;
  font-size: 18px;
  color: #FFFFFF;
}

.play-button2 {
  background-color: transparent;
  float: left;
  margin-top: 20px;
  margin-left: 300px;
  width: 125px;
  height: 50px;
  color: white;

}

.play-video {
  width: 85%;
  border: 1px solid #fdfeff;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.video-player {
  margin-top: 4%;
  margin-bottom: 4%;
}

.video-js .vjs-icon-placeholder {
  display: block;
}
</style>
