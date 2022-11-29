<template>
  <div class="">
    <div class="NoticWarp">
      <span @click="seeNoticeList" class="notic"
        ><i class="el-icon-message-solid"></i>系统公告</span
      >
      <el-carousel
        class="carouselself"
        height="35px"
        direction="vertical"
        :autoplay="true"
        :interval="3000"
      >
        <el-carousel-item v-for="(item, index) in noticList" :key="index">
          <div @click="seemoreNotic(item)" class="medium">
            {{ item.headline }}
            <span v-if="item.status == 0" style="color: red">NEW</span>
          </div>
        </el-carousel-item>
      </el-carousel>
    </div>
    <div class="title">快速新建</div>

    <div class="menu">
      <div v-for="(item, index) in menu" :key="index" @click="handle(item)">
        <span><i :class="item.icon" /></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <div class="center">
      <div class="Div">
        <div class="title titleSelect">
          <span>数据简报</span>
          <div>
            <el-select
              @change="changecondition"
              size="mini"
              v-model="condition"
              placeholder="请选择"
            >
              <el-option
                v-for="item in reportOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <el-select
              @change="changecondition"
              style="margin-left: 10px"
              size="mini"
              v-model="timeStatus"
              placeholder="请选择"
            >
              <el-option
                v-for="item in TimesOptionList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </div>
        </div>

        <div class="reportDiv">
          <div
            class="reportEachDiv"
            v-for="(item, key, index) in reportDataList"
            :key="index"
          >
            <span>{{ key }}</span>
            <span>{{ item }}</span>
          </div>
        </div>
      </div>
      <div class="Div">
        <div class="title">
          <span>待办事项</span>
        </div>
        <div class="todolistDiv">
          <div
            v-for="(item, key, index) in todoList"
            :key="index"
            @click="handleJump(key)"
          >
            <span>{{ item.id }}</span>
            <span>数量（{{ item.name }}）</span>
          </div>
        </div>
      </div>
    </div>

    <div class="center">
      <div class="Div">
        <div class="title titleSelect">
          <span>工作报告</span>
          <div>
            <el-select
              size="mini"
              v-model="homeType"
              placeholder="请选择"
              @change="changeHomeType"
            >
              <el-option
                v-for="item in workReportListShow"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
            <!-- <el-button size="mini" style="margin-left: 10px"
              >写新报告</el-button
            > -->
            <el-popover
              style="margin: 0 5px"
              placement="bottom-start"
              width="100"
              trigger="click"
            >
              <div class="locitem">
                <el-button
                  class="locBtn"
                  v-for="obj in reportTypeArr"
                  :key="obj.dictCode"
                  size="mini"
                  @click="locBton(obj, 1)"
                  >{{ obj.dictLabel }}</el-button
                >
              </div>
              <el-button
                icon="el-icon-plus"
                size="mini"
                type="primary"
                slot="reference"
                >添加</el-button
              >
            </el-popover>
            <el-button size="mini" @click="seeMore">查看更多</el-button>
          </div>
        </div>
        <div class="todolistDiv workList">
          <div v-for="(item, index) in workReportList" :key="index">
            <span class="width100">{{ item.headline }}</span>
            <span>{{ item.founderId }}</span>
            <span>
              <span
                class="businessSpan"
                :style="{
                  background:
                    item.auditStatus === '未批阅' ? '#fec03d' : '#4BD863',
                }"
              />
              <span>{{ item.auditStatus }}</span>
            </span>

            <span @click="particularsBtn(item)"
              ><i class="el-icon-arrow-right"></i> 详情</span
            >
          </div>
        </div>
      </div>
      <!-- <div class="Div">
        <div class="title">
          <span>日程日历</span>
        </div>
        <div>
          <el-calendar>
            <template slot="dateCell" slot-scope="{ date,data }">
              <p :class="data.isSelected ? 'is-selected' : ''" @click="test(date)">
                {{data.day.split("-")[2]}}
                {{ data.isSelected ? "✔️" : "" }}
              </p>
            </template>
          </el-calendar>
        </div>
      </div> -->
    </div>
    <Customer ref="Customer" v-if="CustomerOpen" />
    <Clue ref="Clue" v-if="ClueOpen" />
    <ConnectPerson ref="ConnectPerson" v-if="ConnectPersonOpen" />
    <FollowUp ref="FollowUp" v-if="FollowUpOpen" />

    <Dept ref="Dept" v-if="DeptOpen" />
    <Staff ref="Staff" v-if="StaffOpen" />
    <Task ref="Task" v-if="TaskOpen" />
    <!-- <WorkOrder ref="WorkOrder" /> -->
    <WorkOrder ref="WorkOrder" v-if="WorkOrderOpen" />
    <Report
      :reportVisible="reportVisible"
      :reportObj="reportObj"
      :typeId="typeId"
    />
    <div style="height: 200px"></div>
    <!-- 公告 -->
    <el-dialog
      :close-on-click-modal="false"
      :title="currentData.headline"
      :visible.sync="showDetailNotic"
      width="50%"
      center
      :before-close="closeNotice"
    >
      <div class="description">
        <div class="vhtml" v-html="currentData.description"></div>
      </div>

      <div class="fileWarp">
        <div
          v-for="(item, index) in fileList"
          :key="index"
          @click="downLoad(item)"
        >
          <i class="el-icon-paperclip"></i> {{ item.name }}
        </div>
      </div>
      <div style="margin-top: 20px; display: flex">
        <el-input
          style="border-top-right-radius: 0; border-bottom-right-radius: 0"
          placeholder="请输入评论内容"
          v-model="commentData"
        >
        </el-input>
        <el-button
          style="border-top-left-radius: 0; border-bottom-left-radius: 0"
          type="primary"
          @click="sendcomment"
          >发送</el-button
        >
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="closeNotice">取消</el-button>
        <el-button size="mini" type="primary" @click="closeNotice"
          >关闭</el-button
        >
      </span>
    </el-dialog>

    <el-dialog
      :close-on-click-modal="false"
      :visible.sync="AllNoticlistdialog"
      width="50%"
      center
    >
      <div class="description" v-if="AllNoticList.length <= 0">暂无公告</div>
      <div
        @click="seemoreNotic(item)"
        style="padding: 10px; cursor: pointer"
        v-for="(item, index) in AllNoticList"
        :key="index"
      >
        ·{{ item.headline }}
        <span v-if="item.status == 0" style="color: red">NEW</span>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="AllNoticlistdialog = false"
          >取消</el-button
        >
        <el-button
          size="mini"
          type="primary"
          @click="AllNoticlistdialog = false"
          >关闭</el-button
        >
      </span>
    </el-dialog>
  </div>
