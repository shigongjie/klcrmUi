<template>
  <div>
    <van-dialog
      :beforeClose="beforeClose"
      v-model="smsDialog"
      title="短信群发"
      :show-cancel-button="false"
      :show-confirm-button="false"
    >
      <div style="padding: 20px 10px">
        <van-form ref="rulesForm" @submit="submit">
          <van-field
            v-model="submitParams.taskName"
            name="name"
            required
            label="任务名称"
            placeholder="请输入任务名称"
            :rules="[{ required: true, message: '' }]"
          />

          <VantSelect
            label="短信模板"
            placeholder="请选择短信模板"
            v-model="submitParams.noteTemplateId"
            :columns="templateList"
            :option="{ label: 'name', value: 'id' }"
            required
            :rules="[{ required: true, message: '' }]"
          />
          <div>
            <van-field
              v-model="submitParams.days"
              name="name"
              required
              label="自动过滤"
              placeholder="过滤N天已发送短信的用户"
              :rules="[{ required: true, message: '' }]"
            />
          </div>
        </van-form>
        <div class="btnWarp">
          <van-button
            size="small"
            type="default"
            @click="smsDialog = false"
            style="margin-right: 10px"
            >取消</van-button
          >
          <van-button size="small" type="info" @click="submit">确认</van-button>
        </div>
      </div>
    </van-dialog>
  </div>
</template>

<script>
import { saveNote, noteTemplateList } from "@/api/messageSend/index";
export default {
  props: {
    ids: {
      type: Array,
      default: () => {
        return [];
      },
    },
    type: {},
  },
  data() {
    return {
      smsDialog: false,
      submitParams: {},
      templateList: [],
    };
  },
  watch: {
    smsDialog(val) {
      if (!val) {
        this.submitParams = {};
      }
    },
  },
  beforeMount() {
    noteTemplateList().then((res) => {
      this.templateList = res.data;
    });
  },
  methods: {
    beforeClose(action, done) {
      if (action === "confirm") {
        this.submit();
      } else {
        done();
      }
    },
    submit() {
      this.$refs.rulesForm
        .validate()
        .then((val) => {
          let data = {};
          data.ids = this.ids;
          data.type = this.type;
          data.days = this.submitParams.days;
          data.taskName = this.submitParams.taskName;
          data.noteTemplateId = this.submitParams.noteTemplateId;
          console.log(data);
          saveNote(data).then((res) => {
            this.smsDialog = false;
            this.$toast("成功创建短信群发");
          });
        })
        .catch((err) => {});
    },
  },
};
</script>

<style lang="scss" scoped>
.btnWarp {
  margin-top: 30px;
  display: flex;
  justify-content: flex-end;
}
</style>