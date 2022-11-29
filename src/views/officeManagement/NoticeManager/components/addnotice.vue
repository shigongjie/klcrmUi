/**新建部门 */
<template>
  <div v-if="open">
    <el-dialog
      :title="id == '' ? '新增公告' : '编辑公告'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <div style="width: 100%">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          size="small"
        >
          <el-form-item label="通知人员">
            <el-checkbox v-model="isSelecteAll">全部</el-checkbox>
            <div @click="isShowallUser = !isShowallUser">
              <i
                style="color: #c0c4cc"
                class="el-icon-caret-right"
                v-if="!isShowallUser"
              ></i>
              <i style="color: #c0c4cc" class="el-icon-caret-bottom" v-else></i>
              <span style="padding-left: 10px">展开详情</span>
            </div>
            <el-collapse-transition>
              <el-tree
                class="diabody"
                v-show="isShowallUser"
                :data="userList"
                show-checkbox
                node-key="id"
                ref="tree"
                highlight-current
                :props="defaultProps"
              >
              </el-tree>
            </el-collapse-transition>
          </el-form-item>
          <el-form-item label="公告标题">
            <el-input
              v-model="submitParams.headline"
              placeholder="请输入公告标题"
              maxlength="20"
            ></el-input>
          </el-form-item>
          <el-form-item label="公告内容">
            <Editor :height="300" v-model="submitParams.description" />
          </el-form-item>
          <el-form-item label="附件">
            <el-upload
              class="upload-demo"
              :action="uploadFileUrl"
              :headers="headers"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :on-success="handleUploadSuccess"
              multiple
              :limit="3"
              :file-list="fileList"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="open = false">取消</el-button>
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getInfo } from "@/api/staff/index";
import { saveAffiche } from "@/api/notic/index";
import { getstaffList } from "@/api/customer/index";
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
  },
  data() {
    return {
      isShowallUser: false,
      defaultProps: {
        children: "list",
        label: "name",
      },
      richtext: "123123123阿斯顿",
      headers: {
        Authorization: getToken(),
      },
      submitParams: {},
      open: false,
      fileList: [],
      userList: [],
      educationList: [],
      isSelecteAll: false,
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  watch: {
    open(val) {
      if (!val) {
        this.isSelecteAll = false;
        this.submitParams = this.$options.data().submitParams;
      }
    },
    isSelecteAll(val) {
      if (val) {
        this.$refs.tree.setCheckedNodes(this.userList);
        this.isShowallUser = true;
      } else {
        this.$refs.tree.setCheckedNodes([]);
        this.isShowallUser = false;
      }
    },
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          this.submitParams = res.data;
        });
      }
    },
    handlePreview() {},
    handleRemove(file) {
      this.fileList = this.fileList.filter((item) => {
        return item != file;
      });
    },
    handleUploadSuccess(data, file) {
      this.submitParams.avatar = data.data;
      this.fileList.push(file);
    },
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          // this.submitParams.address = this.submitParams.address.toString();
          // console.log(this.submitParams);
          if (
            this.submitParams.headline == null ||
            this.submitParams.headline == undefined ||
            this.submitParams.headline == ""
          ) {
            this.$message.error("请输入公告标题");
            return;
          }
          if (
            this.submitParams.description == null ||
            this.submitParams.description == undefined ||
            this.submitParams.description == ""
          ) {
            this.$message.error("请输入公告内容");
            return;
          }
          var test = this.submitParams.description;
          var all = test.replaceAll(/<[^>]+>/g, "");
          if (all.length > 600) {
            this.$message.error("公告内容不能超过600个字符");
            return;
          }
          let data = {};
          data.accessory = [];
          if (this.$refs.tree.getCheckedKeys({ leafOnly: true })) {
            data.participantId = this.$refs.tree.getCheckedKeys({
              leafOnly: true,
            });
          }
          if (data.participantId.length <= 0) {
            this.$message.error("请选择通知人员");
            return;
          }
          data.headline = this.submitParams.headline;
          data.description = this.submitParams.description;
          this.fileList.forEach((item) => {
            if (item.response) {
              console.log(item);
              data.accessory.push({
                name: item.name,
                url: item.response.data,
              });
            }
          });
          if (data.accessory) {
            data.accessory = JSON.stringify(data.accessory);
          }
          if (data.participantId) {
            data.participantId = data.participantId.toString();
          }
          console.log(this.$refs.tree.getCheckedKeys({ leafOnly: true }));
          console.log(data);
          saveAffiche(data).then((res) => {
            if (res.code === 0) {
              this.$emit("reload");
              this.open = false;
              this.$message.success("新增成功");
            }
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
.diabody {
  padding: 10px 0;
  max-height: 200px;
  overflow-y: scroll;
}
</style>
