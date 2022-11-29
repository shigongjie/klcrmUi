<template>
  <div class="h5-container">
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo"><i class="el-icon-arrow-left"></i></span>
      <span class="title_msg">消息</span>
      <span></span>
    </div>
    <div class="pd">
      <div class="nodata" v-if="list.length == 0">
        <i class="el-icon-hot-water"></i>
        暂无数据
      </div>
      <div @click="toast" class="messageCard" v-for="(item, index) in list" :key="index">
        <div v-if="item.isRead == 0" class="brdge"></div>
        <div> {{  item.content  }}</div>
        <div class="colordusty">
          {{  item.time  }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMessage, hasread } from "@/api/common/index";
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    getMessage().then((res) => {
      this.list = res.data.message;
      hasread().then((ress) => { });
    });
  },
  methods: {
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    jumpGo() {
      this.$router.go(-1);
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
}

.pd {
  // height: 100%;
  padding-top: 56px;
  background: #F3F3F3;
}

.messageCard {
  position: relative;
  // height: 75px;
  background: #FFFFFF;
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: flex-start;
  background: #ffffff;
  padding: 19px 20px;
  width: 96%;
  margin: auto;
  margin-top: 20px;
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;

  // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  .colordusty {
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    margin-top: 13px;
    color: #999999;
  }

  .brdge {
    width: 6px;
    height: 6px;
    background: red;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 50%;
  }
}

.nodata {
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 300px;
  color: #c0c4cc;

  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}

.title_msg {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  margin-left: -20px;
}
.el-icon-arrow-left{
  font-size:16px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
</style>
