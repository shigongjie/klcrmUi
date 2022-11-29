<template>
  <div class="container">
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <span @click="jumpGo">取消</span>
      <span class="newSchedule">{{ id ? "编辑" : "新建" }}日程</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div
      class="pd"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 96px;' : ''"
    >
      <div class="line"></div>
      <el-form
        class="selfForm"
        ref="rulesForm"
        :model="form"
        label-width="100px"
        label-position="right"
        size="small"
        :rules="rules"
      >
        <el-form-item
          class="customer_name"
          label="日程标题："
          prop="name"
          label-width="100px"
        >
          <el-input
            type=""
            v-model="form.scheduleTitle"
            placeholder="填写日程标题"
            style="padding-right: 14px;"
          ></el-input>
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
          <el-select v-model="form.urgencydegree">
            <el-option
              v-for="(item, index) in remindUrgencydegreeList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
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
            v-model="form.description"
          >
          </el-input>
        </el-form-item>
        <el-form-item label="日程状态：">
          <el-radio-group v-model="form.scheduleStatus" style="display: flex">
            <el-radio :label="0">执行中</el-radio>
            <el-radio :label="1">已结束</el-radio>
            <el-radio :label="2">已取消</el-radio>
          </el-radio-group>
          <!-- <el-checkbox v-model="form.endAutomatic">过期自动结束</el-checkbox> -->
        </el-form-item>
        <el-form-item
          label=""
          style="display: flex; justify-content: flex-end; padding-right: 30px"
        >
          <el-checkbox v-model="form.endAutomatic">过期自动结束</el-checkbox>
        </el-form-item>

        <el-form-item label="日程标记：" class="bottomDiv">
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

        <el-form-item label="任务提醒：">
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
          <el-select multiple v-model="form.war">
            <el-option
              v-for="(item, index) in remindTypeList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import { commonselectList } from "@/api/customer/index";
import { saveSchedule, scheduleSchedule } from "@/api/officeManagement";
import {
  customersave,
  customerdetail,
  getstaffList,
  getareaList,
  getcustomerList,
} from "@/api/customer/index";
import Dict from "@/components/dict/dict.vue";

export default {
  mixins: [Dict],
  data() {
    return {
      id: "",
      remindTypeList: [],
      checked: false,
      choosedUser: "",
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      userList: [],
      customerList: [],
      remindUrgencydegreeList: [],
      area: "",
      areaList: [],
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
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
      form: {
        userId: "",
        war: ["0"],
        contactEntity: {},
        taskEntity: {},
      },
      workBussinessList: [],
      remindSignList: [],
      bussinessTypeList: [],
      chooseRemindValue: "",
      remindUrgencydegreeList: [],
    };
  },
  beforeMount() {
    this.getDicts("remind_urgencydegree").then((res) => {
      this.remindUrgencydegreeList = res.data;
    });
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
    this.id = this.$route.query.id;
    getcustomerList({ type: 1 }).then((res) => {
      this.customerList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
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
      });
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        scheduleSchedule({ id: this.id }).then((res) => {
          this.form = res.data;
          this.changeBussiness(res.data.businessType);
          if (this.form.scheduleStatus === "0") {
            this.form.scheduleStatus = 0;
          } else if (this.form.scheduleStatus === "1") {
            this.form.scheduleStatus = 1;
          } else if (this.form.scheduleStatus === "2") {
            this.form.scheduleStatus = 2;
          }
          this.chooseRemindValue = this.form.sign;
          this.form.war = this.form.war.split(",");
        });
      }
    },
    changeUser() {},
    jumpGo() {
      this.$router.go(-1);
    },
    async submit() {
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
      if (this.form.war.length <= 0) {
        this.$message.error("请选择提醒方式");
        return;
      }
      const result = await saveSchedule(data);
      if (result.code === 0) {
        if (this.id) {
          this.$message.success("编辑日程--成功");
        } else {
          this.$message.success("新增日程--成功");
        }

        this.$router.push({
          path: "/scheduleh5",
        });
      } else {
        this.$message.error(`新增日程--失败！${result.message}`);
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height: 20px;
  background: RGB(249, 249, 249);
}
.container {
  height: 100%;
  color: #606266;
}
.header {
  font-size: 13px;
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
}
.newSchedule{
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
}
.pd {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.title {
  font-weight: 600;
  font-size: 13px;
  padding: 10px;
}
.selfForm {
  ::v-deep input {
    border: none;
    text-align: right;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-form-item {
    background: #ffffff;
    padding: 6px 10px;
    // padding-bottom: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid #ebeff3;
  }
  ::v-deep .el-input__prefix {
    display: none;
  }
  ::v-deep .el-form-item__error {
    right: 15px;
    text-align: right;
  }
  ::v-deep .el-radio-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 8px;
    padding-right: 10px;
    .el-radio {
      margin-right: 10px !important;
    } 
  }
  ::v-deep .el-input__inner{
    text-align: right;
  }
}
.customer_name {
  ::v-deep input {
    border: none;
    text-align: left;
  }
}
.circleWarp {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 7px;
  padding-right: 7px;
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
