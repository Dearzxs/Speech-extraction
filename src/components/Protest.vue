<template>
    <el-button @click="sendParams" v-loading.fullscreen.lock="loading">传递</el-button>
</template>

<script>

export default {
  name: "Protest",
  data() {
    return {
      tableData: [],
      loading: false           //加载loading
    }
  },
  mounted() {
  },
  methods: {
    sendParams() {
      this.loading=true;
      this.$axios.post('/example/find/post').then((res) => {
        console.log('获取json成功');
        console.log(res.data)
        this.tableData = res.data;
        this.loading = false;
      });
      this.$router.push({
        path: '/test',
        query: {
          data: this.tableData
        }
      })
    },
  },
}
</script>

<style scoped>

</style>
