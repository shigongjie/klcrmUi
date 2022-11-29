<template>
  <div v-if="open">
    <el-dialog
      :title="action == 0 ? '新增员工' : '编辑员工'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <div style="width: 50%; margin: auto">
        <el-form
          :rules="rules"
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          size="small"
        >
          <div class="titleself">员工头像</div>
          <el-form-item label="员工头像：" prop="avatar">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileUrl"
              :show-file-list="false"
              :file-list="fileList"
              :on-success="handleUploadSuccess"
              :headers="headers"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar" />
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
          <div class="titleself">基本信息</div>
          <el-form-item prop="name" label="员工姓名：">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入员工姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="account" label="登录账号：">
            <el-input
              v-model="submitParams.account"
              placeholder="请输入登录账号"
            ></el-input>
          </el-form-item>
          <el-form-item v-if="this.id == ''" prop="password" label="登录密码：">
            <el-input
              v-model="submitParams.password"
              placeholder="请输入登录密码"
            ></el-input>
          </el-form-item>

          <el-form-item prop="deptId" label="所属部门：">
            <el-cascader
              placeholder="请选择部门"
              :options="deptTree"
              :show-all-levels="false"
              filterable
              @change="handlechange"
              v-model="submitParams.deptId"
              :props="{
                emitPath: false,
                checkStrictly: true,
                children: 'list',
                label: 'name',
                value: 'id',
              }"
              clearable
              style="width: 100%"
            ></el-cascader>
          </el-form-item>
          <el-form-item prop="deptId" label="当前职务：">
            <el-select
              style="width: 100%"
              v-model="submitParams.roleId"
              placeholder="请选择职务"
            >
              <el-option
                v-for="(item, index) in roleList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="员工性别：">
            <el-radio-group v-model="submitParams.sex">
              <el-radio label="0">保密</el-radio>
              <el-radio label="1">男</el-radio>
              <el-radio label="2">女</el-radio>
            </el-radio-group>
            <!-- <el-input v-model="submitParams.sex" placeholder="请输入员工性别"></el-input> -->
          </el-form-item>
          <el-form-item label="员工生日：">
            <el-date-picker
              style="width: 100%"
              v-model="submitParams.birthday"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item prop="email" label="邮箱地址：">
            <el-input
              v-model="submitParams.email"
              placeholder="请输入邮箱地址"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码：">
            <el-input
              maxlength="11"
              v-model="submitParams.phone"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信账号：">
            <el-input
              v-model="submitParams.vx"
              placeholder="请输入微信账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="座机/分机：">
            <el-input
              v-model="submitParams.specialPlane"
              placeholder="请输入座机/分机"
            ></el-input>
          </el-form-item>
          <div class="titleself">更多信息</div>
          <el-form-item label="工号：">
            <el-input
              v-model="submitParams.empnoId"
              placeholder="请输入工号"
            ></el-input>
          </el-form-item>
          <el-form-item label="籍贯：">
            <el-input
              v-model="submitParams.origo"
              placeholder="请输入籍贯"
            ></el-input>
          </el-form-item>
          <el-form-item label=" 毕业院校：">
            <el-input
              v-model="submitParams.schoolTag"
              placeholder="请输入毕业院校"
            ></el-input>
          </el-form-item>
          <el-form-item label="毕业时间：">
            <el-date-picker
              style="width: 100%"
              v-model="submitParams.graduationDate"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="学历：">
            <el-select
              style="width: 100%"
              v-model="submitParams.education"
              placeholder="请选择学历"
            >
              <el-option
                v-for="(item, index) in educationList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所学专业：">
            <el-input
              v-model="submitParams.professional"
              placeholder="请输入所学专业"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注：">
            <el-input
              v-model="submitParams.remark"
              placeholder="请输入备注"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getdeptTree } from "@/api/organization/index";
import { getToken } from "@/utils/auth";
import { saveStaff, getInfo, getroleList } from "@/api/staff/index";
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
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        account: [
          { required: true, message: "请输入账号", trigger: "blur" },
          { pattern: /^[^\s]*$/, message: "不能包含空格" },
          { pattern: /^(\$|[a-zA-Z_])/, message: "必须以字母开头" },
          {
            min: 5,
            max: 20,
            message: "长度在 5 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            pattern: /^[0-9a-zA-Z]*$/g,
            message: "只能输入数字，字母",
          },
          {
            min: 6,
            max: 20,
            message: "长度在 6 到 20 个字符",
            trigger: "blur",
          },
        ],
        deptId: [{ required: true, message: "请选择部门", trigger: "blur" }],
        phone: [{ required: true, message: "请输入手机号", trigger: "blur" }],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          {
            pattern:
              /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/,
            message: "请输入正确的邮箱格式",
          },
        ],
        "contactEntity.phone": [
          { required: true, message: "请输入联系人手机", trigger: "blur" },
        ],
        "contactEntity.contactName": [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
      },
      headers: {
        Authorization: getToken(),
      },
      submitParams: {},
      open: false,
      fileList: [],
      deptList: [],
      educationList: [], //学历
      deptTree: [], //部门
      imageUrl: "", //头像
      roleList: [], //职务
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
    };
  },
  beforeMount() {
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
    });
  },
  mounted() {
    this.getdeptTree();
    this.getroleList();
  },
  watch: {
    open(val) {
      if (val) {
        this.isEdit();
      } else {
        this.fileList = [];
        this.imageUrl = "";
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  methods: {
    handlechange(val) {
      this.submitParams.pids = val;
    },
    getroleList() {
      getroleList().then((res) => {
        this.roleList = res.data;
      });
    },
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
      });
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          if (res.data.education) {
            this.submitParams.education = this.submitParams.education + "";
          }
          this.imageUrl = res.data.avatar;
        });
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      console.log(data);
      this.submitParams.avatar = data.data;
      this.imageUrl = data.data;
    },
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          // this.submitParams.address = this.submitParams.address.toString();
          saveStaff(this.submitParams).then((res) => {
            if (this.id) {
              this.$emit("closeEdit");
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$emit("closeAdd");
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }
            this.open = false;
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
.titleself {
  font-weight: 600;
  padding: 10px;
  height: 5px;
  font-size: 16px;
  line-height: 3px;
  border-left: 4px solid #3394fe;
  margin-bottom: 20px;
  margin-left: -10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
  border: 1px dashed;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
</style>
