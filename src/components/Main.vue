<template>
  <el-container class="back">
    <el-header height="70">
      <div style="float:left;">
        <h1 style="color: #FFFFFF;margin-left: 50px">文思海辉</h1>
      </div>
      <div style="float:right;">
        <el-link :underline="false">关于我们</el-link>
        <el-link :underline="false">教程</el-link>
        <el-link :underline="false">模板库</el-link>
        <el-link :underline="false">管理</el-link>
        <el-button size="medium" round class="main-button1" style="background-color: #d7b542">注册</el-button>
        <el-button size="medium" round class="main-button1" style="background-color: transparent;margin-right: 70px">
          登录
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
        action="http://localhost:8181/file/fileUpload/ds"
        :before-upload="beforeUpload"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :auto-upload="false">
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="newSubmitForm()">上传文件</el-button>
        <div slot="tip" class="el-upload__tip">只能上传视频文件，且不超过200Mb</div>
      </el-upload>
    </el-dialog>
  </el-container>

</template>

<script>
export default {
  name: "Main",
  data() {
    return {
      dialogVisible: false,
      ruleForm: {
        name: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' },
        ]
      }
    };
  },
  methods: {
    beforeUpload (file) {
      let fd = new FormData()
      fd.append('uploadFile', file)
      this.$http.post('file/fileUpload/ds', fd).then((res) => {
        console.log('上传成功');
      }, (res) => {
        console.log(res)
      })
      return false
    },
    newSubmitForm () {
      const that = this;
      this.$refs.upload.submit();
      this.$message({
        message: '上传成功',
        type: 'success',
        onClose(){
          that.$router.push('/project');
        }
      });
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
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
  margin-left: 165px;
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
  border-radius:10px;
  border-color: #82858d;
}
</style>
