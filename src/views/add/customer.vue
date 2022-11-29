/**新建客户 */
<template>
  <div v-if="open">
    <el-dialog :title="id == '' ? '新建客户' : '编辑客户'" :visible.sync="open" width="90%" :close-on-click-modal="false">
      <div>
        <el-form class="selfForm" ref="rulesForm" :rules="rules" :model="submitParams" label-width="140px" size="small">
          <div style="display: flex">
            <div class="formDiv">
              <div class="titleself">基本信息</div>
              <el-form-item label="客户名称：" prop="name">
                <el-input :maxlength="submitParams.type == 0 ? 80 : 10" v-model="submitParams.name"
                  placeholder="请输入客户名称"></el-input>
              </el-form-item>
              <el-form-item label="助记名称：">
                <el-input v-model="submitParams.shortName" placeholder="请输入助记名称"></el-input>
              </el-form-item>
              <el-form-item label="所属行业：" prop="industry">
                <el-select v-model="submitParams.industry" placeholder="所属行业：">
                  <el-option v-for="(item, index) in industryList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="统一社会信用代码：" prop="social_code">
                <el-input v-model="submitParams.regNo" placeholder="请输入统一社会信用代码"></el-input>
              </el-form-item>
              <!-- <el-form-item label="客户类型：" prop="type">
                <el-radio-group v-model="submitParams.type">
                  <el-radio label="0">企业客户</el-radio>
                  <el-radio label="1">个人客户</el-radio>
                </el-radio-group>
              </el-form-item> -->
              <el-form-item label="客户类型：" prop="type">
                <el-select v-model="submitParams.type" placeholder="客户类型">
                  <el-option v-for="dict in dict.type.customer_type" :key="dict.dictCode" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="法定代表人：" prop="legalPerson">
                <el-input v-model="submitParams.legalPerson" placeholder="请输入法定代表人"></el-input>
              </el-form-item>
              <el-form-item label="企业电话：">
                <el-input v-model="submitParams.phone" placeholder="请输入企业电话"></el-input>
              </el-form-item>
              <el-form-item label="客户状态：" prop="state">
                <el-select v-model="submitParams.state" placeholder="客户状态">
                  <el-option v-for="(item, index) in customerStateList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="客户星级：" prop="star">
                <el-select v-model="submitParams.star" placeholder="客户星级">
                  <el-option v-for="(item, index) in customerStarList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>

              <el-form-item label="客户来源：" prop="source">
                <el-select v-model="submitParams.source" placeholder="客户来源">
                  <el-option v-for="(item, index) in customerSourceList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <!--  -->
              <el-form-item prop="userId" label="归属人员：">
                <el-cascader style="width: 100%" v-model="submitParams.userId" @change="changeUser" :options="userList"
                  :show-all-levels="false" :props="props" clearable></el-cascader>
              </el-form-item>
              <div class="titleself">附加信息</div>
              <el-form-item prop="address" label="所在地区：">
                <el-cascader style="width: 100%" v-model="submitParams.address" :options="areaList"
                  :props="areaListprops" clearable></el-cascader>
                <!-- <el-input
                  v-model="submitParams.address"
                  placeholder="请输入所在地区"
                ></el-input> -->
              </el-form-item>
              <el-form-item label="详细地址：">
                <el-input v-model="submitParams.detailAddress" placeholder="请输入详细地址"></el-input>
              </el-form-item>
              <el-form-item label="企业固话：">
                <el-input v-model="submitParams.tel" placeholder="请输入企业固话"></el-input>
              </el-form-item>
              <el-form-item label="企业邮箱：">
                <el-input v-model="submitParams.email" placeholder="请输入企业邮箱"></el-input>
              </el-form-item>
              <el-form-item label="注册资金：">
                <el-select v-model="submitParams.regCapital" placeholder="注册资金">
                  <el-option v-for="dict in dict.type.company_cash" :key="dict.value" :label="dict.label"
                    :value="dict.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="企业规模：">
                <el-select v-model="submitParams.scale" placeholder="企业规模">
                  <el-option v-for="(item, index) in customerScaleList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="成立日期：">
                <el-date-picker style="width: 100%" v-model="submitParams.startDate" type="datetime"
                  value-format="yyyy-MM-dd" placeholder="日期">
                </el-date-picker>
              </el-form-item>
              <el-form-item label="上级客户：">
                <el-select filterable v-model="submitParams.parentCustomerId" placeholder="上级客户">
                  <el-option v-for="(item, index) in customerList" :key="index" :label="item.name" :value="item.id">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="标签：" prop="labelIds">
                <el-cascader style="width: 100%" v-model="submitParams.labelIds" :options="labelList"
                  :show-all-levels="false" :props="propsArray" separator="," clearable></el-cascader>
              </el-form-item>
              <el-form-item label="备注信息：">
                <el-input v-model="submitParams.remark" placeholder="请输入备注信息"></el-input>
              </el-form-item>
              <el-form-item v-if="id == ''" label="">
                <el-checkbox v-model="checked">是否创建下次跟进</el-checkbox>
              </el-form-item>
              <div v-if="checked">
                <el-form-item label="跟进时间：">
                  <el-date-picker style="width: 100%" v-model="submitParams.taskEntity.time" type="datetime"
                    value-format="yyyy-MM-dd HH:mm:ss" placeholder="日期">
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="跟进内容：">
                  <el-input v-model="submitParams.taskEntity.content" placeholder="请输入跟进内容"></el-input>
                </el-form-item>
                <el-form-item label="跟进人员：">
                  <el-cascader style="width: 100%" v-model="submitParams.taskEntity.userId" @change="changeUser"
                    :options="userList" :show-all-levels="false" :props="props" clearable></el-cascader>
                </el-form-item>
                <el-form-item label="跟进提醒：">
                  <el-select v-model="submitParams.taskEntity.remindTime" placeholder="跟进提醒">
                    <el-option v-for="(item, index) in worktaskmanagerList" :key="index" :label="item.dictLabel"
                      :value="item.dictValue"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item label="提醒方式：">
                  <el-checkbox-group v-model="remindType">
                    <el-checkbox v-for="(item, index) in remindTypeList" :key="index" :disabled="item.dictValue == 0"
                      :label="item.dictValue">{{ item.dictLabel }}</el-checkbox>
                  </el-checkbox-group>
                </el-form-item>
              </div>
            </div>
            <div class="formDiv">
              <div class="titleself">首要联系人</div>
              <el-form-item prop="contactEntity.contactName" label="联系人姓名：">
                <el-input v-model="submitParams.contactEntity.contactName" placeholder="请输入联系人姓名" maxlength="10">
                </el-input>
              </el-form-item>

              <el-form-item label="尊称：" prop="contactSex">
                <el-radio-group v-model="submitParams.contactEntity.sex">
                  <el-radio label="2">未知</el-radio>
                  <el-radio label="1">女士</el-radio>
                  <el-radio label="0">先生</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label=" 角色：">
                <el-select v-model="submitParams.contactEntity.role" placeholder="请输入联系人角色">
                  <el-option v-for="(item, index) in customerRoleList" :key="index" :label="item.dictLabel"
                    :value="item.dictValue"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="生日：">
                <el-date-picker v-model="submitParams.contactEntity.birthday" type="date"
                  value-format="yyyy-MM-dd HH:mm:ss" placeholder="选择联系人生日">
                </el-date-picker>
              </el-form-item>

              <el-form-item label=" 职务部门：">
                <el-input v-model="submitParams.contactEntity.deptRole" placeholder="请输入职务部门"></el-input>
              </el-form-item>
              <el-form-item prop="contactEntity.phone" label=" 手机号码：">
                <el-input v-model="submitParams.contactEntity.phone"
                  oninput="this.value = this.value.replace(/\D/g, '')" maxlength="11" placeholder="请输入手机号码"></el-input>
              </el-form-item>

              <el-form-item label="固定电话：">
                <el-input v-model="submitParams.contactEntity.tel" placeholder="请输入固定电话"></el-input>
              </el-form-item>

              <el-form-item label=" 传真号码：">
                <el-input v-model="submitParams.contactEntity.faxNo" placeholder="请输入传真号码"></el-input>
              </el-form-item>

              <el-form-item label=" 电子邮箱：">
                <el-input v-model="submitParams.contactEntity.email" placeholder="请输入电子邮箱"></el-input>
              </el-form-item>

              <el-form-item label=" 微信账号：">
                <el-input v-model="submitParams.contactEntity.vx" placeholder="请输入微信账号"></el-input>
              </el-form-item>

              <el-form-item label=" QQ号码：">
                <el-input v-model="submitParams.contactEntity.qq" placeholder="请输入QQ号码"></el-input>
              </el-form-item>

              <el-form-item label=" 所在地区：">
                <el-cascader style="width: 100%" v-model="submitParams.contactEntity.region" :options="areaList"
                  :props="areaListprops" clearable></el-cascader>
              </el-form-item>

              <el-form-item label=" 详细地址：">
                <el-input v-model="submitParams.contactEntity.address" placeholder="请输入联系人详细地址"></el-input>
              </el-form-item>

              <el-form-item label="备注信息：">
                <el-input v-model="submitParams.contactEntity.remark" placeholder="请输入备注信息"></el-input>
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
  getlabelList,
} from "@/api/customer/index";

