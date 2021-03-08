<template>
  <div class="all">
    <el-upload class="upload-demo"
               name="uploadFile"
               drag
               action="123"
               :before-upload="beforeUpload"
               :on-success="onSuccess"
               :on-error="onError"
               multiple
               ref="newupload"
               :auto-upload="false"
    >
      <i class="el-icon-upload"></i>
      <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em>     </div>
      <!-- <div class="el-upload__tip" slot="tip">请注意您只能上传.mp4 .flv .mov格式的视频文件</div> -->
    </el-upload>
    <div class="demo-input-suffix">
      <el-input
        placeholder="请输入项目id"
        prefix-icon="el-icon-search"
        v-model="project_id">
      </el-input>
      <br>
      <el-input
        placeholder="请输入版本号"
        prefix-icon="el-icon-search"
        v-model="version_id">
      </el-input>
    </div>
    <br>
    <el-button type="primary" @click="newSubmitForm()" class="yes-btn" icon="importDataBtnIcon">
      {{importDataBtnText}}
    </el-button>
    <!-- <el-button @click="resetForm('newform')">
      重 置
    </el-button> -->
  </div>
</template>

<script>
export default {
  data() {
    return {
      project_id:"",
      version_id:"",
      importDataBtnText:'点击上传',
      importDataBtnIcon:'el-icon-upload2',
      importDataDisabled:'true',
    };
  },
  methods: {
    onSuccess(response, file, fileList){
      this.importDataBtnText='导入成功';
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataDisabled='false';
    },
    onError(err, file, fileList){
      this.importDataBtnText='导入失败';
      this.importDataBtnIcon='el-icon-upload2';
      this.importDataDisabled='false';
    },
    // beforeUpload (file) {
    //   console.log(file)
    //   let fd = new FormData()
    //   fd.append('file', file)
    //   fd.append('groupId', this.groupId)
    //   // console.log(fd)
    //   // this.newVideo(fd).then(res => {
    //   //   console.log(res)
    //   this.newVideo(fd)
    //   //})
    //   return true
    // },
    beforeUpload (file) {
      this.importDataBtnText='正在导入';
      this.importDataBtnIcon='el-icon-loading';
      this.importDataDisabled='false';
      console.log(file)
      let fd = new FormData()
      fd.append('uploadFile', file)
      fd.append('project_id', this.project_id)
      fd.append('version_id', this.version_id)
      this.$http.post('file/fileUpload/ds', fd).then((res) => {
        this.importDataBtnText='导入成功';
      }, (res) => {
        this.importDataBtnText='导入失败';
        console.log(res)
      })
      return false
    },
    newSubmitForm () {
      this.$refs.newupload.submit()
    },

    newVideo (data) {
      console.log("我进这个方法了haha");
      this.$axios({
        method: 'post',
        url: 'file/fileUpload/ds',
        timeout: 20000,
        data: data
      })
    },
  }
};
</script>

<style >
.all {
  width: 90%;
  margin: 0 auto;
  padding-top: 100px;
}
.demo-input-suffix{
  width:30%;
}
</style>