</template>

<script>
import axios from "axios";
import Report from "../officeManagement/WorkStatement/comportRecords/report.vue";
import { workreporthomepage } from "@/api/officeManagement";
import Customer from "../add/customer.vue";
import Clue from "../add/clue.vue";
import ConnectPerson from "../add/connectperson.vue";
import FollowUp from "../add/followup.vue";
import Dept from "../add/dept.vue";
import Staff from "../add/staff.vue";
import Task from "../add/task.vue";
import WorkOrder from "../add/newWorkOrder.vue";
import { getHome, getSchedule, getIntradayWork } from "@/api/customer/index";
import {
  getIndexNotice,
  affichelook,
  sendcomment,
  getPages,
} from "@/api/notic/index";

export default {
  components: {
    Customer,
    Clue,
    ConnectPerson,
    FollowUp,
    Dept,
    Staff,
    Task,
    WorkOrder,
    Report,
  },
  name: "Index",
  data() {
    return {
      commentData: "",
      showDetailNotic: false,
      currentData: {},
      typeId: 0,
      reportVisible: false,
      reportObj: {},
      CustomerOpen: false, //客户弹窗
      ConnectPersonOpen: false,
      StaffOpen: false,
      FollowUpOpen: false,
      DeptOpen: false,
      TaskOpen: false,
      WorkOrderOpen: false,
      ClueOpen: false,
      username: "", //用户名
      //简报
      value: "",
      // 公告列表
      noticList: [],
      TimesOptionList: [
        {
          value: 0,
          label: "今天",
        },
        {
          value: 1,
          label: "昨天",
        },
        {
          value: 2,
          label: "本周",
        },
        {
          value: 3,
          label: "上周",
        },
        {
          value: 4,
          label: "本月",
        },
        {
          value: 5,
          label: "上月",
        },
        {
          value: 6,
          label: "本季度",
        },
        {
          value: 7,
          label: "上季度",
        },
        {
          value: 8,
          label: "今年",
        },
        {
          value: 9,
          label: "去年",
        },
      ],
      reportOptionList: [
        {
          value: 0,
          label: "公司简报",
        },
        {
          value: 1,
          label: "部门简报",
        },
        {
          value: 2,
          label: "我的简报",
        },
      ],
      reportDataList: [],
      // 工作报告下拉框
      workReportOptionList: [
        { label: "提交给我的", value: "0" },
        { label: "我提交的", value: "1" },
        { label: "下属提交的", value: "2" },
      ],
      homeType: "0",
      // 工作报告
      workReportList: [],
      //
      menu: [
        {
          name: "新建客户",
          url: "",
          icon: "el-icon-office-building",
          url: "/bussinessManage/bussinessManager",
          type: "Customer",
        },
        // {
        //   name: "添加线索",
        //   url: "",
        //   icon: "el-icon-user",
        //   url: "/staffManager/staffmanager",
        //   type: "Clue",
        // },
        {
          name: "添加联系人",
          url: "",
          icon: "el-icon-s-order",
          url: "/logs/actionlogs",
          type: "ConnectPerson",
        },
        {
          name: "写新跟进",
          url: "",
          icon: "el-icon-s-order",
          url: "/logs/actionlogs",
          type: "FollowUp",
        },
        {
          name: "新建任务",
          url: "",
          icon: "el-icon-menu",
          url: "/bussinessManage/bussinessManager",
          type: "Task",
        },
        {
          name: "新建工单",
          url: "",
          icon: "el-icon-menu",
          url: "/bussinessManage/bussinessManager",
          type: "WorkOrder",
        },
      ],
      todoList: [
        { name: "今日待处理任务", type: "1" },
        { name: "今日待处理任务", type: "1" },
        { name: "今日待处理任务", type: "1" },
        { name: "今日待处理任务", type: "1" },
        { name: "今日待处理任务", type: "1" },
        { name: "今日待处理任务", type: "1" },
      ],
      condition: "",
      timeStatus: "",
      reportTypeArr: [],
      fileList: [],
      noticeStartViewTime: "",
      noticeEndViewTime: "",
      AllNoticlistdialog: false,
      AllNoticList: [],
    };
  },
  beforeRouteEnter(to, from, next) {
    if (document.documentElement.clientWidth > 750) {
      next();
    } else {
      next("home");
    }
  },
  beforeMount() {
    this.getDicts("report_type").then((res) => {
      this.reportTypeArr = res.data;
    });
    this.getworkreportPage();
    this.getSchedule();
    this.getHome();
    this.getPages();
  },
  computed: {
    workReportListShow() {
      console.log(this.$store.state.user.isDeptHead);
      if (this.$store.state.user.isDeptHead == 0) {
        return this.workReportOptionList.filter((item, index) => {
          if (item.value != 2) {
            return item;
          }
        });
      } else {
        return this.workReportOptionList;
      }
    },
  },
  watch: {
    showDetailNotic(val) {
      if (!val) {
        this.commentData = "";
      }
    },
  },
  mounted() {},
  methods: {
    seeNoticeList() {
      getPages({ type: 1 }).then((res) => {
        this.AllNoticList = res.rows;
        this.AllNoticlistdialog = true;
      });
    },
    sendcomment() {
      sendcomment({
        id: this.currentData.id,
        commentContent: this.commentData,
      }).then((res) => {
        this.$message.success("评论成功");
        this.commentData = "";
      });
    },
    getPages() {
      getIndexNotice().then((res) => {
        this.noticList = res.data;
      });
    },
    seemoreNotic(ob) {
      this.currentData = ob;
      if (ob.accessory) {
        this.fileList = JSON.parse(ob.accessory);
      }
      if (ob.status == 0) {
        this.noticeStartViewTime = this.dateToString(new Date());
      }
      this.showDetailNotic = true;
    },
    dateToString(dateTime) {
      var now = new Date();
      var year = now.getFullYear(); //年
      var month = now.getMonth() + 1; //月
      var day = now.getDate(); //日

      var hh = now.getHours(); //时
      var mm = now.getMinutes(); //分
      if (now.getMinutes() / 60 > 1) {
        hh += Math.floor((now.getMinutes() + addtime) / 60);
      }
      var ss = now.getSeconds();
      var clock = year + "-";

      if (month < 10) clock += "0";

      clock += month + "-";

      if (day < 10) clock += "0";

      clock += day + " ";

      if (hh < 10) clock += "0";

      clock += hh + ":";
      if (mm < 10) clock += "0";
      clock += mm + ":";
      if (ss < 10) clock += "0";
      clock += ss;
      return clock;
    },
    closeNotice() {
      // affichelook();
      if (this.currentData.status == 0) {
        let data = {};
        data.id = this.currentData.id;
        data.startTime = this.noticeStartViewTime;
        data.endTime = this.dateToString(new Date());
        affichelook(data).then((res) => {
          this.getPages();
          getPages({ type: 1 }).then((res) => {
            this.AllNoticList = res.rows;
          });
        });
      }
      this.showDetailNotic = false;
      this.AllNoticlistdialog = false;
    },
    seeMore() {
      this.$router.push("/officeManagement/WorkStatement");
    },
    locBton(obj, typeId) {
      this.reportObj = obj;
      this.typeId = typeId;
      this.reportVisible = true;
    },
    changecondition() {
      let data = {};
      if (this.condition !== "" && this.condition !== null) {
        data.condition = this.condition;
      }
      if (this.timeStatus !== "" && this.timeStatus !== null) {
        data.timeStatus = this.timeStatus;
      }
      this.getHome(data);
    },
    particularsBtn(obj) {
      this.typeId = 1;
      this.$router.push({ name: "Particulars", query: { id: obj.id } });
    },
    changeHomeType() {
      this.getworkreportPage();
    },
    getworkreportPage() {
      workreporthomepage({ homeType: this.homeType }).then((Res) => {
        this.workReportList = Res.data;
      });
    },
    getSchedule() {
      getSchedule().then((Res) => {
        this.todoList = Res.data;
      });
    },
    getHome(data) {
      getHome(data).then((res) => {
        this.reportDataList = res.data;
      });
    },
    downLoad(item) {
      axios.get(item.url, { responseType: "blob" }).then((res) => {
        const blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = item.name;
        a.click();
        document.body.removeChild(a);
      });
    },
    handleJump(key) {
      switch (key) {
        case "a":
          this.$router.push({ path: "/officeManagement/taskmanager" });
          break;
        case "b":
          this.$router.push({ path: "/officeManagement/listmode" });
          break;
        case "c":
          this.$router.push({ path: "/officeManagement/taskmanager" });
          break;
        case "d":
          this.$router.push({ path: "/officeManagement/taskmanager" });
          break;
        case "e":
          this.$router.push({ path: "/workorderlist" });
          break;
        case "f":
          this.$router.push({ path: "/officeManagement/WorkStatement" });
          break;
      }
    },
    handle(ob) {
      switch (ob.type) {
        case "Customer":
          this.CustomerOpen = true;
          this.$nextTick(() => {
            this.$refs.Customer.open = true;
          });
          break;
        case "Clue":
          this.ClueOpen = true;
          this.$nextTick(() => {
            this.$refs.Clue.open = true;
          });
          break;
        case "ConnectPerson":
          this.ConnectPersonOpen = true;
          this.$nextTick(() => {
            this.$refs.ConnectPerson.open = true;
          });
          break;
        case "FollowUp":
          this.FollowUpOpen = true;
          this.$nextTick(() => {
            this.$refs.FollowUp.open = true;
          });
          break;
        case "Task":
          this.TaskOpen = true;
          this.$nextTick(() => {
            this.$refs.Task.open = true;
          });
          break;
        case "Dept":
          this.DeptOpen = true;
          this.$nextTick(() => {
            this.$refs.Dept.open = true;
          });
          break;
        case "WorkOrder":
          //新建工单
          this.WorkOrderOpen = true;
          this.$nextTick(() => {
            this.$refs.WorkOrder.open = true;
          });
          break;
        case "Staff":
          this.StaffOpen = true;
          this.$nextTick(() => {
            this.$refs.Staff.open = true;
          });
          break;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.title {
  padding: 15px 20px;
  background: #f9f9f9;
  font-weight: 600;
  font-size: 14px;
}
.titleSelect {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.center {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  .Div {
    width: 49%;
    border: 1px solid #e9e9e9;
  }
}
.reportDiv {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(3, 33%);
  .reportEachDiv {
    font-size: 14px;
    width: 33%;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    span:nth-child(2) {
      font-size: 24px;
    }
  }
}
.todolistDiv {
  height: 300px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: baseline;
  overflow-y: hidden;
  padding: 0 20px;
  div {
    border-bottom: 1px solid #f2f2f2;
    width: 100%;
    padding: 10px 10px;
    font-size: 13px;
    display: flex;
    justify-content: space-between;
    cursor: pointer;
  }
}
.workList {
  // padding-top: 100px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  overflow-y: scroll;
  div {
    height: 50px;
    box-sizing: border-box;
    flex-shrink: 0;
  }
}
.menu {
  border-top: 1px solid #e9e9e9;
  border-bottom: 1px solid #e9e9e9;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  div {
    font-size: 13px;
    background: #ffffff;
    width: 150px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    i {
      font-size: 40px;
    }
  }
  div:hover {
    border-color: black;
    color: black;
    i {
      color: black;
    }
  }
}
.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  // font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
.width100 {
  width: 180px;
}
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  margin-right: 5px;
}
.locitem ::v-deep .el-button {
  width: 92px;
  background-color: #eeeeee;
  margin: 3px 0 3px 0;
}
.locitem {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.medium {
  padding-left: 15px;
  font-size: 13px;
  line-height: 35px;
}
.description {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.fileWarp {
  div {
    margin-top: 10px;
    cursor: pointer;
  }
  div:hover {
    color: #409eff !important;
  }
}
.notic {
  width: 90px;
  height: 35px;
  // margin-top: -5px;
  color: #409eff;
  cursor: pointer;
  line-height: 35px;
}
.NoticWarp {
  padding: 10px;
  font-size: 13px;
  width: 100%;
  display: flex;
  align-items: center;
}
.carouselself {
  width: 100%;
  cursor: pointer;
}
::v-deep .vhtml {
  img {
    width: 100%;
    height: 100%;
  }
}
</style>

