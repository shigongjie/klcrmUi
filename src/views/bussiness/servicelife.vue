/**使用期限 */
<template>
  <div>
    <el-dialog title="提示" :visible.sync="dialogVisible" width="60%">
      <el-form ref="form" :model="form" label-width="120px" size="small">
        <el-form-item label="已选企业：" v-if="chooseCompany.length > 0">
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
        <el-form-item label="设置期限：">
          <el-date-picker
            style="width: 100%"
            v-model="form.period"
            type="date"
            placeholder="选择日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="原因备注：">
          <el-input type="textarea" v-model="form.remark"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { setPeriod } from "@/api/bussiness/index";
export default {
  props: {
    chooseCompany: {
      type: Array,
      default: () => {
        return [];
      },
    },
    ids: {},
  },
  data() {
    return {
      dialogVisible: false,
      form: {},
      options: [],
    };
  },
  mounted() {},
  methods: {
    handlechange(val) {
    },
    submit() {
      if(this.chooseCompany.length<=0){
        this.form.ids=[this.ids.id]
      }
      setPeriod(this.form).then((res) => {
        this.$message({
          type: "success",
          message: "设置成功!",
        });
        this.dialogVisible = false;
        this.$emit("reroad");
      });
    },
  },
};
</script>

<style>
</style>