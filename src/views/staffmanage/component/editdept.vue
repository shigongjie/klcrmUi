/**修改部门 */
<template>
  <el-dialog :close-on-click-modal='false' title="修改部门" :visible.sync="dialogVisible" width="60%">
    <el-form
      ref="form"
      :model="form"
      :rules="rules"
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
      <el-form-item label="修改部门：">
        <el-cascader
          size="small"
          placeholder="请选择部门"
          :options="deptTree"
          :show-all-levels="false"
          filterable
          v-model="form.deptId"
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
        <!-- <el-select v-model="form.deptId" placeholder="部门：">
          <el-option
            v-for="(item, index) in deptList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select> -->
      </el-form-item>
      <el-form-item label="原因备注：" prop="remark">
        <el-input type="textarea" v-model="form.remark"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="ActionRow('5')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getdeptTree } from "@/api/organization/index";
import { handleStaff } from "@/api/staff/index";
export default {
  props: {},
  data() {
    return {
      dialogVisible: false,
      staffList: [],
      deptList: [],
      deptTree: [],
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },
      form: {
        ids: [],
        deptId: "",
        remark: "",
      },
    };
  },
  watch: {
    dialogVisible(val) {
      if (!val) {
        this.form.ids = [];
        this.form.deptId = "";
        this.form.remark = "";
      }
    },
    staffList(val) {
    },
  },
  mounted() {
    this.getdeptTree();
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
  },
  methods: {
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
      });
    },
    ActionRow() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          // 1停用 2启用 3冻结 4解冻 5修改部门 6重置密码 7删除员工
          this.$confirm(`是否确定修改员工对应的部门`, "确定", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              let data = {};
              data.status = 5;
              data.ids = [];
              data.ids = this.form.ids;
              data.deptId = this.form.deptId;
              data.remark = this.form.remark;
              handleStaff(data).then((res) => {
                this.$emit("closeAdd");
                this.dialogVisible = false;
                this.$message({
                  type: "success",
                  message: "操作成功!",
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

      // handleStaff();
    },
    handlechange(val) {
      this.form.ids = val;
    },
  },
};
</script>

<style>
</style>
