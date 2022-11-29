/**员工List */
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
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <el-table-column prop="avatar" label="头像" width="120" align="center">
        <template slot-scope="scope"
          ><img
            v-if="scope.row.avatar"
            style="width: 80px; height: 80px"
            :src="scope.row.avatar"
            alt=""
          />
          <img
            style="width: 80px; height: 80px"
            v-else
            src="@/assets/images/defaultAvatar.png"
            alt=""
          />
        </template>
      </el-table-column>
      <el-table-column prop="name" label="姓名" width="" align="center">
        <template slot-scope="scope"
          ><span
            style="color: #1890ff; cursor: pointer"
            @click="handleJump(scope.row)"
            >{{ scope.row.name }}</span
          ></template
        >
      </el-table-column>
      <el-table-column prop="sex" width="" label="性别" align="center"></el-table-column>
      <el-table-column prop="deptId" label="部门" width="200" align="center"> </el-table-column>
      <el-table-column prop="phone" label="手机" width="" align="center"> </el-table-column>
      <el-table-column prop="accountStatus" label="账号状态" width="" align="center">
        <template slot-scope="scope">{{
          scope.row.accountStatus == 0
            ? "正常"
            : scope.row.accountStatus == 1
            ? "停用"
            : ""
        }}</template>
      </el-table-column>
      <el-table-column prop="onlineStatus" label="在线状态" width="" align="center">
        <template slot-scope="scope">{{
          scope.row.onlineStatus == 0 ? "在线" : "离线"
        }}</template>
      </el-table-column>
      <el-table-column prop="lastLoginTime" label="最后登录" width="180" align="center">
      </el-table-column>
      <el-table-column prop="shortName" fixed="right" label="操作" width="280" align="center">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="setUpRow(scope.row)"
            size="mini"
            type="primary"
            plain
          >
            设置
          </el-button>

          <el-button
            v-if="scope.row.accountStatus == 0"
            @click.native.prevent="ActionRow('1', scope)"
            size="mini"
            type="danger"
            plain
          >
            停用
          </el-button>
          <el-button
            v-else
            @click.native.prevent="ActionRow('2', scope)"
            size="mini"
            type="primary"
            plain
          >
            启用
          </el-button>
          <el-button
            v-if="scope.row.businessStatus == 0"
            @click.native.prevent="ActionRow('3', scope)"
            size="mini"
            type="danger"
            plain
          >
            冻结
          </el-button>
          <el-button
            v-else
            @click.native.prevent="ActionRow('4', scope)"
            size="mini"
            type="primary"
            plain
          >
            解冻
          </el-button>

          <!-- <el-button
            @click.native.prevent="ActionRow('1', scope)"
            size="mini"
          >
            停用
          </el-button>
          <el-button
            @click.native.prevent="ActionRow('3', scope)"
            size="mini"
          >
            冻结
          </el-button> -->
          <el-button
            @click.native.prevent="ActionRow('7', scope)"
            size="mini"
            type="danger"
            plain
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
      @pagination="getData"
    />
  </div>
</template>

<script>
import { getstaffList, handleStaff } from "@/api/staff/index";
export default {
  data() {
    return {
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      // 总条数
      total: 1,
      tableData: [],
      multipleSelection: [],
    };
  },
  created() {
    window.getStaffData = this.getData;
  },
  mounted() {
    this.getData();
  },
  methods: {
    getDataQuery(query) {
      this.queryParams = query;
      this.getData(query);
    },
    /**获取数据 */
    getData(query) {
      // console.log(query);
      // if (query != null) {
      //   this.queryParams = query;
      // }
      getstaffList(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    /**设置企业 */
    setUpRow(row) {
      this.$router.push({
        path: "/staffManager/staffdetail",
        query: {
          id: row.id,
        },
      });
    },
    handleJump(row) {
      this.$router.push({
        path: "/staffManager/staffdetail",
        query: {
          id: row.id,
        },
      });
    },
    ActionRow(type, row) {
      // 1停用 2启用 3冻结 4解冻 5修改部门 6重置密码 7删除员工
      this.$confirm(
        `是否确定${
          type == 7
            ? "删除员工"
            : type == 3
            ? "冻结员工"
            : type == 1
            ? "停用员工"
            : ""
        }对应的记录`,
        "确定",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          let data = {};
          data.status = type;
          data.ids = [];
          data.ids.push(row.row.id);
          handleStaff(data).then((res) => {
            this.getData();
            this.$message({
              type: "success",
              message: "操作成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
      // handleStaff();
    },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      let tenantId = this.tenantId
        ? this.tenantId
        : this.$store.getters.user.tenantId;
      listUser(
        this.addDateRange(this.queryParams, this.dateRange),
        tenantId
      ).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
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
      console.log(val);
      this.$emit("getIds", val);
    },
  },
};
</script>
