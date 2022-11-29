<template>
  <el-dialog :close-on-click-modal='false' :title="'移入公海'" :visible.sync="open" width="60%">
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      size="small"
    >
      <el-form-item label="备注信息">
        <el-input
          type="textarea"
          v-model="submitParams.name"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        *
        转移到公海后此客户数据将属于公共资源，原归属人员不能再维护跟进和更新此客户数据。
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { moveIntoHighSeas } from "@/api/customer/index";

export default {
  props: {
    ids: {
      type: Array,
      default: [],
    },
  },
  data() {
    return {
      open: false,
      submitParams: {},
    };
  },
  methods: {
    submit() {
      moveIntoHighSeas({ ids: this.ids }).then((res) => {
        this.open = false;
        this.$emit('reload')
      });
    },
  },
};
</script>

<style>
</style>