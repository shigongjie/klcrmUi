<template>
  <div>
    <el-dialog :visible="dialogVisible" width="40%" @close="btnCancel">
      <div slot="title" class="header-title">
        <div style="font-weight: 600">{{ titleName }}日程</div>
      </div>
      <el-form :model="form" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="日程标题：" prop="scheduleTitle">
          <el-input v-model="form.scheduleTitle"></el-input>
        </el-form-item>
        <el-form-item label="开始时间：" prop="beginTime">
          <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.beginTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间：" prop="endTime">
          <el-date-picker
            format="yyyy-MM-dd HH:mm:ss"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="form.endTime"
            style="width: 100%"
            type="datetime"
            placeholder="选择日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="紧要程度：">
          <el-radio-group v-model="form.urgencydegree">
            <el-radio
              v-for="(item, index) in remindUrgencydegreeList"
              :key="index"
              :label="item.dictValue"
              >{{ item.dictLabel }}</el-radio
            >
          </el-radio-group>
        </el-form-item>
        <el-form-item label="关联业务：">
          <el-form-item label="" label-width="0px">
            <el-row type="flex" justify="space-between">
              <el-select
                style="width: 49%"
                v-model="form.businessType"
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
              <el-select
                style="width: 49%"
                v-model="form.businessId"
                placeholder="选择："
              >
                <el-option
                  v-for="(item, index) in bussinessTypeList"
                  :key="index"
                  :label="item.name"
                  :value="item.id"
                ></el-option>
              </el-select>
            </el-row>
          </el-form-item>
        </el-form-item>
        <el-form-item label="日程描述：">
          <el-input
            type="textarea"
            :rows="4"
            placeholder="请输入描述信息"
            maxlength="300"
            show-word-limit
            v-model="form.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="日程状态：">
          <el-radio-group v-model="form.scheduleStatus">
            <el-radio :label="0">执行中</el-radio>
            <el-radio :label="1">已结束</el-radio>
            <el-radio :label="2">已取消</el-radio>
          </el-radio-group>
          <el-checkbox v-model="form.endAutomatic">过期自动结束</el-checkbox>
        </el-form-item>
        <el-form-item label="日程标记：">
          <div class="circleWarp">
            <div
              v-for="(item, index) in remindSignList"
              class="circle"
              :key="index"
              :style="{ backgroundColor: item.dictLabel }"
              @click="chooseRemind(item.dictValue)"
            >
              <i
                v-if="chooseRemindValue == item.dictValue"
                class="el-icon-check"
              ></i>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="日程提醒：">
          <el-select
            style="width: 100%"
            v-model="form.warn"
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
          <el-checkbox-group v-model="form.war">
            <el-checkbox
              v-for="(item, index) in remindTypeList"
              :key="index"
              :disabled="item.dictValue == 0"
              :label="item.dictValue"
              >{{ item.dictLabel }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="btnOK" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { commonselectList } from "@/api/customer/index";
import { saveSchedule } from "@/api/officeManagement";
export default {
  props: {
    dialogVisible: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    titleName() {
      return this.form.id ? "编辑" : "新增";
    },
  },
  data() {
    return {
      className: "check-style-1 theSpan",
      form: {
        war: ["0"],
        urgencydegree: "",
        scheduleStatus: "",
        endAutomatic: true,
        businessId: "",
        businessType: "",
      },
      chooseRemindValue: "",
      rules: {
        scheduleTitle: [
          { required: true, message: "请输入日程标题", trigger: "blur" },
        ],
        beginTime: [
          { required: true, message: "请输入开始时间", trigger: "blur" },
        ],
        endTime: [
          { required: true, message: "请输入结束时间", trigger: "blur" },
        ],
      },
      workBussinessList: [],
      bussinessTypeList: [],
      remindUrgencydegreeList: [],
      remindSignList: [],
      worktaskmanagerList: [],
      remindTypeList: [],
    };
  },
  mounted() {
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
      this.workBussinessList = res.data.filter((item) => {
        return item.dictCode !== 149 && item.dictCode !== 257;
      });
    });
    this.getDicts("remind_urgencydegree").then((res) => {
      this.remindUrgencydegreeList = res.data;
    });
  },
  watch: {
    "form.businessType"(val) {
      commonselectList({ type: val }).then((res) => {
        this.bussinessTypeList = res.data;
      });
    },
  },
  methods: {
    chooseRemind(ob) {
      this.chooseRemindValue = ob;
    },
    changeBussiness(val) {
      commonselectList({ type: val }).then((res) => {
        this.bussinessTypeList = res.data;
        this.form.businessId = "";
      });
    },
    async btnOK() {
      var data = {
        beginTime: this.form.beginTime,
        businessId: this.form.businessId,
        businessType: this.form.businessType,
        description: this.form.description,
        endAutomatic: this.form.endAutomatic ? 0 : 1,
        endTime: this.form.endTime,
        founderId: "",
        personId: "",
        scheduleStatus: this.form.scheduleStatus,
        scheduleTitle: this.form.scheduleTitle,
        sign: this.chooseRemindValue,
        urgencydegree: this.form.urgencydegree,
        war: this.form.war.toString(),
        warn: this.form.warn,
      };
      if (this.form.id) {
        data.id = this.form.id;
      }
      const result = await saveSchedule(data);
      if (result.code === 0) {
        if (this.form.id) {
          this.$message.success("编辑日程--成功");
        } else {
          this.$message.success("新增日程--成功");
        }
      } else {
        if (this.form.id) {
          this.$message.error(`编辑日程--失败！${result.message}`);
        } else {
          this.$message.error(`新增日程--失败！${result.message}`);
        }
      }
      this.$parent.getListMode();
      this.$parent.dialogVisible = false;
    },
    btnCancel() {
      this.form = {
        war: ["0"],
        urgencydegree: "",
        scheduleStatus: "",
        businessId: "",
        endAutomatic: true,
      };
      this.$refs.ruleForm.resetFields();
      this.$parent.dialogVisible = false;
    },
    spanTest(num) {
      this.form.sign = num;
      this.$nextTick(() => {
        var span = document.getElementsByClassName("theSpan");
        for (let i = 0; i < span.length; i++) {
          if (num === i) {
            span[i].className = this.className;
            continue;
          }
          span[i].className = "businessSpan theSpan";
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
}
::v-deep .el-textarea__inner {
  resize: none;
}
::v-deep .el-radio {
  margin-right: 15px;
}
::v-deep .el-checkbox {
  margin-left: 5px;
}
.bottomDiv {
  margin-bottom: 0;
}
::v-deep .el-dialog__body {
  padding-bottom: 5px;
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
  }
}
</style>
