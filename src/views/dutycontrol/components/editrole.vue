<template>
  <el-dialog
    :title="id == '' ? '新增职务' : '编辑职务'"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal='false'
  >
    <el-form
      :model="submitParams"
      :rules="rules"
      ref="queryForm"
      label-width="80px"
    >
      <el-form-item prop="name" label="职务名称">
        <el-input
          v-model="submitParams.name"
          placeholder="请输入职务名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item prop="description" label="部门描述">
        <el-input
          maxlength="300"
          show-word-limit
          v-model="submitParams.description"
          placeholder="请输入部门描述"
          size="small"
          type="textarea"
        />
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { rolesave } from "@/api/role/index";
export default {
  data() {
    return {
      id: "",
      dialogVisible: false,
      submitParams: {
        name: "",
        description: "",
      },
      rules: {
        name: [{ required: true, message: "请输入职务名称", trigger: "blur" }],
      },
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.submitParams.id = "";
        this.submitParams.name = "";
        this.submitParams.description = "";
      }
    },
  },
  methods: {
    submit() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          if (this.id != "") {
            this.submitParams.id = this.id;
          }
          rolesave(this.submitParams).then((res) => {
            this.$emit("reroad");
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>