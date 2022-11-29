<template>
  <el-dialog :close-on-click-modal='false' title="添加人员" :visible.sync="dialogVisible" width="50%">
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
      <el-form-item prop="realName" label="添加成员">
        <el-cascader
          style="width: 100%"
          v-model="choosedUser"
          @change="change"
          :options="options"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>
    </el-form>

    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { userList, getRoleStaff, saveRoleStaff } from "@/api/role/index";
export default {
  data() {
    return {
      id: "",
      statusType: 0, //停用or启用
      dialogVisible: false,
      submitParams: {},
      props: {
        multiple: true,
        value: "id",
        label: "name",
        children: "list",
        // checkStrictly: true,
        emitPath: false,
      },
      options: [],
      choosedUser: [],
    };
  },
  watch: {
    dialogVisible(val) {
      getRoleStaff({ roleId: this.id }).then((r) => {
        this.choosedUser = r.data;
      });
    },
  },
  mounted() {
    this.choosedUser = ["2", "3", "4", "5"];
    this.getUserList();
  },
  methods: {
    change(val) {
    },
    submit() {
      let data = {};
      data.staffIds = this.choosedUser;
      data.roleId = this.id;
      saveRoleStaff(data).then((res) => {
        this.dialogVisible = false
        this.$emit("reroad");
      });
    },
    getUserList() {
      userList().then((res) => {
        this.options = res.data;
      });
    },
  },
};
</script>

<style>
</style>