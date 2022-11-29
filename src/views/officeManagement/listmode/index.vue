<template>
  <div
    class="app-container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" ref="formInline">
            <el-form-item prop="patternVal">
              <el-select
                class="wid"
                v-model="formInline.patternVal"
                @change="goToUrl"
                placeholder="列表模式"
              >
                <el-option
                  v-for="item in pattern"
                  :key="item.value"
                  :label="item.label"
                  :disabled="item.disabled"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>

            <el-form-item prop="scheduleVal">
              <el-select
                class="wid"
                v-model="formInline.scheduleVal"
                placeholder="全部日程"
              >
                <el-option
                  v-for="item in formInline.schedule"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="keyword">
              <el-input
                class="wid"
                v-model="formInline.keyword"
                placeholder="关键词"
              ></el-input>
            </el-form-item>
            <el-form-item prop="beginTime">
              <el-date-picker
                style="width: 300px"
                value-format="yyyy-MM-dd "
                v-model="formInline.beginTime"
                format="yyyy-MM-dd "
                type="daterange"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              >
              </el-date-picker>
            </el-form-item>
            <el-form-item prop="urgencydegree">
              <el-select
                class="wid"
                v-model="formInline.urgencydegree"
                placeholder="紧要程度"
              >
                <el-option
                  v-for="item in formInline.urgencydegreeArr"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="scheduleStatus">
              <el-select
                class="wid"
                v-model="formInline.scheduleStatus"
                placeholder="日程状态"
              >
                <el-option
                  v-for="item in formInline.status"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="getListMode"
                >查询</el-button
              >
            </el-form-item>
            <el-form-item>
              <el-button icon="el-icon-refresh-right" @click="resetBtn"
                >重置</el-button
              >
            </el-form-item>
          </el-form>
        </el-col>
      </el-row>
      <div style="margin-bottom: 10px">
        <el-button
          icon="el-icon-plus"
          type="primary"
          @click="dialogVisible = true"
          v-btnPermi="['sd_new_schedule']"
          >新建日程</el-button
        >
      </div>
    </div>
    <div>
      <el-table
        :data="tableData"
        border
        stripe
        style="width: 100%"
        @selection-change="selectionChange"
        ref="tableData"
      >
        <!-- <template slot="empty">
          <img src="@/assets/noData.gif" alt="" style="height: 200px" />
          <p class="noDataText">暂无数据!</p>
        </template> -->
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="headline" label="标题" width="240">
          <template slot-scope="{ row }">
            <el-button type="text" size="small" @click="msgDetail(row)">{{
              row.scheduleTitle
            }}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="founderId"
          label="负责人员"
          width="160"
        ></el-table-column>
        <el-table-column
          prop="beginTime"
          label="开始时间"
          width="220"
        ></el-table-column>
        <el-table-column prop="businessType" label="类型" width="180">
          <template slot-scope="{ row }">
            <div>
              <span
                class="businessSpan"
                :style="{ background: row.sign }"
              ></span>
              {{ `关联${row.businessType}` }}
            </div>
          </template>
        </el-table-column>
        <el-table-column
          prop="urgencydegree"
          label="紧要程度"
          width="180"
        ></el-table-column>
        <el-table-column
          prop="scheduleStatus"
          label="状态"
          width="180"
        ></el-table-column>
        <el-table-column prop="businessId" label="关联业务">
          <template slot-scope="scope">
            <router-link
              v-if="scope.row.businessType == '客户'"
              style="color: #0079fe"
              :to="{
                name: 'Customerdetail',
                query: { id: scope.row.businessId },
              }"
              >{{ scope.row.businessName }}</router-link
            >
            <router-link
              v-else-if="scope.row.businessType == '联系人'"
              style="color: #0079fe"
              :to="{
                name: 'Contactdetail',
                query: { id: scope.row.businessId },
              }"
              >{{ scope.row.businessName }}</router-link
            >
            <router-link
              v-else-if="scope.row.businessType == '任务'"
              style="color: #0079fe"
              :to="{
                name: 'TaskDetail',
                query: { id: scope.row.businessId },
              }"
              >{{ scope.row.businessName }}</router-link
            >
            <router-link
              v-else-if="scope.row.businessType == '工单'"
              style="color: #0079fe"
              :to="{
                name: 'WorkOrderDetails',
                query: { id: scope.row.businessId },
              }"
              >{{ scope.row.businessName }}</router-link
            >
            <!-- <el-button type="text" size="small">{{scope.row.businessId}}</el-button> -->
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" width="220">
          <template slot-scope="{ row }">
            <el-button
              icon="el-icon-arrow-right"
              type="text"
              size="small"
              @click="msgDetail(row)"
              v-btnPermi="['sd_schedule_for_details']"
              >详情</el-button
            >
            <el-button
              icon="el-icon-delete-solid"
              type="text"
              size="small"
              @click="removeBtn(row, 1)"
              v-btnPermi="['sd_delete__schedule']"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div style="margin-top: 30px">
      <el-row type="flex" justify="space-between">
        <el-col :span="12">
          <el-row type="flex" justify="start">
            <el-button icon="el-icon-circle-check" @click="checkAll"
              >全选</el-button
            >
            <el-button icon="el-icon-refresh" @click="reverseSelect(tableData)"
              >反选</el-button
            >
            <el-select
              style="margin-left: 10px; width: 117px"
              v-model="optionVal"
              :disabled="selectFlag"
              @change="changeOnDutyHeaderBB"
              placeholder="更多操作"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              >
              </el-option>
            </el-select>
          </el-row>
        </el-col>
        <el-col :span="12">
          <el-row type="flex" justify="end">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.pageNum"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="page.pageSize"
              layout=" prev, pager, next,sizes"
              :total="page.total"
            >
            </el-pagination>
          </el-row>
        </el-col>
      </el-row>
    </div>

    <el-dialog :visible.sync="listModedialog" width="50%" @close="getListMode">
      <div slot="title" class="header-title">
        <div style="font-weight: 600">日程详情</div>
      </div>
      <div>
        <table class="listmodeTb" border="1" cellspacing="0">
          <tr class="listmodeTr">
            <td class="tdLeft">日程标题：</td>
            <td class="tdRight">
              <el-input v-model="detailData.scheduleTitle"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">开始时间：</td>
            <td class="tdRight">
              <el-input v-model="detailData.beginTime"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">结束时间：</td>
            <td class="tdRight">
              <el-input v-model="detailData.endTime"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">紧要程度：</td>
            <td class="tdRight">
              <el-input v-model="detailData.urgencydegree"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">关联业务：</td>
            <td class="tdRight">
              <router-link
                v-if="detailData.businessType == '客户'"
                style="color: #0079fe; padding-left: 15px"
                :to="{
                  name: 'Customerdetail',
                  query: { id: detailData.businessId },
                }"
                >{{ detailData.businessName }}</router-link
              >
              <router-link
                v-else-if="detailData.businessType == '联系人'"
                style="color: #0079fe; padding-left: 15px"
                :to="{
                  name: 'Contactdetail',
                  query: { id: detailData.businessId },
                }"
                >{{ detailData.businessName }}</router-link
              >
              <router-link
                v-else-if="detailData.businessType == '任务'"
                style="color: #0079fe; padding-left: 15px"
                :to="{
                  name: 'taskDetail',
                  query: { id: detailData.businessId },
                }"
                >{{ detailData.businessName }}</router-link
              >
              <router-link
                v-else-if="detailData.businessType == '工单'"
                style="color: #0079fe; padding-left: 15px"
                :to="{
                  name: 'WorkOrderDetails',
                  query: { id: detailData.businessId },
                }"
                >{{ detailData.businessName }}</router-link
              >
              <!-- <router-link
                style="color: #0079fe; padding-left: 15px"
                :to="{
                  name: 'Customerdetail',
                  query: { id: detailData.businessId },
                }"
                >{{ detailData.businessName }}</router-link
              > -->
              <!-- <el-input v-model="detailData.businessId"></el-input> -->
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">日程描述：</td>
            <td class="tdRight">
              <el-input
                type="textarea"
                disabled
                v-model="detailData.description"
              ></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">日程状态：</td>
            <td class="tdRight">
              <el-input v-model="detailData.scheduleStatus"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">负责人员：</td>
            <td class="tdRight">
              <el-input v-model="detailData.founderId"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">任务提醒：</td>
            <td class="tdRight">
              <el-input v-model="detailData.warn"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">提醒方式：</td>
            <td class="tdRight">
              <el-input v-model="detailData.war"></el-input>
            </td>
          </tr>
          <tr class="listmodeTr">
            <td class="tdLeft">创建时间：</td>
            <td class="tdRight">
              <el-input v-model="detailData.createTime"></el-input>
            </td>
          </tr>
        </table>
      </div>
      <el-row type="flex" slot="footer" justify="left">
        <el-button
          @click="editTheSchedule(detailData)"
          type="text"
          v-btnPermi="['sd_edit_schedule']"
          >编辑日程</el-button
        >
        <el-button
          type="text"
          @click="removeBtn(detailData, 1)"
          v-btnPermi="['sd_delete__schedule']"
          >删除日程</el-button
        >
      </el-row>
    </el-dialog>
    <add-the-schedule
      :dialogVisible="dialogVisible"
      ref="compileObj"
    ></add-the-schedule>
  </div>
