/**客户列表 */
<template>
  <div>
    <div class="tabWarp">
      <div v-for="(item, index) in filterTabList" :key="index"
        :class="item.type == queryParams.topSort ? 'color-active' : ''" @click="tabquery(item.type)">
        {{ item.name }}
      </div>
    </div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="realName">
          <el-input v-model="queryParams.name" placeholder="搜索关键词" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="" prop="dept">
          <el-select v-model="queryParams.role" placeholder="角色" clearable size="small">
            <el-option label="全部" value />
            <el-option v-for="dict in customerRoleList" :key="dict.dictValue" :label="dict.dictLabel"
              :value="dict.dictValue" />
          </el-select>
        </el-form-item>
        <el-form-item prop="phone">
          <el-input v-model="queryParams.phone" placeholder="手机号" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="" prop="endLastLoginTime">
          <el-date-picker size="small" v-model="time" type="daterange" value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至" start-placeholder="跟进开始时间" end-placeholder="跟进结束时间">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="small" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery">重置</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button style="margin-right: 10px" type="primary" icon="el-icon-plus" size="small" @click="handleAdd"
          v-btnPermi="['contacts_add']">添加</el-button>
        <el-dropdown trigger="click" v-btnPermi="['contacts_export']" style="margin-right: 10px">
          <el-button type="primary" icon="el-icon-upload" size="small">导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams">当前分类</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="exportByChoose">选中导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button plain v-btnPermi="['contacts_delete']" icon="el-icon-switch-button" size="small"
          @click="handledel()">删除</el-button>
      </div>
      <div style="width: 100%; margin-top: 20px">
        <SetColumn style="margin-top: -20px" :showLists="showList" ref="SetColumn" :cacheColunm="'connectColumn'"
          :startFollowUpModel="false" @getTableList="getTableList" @reload="getList" @reset="resetColumn" />
        <el-table border ref="multipleTable" :data="concantTableData" tooltip-effect="dark"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"> </el-table-column>
          <template v-for="item in columnShow">
            <el-table-column v-if="item.id == 'contactName'" :key="item.id" :label="item.name" :resizable="false"
              show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span style="color: #46a6ff; cursor: pointer" @click="jumpContact(scope.row.id)">{{
                    scope.row.contactName
                }}</span>
              </template>
            </el-table-column>
            <el-table-column v-else-if="item.id == 'relevancyClient'" :key="item.id" :label="item.name"
              :resizable="false" show-overflow-tooltip align="center">
              <template slot-scope="scope">
                <span style="color: #46a6ff; cursor: pointer" @click="jump(scope.row.relevancyClientId)">{{
                    scope.row.relevancyClient
                }}</span>
              </template>
            </el-table-column>

            <el-table-column v-else :key="item.name" :label="item.name" :prop="item.id" :resizable="false"
              show-overflow-tooltip align="center">
            </el-table-column>
          </template>
          <el-table-column prop="action" label="操作" align="center">
            <template slot-scope="scope">
              <el-button v-btnPermi="['contacts_update']" style="margin-right: 10px"
                @click.native.prevent="edit(scope.row.id)" size="mini" type="primary" plain>
                编辑
              </el-button>
              <el-popconfirm title="确定删除吗？" @confirm="handledel(scope.row.id)">
                <el-button v-btnPermi="['contacts_delete']" slot="reference" size="mini" type="danger" plain>
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNo" :limit.sync="queryParams.pageSize"
          @pagination="getList" />
      </div>
      <ConnectPerson v-if="open" ref="ConnectPerson" :id="editId" @reload="getList" />
    </div>
  </div>
</template>

