/**新增编辑部门 */
<template>
  <div v-if="open">
    <el-dialog
      :close-on-click-modal="false"
      :title="action == 0 ? '新建单点外呼' : '编辑单点外呼'"
      :visible.sync="open"
      width="50%"
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
          <el-form-item prop="name" label="任务名称">
            <el-input
              v-model="submitParams.name"
              placeholder="任务名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="员工">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.userIds"
              @change="changeUser"
              :options="userList"
              :show-all-levels="false"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitdept()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getstaffList } from "@/api/customer/index";
import { saveDeptpid } from "@/api/organization/index";
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
      open: false,
      choosedUser: [],
      params: {},
      pids: [],
      userList: [],
      rules: {
        name: [
          { required: true, message: "请输入部门名称", trigger: "change" },
        ],
      },
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
  mounted() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    this.isEdit();
  },
  methods: {
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
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          this.submitParams = res.data;
        });
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.avatar = data.data;
    },
    submitdept() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.submitParams.pids) {
            this.submitParams.pid =
              this.submitParams.pids[this.submitParams.pids.length - 1];
          }
          saveDeptpid(this.submitParams).then((res) => {
            this.$message({
              message: "新增成功",
              type: "success",
            });
            this.$emit("closeEdit");
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
