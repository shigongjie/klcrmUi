<template>
  <el-dialog :close-on-click-modal='false' :title="'转移客户'" :visible.sync="open" width="60%">
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      size="small"
    >
      <el-form-item label="接受对象">
        <el-cascader
          style="width: 100%"
          v-model="submitParams.userId"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input
          type="textarea"
          v-model="submitParams.remark"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getstaffList, transfercustomer } from "@/api/customer/index";
export default {
  props: {
    ids: {},
  },
  data() {
    return {
      open: false,
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
    submit() {
      let data = {};
      data.customerIds = this.ids;
      data.remark = this.submitParams.remark;
      data.userId = this.submitParams.userId;
      transfercustomer(data).then((res) => {
        this.open = false;
        this.$message({
          type: "success",
          message: "转移成功!",
        });
        this.$emit('reload')
      });
    },
  },
};
</script>

<style>
</style>