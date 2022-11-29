<template>
  <el-dialog
    :title="statusType == 0 ? '停用' : '启用'"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal='false'
  >
    <el-form :model="submitParams" ref="queryForm" label-width="80px">
      <el-form-item prop="realName" label="职务名称">
        <el-input
          disabled
          v-model="submitParams.name"
          placeholder="请输入职务名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item
        prop="realName"
        :label="statusType == 0 ? '停用原因' : '启用原因'"
      >
        <el-input
          v-model="submitParams.remark"
          placeholder="请输入原因"
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
import { updateStatus } from "@/api/role/index";
export default {
  data() {
    return {
      id: "",
      statusType: 0, //停用or启用
      dialogVisible: false,
      submitParams: {
          remark:''
      },
    };
  },
  watch:{
      dialogVisible(val){
          if(val){
              this.submitParams.remark = ''
          }
      }
  },
  methods: {
    submit() {
      this.submitParams.id = this.id;
      updateStatus(this.submitParams).then((res) => {
        this.$emit('reroad')
        this.dialogVisible = false
      });
    },
  },
};
</script>

<style>
</style>