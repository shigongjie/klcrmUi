/**新建线索222*/
<template>
  <div v-if="open">
    <el-dialog
      :title="action == 0 ? '添加线索' : '编辑线索'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal='false'
    >
      <div style="width:60%;margin:auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          size="small"
        >
          <el-form-item label="客户名称">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="联系人姓名">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入联系人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="尊称">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="角色">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="部门职务">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="手机号码">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入固定电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="传真号码">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入传真号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入电子邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信账号">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入微信账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ号码">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入QQ号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="线索来源">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="归属人员">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="创建跟进">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="下次跟进">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进内容">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入跟进内容"
            ></el-input>
          </el-form-item>
          <el-form-item label="跟进人员">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="任务提醒">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="提醒方式">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入客户名称"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">提交</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { saveStaff, getInfo } from "@/api/staff/index";
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
  },
  data() {
    return {
      headers: {
        Authorization: getToken(),
      },
      submitParams: {},
      open: false,
      fileList: [],
      deptList: [],
      educationList: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
    };
  },
  beforeMount() {
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
    });
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          // // 所在地区回显
          // this.submitParams.address = this.submitParams.address
          //   .split(",")
          //   .map((item) => {
          //     return +item;
          //   });
          this.submitParams.education = this.submitParams.education + "";
          // this.submitParams.industry = this.submitParams.industry + "";
        });
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.avatar = data.data;
    },
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          // this.submitParams.address = this.submitParams.address.toString();
          saveStaff(this.submitParams).then((res) => {
            if (this.id) {
              this.$emit("closeEdit");
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$emit("closeAdd");
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }
            this.open = false;
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
.selfFrom {
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
