<template>
  <div
    class="app-container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="提交给我" name="0"></el-tab-pane>
        <el-tab-pane label="我提交的" name="1"></el-tab-pane>
        <el-tab-pane
          v-if="$store.state.user.isDeptHead !== 0"
          label="下属提交的"
          name="2"
        ></el-tab-pane>
        <!-- <el-tab-pane label="报告统计" name="3"></el-tab-pane> -->
      </el-tabs>
    </div>
    <div>
      <el-row type="flex" justify="space-between">
        <el-col :span="24">
          <el-form :inline="true" :model="formInline" ref="formInline">
            <el-form-item prop="antistop">
              <el-input
                v-model="formInline.antistop"
                placeholder="关键词"
              ></el-input>
            </el-form-item>
            <el-form-item prop="patternVal">
              <el-select
                class="wid"
                v-model="formInline.reportType"
                placeholder="报告类型"
              >
                <el-option
                  v-for="item in reportTypeArr"
                  :key="item.dictSort"
                  :label="item.dictLabel"
                  :value="item.dictSort"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="patternVal">
              <el-select
                class="wid"
                v-model="formInline.auditStatus"
                placeholder="批阅状态"
              >
                <el-option
                  v-for="item in auditStatusArr"
                  :key="item.dictSort"
                  :label="item.dictLabel"
                  :value="item.dictSort"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="scheduleVal">
              <!-- <el-cascader
                style="width: 100%"
                v-model="formInline.departmentType"
                :options="deptList"
                :show-all-levels="false"
                placeholder="提交部门"
                :props="props"
                clearable
              ></el-cascader> -->
              <el-select
                class="wid"
                v-model="formInline.departmentType"
                placeholder="提交部门"
              >
                <el-option
                  v-for="item in deptList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="operatingPersonnel">
              <!-- <el-select collapse-tags v-model="formInline.operatingPersonnel" multiple filterable allow-create default-first-option placeholder="提交人员">
                <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id"></el-option>
              </el-select> -->
              <el-cascader
                placeholder="提交人员"
                style="width: 100%"
                v-model="formInline.operatingPersonnel"
                :options="options"
                :show-all-levels="false"
                :props="propsmul"
                clearable
              ></el-cascader>
            </el-form-item>

            <el-form-item>
              <el-button
                icon="el-icon-search"
                type="primary"
                @click="getworkreportPage"
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
    </div>
    <div>
      <el-row type="flex" justify="start">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item>
            <el-popover placement="bottom-start" width="100" trigger="click">
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
                type="primary"
                slot="reference"
                v-btnPermi="['ws_add_report']"
                >添加</el-button
              >
            </el-popover>
          </el-form-item>
          <el-form-item>
            <el-button
              icon="el-icon-upload2"
              @click="deriveBtn"
              v-btnPermi="['ws_export_report']"
              >导出<i class="el-icon-arrow-down"></i
            ></el-button>
          </el-form-item>
        </el-form>
      </el-row>
    </div>
    <div v-if="workreportData.length > 0">
      <div class="parentDiv" v-for="item in workreportData" :key="item.id">
        <el-row class="workDiv" type="flex" align="middle">
          <el-col :span="4">
            <div class="oneDiv">
              <div>报告标题</div>
              <div>{{ item.headline }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="oneDiv">
              <div>提交人员</div>
              <div><i class="el-icon-s-custom" /> {{ item.founderId }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="oneDiv">
              <div>报告类型</div>
              <div>{{ item.reportType }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="oneDiv">
              <div>批阅状态</div>
              <div>
                <span
                  class="businessSpan"
                  :style="{
                    background:
                      item.auditStatus === '未批阅' ? '#fec03d' : '#4BD863',
                  }"
                />
                {{ item.auditStatus }}
              </div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="oneDiv">
              <div><i class="el-icon-time" /> 提交时间</div>
              <div>{{ item.createTime }}</div>
            </div>
          </el-col>
          <el-col :span="4">
            <div class="oneDiv">
              <el-button
                icon="el-icon-arrow-right"
                size="small"
                @click="particularsBtn(item)"
                v-btnPermi="['ws_report_details']"
                >详情</el-button
              >
            </div>
          </el-col>
        </el-row>
      </div>
    </div>
    <div class="noData" v-else>
      <!-- <img src="@/assets/noData.gif" alt="" style="height: 200px" /> -->
      <!-- <span class="noDataText">暂无数据!</span> -->
      <span
        style="text-align: center; padding-top: 30px; color: rgb(153, 153, 153)"
        class=""
        >暂无数据</span
      >
    </div>
    <el-row type="flex" justify="end" style="margin: 2% 0 2% 0">
      <el-pagination
        v-if="workreportData.length > 0"
        background
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="page.pageNum"
        :page-sizes="[10, 20, 30, 40]"
        :page-size="page.pageSize"
        layout=" prev, pager, next,sizes"
        :total="page.total"
      ></el-pagination>
    </el-row>
    <report
      :reportVisible="reportVisible"
      :reportObj="reportObj"
      :typeId="typeId"
    ></report>
    <el-dialog
      title="批量导出"
      :visible.sync="dialogVisibles"
      width="30%"
      @close="deriveBtn(flag)"
    >
      <div style="height: 150px" v-if="schedule < 100">
        <el-progress
          style="padding-top: 10%"
          :percentage="schedule"
          :format="format"
        ></el-progress>
      </div>

      <el-row
        v-else-if="schedule >= 100"
        style="height: 150px"
        type="flex"
        justify="end"
        align="middle"
      >
        <el-col>
          <el-row type="flex" justify="end">
            <el-button
              icon="el-icon-bottom"
              style="width: 136px; margin-right: 10px"
              type="primary"
              @click="downloadingTheExportedFile"
              >下载导出文件</el-button
            >
          </el-row>
        </el-col>
        <el-col>
          <el-button
            icon="el-icon-document"
            style="width: 136px; margin-left: 10px"
            type="primary"
            plain
            @click="exportFileManagement"
            >导出文件管理</el-button
          >
        </el-col>
      </el-row>
    </el-dialog>
  </div>
</template>

<script>
import {
  staffList,
  workreportPage,
  workreportDerive,
  commonSubordinateList2,
} from "@/api/officeManagement";
import { getDeptTree2 } from "@/api/workOrder";
import Report from "./comportRecords/report.vue";
export default {
  components: {
    Report,
  },
  data() {
    return {
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      propsmul: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      page: {
        pageSize: 10, //每页显示条目个数
        total: 0, //总条目数
        pageNum: 1, //当前页数
      },
      typeId: 0,
      reportVisible: false,
      reportObj: {},
      dialogVisibles: false,
      loading: false,
      workreportData: [],
      activeName: "0",
      formInline: {},
      auditStatusArr: [],
      departmentTypeArr: [],
      options: [],
      reportTypeArr: [],
      schedule: 0,
      flag: false,
      deptList: [],
    };
  },
  beforeMount() {
    this.getDicts("report_type").then((res) => {
      this.reportTypeArr = res.data;
    });
    this.getDicts("report_aduit").then((res) => {
      this.auditStatusArr = res.data;
    });
    this.getDicts("dept_type").then((res) => {
      this.departmentTypeArr = res.data;
    });
    commonSubordinateList2().then((result) => {
      this.userList = result.data;
    });
  },
  created() {
    this.getStaffList();
    this.getworkreportPage();
    this.DeptTree();
  },
  methods: {
    async DeptTree() {
      const { data } = await getDeptTree2();
      this.deptList = data;
      // var arr = data.filter((item) => item.name === "资源中台");
      // if (arr.length > 0) {
      //   this.options = arr[0].list;
      // }
    },
    async getStaffList() {
      const { data } = await staffList();
      this.options = data;
      // var arr = data.filter((item) => item.name === "资源中台");
      // if (arr.length > 0) {
      //   this.options = arr[0].list;
      // }
    },
    async getworkreportPage() {
      this.loading = true;
      var data = {
        pageNum: this.page.pageNum,
        pageSize: this.page.pageSize,
        auditStatus: this.formInline.auditStatus, //批阅状态 null全部 0 未批阅 1 已批阅
        departmentType: this.formInline.departmentType, //提交部门
        headline: this.formInline.antistop, //关键词(报告标题)
        homeType: Number(this.activeName), //类型 null 提交给我的 0 我提交的 1 下属负责的 2 报告统计
        reportType: this.formInline.reportType, //报告类型: null 全部 0 日报 1 周报 2 月报 3 季报 4 半年报 5 全年报
        userIds: this.formInline.operatingPersonnel, //提交人员
      };
      const result = await workreportPage(data);
      this.page.total = result.total;
      this.workreportData = result.rows;
      this.loading = false;
    },
    resetBtn() {
      this.activeName = "0";
      // this.$refs.formInline.resetFields();
      this.formInline = {};
      this.getworkreportPage();
    },
    particularsBtn(obj) {
      this.typeId = 1;
      this.$router.push({ name: "Particulars", query: { id: obj.id } });
    },

    format(schedule) {
      return schedule === 100 ? "满" : `${schedule}%`;
    },
    deriveBtn(bol) {
      if (!bol) {
        this.schedule = 0;
        this.dialogVisibles = bol;
        return;
      } else {
        this.dialogVisibles = true;
        var timer = setTimeout(() => {
          this.schedule += 5;
          if (this.schedule >= 100) {
            clearTimeout(timer);
            // this.schedule = 0;
            return;
          }
          this.format(this.schedule);
          this.deriveBtn(this.dialogVisibles);
        }, 100);
      }
    },
    locBton(obj, typeId) {
      // 传递数据到----报告详情-
      this.reportObj = obj;
      this.typeId = typeId;
      this.reportVisible = true;
    },
    exportFileManagement() {
      this.$router.push("/officeManagement/DerivedRecord");
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getworkreportPage();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getworkreportPage();
    },
    handleClick(tab, event) {
      this.getworkreportPage();
    },
    async downloadingTheExportedFile() {
      var idArr = [];
      this.workreportData.forEach((item) => idArr.push(item.id));
      var data = {
        auditStatus: this.formInline.auditStatus, //批阅状态 null全部 0 未批阅 1 已批阅
        departmentType: this.formInline.departmentType, //提交部门
        headline: this.formInline.antistop, //关键词
        homeType: this.activeName, //类型 0 提交给我的 1 我提交的 2 下属负责的 3 报告统计
        ids: idArr, //任务id
        reportType: this.formInline.reportType, //报告类型: null 全部 0 日报 1 周报 2 月报 3 季报 4 半年报 5 全年报
        userIds: this.formInline.operatingPersonnel, //提交人员
      };
      const result = await workreportDerive(data);

      if (!result) {
        this.$message.warning("文件下载失败");
        return;
      }
      if (typeof window.navigator.msSaveBlob !== "undefined") {
        window.navigator.msSaveBlob(
          new Blob([result], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          }),
          "工作报告列表" + ".xlsx"
        );
      } else {
        let url = window.URL.createObjectURL(
          new Blob([result], {
            type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          })
        );
        let link = document.createElement("a");
        link.style.display = "none";
        link.href = url;
        link.setAttribute("download", "工作报告列表" + ".xlsx");
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link); // 下载完成移除元素
        window.URL.revokeObjectURL(url); // 释放掉blob对象
      }

      this.getworkreportPage();
      this.dialogVisibles = false;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-icon-upload2 {
  font-weight: 600;
}
.workDiv {
  height: 80px;
  // background-color: #f9f9f9;
  border: 1px solid #e4e4e4;
  min-width: 700px;
  .oneDiv {
    margin-left: 25%;
    font-size: 13px;
    line-height: 2;
    color: #666666;
    //   display: flex;
    //   align-items: center;
    //   flex-direction: column;
    .businessSpan {
      display: inline-block;
      width: 10px;
      height: 10px;
      border-radius: 100%;
    }
  }
}
.parentDiv:nth-child(odd) {
  background-color: #f9f9f9;
}
.parentDiv:nth-child(even) {
  background-color: #ffffff;
}
.parentDiv {
  margin-top: 12px;
}
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
  font-weight: 600;
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
.noData {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
