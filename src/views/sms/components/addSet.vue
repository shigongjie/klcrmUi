
<template>
  <div v-if="open">
    <el-dialog
      :close-on-click-modal="false"
      :title="action == 0 ? '新增短信配置' : '编辑短信配置'"
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
          <el-form-item prop="id" v-if="type == 1" label="部门">
            <el-cascader
              placeholder="请选择部门"
              :options="deptTree"
              :show-all-levels="false"
              filterable
              v-model="submitParams.id"
              :props="{
                emitPath: false,
                checkStrictly: true,
                children: 'list',
                label: 'name',
                value: 'id',
              }"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>

          <el-form-item prop="id" v-if="type == 0" label="员工">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.id"
              @change="changeUser"
              :options="userList"
              :show-all-levels="false"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>

          <el-form-item prop="noteDays" label="每天短信条数">
            <el-input
              @input="change2"
              v-model="submitParams.noteDays"
              placeholder="每天短信条数"
            ></el-input>
          </el-form-item>

          <el-form-item prop="noteMonth" label="每月短信条数">
            <el-input
              @input="change2"
              v-model="submitParams.noteMonth"
              show-word-limit
              placeholder="每月短信条数"
            ></el-input>
          </el-form-item>

          <el-form-item prop="status" label="状态">
            <el-switch
              v-model="submitParams.status"
              active-color="#13ce66"
              inactive-color="#ff4949"
              active-text="开启"
              inactive-text="关闭"
            >
            </el-switch>
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
import {
  saveNoteConfig,
  getNoteConfigById,
  updateNoteConfig,
} from "@/api/smsSet/index";
import { getdeptTree } from "@/api/organization/index";
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
      type: "",
      editId: "",
      deptTree: [],
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
        id: [{ required: true, message: "请选择", trigger: "change" }],
        userId: [{ required: true, message: "请选择员工", trigger: "change" }],
        status: [{ required: true, message: "请选择状态", trigger: "change" }],
        noteDays: [
          { required: true, message: "请输入每天短信条数", trigger: "blur" },
        ],
        noteMonth: [
          { required: true, message: "请输入每月短信条数", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    open(val) {
      if (!val) {
        this.submitParams.status = "";
        this.submitParams.noteDays = "";
        this.submitParams.noteMonth = "";
        this.submitParams.id = "";
      } else {
        if (this.editId != "") {
          console.log(this.editId);
          getNoteConfigById({ id: this.editId }).then((res) => {
            this.submitParams = res.data;
            this.submitParams.status = res.data.status == 1 ? true : false;
          });
        }
      }
    },
  },
  mounted() {
    this.getdeptTree();
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    this.isEdit();
  },
  methods: {
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
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
          let data = {};
          data.status = this.submitParams.status ? 1 : 0;
          data.type = this.type;
          data.noteDays = this.submitParams.noteDays;
          data.noteMonth = this.submitParams.noteMonth;
          data.id = this.submitParams.id;
          console.log(data);
          if (this.editId) {
            updateNoteConfig(data).then((res) => {
              this.$message({
                message: "修改成功",
                type: "success",
              });
              this.open = false;
              this.$emit("reload");
            });
          } else {
            saveNoteConfig(data).then((res) => {
              this.$message({
                message: "新增成功",
                type: "success",
              });
              this.open = false;
              this.$emit("reload");
            });
          }
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
