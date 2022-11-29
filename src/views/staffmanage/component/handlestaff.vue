/**操作员工 */
<template>
  <el-dialog
  :close-on-click-modal='false'
    :title="status == 1 ? '停用员工' : status == 3 ? '冻结员工' : '重置密码'"
    :visible.sync="dialogVisible"
    width="60%"
  >
    <el-form
      :rules="rules"
      ref="form"
      :model="form"
      label-width="120px"
      size="small"
    >
      <el-form-item label="已选员工：">
        <el-select
          style="width: 100%"
          v-model="form.ids"
          multiple
          @change="handlechange"
          placeholder="请选择"
        >
          <el-option
            v-for="item in staffList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-if="status == 6" label="新密码：" prop="password">
        <el-input v-model="form.password"></el-input>
      </el-form-item>
      <el-form-item label="原因备注：" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
      <el-form-item label="" v-if="status == 6">
        <div>新密码将以手机短信发送至员工的手机号码</div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ActionRow('5')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { handleStaff } from "@/api/staff/index";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      status: "",
      staffList: [],
      deptList: [],
      status: "",
      rules: {
        password:[{ required: true, message: "请填写密码", trigger: "blur" }],
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },
      form: {
        remark: "",
        ids: [],
      },
    };
  },
  watch: {
    staffList(val) {},
    dialogVisible(val) {
      if (val) {
        this.form.remark = "";
      }
    },
  },
  mounted() {},
  methods: {
    ActionRow() {
      // 1停用 2启用 3冻结 4解冻 5修改部门 6重置密码 7删除员工
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.$confirm(
            `是否确定${
              this.status == 7
                ? "删除员工"
                : this.status == 3
                ? "冻结员工"
                : this.status == 1
                ? "停用员工"
                : this.status == 6
                ? "重置密码"
                : ""
            }`,
            "确定",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              let data = {};
              data.status = this.status;
              data.ids = [];
              data.ids = this.form.ids;
              data.deptId = this.form.deptId;
              data.remark = this.form.remark;
              if(data.status == 6 ){
                data.password = this.form.password
              }
              handleStaff(data).then((res) => {
                this.form.remark = "";
                this.dialogVisible = false;
                this.$emit("close");
                this.$message({
                  type: "success",
                  message: "操作成功！",
                });
              });
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        }
      });
    },
    handlechange(val) {
      this.form.ids = val;
    },
  },
};
</script>

<style>
</style>