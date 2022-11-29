<template>
  <el-dialog :close-on-click-modal='false' :title="'添加协作'" :visible.sync="open" width="60%">
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      size="small"
    >
      <el-form-item label="选择人员">
        <el-cascader
          style="width: 100%"
          v-model="submitParams.collaborators"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
        <!-- <el-select
          style="width: 100%"
          v-model="submitParams.collaborators"
          @change="changeUser"
          multiple
          placeholder="请选择"
        >
          <el-option
            v-for="item in userList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          >
          </el-option>
        </el-select> -->
      </el-form-item>
      <!-- <el-form-item label="">
        * 新增指在已有协作人的基础上增加新的协作人
      </el-form-item>
      <el-form-item label="">
        * 替换指将已有的协作人替换为新的协作人
      </el-form-item>
      <el-form-item label="">
        * 移除指从已有的协作人中移除所选用户
      </el-form-item> -->
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveCoop, subordinateList } from "@/api/customer/index";

export default {
  props: {
    ids: {
      type: Array,
      default: [],
    },
    isCoop: {},
  },
  data() {
    return {
      open: false,
      userList: [],
      submitParams: {
        collaborators: "",
      },
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
         multiple: true,
      },
    };
  },
  watch: {
    open(val) {
      if (this.isCoop) {
        this.submitParams.collaborators = this.isCoop.split(",");
      }
    },
  },
  beforeMount() {
    subordinateList().then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
    changeUser(val) {
      this.submitParams.collaborators = val;
    },
    submit() {
      if (this.submitParams.collaborators) {
        this.submitParams.collaborators =
          this.submitParams.collaborators.toString();
      } else {
        this.submitParams.collaborators = "";
      }
      this.submitParams.id = this.ids.toString();
      saveCoop(this.submitParams).then((res) => {
        this.open = false;
        this.$emit("reload");
      });
    },
  },
};
</script>

<style>
</style>