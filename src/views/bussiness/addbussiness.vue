/**action 0新增,1编辑 */

<template>
  <div v-if="open">
    <el-dialog
      :title="action == 0 ? '新增企业' : '编辑企业'"
      :visible.sync="open"
      width="60%"
      :before-close="beforeClose"
    >
      <div style="width: 50%; margin: auto">
        <el-form
          class="demo-ruleForm selfForm"
          ref="rulesForm"
          :rules="rules"
          :model="submitParams"
          label-width="100px"
          size="small"
        >
          <div class="titleself">基本信息</div>
          <el-form-item label="企业名称：" prop="name">
            <el-input
              v-model="submitParams.name"
              placeholder="请输入企业名称"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业简称：" prop="shortName">
            <el-input
              v-model="submitParams.shortName"
              placeholder="请输入企业简称"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业电话：" prop="phone">
            <el-input
              v-model="submitParams.phone"
              placeholder="请输入企业电话"
            ></el-input>
          </el-form-item>

          <el-form-item label="企业类型：" prop="type">
            <el-select v-model="submitParams.type" placeholder="请选择企业类型">
              <el-option
                v-for="item in companyTypeList"
                :key="item.dictValue"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属行业：" prop="industry">
            <el-select
              v-model="submitParams.industry"
              placeholder="请选择所属行业"
            >
              <el-option
                v-for="(item, index) in industryList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所在地区：" prop="address">
            <el-cascader
              @change="handleChangeAreaList"
              :options="AreaList"
              :props="defaultProps"
              v-model="submitParams.address"
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址：" prop="detailAddress">
            <el-input
              v-model="submitParams.detailAddress"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="邮政编码：" prop="zipCode">
            <el-input
              v-model="submitParams.zipCode"
              placeholder="请输入邮政编码"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业传真：" prop="fax">
            <el-input
              v-model="submitParams.fax"
              placeholder="请输入企业传真"
            ></el-input>
          </el-form-item>
          <el-form-item label="企业网址：" prop="url">
            <el-input
              v-model="submitParams.url"
              placeholder="请输入企业网址"
            ></el-input>
          </el-form-item>
          <el-form-item label="成立日期：" prop="foundTime">
            <el-date-picker
              v-model="submitParams.foundTime"
              type="date"
              placeholder="选择日期"
            >
            </el-date-picker>
          </el-form-item>
          <div class="titleself">公司Logo</div>
          <el-form-item label="公司Logo：" prop="logo">
            <el-upload
              class="upload-demo"
              :action="uploadFileUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :headers="headers"
              :on-success="handleUploadSuccess"
              list-type="picture"
            >
              <el-button size="small" type="primary">选择附件</el-button>
              <div slot="tip" class="el-upload__tip">
                支持 JPG、JPEG、PNG、BMP 格式，图片小于10M
              </div>
            </el-upload>
          </el-form-item>
          <div class="titleself">企业联系人</div>
          <el-form-item label="联系人姓名：" prop="contactName">
            <el-input
              v-model="submitParams.contactName"
              placeholder="请输入联系人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="尊称：" prop="contactSex">
            <el-radio-group v-model="submitParams.contactSex">
              <el-radio label="2">未知</el-radio>
              <el-radio label="1">女士</el-radio>
              <el-radio label="0">先生</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="部门职务：" prop="contactJob">
            <el-input
              v-model="submitParams.contactJob"
              placeholder="请输入部门职务"
            ></el-input>
          </el-form-item>
          <el-form-item label=" 手机号码：" prop="contactPhone">
            <el-input
              v-model="submitParams.contactPhone"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="登录密码：" prop="contactPassword">
            <el-input
              v-model="submitParams.contactPassword"
              placeholder="请输入登录密码"
            ></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：" prop="contactEmail">
            <el-input
              v-model="submitParams.contactEmail"
              placeholder="请输入电子邮箱"
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
import { getToken } from "@/utils/auth";
import {
  Addcompany,
  getcompanyDetail,
  findAreaByPid,
} from "@/api/bussiness/index";
export default {
  props: {
    openDialog: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Number,
      default: 0,
    },
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 地区
      AreaList: [],
      defaultProps: {
        children: "list",
        label: "name",
        value: "id",
      },
      headers: {
        Authorization: getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
      rules: {
        zipCode: [
          { min: 0, max: 6, message: "长度在 0 到 6 个字符", trigger: "blur" },
        ],
        name: [{ required: true, message: "请输入企业名称", trigger: "blur" }],
        shortName: [
          { required: true, message: "请输入企业简称", trigger: "change" },
        ],
        phone: [
          {
            required: true,
            message: "请输入企业电话",
            trigger: "blur",
          },
        ],
      },
      submitParams: {
        address: "", //所在地区
        contactEmail: "", //联系人电子邮箱
        contactJob: "", //联系人职务
        contactName: "", //联系人名称
        contactPassword: "", //联系人登录密码
        contactPhone: "", //联系人手机号
        contactSex: "", //联系人性别 0先生 1女士 2未知
        fax: "", //企业传真
        foundTime: "", //成立时间
        id: "",
        industry: "", //所属行业
        logo: "", //企业logo
        name: "", //企业名称
        period: "", //使用期限
        phone: "", //企业电话
        shortName: "", //企业简称
        type: "", //企业类型
        url: "", //企业网址
        zipCode: "", //邮政编码
      },
      open: false,
      fileList: [],
      industryList: [],
      companyTypeList: [],
    };
  },
  beforeMount() {
    this.getDicts("company_type").then((res) => {
      this.companyTypeList = res.data;
    });
    this.getDicts("industry").then((res) => {
      this.industryList = res.data;
    });
  },
  mounted() {
    this.getArea();

    this.isEdit();
  },
  methods: {
    // 选择地区
    handleChangeAreaList(data) {
    },
    getArea() {
      findAreaByPid().then((res) => {
        this.AreaList = res.data;
      });
    },
    beforeClose() {
      if (this.id != "" && this.id != undefined) {
        this.$emit("closeEdit");
      } else {
        this.open = false;
      }
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getcompanyDetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          // 所在地区回显
          this.submitParams.address = this.submitParams.address
            .split(",")
            .map((item) => {
              return +item;
            });
          this.submitParams.type = this.submitParams.type+''
          this.submitParams.industry = this.submitParams.industry+''
        });
      }
    },
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.submitParams.address = this.submitParams.address.toString();
          Addcompany(this.submitParams).then((res) => {
            if (this.id) {
              this.$emit("closeEdit");
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
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.logo = data.msg;
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
::v-deep {
  .el-select {
    width: 100%;
  }
  .el-input {
    width: 100%;
  }
}
</style>
