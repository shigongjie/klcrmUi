<template>
  <div class="container">
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo"><i class="el-icon-arrow-left"></i></span>
      <span class="title_task">修改密码</span>
      <span></span>
    </div>
    <div class="pd">
      <van-form ref="rulesForm" @submit="surepre">
        <van-field
          v-model="user.wornPassword"
          name="旧密码"
          label="旧密码"
          placeholder="请输入旧密码"
          required
          :rules="[{ required: true, message: '请输入旧密码' }]"
        />
        <van-field
          v-model="user.newPassword"
          name="新密码"
          label="新密码"
          placeholder="请输入新密码"
          required
          :rules="[{ required: true, message: '请输入新密码' }]"
        />
        <van-field
          v-model="user.affirmPassword"
          name="确认新密码"
          label="确认新密码"
          placeholder="请确认新密码"
          required
          :rules="[{ required: true, message: '请确认新密码' }]"
        />
      </van-form>
      <!-- <el-form
        class="selfForm"
        ref="rulesForm"
        :model="user"
        label-width="100px"
        label-position="right"
        size="small"
        :rules="rules"
      >
        <el-form-item label="旧密码" prop="wornPassword">
          <el-input
            v-model="user.wornPassword"
            placeholder="请输入旧密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label=" 新密码" prop="newPassword">
          <el-input
            v-model="user.newPassword"
            placeholder="请输入新密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
        <el-form-item label=" 确认新密码" prop="affirmPassword">
          <el-input
            v-model="user.affirmPassword"
            placeholder="请确认密码"
            type="password"
            show-password
          ></el-input>
        </el-form-item>
      </el-form> -->
      <div class="btn" @click="surepre">确认修改</div>
    </div>
    <el-dialog
      title="确认修改"
      :visible.sync="layoutDia"
      width="300px"
      top="30%"
    >
      <span>确定修改密码吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click.native="layoutDia = false"
          >取 消</el-button
        >
        <el-button size="mini" type="primary" @click.native="sure"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { resetpassword } from "@/api/system/user";
export default {
  data() {
    const equalToPassword = (rule, value, callback) => {
      if (this.user.newPassword !== value) {
        callback(new Error("两次输入的密码不一致"));
      } else {
        callback();
      }
    };
    return {
      layoutDia: false,
      user: {
        wornPassword: undefined,
        newPassword: undefined,
        affirmPassword: undefined,
      },
      rules: {
        wornPassword: [
          { required: true, message: "旧密码不能为空", trigger: "blur" },
        ],
        newPassword: [
          { required: true, message: "新密码不能为空", trigger: "blur" },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        affirmPassword: [
          { required: true, message: "确认密码不能为空", trigger: "blur" },
          { required: true, validator: equalToPassword, trigger: "blur" },
        ],
      },
      submitParams: {},
    };
  },
  methods: {
    surepre() {
      this.$refs.rulesForm
        .validate()
        .then((res) => {
          this.layoutDia = true;
        })
        .catch((err) => {});
      // this.$refs["rulesForm"].validate((valid) => {
      //   if (valid) {
      //     this.layoutDia = true;
      //   }
      // });
    },
    sure() {
      // this.$refs["rulesForm"].validate((valid) => {
      //   if (valid) {
          resetpassword(this.user).then((response) => {
            this.layoutDia = false;
            this.$modal.msgSuccess("修改成功");
            this.$store.dispatch("LogOut").then(() => {
              location.href = "/index";
            });
          });
        // }
      // });
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
  padding-bottom: 40px;
}
::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 30vh !important;
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
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
// ::v-deep input {
//   border: none;
//   text-align: right;
// }：：
::v-deep .van-form{
  margin-top: 5px;
}
::v-deep .el-form-item {
  background: #ffffff;
  padding: 6px 10px;
  // padding-bottom: 15px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeff3;
}
.btn {
  height: 40px;
  line-height: 40px;
  width: 90%;
  margin: auto;
  background: #409eff;
  color: #ffffff;
  margin-top: 20px;
  text-align: center;
  font-size: 13px;
}
</style>
