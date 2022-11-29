/**新建联系人*/
<template>
  <div v-if="open">
    <el-dialog
      :title="id == '' ? '添加联系人' : '编辑联系人'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <div style="width: 60%; margin: auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          size="small"
          :rules="rules"
        >
          <el-form-item prop="contactName" label="联系人姓名">
            <el-input
              v-model="submitParams.contactName"
              placeholder="请输入联系人姓名"
              maxlength="10"
            ></el-input>
          </el-form-item>
          <el-form-item prop="relevancyClient" label="关联客户">
            <el-select
              style="width: 100%"
              v-model="submitParams.relevancyClient"
              placeholder="关联客户"
            >
              <el-option
                v-for="(item, index) in customerList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="尊称：" prop="contactSex">
            <el-radio-group v-model="submitParams.sex">
              <el-radio label="0">保密</el-radio>
              <el-radio label="2">女士</el-radio>
              <el-radio label="1">先生</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label=" 角色：">
            <el-select
              style="width: 100%"
              v-model="submitParams.role"
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
              style="width: 100%"
              v-model="submitParams.birthday"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择联系人生日"
            >
            </el-date-picker>
          </el-form-item>
          <el-form-item label="部门职务">
            <el-input
              v-model="submitParams.deptRole"
              placeholder="请输入部门职务"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码">
            <el-input
              v-model="submitParams.phone"
              maxlength="11"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="固定电话">
            <el-input
              v-model="submitParams.tel"
              placeholder="请输入固定电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="传真号码">
            <el-input
              v-model="submitParams.faxNo"
              placeholder="请输入传真号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱">
            <el-input
              v-model="submitParams.email"
              placeholder="请输入电子邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信账号">
            <el-input
              v-model="submitParams.vx"
              placeholder="请输入微信账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ号码">
            <el-input
              v-model="submitParams.qq"
              placeholder="请输入QQ号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="所在地区">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.region"
              :options="areaList"
              :props="areaListprops"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="详细地址">
            <el-input
              v-model="submitParams.address"
              placeholder="请输入详细地址"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注信息">
            <el-input
              v-model="submitParams.remark"
              placeholder="请输入备注信息"
            ></el-input>
          </el-form-item>

          <el-form-item label="">
            <el-checkbox v-if="id == ''" v-model="checked"
              >是否创建下次跟进</el-checkbox
            >
          </el-form-item>
          <div v-if="checked">
            <el-form-item label="跟进时间：">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-DD HH:mm:ss"
                v-model="submitParams.taskEntity.time"
                type="datetime"
                placeholder="日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进内容：">
              <el-input
                v-model="submitParams.taskEntity.content"
                placeholder="请输入跟进内容"
              ></el-input>
            </el-form-item>
            <el-form-item label="跟进人员：">
              <el-cascader
                style="width: 100%"
                v-model="submitParams.taskEntity.userId"
                @change="changeUser"
                :options="userList"
                :show-all-levels="false"
                :props="props"
                clearable
              ></el-cascader>
            </el-form-item>
            <el-form-item label="跟进提醒：">
              <el-select
                v-model="submitParams.taskEntity.remindTime"
                placeholder="跟进提醒"
              >
                <el-option
                  v-for="(item, index) in worktaskmanagerList"
                  :key="index"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="提醒方式：">
              <el-checkbox-group v-model="remindType">
                <el-checkbox
                  v-for="(item, index) in remindTypeList"
                  :key="index"
                  :disabled="item.dictValue == 0"
                  :label="item.dictValue"
                  >{{ item.dictLabel }}</el-checkbox
                >
              </el-checkbox-group>
              <!-- <el-radio-group v-model="submitParams.taskEntity.remindType">
                <el-radio
                  v-for="(item, index) in remindTypeList"
                  :key="index"
                  :label="item.dictValue"
                  >{{ item.dictLabel }}</el-radio
                >
              </el-radio-group> -->
            </el-form-item>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="" @click="reset()">重置</el-button>
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  saveContact,
  getstaffList,
  getcustomerList,
  getareaList,
  contactdetail,
} from "@/api/customer/index";
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
    customerId: {},
  },
  data() {
    return {
      remindType: ["0"], //提醒方式
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      checked: false,
      submitParams: {
        relevancyClient: "",
        taskEntity: {},
      },
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      open: false,
      customerList: [],
      deptList: [],
      educationList: [],
      userList: [],
      followWayList: [],
      remindTypeList: [],
      worktaskmanagerList: [],
      customerRoleList: [],
      areaList: [],
      rules: {
        contactName: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        relevancyClient: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入必填项", trigger: "blur" }],
      },
    };
  },
  beforeMount() {
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    getcustomerList({ type: 1 }).then((res) => {
      this.customerList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
    });
    this.getDicts("follow_way").then((res) => {
      this.followWayList = res.data;
    });
    /**提醒类型 */
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });
    this.getDicts("work_task_manager_type").then((res) => {
      this.worktaskmanagerList = res.data;
    });
  },
  watch: {
    checked(val) {
      if (val) {
        this.submitParams.taskEntity.userId = this.$store.state.user.userId;
      }
    },
    open(val) {
      if (val) {
        this.isEdit();
        this.submitParams.relevancyClient = this.customerId;
      } else {
        // 清空表单
        this.submitParams = this.$options.data().submitParams;
        this.checked = false;
      }
    },
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    reset() {
      this.submitParams = this.$options.data().submitParams;
      this.submitParams.relevancyClient = this.customerId;
      this.checked = false;
    },
    changeUser() {},
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        contactdetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          if (res.data.taskEntity == null) {
            this.submitParams.taskEntity = {};
          }
          if (this.submitParams.region) {
            this.submitParams.region = this.submitParams.region
              .split(",")
              .map((item) => {
                return +item;
              });
          }
        });
      } else {
        this.submitParams = {
          taskEntity: {},
          relevancyClient: "",
        };
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
          if (this.submitParams.region) {
            this.submitParams.region = this.submitParams.region.toString();
          }
          saveContact(this.submitParams).then((res) => {
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