<script>
import SetColumn from "@/components/Setcolumn/index";
import {
  contactlistAll,
  deleteByIds,
  contactexport,
} from "@/api/customer/index";
import { getShowList } from "@/api/common/index";
import ConnectPerson from "../add/connectperson.vue";
export default {
  components: {
    ConnectPerson,
    SetColumn,
  },
  data() {
    return {
      tableShowList: [], //列表项
      showList: [], //默认列表项
      tabList: [
        {
          name: "全部联系人",
          type: 0,
          isDeptHead: 1,
        },
        {
          name: "我的联系人",
          type: 1,
          isDeptHead: 1,
        },
        {
          name: "下属的联系人",
          type: 2,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
        {
          name: "我协作的",
          type: 3,
          isDeptHead: 1,
        },
        {
          name: "下属协作",
          type: 4,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
      ],
      time: "",
      editId: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        topSort: 0,
      },
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      concantTableData: [],
      customerRoleList: [],
      total: 0,
    };
  },
  beforeMount() {
    getShowList({ type: 2 }).then((res) => {
      if (sessionStorage.getItem("connectColumn")) {
        this.showList = JSON.parse(sessionStorage.getItem("connectColumn"));
      } else {
        this.showList = res.data;
      }
      // this.tableShowList = res.data;
      // this.showList = res.data;
    });
  },
  computed: {
    columnShow() {
      return this.showList.filter((item, index) => {
        if (item.isPre == 1) {
          return item;
        }
      });
    },
    filterTabList() {
      return this.tabList.filter((item, index) => {
        if (item.isDeptHead == 1) {
          return item;
        }
      });
    },
  },
  mounted() {
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    this.getList(this.queryParams);
  },
  methods: {
    resetColumn() {
      getShowList({ type: 2 }).then((res) => {
        this.showList = res.data;
        sessionStorage.setItem("connectColumn", JSON.stringify(res.data));
        this.$refs.SetColumn.showList = res.data;
      });
    },
    // 获取到列表项
    getTableList(val) {
      this.showList = val;
    },
    jumpContact(id) {
      this.$router.push({
        path: "/customerManager/contactdetail",
        query: {
          id: id,
        },
      });
    },
    jump(id) {
      this.$router.push({
        path: "/customerManager/customerdetail",
        query: {
          id: id,
        },
      });
    },
    getList(query) {
      if (query) {
        this.queryParams = Object.assign(this.queryParams, query);
      }
      contactlistAll(this.queryParams).then((res) => {
        this.concantTableData = res.rows;
        this.total = res.total;
      });
    },
    tabquery(type) {
      this.queryParams.topSort = type;
      this.getList(this.queryParams);
    },
    handleSelectionChange(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseStaffIds = ids;
    },
    exports(ob) {
      contactexport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "联系人列表" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "联系人列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      let datas = {};
      datas.ids = this.chooseStaffIds;
      this.exports(datas);
    },
    exportByParams() {
      this.exports(this.queryParams);
    },
    // 从列表页获取ids
    getIds(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseStaffIds = ids;
    },
    handledel(ob) {
      if (ob) {
        this.chooseStaffIds = [ob];
      }
      if (this.chooseStaffIds.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除的联系人",
          type: "warning",
        });
        return;
      } else {
        this.$confirm("此操作将永久删除选中联系人, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteByIds({ ids: this.chooseStaffIds }).then((res) => {
              this.getList(this.queryParams);
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    handleStaff(data) {
      handleStaff(data).then((res) => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      });
    },
    // 重置密码
    handleResetPassword() {
      this.$refs.ResetPassword.dialogVisible = true;
    },
    //使用期限
    handleserviceLife() {
      this.$refs.ServiceLife.dialogVisible = true;
    },
    handleAdd() {
      this.editId = "";
      this.open = true;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
    edit(id) {
      this.open = true;
      this.editId = id;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
    closeAdd() {
      this.$refs.CustomerTable.getData();
    },
    handleQuery() {
      if (this.time != "" && this.time != null) {
        this.queryParams.startTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endTime = this.time[1] + " " + "23:59:59";
      } else if (this.time == null) {
        this.queryParams.followUpTimeStart = "";
        this.queryParams.followUpTimeEnd = "";
      }
      this.getList(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.queryParams = {
        pageSize: 10,
        pageNo: 1,
      };
      this.getList();
    },
  },
};
</script>

<style lang='scss' scoped>
.link {
  color: #409eff;
  cursor: pointer;
}

.tabWarp {
  display: flex;
  align-items: center;
  background: rgb(249, 249, 249);
  padding: 15px 20px;

  div {
    padding-right: 50px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #303133;
  }

  div:hover {
    color: #409eff;
  }

  .color-active {
    color: #409eff !important;
  }
}
</style>
