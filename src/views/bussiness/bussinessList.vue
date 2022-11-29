<template>
  <div>
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" center> </el-table-column>
      <el-table-column prop="logo" label="企业LOGO" width="120" center>
        <template slot-scope="scope"
          ><img style="width: 80px; height: 80px" :src="scope.row.logo" alt=""
        /></template>
      </el-table-column>
      <el-table-column prop="name" label="企业名称" width="180">
        <template slot-scope="scope"
          ><span
            style="color: #1890ff; cursor: pointer"
            @click="handleJump(scope.row.id)"
            >{{ scope.row.name }}</span
          ></template
        >
      </el-table-column>
      <el-table-column
        prop="shortName"
        width="80"
        label="企业简称"
      ></el-table-column>
      <el-table-column prop="phone" label="企业电话" width="120">
      </el-table-column>
      <el-table-column prop="type" label="企业类型"> </el-table-column>
      <el-table-column prop="industry" label="所属行业" width="120">
      </el-table-column>
      <el-table-column prop="period" label="使用期限" width="120">
      </el-table-column>
      <el-table-column prop="contactName" label="联系人信息" width="120">
      </el-table-column>
      <el-table-column prop="contactPhone" label="联系人电话" width="120">
      </el-table-column>
      <el-table-column prop="shortName" fixed="right" label="操作" width="220">
        <template slot-scope="scope">
          <el-button @click.native.prevent="setUpRow(scope.row.id)" size="mini">
            设置
          </el-button>
          <el-button size="mini"> 日志 </el-button>
          <el-button
            @click.native.prevent="deleteRow(scope.$index, scope.row)"
            size="mini"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getlist, delcompany } from "@/api/bussiness/index";
export default {
  data() {
    return {
      searchquery: {},
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
        status: undefined,
      },
      // 总条数
      total: 1,
      tableData: [
        {
          logo: "http://localhost/static/img/profile.473f5971.jpg",
          date: "2016-05-03",
          name: "禄可集团有限公司",
          shortName: "禄可",
          phone: "400123456",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
      multipleSelection: [],
    };
  },
  mounted() {
    this.getlist();
  },
  methods: {
    getlist() {
      getlist(this.searchquery).then((res) => {
        this.tableData = res.rows;
      });
    },
    /**设置企业 */
    setUpRow(row) {
      this.$router.push({
        path: "/bussinessManage/bussinessDetail",
        query: {
          id: row,
        },
      });
    },
    handleJump(row) {
      this.$router.push({
        path: "/bussinessManage/bussinessDetail",
        query: {
          id: row,
        },
      });
    },
    deleteRow(index, row) {
      this.$confirm("是否确定删除对应的记录?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delcompany({ ids: [row.id] }).then((res) => {
            this.$message({
              type: "success",
              message: "企业删除成功!",
            });
            this.getlist();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    /** 查询用户列表 */
    getList() {
      // this.loading = true;
      // let tenantId = this.tenantId
      //   ? this.tenantId
      //   : this.$store.getters.user.tenantId;
      // listUser(
      //   this.addDateRange(this.queryParams, this.dateRange),
      //   tenantId
      // ).then((response) => {
      //   this.userList = response.rows;
      //   this.total = response.total;
      //   this.loading = false;
      // });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.$emit("getIds", val);
      this.multipleSelection = val;
    },
  },
};
</script>