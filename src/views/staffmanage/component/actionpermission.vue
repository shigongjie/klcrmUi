/**操作权限 */
<template>
  <div>
    <div class="warp" v-for="(item, index) in list" :key="index">
      <div class="pid">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="item.checkAll"
          @change="handleCheckAllChange(item)"
          >{{ item.name }}</el-checkbox
        >
      </div>
      <el-checkbox
        class="checkboxself"
        v-for="(items, indexs) in item.list"
        :key="indexs"
        :label="items.menuName"
        :checked="items.isSelected"
        v-model="items.isSelected"
        @change="change(items)"
      ></el-checkbox>
    </div>
    <el-form
      style="margin-top: 50px"
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="100px"
      class="demo-ruleForm"
    >
      <el-form-item label="备注" prop="remark">
        <el-input type="textarea" v-model="ruleForm.remark"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="submit" type="primary">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getStaffMenu, saveStaffMenu } from "@/api/staff/index";
export default {
  data() {
    return {
      ruleForm: {},
      checkList: [],
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },

      list: [],
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    handleCheckAllChange(ob) {
      ob.list.forEach((item, index) => {
        item.isSelected = ob.checkAll;
      });
    },
    getdata() {
      getStaffMenu({ staffId: this.$route.query.id }).then((res) => {
        this.list = res.data;
      });
    },
    submit() {
      this.$refs.ruleForm.validate((valid) => {
        if (valid) {
          let ids = [];
          this.list.forEach((i, t) => {
            if (i.list) {
              i.list.forEach((o, a) => {
                if (o.isSelected) {
                  if (!ids.includes(o.menuId)) {
                    ids.push(o.menuId);
                  }
                }
              });
            }
          });
          let data = {};
          data.ids = ids;
          data.staffId = this.$route.query.id;
          data.remark = this.ruleForm.remark;
          saveStaffMenu(data).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getdata();
          });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    change(val) {
    },
  },
};
</script>

<style lang='scss' scoped>
.warp {
  padding: 6px 12px;
  .pid {
    padding: 15px 0;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
  .checkboxself {
    margin-top: 15px;
  }
}
</style>
