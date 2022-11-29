/**新建联系人*/
<template>
  <div v-if="open">
    <el-dialog
      :title="id == '' ? '添加线索' : '编辑线索'"
      :visible.sync="open"
      width="50%"
    >
      <div style="width: 60%; margin: auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="120px"
          size="small"
          :rules="rules"
        >
          <el-form-item prop="customerName" label="客户名称：">
            <el-input
              v-model="submitParams.customerName"
              placeholder="请输入客户姓名"
            ></el-input>
          </el-form-item>
          <el-form-item prop="contactName" label="联系人姓名：">
            <el-input
              v-model="submitParams.contactName"
              placeholder="请输入联系人姓名"
            ></el-input>
          </el-form-item>
          <el-form-item label="尊称：" prop="sex">
            <el-radio-group v-model="submitParams.sex">
              <el-radio label="0">未知</el-radio>
              <el-radio label="1">先生</el-radio>
              <el-radio label="2">女士</el-radio>
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
          <el-form-item label="部门职务：">
            <el-input
              v-model="submitParams.deptRole"
              placeholder="请输入部门职务"
            ></el-input>
          </el-form-item>
          <el-form-item prop="phone" label="手机号码：">
            <el-input
              v-model="submitParams.phone"
              maxlength="11"
              placeholder="请输入手机号码"
            ></el-input>
          </el-form-item>
          <el-form-item prop="isIndustry" label="所属行业：">
            <el-input
              v-model="submitParams.isIndustry"
              placeholder="请输入所属行业"
            ></el-input>
            <!-- <el-select
              size="small"
              style="width: 100%"
              v-model="submitParams.industry"
              placeholder="所属行业"
            >
              <el-option
                v-for="dict in dict.type.industry"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item prop="address" label="所在地区：">
            <el-cascader
              placeholder="请选择所在地区"
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
          <el-form-item label="固定电话：">
            <el-input
              v-model="submitParams.tel"
              placeholder="请输入固定电话"
            ></el-input>
          </el-form-item>
          <el-form-item label="传真号码：">
            <el-input
              v-model="submitParams.faxNo"
              placeholder="请输入传真号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="电子邮箱：">
            <el-input
              v-model="submitParams.email"
              placeholder="请输入电子邮箱"
            ></el-input>
          </el-form-item>
          <el-form-item label="微信账号：">
            <el-input
              v-model="submitParams.vx"
              placeholder="请输入微信账号"
            ></el-input>
          </el-form-item>
          <el-form-item label="QQ号码：">
            <el-input
              v-model="submitParams.qq"
              placeholder="请输入QQ号码"
            ></el-input>
          </el-form-item>
          <el-form-item label="线索来源：" prop="source">
            <el-select
              style="width: 100%"
              v-model="submitParams.source"
              placeholder="线索来源"
            >
              <el-option
                v-for="(item, index) in customerSourceList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="线索状态：" prop="sourceStatus">
            <el-select
              style="width: 100%"
              v-model="submitParams.sourceStatus"
              placeholder="线索状态"
              clearable
              size="small"
            >
              <el-option
                v-for="(item, index) in sourceSatusList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
              <!-- <el-option label="初步意向" value="1"></el-option>
              <el-option label="下次邀约" value="2"></el-option> -->
              <!-- <el-option label="已转客户" value="0"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item label="归属人员：" prop="affiliationStaff">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.affiliationStaff"
              @change="changeUser"
              :options="userList"
              :show-all-levels="false"
              :props="props"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="标签：">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.labels"
              :options="labelList"
              :show-all-levels="false"
              :props="propsArray"
              separator=","
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="checked">是否创建下次跟进</el-checkbox>
          </el-form-item>
          <div v-if="checked">
            <el-form-item label="跟进时间：">
              <el-date-picker
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
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
import { getstaffList, getareaList, getlabelList } from "@/api/customer/index";
import {
  saveMark,
  getMarketClueDetailById,
  getsaleLeaddetail,
} from "@/api/saleslead/index";
export default {
  dicts: ["industry"],
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
  propsArray: {
    id: {
      type: Array,
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
      customerSourceList: [],
      remindType: ["0"], //提醒方式
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      checked: false, //是否创建下次跟进
      submitParams: {
        taskEntity: {},
      },
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
      labelList: [],
      sourceSatusList: [], //线索状态
      rules: {
        address: [
          { required: true, message: "请选择所在地区", trigger: "change" },
        ],
        // source: [{ required: true, message: "请选择", trigger: "change" }],
        // sourceStatus: [
        //   { required: true, message: "请选择", trigger: "change" },
        // ],
        customerName: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        isIndustry: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入必填项", trigger: "blur" }],
        // affiliationStaff: [
        //   { required: true, message: "请选择", trigger: "change" },
        // ],
      },
    };
  },
  beforeMount() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
    /**提醒类型 */
    this.getDicts("work_task_manager_type").then((res) => {
      this.worktaskmanagerList = res.data;
    });
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    /**提醒类型 */
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });
    /**客户来源 */
    this.getDicts("customer_source").then((res) => {
      this.customerSourceList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    getlabelList().then((res) => {
      this.labelList = res.data;
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
      } else {
        // 清空表单
        this.submitParams = this.$options.data().submitParams;
        this.checked = false;
      }
    },
  },
  mounted() {
    // this.isEdit();
  },
  methods: {
    reset() {
      this.submitParams = this.$options.data().submitParams;
      this.checked = false;
    },
    changeUser() {},
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getsaleLeaddetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          // this.submitParams.affiliationStaff = res.data.affiliationStaff;
          if (res.data.taskEntity == null) {
            this.submitParams.taskEntity = {};
          }
          if (this.submitParams.address) {
            this.submitParams.address = this.submitParams.address
              .split(",")
              .map((item) => {
                return +item;
              });
          }
        });
      } else {
        this.submitParams = {
          taskEntity: {},
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
          if (
            this.submitParams.address != undefined &&
            this.submitParams.address != ""
          ) {
            this.submitParams.address = this.submitParams.address.toString();
          }
          saveMark(this.submitParams).then((res) => {
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
