<template>
  <el-dialog
    :title="id == '' ? '新增渠道' : '编辑渠道'"
    :visible.sync="dialogVisible"
    width="50%"
    :close-on-click-modal="false"
  >
    <el-form
      :model="submitParams"
      :rules="rules"
      ref="queryForm"
      label-width="120px"
    >
      <el-form-item prop="platformName" label="接入平台">
        <el-input
          v-model="submitParams.platformName"
          placeholder="请输入接入平台"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item prop="ids" label="添加客服人员">
        <el-cascader
          style="width: 100%"
          v-model="submitParams.ids"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item prop="description" label="有效时间">
        <el-date-picker
          size="small"
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始创建时间"
          end-placeholder="结束创建时间"
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
import { getstaffList } from "@/api/customer/index";
import { platformsave, getDatailById } from "@/api/chat/index";
export default {
  data() {
    return {
      id: "",
      time: "",
      dialogVisible: false,
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      submitParams: {
        platformName: "",
        ids: [],
      },
      rules: {
        name: [{ required: true, message: "请输入职务名称", trigger: "blur" }],
      },
    };
  },
  watch: {
    dialogVisible(val) {
      if (val) {
        this.isEdit();
      }
      if (!val) {
        this.submitParams.id = "";
      }
    },
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
    isEdit() {
      if (this.id != "") {
        getDatailById({ id: this.id }).then((res) => {
          console.log(res);
          this.submitParams.platformName = res.data.platformName;
          if (res.data.validTime != null) {
            this.time = [res.data.validTime, res.data.endTime];
          }
          if (res.data.ids) {
            this.submitParams.ids = res.data.ids.split(",");
          }
        });
      }
    },
    submit() {
      this.$refs.queryForm.validate((valid) => {
        if (valid) {
          let data = {};
          if (this.time != null || this.time != "") {
            data.validTime = this.time[0]+ " " + "00:00:00";
            data.endTime = this.time[1]+ " " + "23:59:59";
          }
          data.platformName = this.submitParams.platformName;
          if (this.submitParams.ids) {
            data.ids = this.submitParams.ids.toString();
          }
          if (this.id != "") {
            data.id = this.id;
          }
          platformsave(data).then((res) => {
            this.$emit("reroad");
            this.dialogVisible = false;
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style>
</style>