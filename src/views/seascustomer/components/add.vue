/**新建客户 */
<template>
  <div v-if="open">
    <el-dialog :title="'编辑客户'" :visible.sync="open" width="90%">
      <div>
        <el-form
          class="selfForm"
          ref="rulesForm"
          :rules="rules"
          :model="submitParams"
          label-width="120px"
          size="small"
        >
          <div style="display: flex">
            <div class="formDiv">
              <div class="titleself">基本信息</div>
              <!-- <el-form-item label="所属企业：" prop="companyId">
                <el-select
                  v-model="submitParams.companyId"
                  placeholder="所属企业"
                >
                  <el-option
                    v-for="(item, index) in companyList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item> -->
              <el-form-item label="客户名称：" prop="name">
                <el-input
                  v-model="submitParams.name"
                  placeholder="请输入客户名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="助记名称：">
                <el-input
                  v-model="submitParams.shortName"
                  placeholder="请输入助记名称"
                ></el-input>
              </el-form-item>
              <el-form-item label="所属行业：" prop="industry">
                <el-select
                  v-model="submitParams.industry"
                  placeholder="所属行业："
                >
                  <el-option
                    v-for="(item, index) in industryList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户类型：" prop="type">
                <el-radio-group v-model="submitParams.type">
                  <el-radio label="0">企业客户</el-radio>
                  <el-radio label="1">个人客户</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="客户状态：" prop="state">
                <el-select v-model="submitParams.state" placeholder="客户状态">
                  <el-option
                    v-for="(item, index) in customerStateList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户星级：" prop="star">
                <el-select v-model="submitParams.star" placeholder="客户星级">
                  <el-option
                    v-for="(item, index) in customerStarList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="客户来源：">
                <el-select v-model="submitParams.source" placeholder="客户来源">
                  <el-option
                    v-for="(item, index) in customerSourceList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <!--  -->
              <el-form-item prop="userId" label="归属人员：">
                <el-cascader
                  v-if="submitParams.status == 1"
                  disabled
                  style="width: 100%"
                  v-model="submitParams.userId"
                  @change="changeUser"
                  :options="userList"
                  :show-all-levels="false"
                  :props="props"
                  clearable
                ></el-cascader>
                <el-cascader
                  v-else
                  style="width: 100%"
                  v-model="submitParams.userId"
                  @change="changeUser"
                  :options="userList"
                  :show-all-levels="false"
                  :props="props"
                  clearable
                ></el-cascader>
              </el-form-item>
              <div class="titleself">附加信息</div>
              <el-form-item label="所在地区：">
                <el-cascader
                  style="width: 100%"
                  v-model="submitParams.address"
                  :options="areaList"
                  :props="areaListprops"
                  clearable
                ></el-cascader>
              </el-form-item>
              <el-form-item label="详细地址：">
                <el-input
                  v-model="submitParams.detailAddress"
                  placeholder="请输入详细地址"
                ></el-input>
              </el-form-item>
              <el-form-item label="企业规模：">
                <el-select v-model="submitParams.scale" placeholder="企业规模">
                  <el-option
                    v-for="(item, index) in customerScaleList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="上级客户：">
                <el-select
                  v-model="submitParams.parentCustomerId"
                  placeholder="企业规模"
                >
                  <el-option
                    v-for="(item, index) in customerList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>

                <!-- <el-input
                  v-model="submitParams.parentCustomerId"
                  placeholder="请输入上级客户"
                ></el-input> -->
              </el-form-item>
              <el-form-item label="备注信息：">
                <el-input
                  v-model="submitParams.remark"
                  placeholder="请输入备注信息"
                ></el-input>
              </el-form-item>
            </div>
            <div class="formDiv">
              <div class="titleself">首要联系人</div>
              <el-form-item label="联系人姓名：">
                <el-input
                  v-model="submitParams.contactEntity.contactName"
                  placeholder="请输入联系人姓名"
                ></el-input>
              </el-form-item>

              <el-form-item label="尊称：" prop="contactSex">
                <el-radio-group v-model="submitParams.contactEntity.sex">
                  <el-radio label="2">未知</el-radio>
                  <el-radio label="1">女士</el-radio>
                  <el-radio label="0">先生</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label=" 角色：">
                <el-select
                  v-model="submitParams.contactEntity.role"
                  placeholder="请输入联系人角色"
                >
                  <el-option
                    v-for="(item, index) in customerRoleList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日：">
                <el-date-picker
                  v-model="submitParams.contactEntity.birthday"
                  type="date"
                  placeholder="选择联系人生日"
                >
                </el-date-picker>
              </el-form-item>

              <el-form-item label=" 职务部门：">
                <el-input
                  v-model="submitParams.contactEntity.deptRole"
                  placeholder="请输入职务部门"
                ></el-input>
              </el-form-item>
              <el-form-item label=" 手机号码：">
                <el-input
                  v-model="submitParams.contactEntity.phone"
                  maxlength="11"
                  placeholder="请输入手机号码"
                ></el-input>
              </el-form-item>

              <el-form-item label="固定电话：">
                <el-input
                  v-model="submitParams.contactEntity.tel"
                  placeholder="请输入固定电话"
                ></el-input>
              </el-form-item>

              <el-form-item label=" 传真号码：">
                <el-input
                  v-model="submitParams.contactEntity.faxNo"
                  placeholder="请输入传真号码"
                ></el-input>
              </el-form-item>

              <el-form-item label=" 电子邮箱：">
                <el-input
                  v-model="submitParams.contactEntity.email"
                  placeholder="请输入电子邮箱"
                ></el-input>
              </el-form-item>

              <el-form-item label=" 微信账号：">
                <el-input
                  v-model="submitParams.contactEntity.vx"
                  placeholder="请输入微信账号"
                ></el-input>
              </el-form-item>

              <el-form-item label=" QQ号码：">
                <el-input
                  v-model="submitParams.contactEntity.qq"
                  placeholder="请输入QQ号码"
                ></el-input>
              </el-form-item>

              <el-form-item label=" 所在地区：">
                <el-cascader
                  style="width: 100%"
                  v-model="submitParams.contactEntity.region"
                  :options="areaList"
                  :props="areaListprops"
                  clearable
                ></el-cascader>
                <!-- <el-input
                  v-model="submitParams.contactEntity.region"
                  placeholder="请输入联系人所在地区"
                ></el-input> -->
              </el-form-item>

              <el-form-item label=" 详细地址：">
                <el-input
                  v-model="submitParams.contactEntity.address"
                  placeholder="请输入联系人详细地址"
                ></el-input>
              </el-form-item>

              <el-form-item label=" 备注信息：">
                <el-input
                  v-model="submitParams.contactEntity.remark"
                  placeholder="请输入备注信息"
                ></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import Dict from "@/components/dict/dict.vue";
