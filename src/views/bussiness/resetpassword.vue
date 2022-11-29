/**重置密码 */
<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <el-form-item label="已选企业：">
          <el-select
            style="width: 100%"
            v-model="form.ids"
            multiple
            @change="handlechange"
            placeholder="请选择"
          >
            <el-option
              v-for="item in options"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录密码：">
          <el-input v-model="form.password"></el-input>
        </el-form-item>
        <el-form-item label="原因备注：">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit"
          >确 定</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { resetPassword } from "@/api/bussiness/index";
export default {
  data() {
    return {
      dialogVisible: false,
      form: {},
      options: [],
    };
  },
  methods: {
    handlechange() {},
    submit() {
      resetPassword(this.form).then((res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.dialogVisible = false;
        this.$emit('reroad')
      });
    },
  },
};
</script>

<style>
</style>