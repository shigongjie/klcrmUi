/**字段权限 */
<template>
  <div>
    <div class="tip">
      <div style="margin-bottom: 20px">
        <i>字段权限</i>（通过字段权限设置该角色对某些字段不可见）
      </div>
      <el-radio-group v-model="fieldType">
        <el-radio :label="0">对所有数据生效</el-radio>
        <el-radio :label="1">仅对负责人不是自己的数据生效</el-radio>
      </el-radio-group>
    </div>
    <div class="all">
      <div class="warp" v-for="(item, index) in list" :key="index">
        <div class="pid">{{ item.name }}</div>
        <div
          v-for="(items, indexs) in item.list"
          :key="indexs"
          class="each_card"
        >
          <div class="field_name">{{ items.fieldName }}</div>
          <el-checkbox
            class="checkboxself"
            :label="'不可见'"
            :checked="items.status ? false : true"
            @change="change(items)"
          ></el-checkbox>
        </div>
      </div>
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
import { saveStaffField, getStaffField } from "@/api/staff/index";
export default {
  props: {
    fileType: {},
  },
  data() {
    return {
      ruleForm: {},
      checkList: [],
      fieldType: "",
      rules: {
        remark: [{ required: true, message: "请填写备注", trigger: "blur" }],
      },

      list: [],
    };
  },
  mounted() {
    this.fieldType = this.fileType;
    this.getdata();
  },
  methods: {
    getdata() {
      getStaffField({ staffId: this.$route.query.id }).then((res) => {
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
                if (!o.status) {
                  if (!ids.includes(o.id)) {
                    ids.push(o.id);
                  }
                  //   ids.push(o.id);
                }
              });
            }
          });
          let data = {};
          data.ids = ids;
          data.staffId = this.$route.query.id;
          data.remark = this.ruleForm.remark;
          data.fieldType = this.fieldType
          saveStaffField(data).then((res) => {
            this.$message({
              message: "修改成功",
              type: "success",
            });
            this.getdata();
          });
        } else {
          return false;
        }
      });
    },
    change(val) {
      val.status = !val.status;
    },
  },
};
</script>

<style lang='scss' scoped>
.all {
  display: flex;
  justify-content: space-between;
  min-width: 1000px;
}
.warp {
  width: 25%;
  padding: 6px 12px;
  //   display: flex;
  .pid {
    padding: 15px 0;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
  .checkboxself {
    margin-top: 15px;
  }
  .each_card {
    // width: 30%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 13px;
    .field_name {
      margin-top: 10px;
    }
  }
}
.tip {
  font-size: 13px;
  padding-bottom: 10px;
  padding-left: 10px;
  i {
    font-style: normal;
    font-weight: 600;
  }
}
</style>