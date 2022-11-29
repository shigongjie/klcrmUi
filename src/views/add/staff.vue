/**新建员工 */
<template>
  <div v-if="open">
    <el-dialog
      :title="action == 0 ? '添加员工' : '编辑员工'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal='false'
    >
      <div style="width: 60%; margin: auto">
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
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">保存</el-button>
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
          if (res.data.education == null) {
            this.submitParams.education = "";
          }
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
