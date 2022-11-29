<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="deptId">
          <el-cascader
            placeholder="请选择部门"
            :options="deptTree"
            :show-all-levels="false"
            filterable
            size="small"
            v-model="queryParams.deptId"
            :props="{
              emitPath: false,
              checkStrictly: true,
              children: 'list',
              label: 'name',
              value: 'id',
            }"
            clearable
            style="width: 100%"
          ></el-cascader>
        </el-form-item>

        <el-form-item prop="description" label="">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="配置创建时间"
            end-placeholder="配置结束时间"
          />
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleAdd(1)"
            >部门新增</el-button
          >
          <el-button type="primary" size="small" @click="handleAdd(0)"
            >个人新增</el-button
          >
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >
          <el-button type="" size="small" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
      <!-- <Tips ref="Tips" /> -->
      <div>
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
        >
          <el-table-column prop="name" label="姓名" width="" align="center">
          </el-table-column>
          <el-table-column prop="type" label="类型" width="" align="center">
            <template slot-scope="scope">
              {{ scope.row.type == 0 ? "个人" : "部门" }}
            </template>
          </el-table-column>
          <el-table-column prop="noteDays" label="每天短信条数" width="" align="center">
          </el-table-column>
          <el-table-column
            prop="noteMonth"
            width="200"
            label="每月短信条数"
            align="center"
          ></el-table-column>
          <el-table-column prop="status" width="" label="状态" align="center">
            <template slot-scope="scope">
              {{ scope.row.status == 0 ? "关闭" : "开启" }}
            </template></el-table-column
          >
          <el-table-column
            prop="createTime"
            width="180"
            label="配置时间"
            align="center"
          ></el-table-column>
          <el-table-column prop="shortName" fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="handleEdit(scope.row)"
                size="mini"
              >
                修改
              </el-button>
              <el-button
                @click.native.prevent="confirmDel(scope.row)"
                size="mini"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <SmsSet @reload="getList" ref="SmsSet" />
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getlist, deleteconfig } from "@/api/smsSet/index";
import SmsSet from "./components/addSet.vue";
import { getdeptTree } from "@/api/organization/index";
export default {
  components: {
    SmsSet,
  },
  data() {
    return {
      time: "",
      deptTree: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      list: [],
    };
  },
  beforeMount() {},
  mounted() {
    this.getList();
    this.getdeptTree();
  },
  methods: {
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
      });
    },
    handleAdd(type) {
      this.$refs.SmsSet.open = true;
      this.$refs.SmsSet.type = type;
      this.$refs.SmsSet.editId = "";
    },
    handleEdit(row) {
      this.$refs.SmsSet.type = row.type;
      this.$refs.SmsSet.open = true;
      this.$refs.SmsSet.editId = row.id;
    },
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      getlist(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
      });
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.time = "";
      this.getList();
    },
    handleQuery() {
      if (this.time != "" && this.time != null && this.time != undefined) {
        this.queryParams.startTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endTime = this.time[1] + " " + "23:59:59";
      }
      this.getList();
    },
    jumpStaff(row) {
      this.$router.push({
        name: "/setpermission",
        // path: `/setpermission/:${JSON.stringify(row)}`,
        query: {
          id: row.id,
          data: JSON.stringify(row),
          type: 3,
        },
      });
    },
    confirmDel(ob) {
      this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteconfig({ customerId: ob.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style  lang='scss' scoped>
.topDiv {
  .tips {
    font-size: 13px;
    padding: 0 20px;
    color: #999999;
  }
}
.color4 {
  color: #409eff;
  cursor: pointer;
}
</style>
