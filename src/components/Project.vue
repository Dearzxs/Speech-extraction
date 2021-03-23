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
        <videoView></videoView>
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
              <span>{{ scope.row.beginTime }}::{{ scope.row.endTime }}</span>
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
              <el-button size="mini" type="danger" @click="handleCancel(scope.$index, scope.row)"
                         v-if="showBtn[scope.$index]">取消
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-row>
          <el-button size="small" type="info" @click="getData()">获取数据</el-button>
          <el-button size="small" type="success" @click="submitForm()">提交</el-button>
        </el-row>
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
      projectName: "我的项目",
      tableData: [],
      editData: [],
      showEdit: [], //显示编辑框
      showBtn: [],  //显示编辑按钮
      tempText: ''
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    login() {
      this.$router.push('/login');
    },
    getData() {
      this.tableData = this.$route.query.data
    },
    submitForm() {
      console.log(this.editData);
    },
    //点击编辑
    handleEdit(index, row) {
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.$set(this.showEdit, index, true)
      this.$set(this.showBtn, index, true)
    },
    //点击取消
    handleCancel(index, row) {
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
    },
    //点击更新
    handleUpdate(index, row) {
      this.editData.push(
        {
          videoId: row.videoId,
          beginTime: row.beginTime,
          endTime: row.endTime,
          text: row.text
        }
      )
      this.$set(this.showEdit, index, false)
      this.$set(this.showBtn, index, false)
      this.$axios.post('/api/login',
        {
          editData: this.editData,
        }
      ).then(res => {
        if (res.data.message === 'SUCCESS') {
          this.$router.push('/main')
          alert('登陆成功')
        } else {
          alert('登录失败')
        }
      })
    }
  },
  components: {videoView, videoControl}
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
  width: 56%;
  height: 420px;
  background-color: #d4d1d1;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

.project-main2 {
  margin-left: 10px;
  float: right;
  width: 42%;
  height: 420px;
  background-color: #d4d1d1;
  text-align: center;
  border-radius: 10px;
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
}

</style>
