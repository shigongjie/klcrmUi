<template>
  <div class="container">
    <div style="height: 54px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo" style="color: #666666;">取消</span>
      <span class="title-clue">转移客户</span>
      <span @click="submit" style="color: #2B82FC;">确认转移</span>
    </div>
    <div class="pd">
      <div class="line"></div>
      <el-form
        class="selfForm"
        ref="rulesForm"
        :model="submitParams"
        label-width="100px"
        label-position="left"
        size="small"
      >
        <el-form-item label="接受对象">
          <el-cascader
            style="width: 100%;"
            v-model="submitParams.userId"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
      </el-form>
      <div class="title">备注信息</div>
      <el-input
        :rows="4"
        type="textarea"
        v-model="remark"
        placeholder="请输入备注信息"
      ></el-input>
    </div>
  </div>
</template>

<script>
import { getstaffList, transfercustomer } from "@/api/customer/index";
export default {
  data() {
    return {
      remark: "",
      submitParams: {},
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      let ids;
      let data = {};
      if (this.submitParams.userId == "" || this.submitParams.userId == null) {
        this.$toast.fail("选择接收对象");
        return;
      }
      if (this.$route.query.id) {
        ids = [this.$route.query.id];
      } else if (this.$route.query.ids) {
        ids = JSON.parse(this.$route.query.ids);
      }
      data.customerIds = ids;
      data.remark = this.remark;
      data.userId = this.submitParams.userId;
      transfercustomer(data).then((res) => {
        if (res.success) {
          this.$router.push({
            path: "/customerh5",
          });
          this.$toast.success("转移成功!");
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height: 5px;
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
  background: #ffffff;
  font-size: 15px;
  padding: 10px 14px;
  color: #606266;
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
  background: #ffffff;
  padding: 20px 10px;
}
::v-deep input {
  border: none;
  text-align: right;
}
::v-deep .el-select {
  width: 100%;
}
::v-deep .el-form-item {
  background: #ffffff;
  padding: 6px 14px;
  // padding-bottom: 15px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeff3;
}
::v-deep .el-form-item__label{
  font-size: 15px;
}
</style>