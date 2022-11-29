<template>
  <div>
    <el-dialog
      v-bind="$attrs"
      v-on="$listeners"
      :visible="visible"
      @open="onOpen"
      @close="onClose"
      :title="title"
    >
      <el-form ref="elForm" :model="formData" :rules="rules" size="medium" label-width="130px">
        <el-form-item label="生命周期名称" prop="lifeCycleName">
          <el-input
            v-model="formData.lifeCycleName"
            placeholder="请输入生命周期名称"
            clearable
            :style="{ width: '100%' }"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
        <el-form-item label="备注">
          <el-input
            v-model="formData.remark"
            placeholder="请输入备注"
            clearable
            :style="{ width: '100%' }"
            maxlength="20"
            show-word-limit
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="handelConfirm">确定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  inheritAttrs: false,
  components: {},
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    eidtDate: {
      type: Object,
      default: {}
    },
    title: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      open: false,
      formData: {
        lifecycleName: "",
        remark: ""
      },
      rules: {
        lifecycleName: [
          {
            required: true,
            message: "请输入生命周期",
            trigger: "blur"
          }
        ]
      },
      minFollowUpNumLimit: 0
    };
  },
  computed: {},
  watch: {
    eidtDate(val) {
      console.log(val);
      if (val.id != "" || val.id != undefined) {
        this.formData = Object.assign({}, val);
      } else {
        if (this.$refs["elForm"]) this.$refs["elForm"].resetFields();
        this.formData = {
          lifecycleName: "",
          remark: ""
        };
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    onOpen() {},
    onClose() {
      this.$refs["elForm"].resetFields();
    },
    close() {
      this.$emit("update:visible", false);
    },

    handelConfirm() {
      this.$refs["elForm"].validate(valid => {
        if (valid) {

          this.$emit("submit", this.formData);
        }
      });
    }
  }
};
</script>
<style>
</style>
