<template>
  <el-dialog :close-on-click-modal='false' :title="'处理任务'" :visible.sync="open" width="50%">
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      size="small"
    >
    <el-form-item label="完成进度：" prop="remark">
         <el-slider v-model="submitParams.schedule"></el-slider>
      </el-form-item>
   
      <el-form-item label="备注：" prop="remark">
        <el-input
          v-model="submitParams.remark"
          placeholder="请输入备注"
          type="textarea"
          maxlength="300"
          :rows="4"
          show-word-limit
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
import { accomplishTask } from "@/api/task/index";
export default {
  props: {
    id: {},
    schedule:{}
  },
  data() {
    return {
      open: false,
      submitParams: {
        schedule:0
      },
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.submitParams.schedule = this.schedule
      } else {
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  mounted() {
    // getMarketClueDetailById({ id: this.id }).then((res) => {
    // });
  },
  methods: {
    submit() {
      this.submitParams.id = this.$route.query.id;
      accomplishTask(this.submitParams).then((res) => {
        this.open = false;
        this.$message({
          type: "success",
          message: "操作成功!",
        });
        this.$emit("reload");
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.el-select {
  width: 100%;
}
</style>