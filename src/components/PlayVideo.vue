<template>
  <video id="playVideos" controls width="80%" height="80%">
    <source id="playVideosss" :src="playVideoUrl" type="video/mp4">
  </video>
</template>

<script>
export default {
  data() {
    return {
      playVideoUrl: ''
    };
  },
  methods: {
    playVideo(){
      let vdo = document.getElementById("playVideos")
      vdo.src='./static/video/java.mp4'
      // vdo.src=this.$route.query.VideoAddress;
      vdo.play();
    },
  },
  mounted() {
    this.playVideo();
  }
}
</script>

<style scoped>

</style>
