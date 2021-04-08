<template>
  <el-container class="back">
    <el-main>
      <div class="project-main1">
        <div class="playVideo">
<!--          <video src="./static/video/java.mp4" id="myVideo"></video>-->
        </div>
      </div>
      <div class="project-main2">
        <el-table
          :data="tableData"
          style="width: 100%"
          max-height="400">
          <el-table-column
            label="时间"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }}-{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="文本"
            width="280">
            <template slot-scope="scope">
              <input class="edit-cell" v-if="showEdit[scope.$index]" v-model="scope.row.text">
              <span v-if="!showEdit[scope.$index]">{{ scope.row.text }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click.native="handleEdit(scope.$index, scope.row)" v-if="!showBtn[scope.$index]">
                编辑
              </el-button>
              <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)"
                         v-if="showBtn[scope.$index]">保存
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <footer>
      <div class="menu">
        <div class="controlMenu">
          <div @click="onControl()" class="iconfont icon-dadian" :title="clickMsg">
            <span>{{ clickMsg }}</span>
          </div>

          <div class="controlBtn">
            <el-button class="iconfont icon-tuisong" size="mini" @click="submitForm()">确认修改</el-button>
          </div>
        </div>
        <div class="videoContorl">
          <div class="timeLong">
            <em>总时长：</em><span>{{ videoLongTime }}</span>
          </div>
          <i class="iconfont icon-kuaijin-1" @click="prevPage"></i>
          <i class="iconfont icon-bofang" @click="play" v-if="playFlag"></i>
          <i class="icon-bofang1 iconfont" @click="stop" v-else></i>
          <i class="iconfont icon-kuaijin-" @click="nextPage"></i>
        </div>
        <div class="rule">
          <span class="iconfont icon-fanxuan" title="反选" @click="turnReserve"></span>
          <span class="iconfont icon-qingchu" title="删除所有片段" @click="clearAllVideo"></span>
          <div class="block">
            <el-slider v-model="value2" :step="20" show-stops @change="stepChange"></el-slider>
          </div>
        </div>
      </div>

      <div class="controlLine">
        <div class="signshowImg" v-if="signFlag" :style="`left:${signLeft}`">
          <span class="signDetail icon-qingchu iconfont" @click="signDelete"></span>
          <span class="signClose icon-chuyidong iconfont" @click="signFlag = false"></span>

          <div class="icon-xiugai iconfont text" @click="changeSignText">{{ signText }}</div>
        </div>

        <div class="dyc" id="pickedDeng">
          <div class="canFa" @mouseup="blueBgUp">
            <!--          时间轴-->
            <canvas id="canvas" :width="canvasWidth" height="80" @mousemove="showMoveImg"></canvas>
            <div class="signcircle" v-for="(item,index) in makeSignList" :key="index" :style="`left:${item.left}`"
                 @click="signClick(item,index)"></div>
            <div class="blueBg" id="blueBg" ref="timeMove" @mousedown="blueBgDown" @mousemove="blueBgMove"
                 @mouseup="blueBgUp">
              {{ timeCurrentLeft }}<span class="turnDowm"></span>
            </div>
          </div>

          <div class="imgbackground" id="imgbackground" :style="`width:${imgWidth};`" @mousemove="faPKMove"
               @mouseup="faPKup">
            <div class="coverlist" v-for="(item,index) in cutCoverList" :key="index"
                 :style="`width:${item.width};left:${item.left}`" @mouseup="pkLup">
              <span class="dragLeft icon-zuo iconfont" @mousedown="pkLDown(index,$event)"></span>
              <div>
                <span class="icon-bofang iconfont" @click="subSection(item)"></span>
                <span class="icon-qingchu iconfont" @click="clearCoverBox(index)"></span>
                <div>{{ item.timeLong }}</div>
                <div class="icon-xiugai iconfont" @click="changeText(index)">{{ item.text }}</div>
              </div>
              <span class="dragRight icon-you iconfont" @mousedown="pkRDown(index,$event)" @mouseup="pkRup"></span>
            </div>
          </div>
        </div>
      </div>

    </footer>
  </el-container>
</template>

<script>

export default {
  name: "Project",
  data() {
    return {
      projectName: "我的项目",
      tableData: [],
      editData: { editSet:[]},
      showEdit: [], //显示编辑框
      showBtn: [],  //显示编辑按钮
      VideoAddress: '',


      //时间线控件
      turnFlag: "",
      index: null,
      timeLong: "3秒",

      //底部
      topMoveBox: null, //移动的蓝色时间盒子
      number: 5, //刻度对应秒数
      maxTimeLong: 360000, //除以10 即为刻度尺 个 刻度
      videoLongTime: "00:00:00",
      value2: 80, //选择刻度尺刻度大小
      canvas: null,
      canvasWidth: 60000,
      cxt: null,
      clickMsg: "打入点", //打入打出
      config: {},
      timeCurrentLeft: "00:00:00:00", //当前距离左侧时间
      clickCurrentTime: null, //点击距离

      timeId: null, //计算定时器
      clickIn: null, //打入定时器
      scrollId: null, //滚动定时器
      subTimeId: null, //分段播放移动计时器

      subPlayValue: null, //分段播放数据
      moveLeft: -40, //移动中坐标
      cutCoverList: [], //裁剪列表
      makeSignList: [], //标记列表
      coverBoxWidth: "0px",
      clickCurrentLeft: null, //点击打入时，距离左侧位置
      videoLong: 600,
      imgWidth: "0px", //图片的宽度
      pickedDeng: null,
      playFlag: true, //播放flag
      signFlag: false, //标记flag
      scrollFlag: false, //滚动标识
      target: 1400, //目标位置
      // 盒子拖拽部分
      downFlag: false, //按下的标志
      offsetStart: null,
      offsetEnd: null,
      currentRunMsg: "run",
      signIndex: null, //当前点击标记的index
      signLeft: "0px",
      signText: "标记1",

      countNumber: 1,
      blueBgFlag: false,
      timeMoveNumber: 0,// 控制滚动数字
    }
  },
  created() {
    this.Event.$on("allTime", data => {
      this.videoLongTime = this.setTime(data);
      this.videoLong = data;
      this.maxTimeLong = Math.ceil(data) * 100;
      this.imgWidth = (this.videoLong / this.number) * 100 + "px";
      this.target = parseFloat(this.imgWidth) - 40;
    });
    this.$nextTick(() => {
      const videoObject1 = document.getElementById("myVideo");
      const that = this;
      videoObject1.oncanplay = function () {
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
      videoObject4.currentTime = String(this.formData(value.startTime))
    });

  },
  mounted() {
    this.getData();

    // 获取时间
    const canvas = document.getElementById("canvas");
    this.canvas = canvas;
    const cxt = canvas.getContext("2d");
    cxt.fillStyle = "#ffffff";
    this.cxt = cxt;
    this.config = {
      height: 200,
      width: this.canvasWidth,
      // 刻度尺相关
      start: "00:00:00",
      end: "00:20:10",
      size: 300, // 刻度尺总刻度数
      // unit:10,
      x: 20, // 刻度尺x坐标位置
      y: 70, // 刻度尺y坐标位置
      w: 10, // 刻度线的间隔
      h: 10, // 刻度线基础长度

      // 事件相关
      mousedown: false
    };
    this.showCanvas();
    const timeMove = document.getElementsByClassName("blueBg")[0];
    this.topMoveBox = timeMove;
    timeMove.style.left = "-40px";
    // 设置图片盒子宽度
    this.imgWidth = (this.videoLong / this.number) * 100 + "px";
    this.pickedDeng = document.getElementById("pickedDeng")
  },
  methods: {
    login() {
      this.$router.push('/Login');
    },
    getData() {
      this.tableData = this.$route.query.tableData
    },
    handleReceive: async function () {
      let isSuccess = false;
      await this.$axios.post('/syn/speech',this.editData).then((res) => {
        if (res.status === 200) {
          this.VideoAddress=res.data;
          console.log(res.data)
          this.$message({
            message: '视频处理完成',
            type: 'success'
          });
          isSuccess = true;
        }
      }).catch(err => {
        console.log(err);
        this.$message({
          type: "error",
          message: "视频处理失败"
        });
      });
      return isSuccess
    },
    submitForm: async function () {
      const loading = this.$loading({
        lock: true,
        text: '视频处理中，请稍后',
        spinner: 'el-icon-loading',
        background: 'rgba(0, 0, 0, 0.7)'
      });
      await this.handleReceive().then((res)=>{
        if(res === true){
          loading.close();
          this.$router.push({
            path: '/playVideo',
            query: {
              VideoAddress: this.VideoAddress
            }
          })
        }
        else {
          this.$message({
            type: "error",
            message: "FAIL"
          });
          loading.close();
        }
      })
    },
    //点击编辑
    handleEdit(index, row) {
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.$set(this.showEdit, index, true)
      this.$set(this.showBtn, index, true)
    },
    //点击更新
    handleUpdate(index, row) {
      const jsonStr = {"videoId":row.videoId,"beginTime":row.beginTime,"endTime":row.endTime,"text":row.text};
      this.editData.editSet.push(jsonStr);
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
    },


    formData(time) {
      const h = time.split(":")[0];
      const m = time.split(":")[1];
      const s = time.split(":")[2];
      const ms = time.split(".")[1];
      return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + "." + ms;
    },


    //时间进度条移动
    blueBgDown() {
      this.stop();
      this.blueBgFlag = true;
    },
    blueBgMove(e) {
      if (!this.blueBgFlag) {
        return;
      }
      const pickedDeng = document.getElementById("pickedDeng");
      const finLeft = pickedDeng.scrollLeft + e.pageX - 40;
      if (finLeft > (parseFloat(this.imgWidth) - 40) || finLeft < -40) {
        this.stop();
        this.$message.error("超过限制区域")
        return
      }
      document.getElementById("blueBg").style.left = finLeft + "px";
      this.timeCurrentLeft = this.setDetailTime(parseFloat(Math.floor((this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100) / 100).toFixed(2));
      this.Event.$emit("currentTime", this.timeCurrentLeft);
    },
    blueBgUp() {
      this.blueBgFlag = false;
    },
    // pk
    faPKMove($event) {
      let finWidth;
      if (!this.downFlag) {
        return;
      }
      const pickedDeng = document.getElementById("pickedDeng");
      const currentBox = this.cutCoverList[this.index];
      const curWidth = parseFloat(currentBox.width);
      const curLeft = parseFloat(currentBox.left);
      const finLeft = pickedDeng.scrollLeft + $event.pageX - 30;
      if (this.turnFlag === "left") {
        const finright = curLeft + curWidth;
        finWidth = finright - finLeft;
        currentBox.width = finWidth + "px";
        currentBox.left = finLeft + "px";

        currentBox.startTime = this.getStartEndTime(
          parseFloat(currentBox.left)
        );
        currentBox.timeLong = this.getTimeBesides(
          currentBox.startTime,
          currentBox.endTime
        );
        this.topMoveBox.style.left = finLeft - 40 + "px";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor(
              (this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100
            ) / 100
          ).toFixed(2)
        );
        this.Event.$emit("currentTime", this.timeCurrentLeft);
      } else if (this.turnFlag === "center") {
        // 设置左侧位置

        currentBox.left = finLeft - 30 + "px";
        currentBox.startTime = this.getStartEndTime(
          parseFloat(currentBox.left)
        );
        currentBox.endTime = this.getStartEndTime(
          parseFloat(currentBox.left) + parseFloat(currentBox.width)
        );
        currentBox.timeLong = this.getTimeBesides(
          currentBox.startTime,
          currentBox.endTime
        );

        this.topMoveBox.style.left = finLeft - 70 + "px";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor(
              (this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100
            ) / 100
          ).toFixed(2)
        );
        this.Event.$emit("currentTime", this.timeCurrentLeft);
      } else if (this.turnFlag === "right") {
        // 设置宽度
        finWidth = finLeft - curLeft + 30;
        currentBox.width = finWidth + "px";
        currentBox.endTime = this.getStartEndTime(
          parseFloat(currentBox.left) + parseFloat(currentBox.width)
        );
        currentBox.timeLong = this.getTimeBesides(
          currentBox.startTime,
          currentBox.endTime
        );
        this.topMoveBox.style.left =
          finWidth - 40 + parseFloat(currentBox.left) + "px";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor(
              (this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100
            ) / 100
          ).toFixed(2)
        );
        this.Event.$emit("currentTime", this.timeCurrentLeft);
      }
    },
    faPKup() {
      this.downFlag = false;
    },
    pkLDown(index, $event) {
      this.index = index;
      this.turnFlag = "left";
      this.downFlag = true;
      this.stop();
    },
    pkRDown(index, $event) {
      this.index = index;
      this.turnFlag = "right";
      this.downFlag = true;
      this.stop()
    },
    pkLup() {
      this.downFlag = false;
    },
    pkRup() {
      this.downFlag = false;
    },
    //鼠标悬浮显示当前图片
    showMoveImg($event) {
      const currentTime = this.setDetailTime(
        ($event.offsetX - 20) * (this.number / 100)
      );
      this.Event.$emit("currentImg", currentTime);
    },
    //反选
    turnReserve() {
      if (this.cutCoverList.length > 0) {
        const turnReverse = []; //反选数组列表
        for (let i = 1; i < this.cutCoverList.length; i++) {
          const prev = this.cutCoverList[i - 1];
          const current = this.cutCoverList[i];
          const prevRight = parseFloat(prev.left) + parseFloat(prev.width);
          const currentWidth = parseFloat(current.left) - prevRight;
          turnReverse.push({
            left: prevRight + "px",
            width: currentWidth + "px",
            clickFlag: true,
            text: "片段" + i,
            startTime: this.getStartEndTime(prevRight),
            endTime: this.getStartEndTime(currentWidth + prevRight),
            timeLong: this.getStartEndTime(currentWidth)
          });
          console.log(turnReverse);
        }
        if (parseFloat(this.cutCoverList[0].left) >= (100 / this.number) * 3) {
          //说明从一开始就开始打点 并且大于3秒
          turnReverse.unshift({
            left: "0px",
            width: this.cutCoverList[0].left,
            startTime: "00:00:00.00",
            endTime: this.getStartEndTime(
              parseFloat(this.cutCoverList[0].left)
            ),
            timeLong: this.getStartEndTime(
              parseFloat(this.cutCoverList[0].left)
            ),
            text: "第一条"
          });
        }
        const last = this.cutCoverList[this.cutCoverList.length - 1];
        if (
          parseFloat(last.left) + parseFloat(last.width) <=
          parseFloat(this.imgWidth) - (100 / this.number) * 3
        ) {
          turnReverse.push({
            left: parseFloat(last.left) + parseFloat(last.width) + "px",
            width:
              parseFloat(this.imgWidth) -
              (parseFloat(last.left) + parseFloat(last.width)) +
              "px",
            startTime: this.getStartEndTime(
              parseFloat(last.left) + parseFloat(last.width)
            ),
            endTime: this.getStartEndTime(
              parseFloat(last.left) +
              parseFloat(last.width) +
              parseFloat(this.imgWidth) -
              (parseFloat(last.left) + parseFloat(last.width))
            ),
            timeLong: this.getStartEndTime(
              parseFloat(this.imgWidth) -
              (parseFloat(last.left) + parseFloat(last.width))
            ),
            text: "最后一条"
          });
        }
        this.cutCoverList = turnReverse;
      } else {
        this.$message("还没有划分片段");
      }
    },
    //清除所有片段1
    clearAllVideo() {
      this.$confirm("是否删除所有片段?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.cutCoverList = [];
          this.$message({
            type: "success",
            message: "删除成功!"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    signDelete() {
      this.$confirm("是否删除标记?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          this.makeSignList.splice(this.index, 1);
          this.signFlag = false;
          this.$message({
            type: "success",
            message: "删除成功"
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除"
          });
        });
    },
    signClick(item, index) {
      console.log(item);
    },
    // 分段播放
    subSection(value) {
      if (this.clickMsg === "打出点") {
        this.$message.error("请先打出点后再删除")
        return;
      }
      this.subPlayValue = value;
      this.Event.$emit("subSectionPlay", value);
      this.topMoveBox.style.left = parseFloat(value.left) - 40 + "px";
      this.subRunning(parseFloat(value.left) + parseFloat(value.width));
    },
    // 修改标记名称
    changeSignText(index) {
      this.$prompt("请输入标记标题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({value}) => {
        this.makeSignList[this.signIndex].text = value;
        this.signText = value;
      }).catch(() => {
        this.$message({
          type: "info",
          message: "取消输入"
        });
      });
    },
    // 修改片段名称
    changeText(index) {
      this.$prompt("请输入片段标题", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消"
      }).then(({value}) => {
        this.cutCoverList[index].text = value;
      }).catch(() => {
        this.$message({
          type: "info",
          message: "取消输入"
        });
      });
    },
    // 删除单个覆盖盒子
    clearCoverBox(index) {
      if (this.clickMsg === "打出点") {
        this.$message.error("请先打出点后再删除")
        return;
      }
      this.cutCoverList.splice(index, 1);
    },
    // 播放
    play() {
      if (this.currentRunMsg === "clickIn") {
        this.running();
        return;
      } else if (this.currentRunMsg === "subRunning") {
        this.running();
        return;
      }
      this.currentRunMsg = "run";
      this.running();
    },
    running() {
      this.playFlag = false;
      this.Event.$emit("play", true); //播放视频
      if (this.currentRunMsg === "clickIn") {
        this.clickInInterval();
        return;
      } else if (this.currentRunMsg === "subRunning") {
        this.subRunning(
          parseFloat(this.subPlayValue.left) +
          parseFloat(this.subPlayValue.width)
        );
        return;
      }
      const timeMove = document.getElementsByClassName("blueBg")[0];
      timeMove.style.left = this.target + "px";

      this.timeId = setInterval(() => {
        this.moveLeft = window.getComputedStyle(timeMove).left;
        this.timeMoveNumber = parseInt(parseInt(this.moveLeft) / 1600)
        if (parseFloat(this.moveLeft) / 1400 > this.countNumber) {
          this.countNumber = parseInt(parseFloat(this.moveLeft) / 1400) + 1;
        }
        if (parseFloat(this.moveLeft) + 40 > parseFloat(this.imgWidth)) {
          clearInterval(this.timeId);
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
        }

        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) / 100).toFixed(2)
        );
      }, 20);
      const pxecachS = this.number / 100; // 对应的每px所需要的秒
      const timeCount = (parseInt(this.target) - parseInt(this.moveLeft)) * pxecachS;
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    subRunning(target) {
      this.stop();
      this.currentRunMsg = "subRunning";
      this.playFlag = false;
      const timeMove = document.getElementsByClassName("blueBg")[0];
      timeMove.style.left = target + "px";
      this.Event.$emit("play", true); //播放视频
      this.subTimeId = setInterval(() => {
        console.log("subRunning");
        this.moveLeft = window.getComputedStyle(timeMove).left;
        this.timeMoveNumber = parseInt(parseInt(this.moveLeft) / 1600)
        if (parseFloat(this.moveLeft) / 1400 > this.countNumber) {
          this.countNumber = parseInt(parseFloat(this.moveLeft) / 1400) + 1;
        }
        if (parseFloat(this.moveLeft) + 40 > target) {
          clearInterval(this.subTimeId);
          timeMove.style.left = this.moveLeft;
          this.stop();
          timeMove.style.transition = "none";
          clearInterval(this.subTimeId);
          this.currentRunMsg = "run";
        }
        if (parseInt(this.moveLeft) >= target) {
        }
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(
            Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) /
            100
          ).toFixed(2)
        );
      }, 20);
      const pxecachS = this.number / 100; // 对应的每px所需要的秒
      const timeCount = (parseInt(target) - parseInt(this.moveLeft)) * pxecachS;
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    // 暂停
    stop() {
      this.Event.$emit("play", false); //暂停视频
      this.playFlag = true;
      const timeMove = document.getElementsByClassName("blueBg")[0];
      this.moveLeft = window.getComputedStyle(timeMove).left;
      timeMove.style.left = this.moveLeft;
      timeMove.style.transition = `none`;
      clearInterval(this.timeId);
      clearInterval(this.clickIn);
      clearInterval(this.subTimeId);
      clearInterval(this.scrollId);
    },
    // 上一帧
    prevPage() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      const movePX = (100 / this.number / 100) * 10;
      const currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      if (currentLeft <= -40) {
        timeMove.style.left = "-40px";
        timeMove.style.transition = "none";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) / 100).toFixed(2)
        );
        return;
      }
      const fininal = currentLeft - movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("currentTime", this.timeCurrentLeft); //触发上一帧下一帧
    },
    // 下一帧
    nextPage() {
      this.stop();
      const timeMove = document.getElementById("blueBg");
      const movePX = (100 / this.number / 100) * 10;
      const currentLeft = parseFloat(window.getComputedStyle(timeMove).left);
      if (currentLeft >= parseFloat(this.imgWidth) - 40) {
        timeMove.style.left = parseFloat(this.imgWidth) - 40 + "px";
        timeMove.style.transition = "none";
        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) / 100).toFixed(2)
        );
        return;
      }
      const fininal = currentLeft + movePX;
      timeMove.style.left = fininal + "px";
      this.timeCurrentLeft = this.getStartEndTime(fininal + 40);
      this.Event.$emit("currentTime", this.timeCurrentLeft);
    },
    // 打入计时器
    clickInInterval() {
      if (this.currentRunMsg === "run") {
        clearInterval(this.timeId);
      }
      this.currentRunMsg = "clickIn";
      const timeMove = document.getElementsByClassName("blueBg")[0];
      const target = this.target;
      this.clickIn = setInterval(() => {
        this.moveLeft = window.getComputedStyle(timeMove).left;
        this.timeMoveNumber = parseInt(parseInt(this.moveLeft) / 1600)//赋值让底部滚动
        if (parseFloat(this.moveLeft) / 1400 > this.countNumber) {
          this.countNumber = parseInt(parseFloat(this.moveLeft) / 1400) + 1;
        }
        if (parseFloat(this.moveLeft) + 40 >= parseFloat(this.imgWidth)) {
          clearInterval(this.clickIn);
          this.timeMove();
          this.clickMsg = "打入点";
          timeMove.style.left = this.moveLeft;
          timeMove.style.transition = "none";
          this.stop();
        }
        if (this.cutCoverList.length > 0) {
          const current = this.cutCoverList[this.cutCoverList.length - 1];
          const coverBoxWidth = parseFloat(this.moveLeft) - parseFloat(this.clickCurrentLeft + 40);
          current.width = coverBoxWidth + "px";
          current.timeLong = this.getStartEndTime(coverBoxWidth);
        }

        this.timeCurrentLeft = this.setDetailTime(
          parseFloat(Math.floor((this.number / 100) * (timeMove.offsetLeft + 40) * 100) / 100).toFixed(2)
        );
      }, 10);
      const pxecachS = this.number / 100; // 对应的每px所需要的秒
      const timeCount = (parseInt(target) - parseInt(this.moveLeft)) * pxecachS;
      timeMove.style.left = target + "px";
      timeMove.style.transition = `all ${timeCount}s linear`;
    },
    //改变刻度
    stepChange() {
      // 鼠标松开时触发
      const number = this.number;
      switch (this.value2) {
        case 0:
          this.number = 600;
          break;
        case 20:
          this.number = 120;
          break;
        case 40:
          this.number = 30;
          break;
        case 60:
          this.number = 10;
          break;
        case 80:
          this.number = 5;
          break;
        case 100:
          this.number = 1;
          break;
        default:
          break;
      }

      // 修改片段宽度
      for (let i = 0; i < this.cutCoverList.length; i++) {
        this.cutCoverList[i].left =
          parseFloat(
            (number * parseFloat(this.cutCoverList[i].left)) / this.number
          ) + "px";
        this.cutCoverList[i].width =
          parseFloat(
            (number * parseFloat(this.cutCoverList[i].width)) / this.number
          ) + "px";
      }
      const moveBox = document.getElementById("blueBg");
      const moveBoxLeft = document.getElementById("blueBg").style.left;
      moveBox.style.left =
        parseFloat(
          (number * parseFloat(moveBoxLeft)) / this.number
        ) + "px";
      this.timeCurrentLeft = this.setDetailTime(
        parseFloat(
          Math.floor(
            (this.number / 100) * (this.topMoveBox.offsetLeft + 40) * 100
          ) / 100
        ).toFixed(2)
      );
      this.showCanvas();
      this.imgWidth = (this.videoLong / this.number) * 100 + "px";
      this.stop();
    },
    // 获取总秒数
    getCountS(time) {
      const hour = time.split(":")[0];
      const min = time.split(":")[1];
      const s = time.split(".")[0].split(":")[2];
      const ms = time.split(".")[1];
      return parseFloat(
        parseInt(hour) * 3600 + parseInt(min * 60) + s + "." + ms
      );
    },
    showCanvas() {
      const that = this;
      this.drawCan(this.cxt, this.config, that.number);
      // 鼠标按下时 记录状态及位置
      this.canvas.addEventListener("dblclick", function (e) {
        const scrollpd = document.getElementById("pickedDeng");
        const scrollLeft = scrollpd.scrollLeft;
        if (e.offsetX > parseInt(scrollLeft) + 1400) {
          that.$message.error("超过最大位置，请选择左侧位置~");
          return;
        }
        that.stop();
        that.clickCurrentTime = e.offsetX;
        const timeMove = document.getElementById("blueBg");
        timeMove.style.left = e.offsetX - 60 + "px";
        that.timeCurrentLeft = that.setDetailTime(
          parseFloat(
            Math.floor((that.number / 100) * (timeMove.offsetLeft + 40) * 100) /
            100
          ).toFixed(2)
        );
        that.config.mousedown = true;
        that.config.start = [e.offsetX, e.offsetY];
        that.playFlag = true;
        that.Event.$emit("currentTime", that.timeCurrentLeft);
      });
      // 鼠标放开时 重置状态
      this.canvas.addEventListener("mouseup", function (e) {
        that.config.mousedown = false;
        that.config.x += e.offsetX - that.config.start[0];
        // console.log(that.config.x);
        if (that.config.x > 10) {
          that.config.x = 20;
          that.drawCan(that.cxt, that.config, that.number);
        }
      });
      // 鼠标划出canvas时 重置状态
      this.canvas.addEventListener("mouseout", function (e) {
        that.config.mousedown = false;
      });
    },
    drawCan(cxt, config, number) {
      const size = 36000; //size/10则生成多少个刻度
      const x = config.x || 0;
      const y = config.y || 0;
      const w = config.w || 5;
      const h = config.h || 10;
      let offset = 3; // 上面数字的偏移量
      // 画之前清空画布
      cxt.clearRect(0, 0, config.width, config.height);
      // 设置画笔属性
      cxt.strokeStyle = "#fff";
      cxt.lineWidth = 1;
      cxt.font = 12;
      for (let i = 0; i <= size; i++) {
        // 开始一条路径
        cxt.beginPath();
        // 移动到指定位置
        cxt.moveTo(x + i * w, y);
        // 满10刻度时刻度线长一些 并且在上方表明刻度
        if (i % 10 === 0 && this.number === 1) {
          // 区间为 1 s
          offset = 20;
          cxt.fillText(this.setTime(i / 10), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }

        if (i % 10 === 0 && this.number === 5) {
          // 区间为 5 s
          offset = 20;
          cxt.fillText(this.setTime(i / 2), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 === 0 && this.number === 10) {
          // 区间为 10 s
          offset = 20;
          // console.log(i * number, x + i * w - offset, y - h * 2.5)
          // 按照第一个参数递增
          cxt.fillText(this.setTime(i), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 === 0 && this.number === 30) {
          // 区间为 30 s
          offset = 20;
          cxt.fillText(this.setTime(i * 3), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 === 0 && this.number === 120) {
          // 区间为 120 s
          offset = 20;
          cxt.fillText(this.setTime(i * 12), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        }
        if (i % 10 === 0 && this.number === 600) {
          // 区间为 600 s
          offset = 20;
          cxt.fillText(this.setTime(i * 60), x + i * w - offset, y - h * 2.5);
          cxt.lineTo(x + i * w, y - h * 2);
        } else {
          // 满5刻度时的刻度线略长于1刻度的
          cxt.lineTo(x + i * w, y - (i % 5 === 0 ? 1.5 : 1) * h);
        }

        // 画出路径
        cxt.stroke();
      }
    },
    setTime(time) {
      let secondTime = parseInt(time); // 秒
      let minuteTime = 0; // 分
      let hourTime = 0; // 小时
      if (secondTime > 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime > 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime;
    },
    setDetailTime(time) {
      let detail = null;
      if (time % 1 === 0) {
        detail = "00";
      } else {
        detail = String(parseFloat(parseInt(time * 100) / 100)).split(".")[1]; // 秒
      }
      if (String(detail).length === 1) {
        detail = String(detail + "0");
      }
      let secondTime = parseInt(time); // 秒
      let minuteTime = 0; // 分
      let hourTime = 0; // 小时
      if (secondTime >= 60) {
        //如果秒数大于60，将秒数转换成整数
        //获取分钟，除以60取整数，得到整数分钟
        minuteTime = parseInt(secondTime / 60);
        //获取秒数，秒数取佘，得到整数秒数
        secondTime = parseInt(secondTime % 60);
        //如果分钟大于60，将分钟转换成小时
        if (minuteTime >= 60) {
          //获取小时，获取分钟除以60，得到整数小时
          hourTime = parseInt(minuteTime / 60);
          //获取小时后取佘的分，获取分钟除以60取佘的分
          minuteTime = parseInt(minuteTime % 60);
        }
      }
      hourTime = hourTime < 10 ? String("0" + hourTime) : hourTime;
      minuteTime = minuteTime < 10 ? String("0" + minuteTime) : minuteTime;
      secondTime = secondTime < 10 ? String("0" + secondTime) : secondTime;
      return hourTime + ":" + minuteTime + ":" + secondTime + "." + detail;
    },
    timeMove() {
      const timeMove = document.getElementsByClassName("blueBg")[0];
      if (this.clickMsg === "打出点") {
        // 添加结束时间
        const currentBox = this.cutCoverList[this.cutCoverList.length - 1];
        const start = this.getCountS(currentBox.startTime);
        const end = this.getCountS(
          this.getStartEndTime(
            parseFloat(currentBox.left) + parseFloat(currentBox.width)
          )
        );
        if (end - start < 3) {
          this.$message.error("最短剪辑3秒");
          this.clickMsg = "打入点";
          return;
        }
        currentBox.endTime = this.getStartEndTime(
          parseFloat(currentBox.left) + parseFloat(currentBox.width)
        );

        clearInterval(this.clickIn);
        this.currentRunMsg = "run";
        this.running();
      } else if (this.clickMsg === "打入点") {
        clearInterval(this.timeId);
        this.currentRunMsg = "clickIn";
        this.running();

        this.clickCurrentLeft = window.getComputedStyle(timeMove).left;
        // 添加覆盖盒子
        this.$set(this.cutCoverList, this.cutCoverList.length, {
          clickFlag: true,
          text: "片段" + parseInt(parseInt(this.cutCoverList.length) + 1),
          left: parseFloat(this.clickCurrentLeft) + 40 + "px",
          width: "0px",
          startTime: this.getStartEndTime(
            parseFloat(this.clickCurrentLeft) + 40
          )
        });
      }
    },
    // 点击控制线控件
    onControl() {
      this.timeMove();
      this.clickMsg = this.clickMsg === "打入点" ? "打出点" : "打入点";
    },
    getStartEndTime(leftPX) {
      return this.setDetailTime(
        parseFloat(
          Math.floor((this.number / 100) * leftPX * 100) / 100
        ).toFixed(2)
      );
    },
    // 获取时间间隔
    getTimeBesides(str1, str2) {
      const time1 = str1.split(".")[0].split(":");
      const time2 = str2.split(".")[0].split(":");
      const hour1 = parseInt(time1[0]) * 3600;
      const min1 = parseInt(time1[1]) * 60;
      const second1 = parseInt(time1[2]);

      const hour2 = parseInt(time2[0]) * 3600;
      const min2 = parseInt(time2[1]) * 60;
      const second2 = parseInt(time2[2]);

      const timeall1 = hour1 + min1 + second1;
      const timeall2 = hour2 + min2 + second2;

      const between = timeall2 - timeall1;
      let lessHour = parseInt(between / 3600) >= 10 ? parseInt(between / 3600) : "0" + parseInt(between / 3600);
      let lessMin = parseInt((between % 3600) / 60) >= 10 ? parseInt((between % 3600) / 60) : "0" + parseInt((between % 3600) / 60);
      let lessSecond = parseInt(between % 60) >= 10 ? parseInt(between % 60) : "0" + parseInt(between % 60);

      const msStart = parseInt(str1.split(".")[1]);
      const msEnd = parseInt(str2.split(".")[1]);

      let ms = msEnd - msStart;
      if (msStart > msEnd) {
        if (parseInt(lessSecond) < 10) {
          lessSecond = "0" + String(parseInt(lessSecond) - 1)
        } else {
          lessSecond = String(parseInt(lessSecond) - 1)
        }
      }
      if (ms < 0) {
        ms = ms + 100
      }
      if (ms < 10) {
        ms = "0" + ms
      }
      return `${lessHour}:${lessMin}:${lessSecond}.${ms}`;
    },
  },
  watch: {
    timeMoveNumber(val, old) {
      this.pickedDeng.scrollLeft = val * 1600
    },
    videoLong(val, old) {
      this.maxTimeLong = (Math.floor(val / this.number) + 1) * 10;
    },
    maxTimeLong(val, old) {
      this.showCanvas();
    },
    imgWidth(val, old) {
      this.target = parseFloat(val) - 40;
    },
    scrollFlag(val, old) {
      if (val) {

      }
    }
  }
}
</script>

<style lang="less">

.back {
  background-color: #000000;
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
  float: left;
  width: 50%;
  height: 95%;
  background-color: #ffffff;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.project-main2 {
  margin-left: 10px;
  float: right;
  width: 45%;
  height: 95%;
  background-color: #ffffff;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.playVideo video {
  height: 70%;
  width: 70%;
}

footer {
  width: 100%;
  height: 200px;
  border-top: 2px solid #1d1e22;

  .menu {
    width: 100%;
    height: 40px;
    display: flex;
    justify-content: space-between;
    background: #1d1e22;

    .controlMenu {
      width: 670px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;

      > div {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 30px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;

        &::after {
          content: "";
          display: block;
          width: 1px;
          height: 20px;
          position: absolute;
          top: 5px;
          right: -10px;
          background-color: #ccc;
        }

        &:hover {
          color: #fff;
        }

        span {
          font-size: 14px;
        }
      }

      .controlBtn {
        margin: 0 0 0 20px;
        display: flex;

        &::after {
          width: 0;
        }

        button {
          color: #fff;
          border: 0;
        }

        button:nth-child(1) {
          background: -webkit-linear-gradient(#8164d0,
          #3d67cd); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(#8164d0,
          #3d67cd); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(#8164d0,
          #3d67cd); /* Firefox 3.6 - 15 */
          background: linear-gradient(#8164d0, #3d67cd); /* 标准的语法 */

          &:hover {
            background: -webkit-linear-gradient(#967fd7,
            #6282d5); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(#967fd7,
            #6282d5); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(#967fd7,
            #6282d5); /* Firefox 3.6 - 15 */
            background: linear-gradient(#967fd7, #6282d5); /* 标准的语法 */
          }
        }

        button:nth-child(2) {
          background: -webkit-linear-gradient(#fa9710,
          #ff5f1e); /* Safari 5.1 - 6.0 */
          background: -o-linear-gradient(#fa9710,
          #ff5f1e); /* Opera 11.1 - 12.0 */
          background: -moz-linear-gradient(#fa9710,
          #ff5f1e); /* Firefox 3.6 - 15 */
          background: linear-gradient(#fa9710, #ff5f1e); /* 标准的语法 */

          &:hover {
            background: -webkit-linear-gradient(#fba83a,
            #ff7d45); /* Safari 5.1 - 6.0 */
            background: -o-linear-gradient(#fba83a,
            #ff7d45); /* Opera 11.1 - 12.0 */
            background: -moz-linear-gradient(#fba83a,
            #ff7d45); /* Firefox 3.6 - 15 */
            background: linear-gradient(#fba83a, #ff7d45); /* 标准的语法 */
          }
        }
      }
    }

    .videoContorl {
      display: flex;
      color: #8c97b1;
      align-items: center;

      .timeLong {
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-right: 20px;

        em {
          font-style: normal;
          font-size: 16px;
          line-height: 30px;
          white-space: nowrap;
        }

        span {
          width: 100px;
          font-size: 18px;
          line-height: 30px;
          border: 1px solid #515257;
          border-radius: 10px;
          text-align: center;
        }
      }

      i {
        font-size: 25px;
        cursor: pointer;
        margin: 0 15px;

        &:hover {
          color: #f25915;
        }
      }
    }

    .rule {
      width: 390px;
      padding: 0 20px;
      display: flex;
      box-sizing: border-box;
      align-items: center;

      .el-slider {
        width: 150px;
      }

      > span {
        height: 30px;
        margin-right: 20px;
        position: relative;
        font-size: 22px;
        color: #707070;
        cursor: pointer;
        white-space: nowrap;
        display: flex;
        align-items: center;

        &:hover {
          color: #fff;
        }

        span {
          font-size: 14px;
        }
      }
    }
  }

  .controlLine {
    position: relative;
    width: 100%;
    height: calc(100% - 40px);
    background: #1d1e22;

    .signshowImg {
      width: 150px;
      height: 100px;
      background: #fff;
      position: absolute;
      top: -121px;
      z-index: 30;
      text-align: center;
      padding: 10px;
      transform: translateX(-50%);

      .text {
        font-size: 13px;
        color: #666;
      }

      > img {
        height: 80px;
        width: 100%;
      }

      .signDetail {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 10px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }

      .signClose {
        width: 15px;
        height: 15px;
        color: #fff;
        background-color: #e92322;
        position: absolute;
        right: 10px;
        top: 26px;
        font-size: 13px;
        text-align: center;
        line-height: 15px;
        cursor: pointer;
      }
    }

    .dyc {
      position: relative;
      overflow: auto;

      &::-webkit-scrollbar {
        height: 10px;
      }

      /*滚动条滑块*/

      &::-webkit-scrollbar-thumb {
        border-radius: 4px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: #535353;
        width: 30px;
      }

      /*滚动条轨道*/

      &::-webkit-scrollbar-track {
        box-shadow: inset 0 0 1px rgba(0, 0, 0, 0);
        border-radius: 10px;
        background: #ccc;
      }

      .canFa {
        position: relative;

        .signcircle {
          width: 8px;
          height: 8px;
          background: orange;
          border-radius: 50%;
          position: absolute;
          top: 60px;
          cursor: pointer;
        }

      }

      .imgbackground {
        left: 20px;
        height: 100px;
        background-repeat: repeat !important;
        background-size: contain !important;
        background-color: #2c2c31;
        position: relative;

        .coverlist {
          background: rgba(23, 149, 255, 0.3);
          position: absolute;
          top: 0;
          height: 100px;
          display: flex;
          flex-wrap: nowrap;
          box-sizing: border-box;
          overflow: hidden;
          border: 1px solid;

          &:hover {
            border: 1px solid #ccc;
          }

          .dragLeft {
            width: 16px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: absolute;
            left: 0;
            cursor: e-resize;
            text-align: center;
          }

          .dragRight {
            text-align: center;
            width: 16px;
            height: 100px;
            line-height: 100px;
            color: #fff;
            font-size: 14px;
            position: absolute;
            right: 0;
            cursor: w-resize;
          }

          > div {
            > div {
              font-size: 13px;
              color: #fff;
              cursor: pointer;
              width: 60px;
              margin: auto;
            }

            width: 100%;
            height: 100%;
            margin: 0 auto 0;
            padding: 20px;
            box-sizing: border-box;
            text-align: center;
            overflow: hidden;

            span {
              color: #fff;
              font-size: 14px;
              cursor: pointer;
            }
          }
        }
      }
    }

    .blueBg {
      position: absolute;
      cursor: move;
      box-sizing: content-box;
      text-align: center;
      line-height: 30px;
      width: 104.53px;
      padding: 0 10px;
      border-radius: 5px;
      top: 0;
      left: -32px;
      background: rgba(23, 149, 255);
      color: #fff;
    }

    .turnDowm {
      position: absolute;
      width: 0;
      height: 0;
      bottom: -10px;
      left: 50%;
      transform: translateX(-50%);
      border-style: solid;
      border-width: 10px 5px 0 5px;
      border-color: #007bff transparent transparent transparent;
    }

    .block {
      width: 150px;
      margin: auto;
    }
  }
}

</style>
