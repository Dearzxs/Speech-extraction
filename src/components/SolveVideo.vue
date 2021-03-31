<template>
  <el-container class="back">
    <el-header>
      <div class="el-icon-coin"></div>
      <div class="project-name">
        {{ projectName }}
      </div>
      <div class="project-icon">
        <i class="el-icon-edit-outline"></i>
      </div>
      <div class="nav">
        <el-button size="medium" round class="project-button1" @click="login()">登录</el-button>
      </div>
    </el-header>
    <el-main>
      <div class="project-main1">
        <div class="playVideo">
          <video src="../assets/video/java.mp4" id="myVideo"></video>
        </div>
      </div>
      <div class="project-main2">
        <el-table :data="tableData" style="width: 100%" max-height="400">
          <el-table-column label="时间" width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.beginTime }}-{{ scope.row.endTime }}</span>
            </template>
          </el-table-column>
          <el-table-column label="文本" width="280">
            <template slot-scope="scope">
              <span v-if="showEdit[scope.$index]"><el-input size="mini" v-model="scope.row.text"></el-input></span>
              <span v-if="!showEdit[scope.$index]">{{ scope.row.text }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="150" fixed="right">
            <template slot-scope="scope">
              <el-button size="mini" @click="edit(scope.row,scope.$index)" v-if="!showBtn[scope.$index]">编辑</el-button>
              <el-button size="mini" type="success" @click="save(scope.row,scope.$index)" v-if="showBtn[scope.$index]">保存</el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </el-main>
    <el-button @click="submitForm">提交</el-button>
  </el-container>
</template>

<script>

export default {
  data() {
    return {
      projectName: "我的项目",
      tableData: [],
      editData: {
        videoId:'1',
        diffData: [],	// 差异
      },
      rawData: [],	// 获取表单时clone的原始数据
      showEdit: [], //显示编辑框
      showBtn: [],  //显示编辑按钮
      VideoAddress: '',
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    login() {
      this.$router.push('/Login');
    },
    getData() {
      this.tableData = this.$route.query.tableData//接收数据
      this.rawData = JSON.parse(JSON.stringify(this.tableData));//深拷贝
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
      this.diffFormData()
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

    edit(row, index) {
      console.log("传入参数为" + row.title + "和" + index)
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.$set(this.showEdit, index, true)
      this.$set(this.showBtn, index, true)
    },
    save(row, index){
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
    },
    diffFormData () {
      for (let k in this.rawData) {
        if(this.rawData.hasOwnProperty(k)){
          if (this.rawData[k].text !== this.tableData[k].text) {
            const jsonStr = {
              "beginTime":this.tableData[k].beginTime,
              "endTime":this.tableData[k].endTime,
              "text":this.tableData[k].text
            };
            this.editData.diffData.push(jsonStr)
          }
        }
      }
    },
  },
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

</style>
