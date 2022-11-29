<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="ids.length > 1 ? '短信群发' : '短信单发'"
    :visible.sync="open"
    width="60%"
  >
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      size="small"
      :rules="rules"
    >
      <el-form-item prop="taskName" label="任务名称">
        <el-input
          v-model="submitParams.taskName"
          placeholder="请输入任务名称"
        ></el-input>
      </el-form-item>

      <el-form-item
        v-if="ids.length > 1"
        prop="noteTemplateId"
        label="短信模板"
      >
        <el-select style="width: 100%" v-model="submitParams.noteTemplateId">
          <el-option
            v-for="(item, index) in templateList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item v-else prop="message" label="短信内容">
        <el-input
          type="textarea"
          v-model="submitParams.message"
          placeholder="短信内容："
        ></el-input>
      </el-form-item>
      <el-form-item v-if="ids.length > 1" label="自动过滤">
        <div style="display: flex">
          <el-input
            style="width: 100px; margin-right: 10px"
            v-model="submitParams.days"
            placeholder=""
          ></el-input
          >天已发送短信的用户
        </div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveNote, noteTemplateList } from "@/api/messageSend/index";
import { sendNoteMessageSingle } from "@/api/sms/index";
export default {
  props: {
    ids: {},
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      open: false,
      submitParams: {
        taskName: "",
        noteTemplateId: "",
        days: "",
      },
      templateList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      rules: {
        taskName: [
          { required: true, message: "请输入任务名称", trigger: "blur" },
        ],
        noteTemplateId: [
          { required: true, message: "请选择短信模板", trigger: "blur" },
        ],
        message: [
          { required: true, message: "请输入任务内容", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  beforeMount() {
    noteTemplateList().then((res) => {
      this.templateList = res.data;
    });
  },
  methods: {
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.ids.length > 1) {
            let data = {};
            data.ids = this.ids;
            data.type = this.type;
            data.days = this.submitParams.days;
            data.noteTemplateId = this.submitParams.noteTemplateId;
            data.taskName = this.submitParams.taskName;
            saveNote(data).then((res) => {
              this.open = false;
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            });
          } else {
            let data = {};
            data.taskName = this.submitParams.taskName;
            data.customerId = this.ids.toString();
            data.message = this.submitParams.message;
            data.type = this.type;
            sendNoteMessageSingle(data).then((res) => {
              this.open = false;
              this.$message({
                type: "success",
                message: "操作成功!",
              });
            });
          }
        } else {
        }
      });
    },
  },
};
</script>

<style>
</style>
