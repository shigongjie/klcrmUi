/**新增编辑部门 */
<template>
  <div v-if="open">
    <el-dialog
      :close-on-click-modal="false"
      :title="
        id == ''
          ? '新增短信模板'
          : submitParams.templateType == 0
          ? '审核短信模板'
          : '查看短信模板'
      "
      :visible.sync="open"
      width="50%"
    >
      <div style="width: 80%; margin: auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="120px"
          size="small"
          :rules="rules"
        >
          <el-form-item prop="name" label="模板名称" >
            <el-input
              v-model="submitParams.name"
              placeholder="模板名称"
            ></el-input>
          </el-form-item>

          <el-form-item prop="noteDetail" label="短信内容">
            <el-input
              type="textarea"
              v-model="submitParams.noteDetail"
              :rows="6"
              placeholder="短信内容"
            ></el-input>
          </el-form-item>

          <el-form-item label="请选择变量">
            <!-- <el-checkbox-group v-model="submitParams.checkList"> -->
            <el-checkbox
              v-for="(item, index) in checkBoxList"
              :key="index"
              @change="changeCheckbox(item)"
              :value="item.value"
              :label="item.label"
            ></el-checkbox>
            <!-- </el-checkbox-group> -->
          </el-form-item>
          <el-form-item
            v-if="submitParams.id != '' && submitParams.id != null"
            label="审核状态"
          >
            <el-select
              disabled
              placeholder="审核状态"
              size="small"
              style="width: 100%"
              v-model="submitParams.templateType"
            >
              <el-option
                v-for="(item, index) in list"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="
              submitParams.id != '' &&
              submitParams.id != null &&
              submitParams.templateType != 1 &&
              submitParams.templateType != 0
            "
            label="失败原因"
          >
            <el-input
              v-model="submitParams.causeFailure"
              type="textarea"
              :rows="3"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">取消</el-button>
        <el-button type="primary" @click="submitdept()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveNoteTemplate, lookTemplate } from "@/api/sms/tempate";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
    action: {
      type: Number,
      default: 0,
    },
    choosedDept: {},
  },
  data() {
    return {
      isDisabled: false,
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      list: [
        { name: "审核中", id: 0 },
        { name: "通过", id: 1 },
        { name: "失败", id: 2 },
      ],
      checkBoxList: [
        { label: "客户名称", key: "name", tempt: "${name}", value: false },
        { label: "客户星级", key: "star", tempt: "${star}", value: false },
        {
          label: "客户简称",
          key: "shortName",
          tempt: "${shortName}",
          value: false,
        },
        {
          label: "联系人姓名",
          key: "contactName",
          tempt: "${contactName}",
          value: false,
        },
      ],
      submitParams: {
        name: "",
        noteDetail: "",
      },
      open: false,
      choosedUser: [],
      params: {},
      userList: [],
      rules: {
        name: [
          { required: true, message: "请输入模板名称", trigger: "blur" },
        ],
        noteDetail: [
          { required: true, message: "请输入短信内容", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    open(val) {
      if (!val) {
        this.submitParams.name = "";
        this.submitParams.noteDetail = "";
        this.checkBoxList.forEach((item) => {
          item.value = false;
        });
      } else {
        console.log(val);
        this.isEdit();
      }
    },
  },
  mounted() {},
  methods: {
    changeCheckbox(item) {
      item.value = !item.value;
      if (item.value) {
        console.log(this.submitParams.noteDetail);
        this.submitParams.noteDetail =
          this.submitParams.noteDetail + item.tempt.toString();
      } else {
        this.submitParams.noteDetail = this.submitParams.noteDetail
          .split(item.tempt)
          .join("");
      }
    },
    handlechange(val) {
      this.submitParams.pids = val;
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        lookTemplate({ id: this.id }).then((res) => {
          this.submitParams = res.data;
        });
      } else {
        this.submitParams = {
          name: "",
          noteDetail: "",
        };
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.avatar = data.data;
    },
    submitdept() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          // if (this.submitParams.pids) {
          //   this.submitParams.pid =
          //     this.submitParams.pids[this.submitParams.pids.length - 1];
          // }
          saveNoteTemplate(this.submitParams).then((res) => {
            if (this.submitParams.id) {
              this.$message({
                message: "操作成功",
                type: "success",
              });
            } else {
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }

            this.open = false;
            this.$emit("reload");
          });
        } else {
          return false;
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.selfFrom {
  .el-form-item__label {
    font-weight: 400 !important;
  }
}
.formDiv {
  width: 50%;
  padding: 0 20px;
}
.titleself {
  font-weight: 600;
  padding: 10px;
  height: 5px;
  font-size: 16px;
  line-height: 3px;
  border-left: 4px solid #3394fe;
  margin-bottom: 20px;
  //   margin-left: -10px;
}
</style>
