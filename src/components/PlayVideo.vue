<template>
  <div class="play-back">
    <el-header height="70">
      <div style="float:left;">
        <h1 style="color: #FFFFFF;margin-left: 50px">文思海辉</h1>
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">教程</el-link>
        <el-link href="http://localhost:8081/auditCount" :underline="false">审计</el-link>
        <el-button size="medium" round class="play-button1" style="background-color: transparent;margin-right: 70px">
          admin
        </el-button>
      </div>
    </el-header>
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
    </el-main>
    <el-footer>
      <div class="typewriter">
        <div class="typewriter-content">
          <p class="typewriter-dynamic">
            <span class="cut"><span class="word" v-for="(letter,index) in words" :key="index">{{ letter }}</span></span>
          </p>
        </div>
      </div>
      <el-button class="play-button2" size="medium" style="background-color: transparent" round @click="dialogVisible = true">完成</el-button>
    </el-footer>

    <el-dialog title="我的项目" :visible.sync="dialogVisible" width="30%" :modal-append-to-body='false'>
      <span>还有视频文件未处理，是否处理下一文件</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
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

      dialogVisible: false,

      words: [],               //字母数组push，pop的载体
      str: "嗯",          //str初始化
      letters: [],             //str分解后的字母数组
      order: -1,                //表示当前是第几句话
      stopFlag: 0,
      lastPlace: -1, //-1表示正常输入， 非-1表示输出上一次结果
      durations: 0,
      firstFlag: true,

      jsonData: [],   //字幕json数组
      jsonLength: 0,  //总句子数
    };
  },
  computed: {
    player() {
      return this.$refs.videoPlayer.player
    }
  },
  mounted() {
    this.testData();
  },
  watch: {                     //监听order值的变化，改变str的内容
    order() {
      this.str = this.jsonData[this.order].text;
    },
  },
  methods: {
    // 开始输入
    beginText(lastPlace) {
      if (lastPlace === -1) {
        this.letters = this.str.split("")
        for (let i = 0; i < this.letters.length; i++) {
          setTimeout(this.write(i), i * 500);
        }
      }
      if (lastPlace !== -1) {
        this.letters = this.str.split("")
        for (let i = lastPlace + 1; i < this.letters.length; i++) {
          setTimeout(this.write(i), i * 500);
        }
        this.lastPlace = -1;
      }
    },
    // 输入字母
    write(i) {
      return () => {
        if (this.stopFlag === 0) {
          let L = this.letters.length;
          this.words.push(this.letters[i]);
          if (i === L - 1) {
            this.words.splice(0, L)
            if (this.order === this.jsonLength - 1) {
              this.order = 0;
            } else {
              this.order++;
            }
            let that = this;
            that.beginText(-1);
          }
        }
        if (this.stopFlag === 1) {
          this.lastPlace = i;
        }
      }
    },

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
        // this.beginText(this.lastPlace);
        console.log('player play!')
      }

    },
    // 暂停回调
    onPlayerPause(player) {
      this.stopFlag = 1;
      // console.log('player pause!', player)
      console.log('player pause!')
    },

    // onPlayerTimeupdate(player) {
    //   this.durations = player.cache_.currentTime
    //   const dura = parseInt(this.durations);
    // }
  }
}
</script>

<style scoped lang="less">

.play-back {
  background-color: #000000;
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
  float: right;
  width: 100px;
  height: 40px;
  color: white;
  margin-right: 40px;
  margin-bottom: 40px;
}

.el-main {
  width: 75%;
  height: 70%;
}

.play-video {
  width: 55%;
  margin-left: 180px;
  border: 1px solid #8cc9ea;
  background-color: transparent;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.video-player {
  margin-top: 8%;
  margin-bottom: 4%;
}

.video-js .vjs-icon-placeholder {
  display: block;
}

.typewriter {
  //border: solid 1px #e0acac;
  box-sizing: border-box;
  color: #ffffff;
  text-align: center;
}

.typewriter-content {
  font-weight: bold;
  font-size: 30px;
  flex-direction: row;
  letter-spacing: 2px
}

//光标
//.typewriter-cursor {
//  position: absolute;
//  height: 100%;
//  width: 3px;
//  top: 0;
//  right: -10px;
//  background-color: #000000;
//  animation: flash 1.5s linear infinite;
//}
</style>
