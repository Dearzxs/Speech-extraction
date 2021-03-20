<template>
  <div class="back_test">
    <el-table
      :data="tableData"
      style="width: 100%"
      max-height="250">
      <el-table-column
        label="时间"
        width="80">
        <template slot-scope="scope">
          <span>{{ scope.row.beginTime }}::{{scope.row.endTime}}</span>
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
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button size="mini" @click.native="handleEdit(scope.$index, scope.row)" v-if="!showBtn[scope.$index]">编辑</el-button>
          <el-button size="mini" type="success" @click="handleUpdate(scope.$index, scope.row)" v-if="showBtn[scope.$index]">保存</el-button>
          <el-button size="mini" type="danger" @click="handleCancel(scope.$index, scope.row)" v-if="showBtn[scope.$index]">取消</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row>
      <el-button size="small" type="success" @click="submitForm()">提交</el-button>
    </el-row>
  </div>


</template>

<script>
export default {
  name: "Test",
  data() {
    return {
      tableData: [],
      editData: [],
      showEdit: [], //显示编辑框
      showBtn: [],
      showBtnOrdinary: true
    }
  },
  mounted() {
    this.getData();
  },
  methods: {
    getData(){
      this.tableData = this.$route.query.data
    },
    submitForm() {
      console.log(this.editData);
    },
    //点击编辑
    handleEdit(index, row) {
      this.showEdit[index] = true;
      this.showBtn[index] = true;
      this.$set(this.showEdit,index,true)
      this.$set(this.showBtn,index,true)
    },
    //点击取消
    handleCancel(index, row) {
      this.$set(this.showEdit,index,false)
      this.$set(this.showBtn,index,false)
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
      this.$set(this.showEdit,index,false)
      this.$set(this.showBtn,index,false)
    },
  },

}
</script>

<style scoped>

.back_test {
  border: 1px solid #DCDFE6;
  width: 600px;
  height: 300px;
  margin: 180px auto;
  padding: 35px 35px 15px 35px;
  border-radius: 5px;
  -webkit-border-radius: 5px;
  -moz-border-radius: 5px;
  box-shadow: 0 0 25px #909399;
}
</style>
