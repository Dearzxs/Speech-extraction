<template>
  <div>
    <el-button @click="updateInfo">提交</el-button>
    <el-table :data="tableDates">
      <el-table-column label="title">
        <template slot-scope="scope">
          <span>{{ scope.row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column label="text">
        <template slot-scope="scope">
          <span v-if="showEdit[scope.$index]"><el-input size="mini" v-model="scope.row.text"></el-input></span>
          <span v-if="!showEdit[scope.$index]">{{ scope.row.text }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button @click="edit(scope.row,scope.$index)" v-if="!showBtn[scope.$index]">编辑</el-button>
          <el-button @click="save(scope.row,scope.$index)" v-if="showBtn[scope.$index]">保存</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>
<script>
import Vue from 'vue'

export default {
  data() {
    return {
      tableDates: [],
      rawData: [],	// 获取表单时clone的原始数据
      diffData: [],	// 差异
      showEdit: [], //显示编辑框
      showBtn: [],  //显示编辑按钮
    }
  },
  mounted() {
    this.tableDates = [
      {title: '标题1', text: 's111'},
      {title: '标题2', text: 's222'},
    ]
    this.rawData = JSON.parse(JSON.stringify(this.tableDates));
  },
  methods: {
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
           console.log("源数据为:"+this.rawData[k].text+",提交数据为:"+this.tableDates[k].text)
          if (this.rawData[k].text !== this.tableDates[k].text) {
            const jsonStr = {"title":this.tableDates[k].title,"text":this.tableDates[k].text};
            this.diffData.push(jsonStr)
          }
         }
      }
    },
    updateInfo () {
      this.diffFormData()
      if (!this.diffData) {
        this.$message.error('未修改任何数据，无需提交')
      } else {
        this.$message.success('修改了数据，提交成功')
        console.log(this.diffData)
      }
    }
  },
}
</script>
