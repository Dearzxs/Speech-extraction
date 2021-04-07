<template>
  <div class="play-back">
    <el-header height="70">
      <div style="float:left;">
        <h1 style="color: #FFFFFF;margin-left: 50px">文思海辉</h1>
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">教程</el-link>
        <el-link :underline="false">模板库</el-link>
        <el-link :underline="false">管理</el-link>
        <el-button size="medium" round class="play-button1" style="background-color: transparent;margin-right: 70px">
          登录
        </el-button>
      </div>
    </el-header>
    <el-main>
      <div class="play-video">
        <video-player class="video-player vjs-custom-skin" ref="videoPlayer" :playsline="false" :options="playerOptions"></video-player>
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
    </el-footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      playVideoUrl: '',
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
      },

      words: [],               //字母数组push，pop的载体
      str: "嗯啊",          //str初始化
      letters: [],             //str分解后的字母数组
      order: 0,                //表示当前是第几句话

      jsonData: [],
      jsonLength: 0,
    };
  },
  mounted() {
    this.begin();
    this.testData();
  },
  watch: {                     //监听order值的变化，改变str的内容
    order() {
      this.str=this.jsonData[this.order].text;
    }
  },
  methods: {
    begin() {//开始输入的效果动画
      this.letters = this.str.split("")
      for (let i = 0; i < this.letters.length; i++) {
        setTimeout(this.write(i), i * 500);
      }
    },
    write(i) {//输入字母
      return () => {
        let L = this.letters.length;
        this.words.push(this.letters[i]);
        let that = this;
        if (i === L - 1) {
          that.back();
        }
      }
    },
    back() {//开始删除的效果动画
      let L = this.letters.length;
      for (let i = 0; i < L; i++) {
        setTimeout(this.wipe(i), 0);
      }
    },
    wipe(i) {//擦掉(删除)字母
      return () => {
        this.words.pop(this.letters[i]);
        if (this.words.length === 0) {
          if(this.order === this.jsonLength-1){
            this.order=0;
          }else
          {
            this.order++;
          }
          let that = this;
          that.begin();
        }
      }
    },

    testData(){
      this.$axios.get('http://localhost:8081/static/json/test.json')
        .then( res => {
          this.jsonData = res.data;
          this.jsonLength = this.jsonData.length;
          console.log(this.jsonData)
      }).catch((error) => {
        console.log(error);
      });

    }

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
