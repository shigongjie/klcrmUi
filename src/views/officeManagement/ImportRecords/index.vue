<template>
  <div
    class="app-container"
    v-loading="loading"
    element-loading-text="拼命加载中"
    element-loading-spinner="el-icon-loading"
  >
    <div>
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="全部记录" name="0"> </el-tab-pane>
        <el-tab-pane label="我的记录" name="1"> </el-tab-pane>
        <el-tab-pane
          v-if="$store.state.user.isDeptHead !== 0"
          label="下属记录"
          name="2"
        >
        </el-tab-pane>
      </el-tabs>
      <div>
        <el-form
          :inline="true"
          :model="formdata"
          ref="formdata"
          class="demo-form-inline"
        >
          <el-form-item prop="beginTime">
            <el-date-picker
              style="width: 300px"
              value-format="yyyy-MM-dd "
              v-model="formdata.beginTime"
              format="yyyy-MM-dd "
              type="daterange"
              range-separator="-"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <!-- <el-date-picker style="width:217px;" format="yyyy-MM-dd HH:mm:ss" value-format="yyyy-MM-dd HH:mm:ss" v-model="formdata.beginTime" type="datetime" placeholder="时间范围">
            </el-date-picker> -->
          </el-form-item>
          <el-form-item prop="operatingPersonnel">
            <el-cascader
              style="width: 100%"
              v-model="formdata.operatingPersonnel"
              :options="options"
              :show-all-levels="false"
              :props="props"
              placeholder="操作人员"
              clearable
            ></el-cascader>
            <!-- <el-select collapse-tags v-model="formdata.operatingPersonnel" multiple filterable allow-create default-first-option placeholder="操作人员">
              <el-option v-for="item in options" :key="item.id" :label="item.name" :value="item.id">
              </el-option>
            </el-select> -->
          </el-form-item>
          <el-form-item>
            <el-button icon="el-icon-search" type="primary" @click="getListData"
              >查询</el-button
            >
            <el-button icon="el-icon-refresh-right" @click="resetBtn"
              >重置</el-button
            >
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-table :data="tableData" border stripe ref="tableData">
          <!-- <template slot="empty">
            <img src="@/assets/noData.gif" alt="" style="height: 200px" />
            <p class="noDataText">暂无数据 !</p>
          </template> -->
          <el-table-column
            prop="createBy"
            align="center"
            label="操作人员"
          ></el-table-column>
          <el-table-column
            prop="leadType"
            align="center"
            label="导入类型"
          ></el-table-column>
          <el-table-column
            prop="dataSize"
            align="center"
            label="数据条数"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            align="center"
            label="导入时间"
          ></el-table-column>
        </el-table>
        <div style="margin-top: 15px">
          <el-row type="flex" justify="end">
            <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page="page.currentPage"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="page.pageSize"
              layout=" prev, pager, next,sizes"
              :total="page.total"
            >
            </el-pagination>
          </el-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { workleadPage, staffList } from "@/api/officeManagement";
export default {
  data() {
    return {
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      formdata: {
        beginTime: [],
        operatingPersonnel: [],
      },
      options: [],
      loading: false,
      page: {
        pageSize: 10,
        total: 0,
        pageNum: 1,
      },
      tableData: [],
      activeName: "0",
    };
  },
  created() {
    this.getListData();
    this.getStaffList();
  },
  methods: {
    async getStaffList() {
      const { data } = await staffList();
      this.options = data;
      // var arr = data.filter((item) => item.name === "资源中台");
      // if (arr.length > 0) {
      //   this.options = arr[0].list;
      // }
    },
    resetBtn() {
      this.formdata = {
        beginTime: "",
        operatingPersonnel: [],
      };
      this.getListData();
    },
    async getListData() {
      this.loading = true;
      var data = {
        createBys: this.formdata.operatingPersonnel, //操作人员名字
        createTime: this.formdata.beginTime[0], //开始时间
        endTime: this.formdata.beginTime[1], //结束时间
        homeType: Number(this.activeName), //操作类型 null 全部 0 我的 1 下属的
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
      };
      console.log("data :>> ", data);
      const result = await workleadPage(data);
      this.tableData = result.rows;
      this.page.total = result.total;
      this.loading = false;
    },
    gainData(e) {
      this.tableData = e;
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getListData();
    },
    handleClick(tab, event) {
      this.getListData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
