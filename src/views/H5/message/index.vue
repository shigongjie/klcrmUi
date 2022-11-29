<template>
  <div>
    <Navbar :title="'消息'" @jump="jumpgo" />
    <div class="container">
      <div class="header" v-if="$store.state.user.isApp != 2">
        <span class="titleH5">消息</span>
      </div>
      <div
        class="pd"
        :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
      >
        <div class="listCard" @click="jumpmessageDetail">
          <div class="icon_div">
            <img src="@/assets/images/message3x.png" alt="" />
          </div>
          <div class="text">
            <div>提醒消息</div>
            <div class="detail" v-if="list.length == 0">暂无消息</div>
            <div class="detail" v-else>{{ list[0].content }}</div>
          </div>
          <div class="right_div" v-if="sum > 0">
            <span class="notic">{{ sum }}</span>
            <span><i class="el-icon-arrow-right"></i></span>
          </div>
        </div>

        <div class="listCard" @click="jumptodoDetail">
          <div class="icon_div">
            <img src="@/assets/images/todo.png" alt="" />
          </div>
          <div class="text">
            <div>待办事项</div>
            <div class="detail">全部待办</div>
          </div>
          <div class="right_div"></div>
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  </div>
</template>


<script>
import { getMessage } from "@/api/common/index";
import Footer from "../components/footer.vue";
import Navbar from "../components/navbar.vue";
export default {
  components: { Footer, Navbar },
  data() {
    return {
      list: [],
      sum: "",
      isApp: 1,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    getMessage().then((res) => {
      this.list = res.data.message;
      this.sum = res.data.noRead;
    });
  },
  methods: {
    jumpgo() {
      this.$router.push("/home");
    },
    jumptodoDetail() {
      this.$router.push("/home");
    },
    jumpmessageDetail() {
      this.$router.push("/messagelisth5");
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  height: 100%;
  color: #606266;
}
.header {
  font-size: 13px;
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
  border-bottom: 1px solid #ebeff3;
  .titleH5 {
    font-size: 17px;
    font-weight: 600;
  }
}
.pd {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.listCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid #ebeff3;
  background: #ffffff;
  padding: 10px 10px;
}
.icon_div {
  width: 42px;
  height: 42px;
  line-height: 50px;
  margin-right: 10px;
  color: #606266;
  text-align: center;
  img {
    width: 42px;
    height: 42px;
    border-radius: 50%;
  }
}
.right_div {
  width: 50px;
  text-align: center;
  display: flex;
  align-items: center;
  .notic {
    display: block;
    width: 30px;
    font-size: 12px;
    height: 20px;
    background: rgba(236, 66, 66, 0.877);
    line-height: 20px;
    color: #ffffff;
    border-radius: 10px;
    margin-right: 10px;
  }
}
.text {
  flex: 1;
  font-size: 14px;
  .detail {
    font-size: 12px;
    color: #909399;
    margin-top: 6px;
  }
}
</style>
