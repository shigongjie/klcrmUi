/**新增编辑部门 */
<template>
  <div v-if="open">
    <el-dialog
      :close-on-click-modal="false"
      :title="'在线充值'"
      :visible.sync="open"
      width="700px"
    >
      <div style="width: 80%; margin: auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="120px"
          size="small"
          :rules="rules"
        >
          <el-form-item prop="name" label="企业名称：">
            <!-- <el-input
              v-model="submitParams.name"
              placeholder="任务名称"
            ></el-input> -->
            {{ $store.state.user.companyName }}
          </el-form-item>
          <el-form-item prop="name" label="生效时间："> 次月 </el-form-item>
          <el-form-item prop="name" label="套餐详情："
            >{{ detail.detail }}
          </el-form-item>
          <el-form-item prop="name" label="支付金额："
            >{{ detail.price }}
          </el-form-item>
          <el-form-item prop="name" label="支付渠道：">
            <div>
              <el-radio-group v-model="submitParams.radio">
                <el-radio label="1" border>
                  <img class="" src="@/assets/images/zfb.png" alt="" />
                  <span class="name">支付宝</span>
                </el-radio>
                <el-radio label="2" border>
                  <img class="" src="@/assets/images/vx.png" alt="" />
                  <span class="name">微信</span>
                </el-radio>
                <el-radio label="3" border>
                  <!-- <img class="" src="@/assets/images/usage.png" alt="" /> -->
                  <span class="padding0">诚聊通</span>
                </el-radio>
              </el-radio-group>
            </div>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitdept()">充值</el-button>
      </span>
    </el-dialog>
    <el-dialog
      style="margin-top: 200px"
      :visible.sync="dialogVisible"
      width="240px"
    >
      <el-image style="width: 200px" :src="src"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { rechargeconfig } from "@/api/sms/package";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    action: {
      type: Number,
      default: 0,
    },
    choosedDept: {},
  },
  data() {
    return {
      dialogVisible: false,
      src: "",
      isDisabled: false,
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      submitParams: {
        pids: [],
      },
      detail: {},
      open: false,
      choosedUser: [],
      params: {},
      pids: [],
      userList: [],
      rules: {},
    };
  },
  watch: {
    open(val) {
      if (!val) {
        this.submitParams.userId = "";
        this.submitParams.pids = "";
        this.submitParams.name = "";
        this.submitParams.description = "";
        this.submitParams.userIds = "";
      } else {
        if (this.choosedDept) {
          this.submitParams.pids = this.choosedDept;
        }
      }
    },
  },
  created() {
    window.rechargeSuccess = this.rechargeSuccess;
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    rechargeSuccess() {
      this.dialogVisible = false;
      //   this.src = res.data;
      this.$message({
        message: "充值成功",
        type: "success",
      });
    },
    changeUser() {},
    change(e) {
      this.$forceUpdate();
    },
    change2(e) {
      this.$forceUpdate();
    },
    handlechange(val) {
      this.submitParams.pids = val;
    },
    // 是否编辑
    geteditData(val) {
      this.submitParams.id = val.row.id;
      this.submitParams.pids = val.row.pidList;
      this.submitParams.name = val.row.name;
      this.submitParams.description = val.row.description;
      this.submitParams.userIds = val.row.userIds;
      if (val.row.pid == 0) {
        this.isDisabled = true;
      } else {
        this.isDisabled = false;
      }
    },
    isEdit() {},
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.avatar = data.data;
    },
    submitdept() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          let data = {};
          data.payWay = 1;
          data.id = this.detail.id;
          rechargeconfig(data).then((res) => {
            if (res.success) {
              this.dialogVisible = true;
              this.src = res.data;
              //   this.$message({
              //     message: "充值成功",
              //     type: "success",
              //   });
            }

            // this.open = false;
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.selfForm {
  .title {
    padding-bottom: 20px;
  }
  padding: 20px;
  img {
    width: 16px;
    height: 16px;
    position: absolute;
  }
  .name {
    padding-left: 20px;
  }
  .padding0 {
    padding-left: 0;
  }
  .el-form-item__label {
    font-weight: 400 !important;
  }
}
.formDiv {
  width: 50%;
  padding: 0 20px;
}
.titleself {
  font-weight: 600;
  padding: 10px;
  height: 5px;
  font-size: 16px;
  line-height: 3px;
  border-left: 4px solid #3394fe;
  margin-bottom: 20px;
  //   margin-left: -10px;
}
</style>
