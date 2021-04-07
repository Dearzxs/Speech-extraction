<template>
  <div class="typewriter">
    <div class="typewriter-content">
      <!-- 动态变化的内容-->
      <p class="typewriter-dynamic">
          <span class="cut">
            <span class="word" v-for="(letter,index) in words" :key="index">{{ letter }}</span>
          </span>
        <!-- 模拟光标-->
        <span class="typewriter-cursor"></span>
      </p>
    </div>
  </div>
</template>


<script>
export default {
  data() {
    return {
      words: [],               //字母数组push，pop的载体
      str: "By Punk",          //str初始化
      letters: [],             //str分解后的字母数组
      order: 1,                //表示当前是第几句话
    }
  },
  watch: {                     //监听order值的变化，改变str的内容
    order() {
      if (this.order % 4 === 1) {
        this.str = "潘晨高!"
      } else if (this.order % 4 === 2) {
        this.str = "就先这样吧. "
      } else if (this.order % 4 === 3) {
        this.str = "去吃饭吧."
      } else {
        this.str = "晚上再弄了..."
      }

    }
  },
  mounted() {            //页面初次加载后调用begin()开始动画
    this.begin()
  },
  methods: {
    //开始输入的效果动画
    begin() {
      this.letters = this.str.split("")
      for (let i = 0; i < this.letters.length; i++) {
        setTimeout(this.write(i), i * 50);
      }
    },
    //开始删除的效果动画
    back() {
      let L = this.letters.length;
      for (let i = 0; i < L; i++) {
        setTimeout(this.wipe(i), i * 10);
      }
    },
    //输入字母
    write(i) {
      return () => {
        let L = this.letters.length;
        this.words.push(this.letters[i]);
        let that = this;
        if (i === L - 1) {
          that.back();
        }
      }
    },
    //擦掉(删除)字母
    wipe(i) {
      this.words.pop(this.letters[i]);
      if (this.words.length === 0) {
        this.order++;
        let that = this;
        that.begin();
      }
    },

  },
}
</script>


<style scoped lang="less">

@thePink: #000000;
.typewriter {
  margin-top: 2%;
  box-sizing: border-box;
}

.typewriter .typewriter-content {
  font-weight: bold;
  font-size: 50px;
  display: flex;
  flex-direction: row;
  letter-spacing: 2px
}

.typewriter-dynamic {
  position: relative;
}

.cut {
  color: @thePink;
}

.typewriter-cursor {
  position: absolute;
  height: 100%;
  width: 3px;
  top: 0;
  right: -10px;
  background-color: @thePink;
  animation: flash 1.5s linear infinite;
}
</style>