</template>

<script>
import {
  business,
  delSchedule,
  scheduleSchedule,
} from "@/api/officeManagement";
import AddTheSchedule from "./components/AddTheSchedule.vue";
export default {
  components: {
    AddTheSchedule,
  },
  computed: {
    selectFlag() {
      return this.selectedObjArr.length > 0 ? false : true;
    },
  },

  data() {
    return {
      selectedObjArr: [],
      page: {
        pageSize: 10,
        total: 0,
        pageNum: 1,
      },
      dialogVisible: false,
      loading: false,
      form: {},
      listModedialog: false,
      tableData: [],
      formInline: {
        beginTime: [],
        beijing: "",
        shanghai: "",
        scheduleStatus: "",
        status: [
          {
            value: null,
            label: "全部",
          },
          {
            value: 0,
            label: "执行中",
          },
          {
            value: 1,
            label: "已结束",
          },
          {
            value: 2,
            label: "已取消",
          },
        ],
        importantVal: "",
        urgencydegreeArr: [
          {
            value: null,
            label: "全部",
          },
          {
            value: 0,
            label: "重要",
          },
          {
            value: 1,
            label: "紧急",
          },
          {
            value: 2,
            label: "普通",
          },
          {
            value: 3,
            label: "重要且紧急",
          },
        ],
        scheduleVal: "",
        schedule: [
          {
            value: "1",
            label: "全部日程",
          },
          {
            value: "2",
            label: "我的日程",
          },
          {
            value: "3",
            label: "下属日程",
          },
          {
            value: "4",
            label: "指定成员",
          },
        ],
      },
      pattern: [
        {
          value: 1,
          label: "列表模式",
          disabled: true,
        },
        // {
        //   value: 2,
        //   label: "日历模式",
        // },
      ],
      options: [
        {
          value: 1,
          label: "删除记录",
        },
      ],
      optionVal: "",
      detailData: {},
    };
  },
  created() {
    this.getListMode();
  },
  methods: {
    async getListMode() {
      this.loading = true;
      let obj = {
        keyword: this.formInline.keyword, //  关键字
        queryType: this.formInline.scheduleVal, //  查询模式 null 全部日程 0 我的日程 1 下属日程 2 指定成员
        scheduleStatus: this.formInline.scheduleStatus, //  日程状态 null 全部 0 执行中 1 已结束 2 已取消
        startTime: this.formInline.beginTime[0], //  开始时间
        endTime: this.formInline.beginTime[1],
        urgencydegree: this.formInline.urgencydegree, //  重要程度 null 全部 0重要 1紧急 2普通 3重要且紧急
        pageSize: this.page.pageSize, //  每页显示条数
        pageNum: this.page.pageNum, //  第几页
      };
      var data = await business(obj);
      this.page.total = data.rows.length;
      this.tableData = data.rows;
      this.page.total = data.total;
      this.loading = false;
    },
    msgDetail(obj) {
      console.log(obj);
      // if (obj.war === 0) {
      //   obj.war = "系统消息";
      // } else if (obj.war === 1) {
      //   obj.war = "邮件通知";
      // } else {
      //   obj.war = "短信通知";
      // }
      if (obj.warn === 0) {
        obj.warn = "准时提醒";
      } else if (obj.warn === 1) {
        obj.warn = "提前5分钟 ";
      } else if (obj.warn === 2) {
        obj.warn = "提前15分钟";
      } else if (obj.warn === 3) {
        obj.warn = "提前30分钟";
      } else if (obj.warn === 4) {
        obj.warn = "提前1小时";
      } else if (obj.warn === 5) {
        obj.warn = "提前2小时";
      } else if (obj.warn === 6) {
        obj.warn = "提前1天";
      }
      this.listModedialog = true;
      this.detailData = obj;
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getListMode();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getListMode();
    },
    checkAll() {
      this.$refs.tableData.toggleAllSelection();
    },
    reverseSelect(rows) {
      rows.forEach((row) => {
        this.$refs.tableData.toggleRowSelection(row);
      });
    },
    selectionChange(selection) {
      this.selectedObjArr = selection;
    },
    async changeOnDutyHeaderBB(item) {
      this.removeBtn(this.selectedObjArr, 2);
      this.optionVal = "";
    },
    async editTheSchedule(obj) {
      this.listModedialog = false;
      this.dialogVisible = true;
      const { data } = await scheduleSchedule({ id: obj.id });
      if (data.scheduleStatus === "0") {
        data.scheduleStatus = 0;
      } else if (data.scheduleStatus === "1") {
        data.scheduleStatus = 1;
      } else if (data.scheduleStatus === "2") {
        data.scheduleStatus = 2;
      }
      data.endAutomatic == 0
        ? (data.endAutomatic = true)
        : (data.endAutomatic = false);
      data.war = data.war.split(",");
      this.$refs.compileObj.form = data;
      this.$refs.compileObj.chooseRemindValue = data.sign;
    },
    async removeBtn(row, num) {
      await this.$confirm("此操作将永久删除该文件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      });
      if (num === 1) {
        const result = await delSchedule({ ids: [row.id] });
      } else {
        var arr = [];
        row.forEach((item) => arr.push(item.id));
        const result = await delSchedule({ ids: arr });
      }
      this.listModedialog = false;
      this.getListMode();
    },
    resetBtn() {
      this.$refs.formInline.resetFields();
      this.getListMode();
    },
    goToUrl() {
      if (this.$route.path === "/officeManagement/listmode") {
        // this.$router.push({ name: "Schedule" });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__footer {
  border-top: 1px solid #e4e4e4;
}
::v-deep .listmodeTb {
  width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  border-top: 1px solid #e4e4e4;
  border-left: 1px solid #e4e4e4;
}

::v-deep .listmodeTr td {
  padding: 10px;
  border-right: 1px solid #e4e4e4;
  border-bottom: 1px solid #e4e4e4;
  .el-input__inner {
    border: 0;
    background-color: white;
  }
}

.tdLeft {
  text-align: center;
  font-weight: 600;
  color: black;
  width: 22%;
  padding: 10px 20px;
  background-color: #f2f2f2;
}
.tdRight {
  width: 78%;
  padding: 10px 20px;
}
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
}
::v-deep.el-dialog__body {
  // padding: 0px;
  .el-divider--horizontal {
    margin: 0px;
  }
}
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
}
.wid {
  width: 180px;
}
</style>
