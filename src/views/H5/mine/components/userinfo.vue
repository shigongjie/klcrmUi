<template>
  <div class="container">
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo"><i class="el-icon-arrow-left"></i></span>
      <span class="title_task">个人中心</span>
      <span></span>
    </div>
    <div class="pd">
      <div class="avatar">
        <div>
          <img :src="submitParams.avatar" alt="" />
        </div>
        <div class="name">
          <div>{{ submitParams.name }}</div>
          <div>{{ submitParams.deptName }}</div>
        </div>
      </div>
      <div>
        <div class="titleh5">基本信息</div>
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          label-position="left"
          size="small"
        >
          <el-form-item label="性别">
            <el-input
              :value="
                submitParams.sex == 0
                  ? '未知'
                  : submitParams.sex == 1
                  ? '男'
                  : '女'
              "
              disabled
            ></el-input>
          </el-form-item>

          <el-form-item label="生日">
            <el-input disabled v-model="submitParams.birthday"></el-input>
          </el-form-item>
          <el-form-item label=" 电子邮箱">
            <el-input disabled v-model="submitParams.email"></el-input>
          </el-form-item>
          <el-form-item prop="phone" label=" 手机号码">
            <el-input
              disabled
              v-model="submitParams.phone"
              oninput="this.value = this.value.replace(/\D/g, '')"
              maxlength="11"
            ></el-input>
          </el-form-item>
          <el-form-item label=" 微信账号">
            <el-input disabled v-model="submitParams.vx"></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input disabled v-model="submitParams.specialPlane"></el-input>
          </el-form-item>
          <div class="titleh5">更多信息</div>
          <el-form-item label="工号">
            <el-input disabled v-model="submitParams.empnoId"></el-input>
          </el-form-item>
          <el-form-item label="籍贯">
            <el-input disabled v-model="submitParams.origo"></el-input>
          </el-form-item>
          <el-form-item label="毕业院校">
            <el-input disabled v-model="submitParams.schoolTag"></el-input>
          </el-form-item>
          <el-form-item label="学历">
            <el-input disabled v-model="submitParams.educationType"></el-input>
          </el-form-item>
          <el-form-item label="所学专业">
            <el-input disabled v-model="submitParams.professional"></el-input>
          </el-form-item>
        </el-form>
        <!-- <div class="btn" @click="layout">退出登录</div> -->
      </div>
    </div>
  </div>
</template>

<script>
import { getcommonuserInfo } from "@/api/system/user";
export default {
  data() {
    return {
      submitParams: {},
    };
  },
  mounted() {
    getcommonuserInfo().then((res) => {
      console.log(res);
      this.submitParams = res.data;
    });
  },
  methods: {
    layout() {},
    jumpGo() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  color: #606266;
  padding-bottom: 40px;
}
.header {
  background: rgb(136, 181, 255);
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
.title_task {
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
.pd {
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.titleh5 {
  height: 40px;
  line-height: 40px;
  font-weight: 600;
  font-size: 13px;
  padding-left: 20px;
  background: RGB(249, 249, 249);
}
::v-deep .el-input.is-disabled .el-input__inner {
  background: #ffffff;
  color: #606266;
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
  padding: 6px 20px;
  // padding-bottom: 15px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeff3;
}
::v-deep .el-input__prefix {
  display: none;
}
::v-deep .el-form-item__error {
  right: 15px;
  text-align: right;
}
::v-deep .el-radio-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  padding-right: 10px;
}
.avatar {
  background: url("~@/assets/images/userInfo.png") no-repeat;
  background-size: 100% 100%;
  height: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .name {
    margin-top: 20px;
  }
  img {
    width: 60px;
    height: 60px;
    border-radius: 50%;
  }
}
.btn {
  height: 30px;
  line-height: 30px;
  width: 90%;
  margin: auto;
  background: rgb(226, 97, 97);
  color: #ffffff;
  margin-top: 20px;
  text-align: center;
}
</style>
