<template>
  <div class="container">
    <div style="height: 54px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo" style="color: #666666;">取消</span>
      <span class="title-clue">转入公海</span>
      <span @click="submit" style="color: #2B82FC;">确认转入</span>
    </div>
    <div class="pd">
      <div class="line"></div>
      <div class="title">备注信息</div>
      <el-input
        :rows="4"
        type="textarea"
        v-model="remark"
        placeholder="请输入备注信息"
      ></el-input>
      <div class="tip">
        转移到公海后此客户数据将属于公共资源，原归属人员不能再维护跟进和更新此客户数据。
      </div>
    </div>
  </div>
</template>

<script>
import { moveIntoHighSeas } from "@/api/customer/index";
export default {
  data() {
    return {
      remark: "",
    };
  },
  methods: {
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      let ids;
      if (this.$route.query.id) {
        ids = [this.$route.query.id];
      } else if (this.$route.query.ids) {
        ids = JSON.parse(this.$route.query.ids);
      }
      moveIntoHighSeas({ ids: ids }).then((res) => {
        this.$router.push({
          path: "/customerh5",
        });
        this.$toast("操作成功");
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height:5px;
  background: RGB(249, 249, 249);
}
.container {
  height: 100%;
  // color: #606266;
  background: #f3f3f3;
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
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
    margin-left: 26px;
}
.pd {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
}
.title {
  // border-top: 1px solid #dcdfe6;
  background: #ffffff;
  font-size: 15px;
  padding: 10px 14px;
}
::v-deep .el-textarea__inner {
  // border-left: none;
  // border-right: none;
  border-radius: 0;
  // border-top: none;
  border: none;
}
.tip {
  color: #909399;
  font-size: 12px;
  padding: 10px 12px;
}
</style>