import {
  customersave,
  customerdetail,
  getstaffList,
  getareaList,
  getcustomerList,
} from "@/api/customer/index";

export default {
  mixins: [Dict],
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
      choosedUser: "",
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      area: "",
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      userList: [],
      rules: {
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "blur" },
        ],
        type: [{ required: true, message: "请选择客户类型", trigger: "blur" }],
        state: [{ required: true, message: "请选择客户状态", trigger: "blur" }],
        star: [{ required: true, message: "请选择客户星级", trigger: "blur" }],
      },
      submitParams: {
        contactEntity: {},
      },
      open: false,
      fileList: [],
      deptList: [],
      companyList: [],
      areaList: [],
      customerList: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
    };
  },
  beforeMount() {
    getcustomerList().then((res) => {
      this.customerList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  watch: {
    // id(val) {
    //   this.isEdit();
    // },
    open(val) {
      if (val) {
        this.isEdit();
      } else {
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    changeUser() {
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        customerdetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          if (res.data.contactEntity == null) {
            this.submitParams.contactEntity = {};
          }
          // // 所在地区回显
          if (this.submitParams.contactEntity.region) {
            this.submitParams.contactEntity.region =
              this.submitParams.contactEntity.region.split(",").map((item) => {
                return +item;
              });
          }
          if (this.submitParams.address) {
            this.submitParams.address = this.submitParams.address
              .split(",")
              .map((item) => {
                return +item;
              });
          }
        });
      }
    },
    submit() {
      // this.submitParams.userId = this.choosedUser;
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          //this.submitParams.status = 1;
          if (this.submitParams.contactEntity.region) {
            this.submitParams.contactEntity.region =
              this.submitParams.contactEntity.region.toString();
          }
          if (this.submitParams.address) {
            this.submitParams.address = this.submitParams.address.toString();
          }
          if (this.id != "") {
            this.submitParams.id = this.id;
          }
          customersave(this.submitParams).then((res) => {
            if (this.id) {
              this.$emit("reload");
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$emit("reload");
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
.el-select {
  width: 100%;
}
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
