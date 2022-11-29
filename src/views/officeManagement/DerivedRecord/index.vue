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
    </div>
    <div>
      <el-form :inline="true" :model="deriveObj" class="demo-form-inline">
        <el-form-item>
          <el-date-picker
            style="width: 300px"
            value-format="yyyy-MM-dd "
            v-model="deriveObj.createTime"
            format="yyyy-MM-dd "
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-cascader
            style="width: 100%"
            v-model="deriveObj.createBys"
            :options="options"
            :show-all-levels="false"
            :props="props"
            placeholder="操作人员"
            clearable
          ></el-cascader>
          <!-- <el-select v-model="deriveObj.createBys" multiple collapse-tags placeholder="操作人员">
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
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column
          prop="createBy"
          align="center"
          label="操作人员"
        ></el-table-column>
        <el-table-column
          prop="exportType"
          align="center"
          label="导出类型"
        ></el-table-column>
        <el-table-column
          prop="dataSize"
          align="center"
          label="数据条数"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          align="center"
          label="导出时间"
        ></el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="{ row }">
            <el-button
              type="text"
              size="small"
              style="color: #46a6ff; margin-right: 10px"
              @click="clickDownLoad(row.fileUrl, row.exportType)"
              ><i class="el-icon-download"></i>下载</el-button
            >
            <!-- <a
              style="color: #46a6ff; margin-right: 10px"
              download="导出记录.xls"
              @click="clickDownLoad(row.fileUrl)"
              ><i class="el-icon-download"></i>下载11</a
            > -->
            <el-button
              icon="el-icon-delete-solid"
              type="text"
              size="small"
              @click="removeBtn(row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 15px">
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
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import {
  workexportPage,
  staffList,
  delData,
  commonSubordinateList2,
} from "@/api/officeManagement";
export default {
  data() {
    return {
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      deriveObj: {
        createTime: [],
        createBys: [],
      },
      options: [],
      loading: false,
      tableData: [],
      activeName: "0",
      page: {
        pageSize: 10,
        total: 0,
        pageNum: 1,
      },
    };
  },
  created() {
    this.getListData();
    this.getStaffList();
  },
  methods: {
    clickDownLoad(url, fileName) {
      axios.get(url, { responseType: "blob" }).then((res) => {
        const blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = fileName + ".xlsx";
        a.click();
      });
    },
    async getStaffList() {
      const { data } = await staffList();
      this.options = data;
      // var arr = data.filter((item) => item.name === "资源中台");
      // if (arr.length > 0) {
      //   this.options = arr[0].list;
      // }
    },
    resetBtn() {
      this.deriveObj = {
        createTime: "",
        createBys: [],
      };
      this.getListData();
    },
    async getListData() {
      this.loading = true;
      var data = {
        createBys: this.deriveObj.createBys, //操作人员名字
        createTime: this.deriveObj.createTime[0], //开始时间
        endTime: this.deriveObj.createTime[1], //结束时间
        homeType: Number(this.activeName), // 操作类型 null 全部 0 我的 1 下属的
        pageSize: this.page.pageSize,
        pageNum: this.page.pageNum,
      };
      const result = await workexportPage(data);
      this.tableData = result.rows;
      this.page.total = result.total;
      this.loading = false;
    },
    async removeBtn(row) {
      await delData({ ids: [row.id] });
      this.getListData();
    },
    handleClick(tab, event) {
      this.getListData();
    },
    handleCurrentChange(val) {
      this.page.pageNum = val;
      this.getListData();
    },
    handleSizeChange(val) {
      this.page.pageSize = val;
      this.getListData();
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
