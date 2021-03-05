<template>
  <div class="playVideo">
    <video src="../assets/video/java.mp4" id="myVideo"></video>
  </div>
</template>

<script>
export default {
  created() {
    this.$nextTick(() => {
      const videoObject1 = document.getElementById("myVideo");
      const that = this;
      videoObject1.oncanplay = function() {
        that.Event.$emit("allTime", videoObject1.duration);
      };
    });
    // 开始和暂停播放视频
    this.Event.$on("play", data => {
      const videoObject2 = document.getElementById("myVideo");
      if (data) {
        videoObject2.play(); //播放
      } else {
        videoObject2.pause(); //暂停
      }
    });
    //设置当前时间
    this.Event.$on("currentTime", time => {
      const videoObject3 = document.getElementById("myVideo");
      videoObject3.currentTime = String(this.formData(time))
    });
    // 分段播放
    this.Event.$on("subSectionPlay", value => {
      const videoObject4 = document.getElementById("myVideo");
      videoObject4 .currentTime = String(this.formData(value.startTime))
    });

  },
  methods: {
    formData(time){
      const h = time.split(":")[0];
      const m = time.split(":")[1];
      const s = time.split(":")[2];
      const ms = time.split(".")[1];
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + "." + ms;
    }
  }
};
</script>

<style>

.playVideo video {
  height: 420px;
  width: 600px;
}
</style>


