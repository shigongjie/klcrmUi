/**新跟进 */
<template>
  <div v-if="open" style="margin-top: 200px">
    <el-dialog
      top="300vh"
      :title="this.editId ? '编辑跟进' : '添加跟进'"
      :visible.sync="open"
      width="600px"
      :close-on-click-modal="false"
    >
      <div style="width: 100%; margin: auto">
        <el-form
          class="selfForm"
          ref="rulesForm"
          :model="submitParams"
          label-width="100px"
          size="small"
          :rules="rules"
        >
          <el-row>
            <el-col :span="12">
              <el-form-item label="" label-width="0px">
                <el-select
                  style="width: 90%"
                  v-model="submitParams.recordEntity.followWay"
                  placeholder="到访："
                >
                  <el-option
                    v-for="(item, index) in followWayList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" label-width="0px">
                <el-date-picker
                  style="width: 100%"
                  v-model="submitParams.recordEntity.time"
                  value-format="yyyy-MM-dd HH:mm:ss"
                  type="datetime"
                  placeholder="日期"
                >
                </el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item prop="realName" label-width="0px">
            <el-input
              v-model="submitParams.recordEntity.description"
              placeholder="勤跟进，多签单"
              clearable
              size="small"
              type="textarea"
              :rows="3"
            />
          </el-form-item>
          <el-form-item prop="recordEntity.customerId" label="客户名称：">
            <el-select
              @change="changeCustomer"
              :disabled="customerId != ''"
              v-model="submitParams.recordEntity.customerId"
              placeholder="选择客户"
            >
              <el-option
                v-for="(item, index) in customerList"
                :key="index"
                :label="item.name"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="saleId == ''"
            prop="recordEntity.state"
            label="客户状态："
          >
            <el-select
              v-model="submitParams.recordEntity.state"
              placeholder="客户状态"
            >
              <el-option
                v-for="(item, index) in customerStateList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item v-else label="线索状态：" prop="recordEntity.state">
            <el-select
              v-model="submitParams.recordEntity.state"
              placeholder="线索状态"
              clearable
              size="small"
            >
              <!-- <el-option label="初步意向" value="0"></el-option>
              <el-option label="下次邀约" value="1"></el-option> -->
              <el-option
                v-for="(item, index) in sourceSatusList"
                :key="index"
                :label="item.dictLabel"
                :value="item.dictValue"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item
            v-if="saleId == ''"
            prop="recordEntity.contactId"
            label="联系人："
          >
            <el-select
              v-model="submitParams.recordEntity.contactId"
              placeholder="联系人"
            >
              <el-option
                v-for="(item, index) in contantList"
                :key="index"
                :label="item.contactName"
                :value="item.id"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="提醒谁看：">
            <el-cascader
              style="width: 100%"
              v-model="submitParams.recordEntity.remindUserIds"
              @change="changeUser"
              :options="userList"
              :show-all-levels="false"
              :props="propsMuti"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-checkbox v-model="checked">是否创建下次跟进</el-checkbox>
          </el-form-item>
          <div v-if="checked">
            <el-form-item prop="taskEntity.time" label="跟进时间：">
              <el-date-picker
                v-model="submitParams.taskEntity.time"
                type="datetime"
                style="width: 100%"
                value-format="yyyy-MM-dd HH:mm:ss"
                placeholder="选择日期时间"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item label="跟进内容：">
              <el-input
                v-model="submitParams.taskEntity.content"
                placeholder="请输入跟进内容"
              ></el-input>
            </el-form-item>
            <el-form-item prop="taskEntity.userId" label="跟进人员：">
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
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getcustomerList,
  savefollowUp,
  getxsList,
  getcontactList,
  subordinateList,
  detailForEdit,
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
    customerId: {
      type: String,
      default: "",
    },
    contactIds: {
      type: String,
      default: "",
    },
    editId: {
      type: String,
      default: "",
    },
    saleId: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      remindType: ["0"], //提醒方式
      checked: false,
      customerStateList: [],
      submitParams: {
        recordEntity: {
          customerId: "",
          contactId: "",
          time: "",
        },
        taskEntity: {
          remindType: [],
          time: "",
        },
      },
      sourceSatusList: [], //线索状态
      open: false,
      fileList: [],
      deptList: [],
      contantList: [],
      educationList: [],
      userList: [],
      remindTypeList: [],
      worktaskmanagerList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      propsMuti: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      customerList: [],
      followWayList: [],
      rules: {
        "taskEntity.userId": [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        "taskEntity.time": [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        "recordEntity.customerId": [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        "recordEntity.contactId": [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        "recordEntity.state": [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
      },
    };
  },
  watch: {
    checked(val) {
      if (val) {
        this.submitParams.taskEntity.userId = this.$store.state.user.userId;
      }
    },
    open(val) {
      console.log("this.editId", this.editId);
      if (val) {
        if (this.editId) {
          detailForEdit({ id: this.editId }).then((res) => {
            this.submitParams.recordEntity = res.data;
            if (this.submitParams.recordEntity.remindUserIds) {
              this.submitParams.recordEntity.remindUserIds =
                this.submitParams.recordEntity.remindUserIds.split(",");
            }
          });
        }
        if (this.customerId) {
          this.getcustomerList();
          getcontactList({ customerId: this.customerId }).then((res) => {
            this.contantList = res.rows;
            if (this.contactId != "") {
              this.$set(
                this.submitParams.recordEntity,
                "contactId",
                this.contactIds
              );
            }
          });
          this.submitParams.recordEntity.customerId = this.customerId;
          return;
        }
        if (this.saleId) {
          this.getxsLists();
          this.submitParams.recordEntity.customerId = this.saleId;
          return;
        } else {
          this.getcustomerList();
        }
      } else {
        this.submitParams = this.$options.data().submitParams;
        return;
      }
    },
  },
  beforeMount() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
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

    this.getDicts("customer_state").then((res) => {
      this.customerStateList = res.data;
    });
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
    });
    subordinateList().then((res) => {
      this.userList = res.data;
    });
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    changeCustomer(val) {
      getcontactList({ customerId: val }).then((res) => {
        this.contantList = res.rows;
      });
    },
    getcustomerList() {
      getcustomerList({type:1}).then((res) => {
        this.customerList = res.data;
      });
    },
    getxsLists() {
      getxsList({type:1}).then((res) => {
        this.customerList = res.data;
      });
    },
    changeUser() {},
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          this.submitParams = res.data;
        });
      } else {
        this.submitParams = {
          recordEntity: {
            customerId: "",
          },
          taskEntity: {},
        };
      }
    },
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(data) {
      this.submitParams.avatar = data.data;
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
          if (this.submitParams.recordEntity.remindUserIds) {
            if (this.submitParams.recordEntity.remindUserIds.length > 50) {
              this.$message.error("最多提醒50个人");
              return;
            }
            this.submitParams.recordEntity.remindUserIds =
              this.submitParams.recordEntity.remindUserIds.toString();
          }
          if (this.saleId) {
            this.submitParams.recordEntity.followType = 1;
          }
          savefollowUp(this.submitParams).then((res) => {
            if (this.editId) {
              this.$emit("reload",this.editId);
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$emit("reload",this.editId);
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
.el-select {
  width: 100%;
}
</style>
