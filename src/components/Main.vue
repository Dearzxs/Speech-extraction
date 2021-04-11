<template>
  <el-container class="back">
    <el-header height="70">
      <div style="float:left;">
        <h1 style="color: #FFFFFF;margin-left: 50px">文思海辉</h1>
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">教程</el-link>
        <el-link href="http://localhost:8081/auditCount" :underline="false">审计</el-link>
        <el-button size="medium" round class="main-button1" style="background-color: transparent;margin-right: 70px">
          admin
        </el-button>
      </div>
    </el-header>
    <el-main>
      <div class="main-p-1">
        <p>在这里</p>
        <p>轻松掌握视频剪辑的技能</p>
      </div>
      <div class="main-p-2">
        <p>音频转化文本</p>
        <p>高效修改音频</p>
        <p>适用多种格式视频</p>
      </div>
      <div>
        <el-button class="main-button2" @click="dialogVisible = true">开始使用</el-button>
      </div>
    </el-main>

    <el-dialog title="新建项目" :visible.sync="dialogVisible" width="30%" :modal-append-to-body='false'>
      <el-upload
        class="upload-demo"
        ref="upload"
        :on-change="changFile"
        :on-remove="handleRemove"
        :file-list="fileList"
        action=""
        :auto-upload="false"
        multiple
        :limit="5"
        >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" @click="solveData()">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过30min</div>
      </el-upload>
    </el-dialog>
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
      dialogVisible: false,
      uploadVisible: false,
      loading: false,
      fileList: [],
      uploadForm:null,
      tips: '',

      processInfo: "正在进行视频语音提取",
      percent: 0,
      ifUp: true,
    };
  },
  mounted() {
    const timer = setInterval(() =>{
      if (this.ifUp) {
        this.percent = this.percent + 1
        if(this.percent === 5) this.processInfo="视频分片成功"
        if(this.percent === 10) this.processInfo="正在分片处理"
        if(this.percent === 30) this.processInfo="第一片处理完成"
        if(this.percent === 50) this.processInfo="第二片处理完成"
        if(this.percent === 70) this.processInfo="第三片处理完成"
        if(this.percent === 90) this.processInfo="正在存储文本"
        if(this.percent === 100){
          this.processInfo = "文本存储完成"
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
    changFile(file, fileList) {
      // console.log(fileList);
      //选择文件后，给fileList对象赋值
      this.fileList = fileList;
    },
    handleRemove(file, fileList) {
      //删除文件后，给fileList对象赋值
      this.fileList = fileList;
    },

    solveData() {
      this.dialogVisible=false;
      this.uploadVisible=true;
      this.uploadForm = new FormData();
      for (let i = 0; i < this.fileList.length; i++) {
        this.uploadForm.append('uploadFile', this.fileList[i].raw);
      }
      const userId = sessionStorage.getItem('userId');
      // this.uploadForm.append("userId", userId);
      this.uploadForm.append("userId", "admin");
      this.$axios.post('file/fileUpload/ds', this.uploadForm).then((res) => {
        if (res.status === 200) {
          const jsonArr = res.data.textParaList;
          const originalVideo = res.data.originalVideo;
          sessionStorage.setItem('sourceText', JSON.stringify(jsonArr));
          this.$message({
            type: "success",
            message: "上传成功"
          });
          this.uploadVisible=false;
          this.$router.push('/solveVideo');
        }
        else{
          this.uploadVisible=false;
          this.$message({
            type: "error",
            message: "解析失败，请重新上传"
          });
        }
      }).catch(err => {
        console.log(err);
        this.uploadVisible=false;
        this.$message({
          type: "error",
          message: "发送请求失败，请检查网络连接"
        });
      });
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
  }
}
</script>

<style scoped>
.back {
  background-color: #000000;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
}

.main-p-1 {
  letter-spacing: 8px;
  margin-left: 150px;
  margin-top: 120px;
  color: #FFFFFF;
  font-size: 32px;
}

.main-p-2 {
  margin-left: 150px;
  margin-top: 80px;
  color: #FFFFFF;
  font-size: 14px;
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

.main-button1 {
  width: 140px;
  height: 45px;
  font-size: 18px;
  color: #FFFFFF;
}

.main-button2 {
  margin-left: 150px;
  margin-top: 45px;
  width: 150px;
  height: 50px;
  font-size: 19px;
  color: #FFFFFF;
  background-color: #d7b542;
  border-radius: 10px;
}

.block {
  margin: 30px 10px 5px 10px;
}

.el-image {
  margin-right: 10px;
  border-style: solid;
  border-width: 1px;
  border-radius: 10px;
  border-color: #82858d;
}
</style>