export default {
  dicts: ["company_manage_status", "company_cash", "customer_type"],
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
  propsArray: {
    id: {
      type: Array,
      default: "",
    },
    action: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      remindType: ["0"], //提醒方式
      remindTypeList: [],
      checked: false,
      choosedUser: "",
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      propsArray: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      area: "",
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      userList: [],
      rules: {
        labelIds: [
          { required: true, message: "请选择客户标签", trigger: "change" },
        ],
        source: [
          { required: true, message: "请选择客户来源", trigger: "change" },
        ],
        address: [
          { required: true, message: "请选择所在地区", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择客户类型", trigger: "change" },
        ],
        state: [
          { required: true, message: "请选择客户状态", trigger: "change" },
        ],
        star: [
          { required: true, message: "请选择客户星级", trigger: "change" },
        ],
        userId: [
          { required: true, message: "请选择归属人员", trigger: "change" },
        ],
        legalPerson:[ { required: true, message: "请输入法定代表人", trigger: "blur" },],
        "contactEntity.phone": [
          { required: true, message: "请输入联系人手机", trigger: "blur" },
        ],
        "contactEntity.contactName": [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
      },
      submitParams: {
        userId: "",
        contactEntity: {},
        taskEntity: {},
      },
      open: false,
      fileList: [],
      deptList: [],
      areaList: [],
      customerRoleList: [],
      customerList: [],
      labelList: [],
    };
  },
  beforeMount() {
    /**提醒类型 */
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getcustomerList({ type: 1 }).then((res) => {
      this.customerList = res.data;
    });
    getlabelList().then((res) => {
      this.labelList = res.data;
    });
  },
  watch: {
    open(val) {
      if (val) {
        this.submitParams.userId = this.$store.state.user.userId;
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
    changeUser() { },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        customerdetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          this.customerList = this.customerList.filter((item) => {
            return item.id != this.id;
          });
          if (res.data.contactEntity == null) {
            this.submitParams.contactEntity = {};
          }
          if (res.data.taskEntity == null) {
            this.submitParams.taskEntity = {};
          }
          //  所在地区回显
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
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (!this.checked) {
            this.submitParams.taskEntity = null;
          } else {
            this.submitParams.taskEntity.remindType =
              this.remindType.toString();
          }
          if (
            this.submitParams.contactEntity.region != undefined &&
            this.submitParams.contactEntity.region != ""
          ) {
            this.submitParams.contactEntity.region =
              this.submitParams.contactEntity.region.toString();
          }
          if (
            this.submitParams.address != undefined &&
            this.submitParams.address != ""
          ) {
            this.submitParams.address = this.submitParams.address.toString();
          }
          if (this.id != "") {
            this.submitParams.id = this.id;
          }
          if (!this.checked) {
            this.submitParams.taskEntity = null;
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
