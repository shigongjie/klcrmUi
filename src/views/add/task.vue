/**新建任务 */
<template>
  <div v-if="open">
    <el-dialog
      :title="id == '' ? '添加任务' : '编辑任务'"
      :visible.sync="open"
      width="60%"
      :close-on-click-modal="false"
    >
      <!-- <div style="width:60%;margin:auto"> -->
      <el-form
        class="selfForm"
        ref="rulesForm"
        :model="submitParams"
        label-width="100px"
        size="small"
        :rules="rules"
      >
        <el-form-item prop="headline" label="任务标题">
          <el-input
            v-model="submitParams.headline"
            placeholder="请输入任务标题"
          ></el-input>
        </el-form-item>
        <el-form-item prop="beginTime" label="开始时间">
          <el-date-picker
            style="width: 100%"
            v-model="submitParams.beginTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择开始时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime" label="结束时间">
          <el-date-picker
            style="width: 100%"
            v-model="submitParams.endTime"
            value-format="yyyy-MM-dd HH:mm:ss"
            type="datetime"
            placeholder="选择结束时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="紧要程度">
          <el-radio-group v-model="submitParams.urgencydegree">
            <el-radio
              v-for="(item, index) in remindUrgencydegreeList"
              :key="index"
              :label="item.dictValue"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联业务">
          <el-row>
            <el-col :span="12">
              <el-form-item label="" label-width="0px">
                <el-select
                  style="width: 90%"
                  v-model="submitParams.businessType"
                  placeholder="选择业务："
                  @change="changeBussiness"
                >
                  <el-option
                    v-for="(item, index) in workBussinessList"
                    :key="index"
                    :label="item.dictLabel"
                    :value="item.dictValue"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="" label-width="0px">
                <el-select
                  style="width: 100%"
                  v-model="submitParams.businessId"
                  placeholder="选择客户："
                  multiple
                >
                  <el-option
                    v-for="(item, index) in bussinessTypeList"
                    :key="index"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item label="任务描述">
          <el-input
            type="textarea"
            v-model="submitParams.description"
            placeholder="请输入任务描述"
          ></el-input>
        </el-form-item>
        <el-form-item prop="personId" label="负责人员">
          <el-cascader
            style="width: 100%"
            v-model="submitParams.personId"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="participantId" label="参与人员">
          <el-cascader
            style="width: 100%"
            v-model="submitParams.participantId"
            :options="userList"
            :show-all-levels="false"
            :props="propsmult"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="任务标记">
          <div class="circleWarp">
            <div
              v-for="(item, index) in remindSignList"
              class="circle"
              :key="index"
              :style="{ background: item.dictLabel }"
              @click="chooseRemind(item.dictValue)"
            >
              <i
                v-if="chooseRemindValue == item.dictValue"
                class="el-icon-check"
              ></i>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="任务提醒">
          <el-select
            style="width: 100%"
            v-model="submitParams.warn"
            :disabled="id != ''"
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
        <el-form-item label="提醒方式">
          <el-checkbox-group v-model="remindType">
            <el-checkbox
              v-for="(item, index) in remindTypeList"
              :key="index"
              :disabled="item.dictValue == 0 || id != ''"
              :label="item.dictValue"
              >{{ item.dictLabel }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { saveWork, commonselectList, getstaffList } from "@/api/customer/index";
import { detailById } from "@/api/task/index";
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
    type: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      remindType: ["0"],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      propsmult: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      submitParams: {},
      open: false,
      userList: [],
      workBussinessList: [],
      remindUrgencydegreeList: [],
      remindSignList: [],
      chooseRemindValue: "",
      worktaskmanagerList: [],
      remindTypeList: [],
      bussinessTypeList: [],
      rules: {
        headline: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        participantId: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        personId: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        beginTime: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        endTime: [{ required: true, message: "请输入必填项", trigger: "blur" }],
      },
    };
  },
  watch: {
    open(val) {
      if (val) {
        if (this.customerId) {
          this.submitParams.businessType = this.type.toString();
          commonselectList({ type: this.type }).then((res) => {
            this.bussinessTypeList = res.data;
            this.$set(this.submitParams, "businessId", this.customerId);
          });
        }
        this.isEdit();
      } else {
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  beforeMount() {
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });
    this.getDicts("work_task_manager_type").then((res) => {
      this.worktaskmanagerList = res.data;
    });
    this.getDicts("remind_sign").then((res) => {
      this.remindSignList = res.data;
    });
    this.getDicts("work_business_type").then((res) => {
      // this.workBussinessList = res.data;
      this.workBussinessList = res.data.filter((item) => {
        return item.dictValue != 5;
      });
    });
    this.getDicts("remind_urgencydegree").then((res) => {
      this.remindUrgencydegreeList = res.data;
    });

    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    chooseRemind(ob) {
      this.chooseRemindValue = ob;
    },
    changeBussiness(val) {
      commonselectList({ type: val }).then((res) => {
        this.bussinessTypeList = res.data;
        this.submitParams.businessId = "";
      });
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        detailById({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          // 参与人员回显
          this.submitParams.participantId =
            this.submitParams.participantId.split(",");
          this.remindType = this.submitParams.war.split(",");
          this.submitParams.businessId =
            this.submitParams.businessId.split(",");
          this.chooseRemindValue = this.submitParams.sign;
          commonselectList({ type: res.data.businessType }).then((res) => {
            this.bussinessTypeList = res.data;
          });
        });
      }
    },
    submit() {
      this.submitParams.sign = this.chooseRemindValue;
      this.submitParams.war = this.remindType.toString();
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          if (this.submitParams.participantId) {
            this.submitParams.participantId =
              this.submitParams.participantId.toString();
          }
          saveWork(this.submitParams).then((res) => {
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
.circleWarp {
  display: flex;
  align-items: center;
  margin-top: 7px;
  .circle {
    text-align: center;
    color: #ffffff;
    line-height: 20px;
    cursor: pointer;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    // border: 1px solid;
  }
}
</style>
