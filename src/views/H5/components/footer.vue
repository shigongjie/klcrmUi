<template>
  <div class="footer">
    <div
      :class="item.path == $route.path ? 'coloractive' : ''"
      class="footerCard"
      v-for="(item, index) in meunList"
      :key="index"
      @click="jump(item.path)"
    >
      <div><i :class="item.icon"></i></div>
      <div>{{ item.name }}</div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      meunList: [
        {
          name: "首页",
          icon: "el-icon-house",
          path: "/home",
        },
        {
          name: "CRM",
          icon: "el-icon-help",
          path: "/crm",
        },
        {
          name: "办公",
          icon: "el-icon-suitcase-1",
          path: "/offich5",
        },
        {
          name: "消息",
          icon: "el-icon-chat-line-round",
          path: "/messageh5",
        },
        {
          name: "我的",
          icon: "el-icon-user",
          path: "/mine",
        },
      ],
    };
  },
  mounted() {
    console.log(this.$route);
  },
  methods: {
    jump(path) {
      this.$router.push({
        path: path,
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  border-top: 1px solid #dcdfe6;
  height: 70px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: #ffffff;
//   padding: 15px 0px 25px 0px;
}
.footerCard {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  i {
    font-size: 28px;
    margin-bottom: 4px;
  }
}
.coloractive {
  color: #2a81fc;
}
</style>
