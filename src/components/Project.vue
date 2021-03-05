<template>
  <el-container class="back">
    <el-header>
      <div class="el-icon-coin"></div>
      <div class="project-name">
        项目名称
      </div>
      <div class="project-icon">
        <i class="el-icon-edit-outline"></i>
      </div>
      <div class="nav">
        <el-button size="medium" round class="project-button1">登录</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="project-main1">
        <videoView></videoView>
      </div>
      <div class="project-main2">
        文字区域
      </div>
    </el-main>
    <div class="project-operation">
      <videoControl></videoControl>
    </div>
  </el-container>
</template>

<script>

import videoView from "./VideoView"
import videoControl from "./VideoControl";

export default {
  name: "Project",
  data() {
    return {
      value1: 20
    }
  },
  components: {videoView,videoControl}
}
</script>

<style scoped>

.back {
  background-color: #4c4b4b;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.el-header {
  margin-top: 20px;
}

.el-icon-coin{
  float:left;
  font-size: 35px;
  color: #FFFFFF;
}

.project-name{
  float: left;
  margin-left: 600px;
  width: 200px;
  height: 40px;
  font-size: 25px;
  color: #cecdcd;
}

.project-icon {
  float: left;
  margin-left: 60px;
  width: 200px;
  height: 40px;
  font-size: 30px;
  color: #cecdcd;
}

.nav {
  float: left;
  margin-left: 250px;
  width: 100px;
  height: 40px;
}

.project-button1{
  background-color: transparent;
  margin-right: 25px;
  color: #cecdcd;
  width: 80px;
  height: 30px;
}

.el-main {
  padding: 0 30px 2px 30px;
}

.project-main1 {
  float:left;
  width: 56%;
  height: 420px;
  background-color: #050505;
  color: #cecdcd;
  text-align: center;
}

.project-main2 {
  margin-left: 10px;
  float:right;
  width: 42%;
  height: 420px;
  background-color: #050505;
  color: #cecdcd;
  text-align: center;
}

</style>
