<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="realName">
          <el-input
            v-model="queryParams.name"
            placeholder="接入平台"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >
          <el-button type="primary" size="small" @click="handleAdd(0)"
            >新增</el-button
          >
        </el-form-item>
        <!-- <el-form-item prop="real">
          <span class="tips" @click="tipsClick"><i style="margin-right:5px" class="el-icon-question"></i>帮助提示</span>
        </el-form-item> -->
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
          <el-table-column prop="platformName" label="接入平台" width="" align="center">
          </el-table-column>
          <el-table-column
            prop="customerServiceLink"
            label="客服链接"
            width="700"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="ids" label="客服人员" width="" align="center">
            <!-- <template slot-scope="scope">
              <span
                v-for="(item, index) in scope.row.staffs"
                :key="index"
                >{{ item.name }}、</span
              >
            </template> -->
          </el-table-column>
          <el-table-column
            prop="validTime"
            width="180"
            label="有效时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="endTime"
            width="180"
            label="结束时间"
            align="center"
          ></el-table-column>
          <el-table-column prop="shortName" fixed="right" label="操作" width="180" align="center">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="editRole(scope.row)"
                size="mini"
                type="primary"
                plain
              >
                修改
              </el-button>
              <el-button
                @click.native.prevent="confirmDel(scope.row)"
                size="mini"
              >
                删除
              </el-button>
            </template></el-table-column
          ></el-table
        >
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
        <!-- <ChangeRoleStatus ref="ChangeRoleStatus" @reroad="getList" /> -->
        <EditRole ref="EditRole" @reroad="getList" />
        <!-- <AddPerson ref="AddPerson" @reroad="getList" /> -->
      </div>
    </div>
  </div>
</template>

<script>
import { channellist,channeldelete } from "@/api/chat/index";
// import Tips from "./components/tips.vue";
import EditRole from "./components/addaccess.vue";
// import AddPerson from "./components/addperson.vue";
// import ChangeRoleStatus from "./components/changerolestatus.vue";
export default {
  components: {
    // Tips,
    // ChangeRoleStatus,
    EditRole,
    // AddPerson,
  },
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      channellist(this.queryParams).then((res) => {
        // this.total = res.total;
        this.tableData = res.data;
      });
    },
    // 编辑职务
    editRole(ob) {
      this.$refs.EditRole.id = ob.id;
      // this.$refs.EditRole.submitParams.name = ob.name;
      // this.$refs.EditRole.submitParams.description = ob.description;
      this.$refs.EditRole.dialogVisible = true;
    },
    // 新增人员
    addPerson(ob) {
      this.$refs.AddPerson.id = ob.id;
      this.$refs.AddPerson.submitParams.name = ob.name;
      this.$refs.AddPerson.dialogVisible = true;
    },
    // 停用启用职务
    updateRoleStatus(ob) {
      this.$refs.ChangeRoleStatus.dialogVisible = true;
      this.$refs.ChangeRoleStatus.id = ob.id;
      this.$refs.ChangeRoleStatus.submitParams.name = ob.name;
      this.$refs.ChangeRoleStatus.statusType = ob.status;
    },
    handleAdd() {
      this.$refs.EditRole.id = "";
      this.$refs.EditRole.submitParams = {};
      this.$refs.EditRole.dialogVisible = true;
    },
    tipsClick() {
      this.$refs.Tips.tipsdialogVisible = true;
    },
    handleQuery() {
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
      // this.$router.push({
      //   name: "/staffmanage",
      // });
    },
    confirmDel(ob) {
      this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          channeldelete({ ids: [ob.id] }).then((res) => {
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
