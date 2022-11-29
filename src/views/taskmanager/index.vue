/**任务管理 */
<template>
  <div>
    <div class="tabWarp">
      <div
        v-for="(item, index) in filterTabList"
        :key="index"
        :class="item.type == queryParams.homeType ? 'color-active' : ''"
        @click="tabquery(item.type)"
      >
        {{ item.name }}
      </div>
    </div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="word">
          <el-input
            v-model="queryParams.word"
            placeholder="搜索关键词"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <el-form-item label="">
          <el-select
            size="small"
            v-model="queryParams.type"
            placeholder="任务状态"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="未开始" value="0"></el-option>
            <el-option label="进行中" value="1"></el-option>
            <el-option label="已超时" value="2"></el-option>
            <el-option label="已完成" value="3"></el-option>
            <el-option label="未完成" value="4"></el-option>
            <el-option label="已取消" value="5"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="sourceStatus">
          <el-select
            v-model="queryParams.state"
            placeholder="发起人员"
            clearable
            size="small"
          >
            <el-option label="全部" value=""></el-option>
            <el-option label="待审批" value="0"></el-option>
            <el-option label="已通过" value="1"></el-option>
            <el-option label="被否决" value="2"></el-option>
            <el-option label="被驳回" value="3"></el-option>
            <el-option label="已撤销" value="4"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="star">
          <el-cascader
            style="width: 100%"
            v-model="queryParams.ids"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            size="small"
            placeholder="负责人员"
            clearable
          ></el-cascader>
        </el-form-item>

        <el-form-item label="" prop="followUpTimeEnd">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="mini"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <div>
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          style="margin-right: 10px"
          v-btnPermi="['rm_add_tasks']"
          >添加</el-button
        >
        <el-dropdown
          v-btnPermi="['rm_export_task']"
          trigger="click"
          style="margin-right: 10px"
        >
          <el-button type="primary" icon="el-icon-upload" size="small"
            >导出</el-button
          >
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams"
              >当前分类</el-dropdown-item
            >
            <el-dropdown-item
              icon="el-icon-circle-plus"
              @click.native="exportByChoose"
              >选中导出</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
      </div>

      <div style="margin-top: 20px"></div>
      <Task ref="Task" v-if="taskOpen" @reload="getData" />
      <TaskTable ref="TaskTable" />
    </div>
  </div>
</template>

<script>
import { getstaffList } from "@/api/customer/index";
import { workderive } from "@/api/task/index";
import TaskTable from "./components/taskTable.vue";
import Task from "../add/task.vue";
export default {
  components: {
    Task,
    TaskTable,
  },
  data() {
    return {
      tabList: [
        { name: "全部任务", type: null, isDeptHead: 1 },
        {
          name: "我发起的",
          type: 0,
          isDeptHead: 1,
        },
        {
          name: "我负责的",
          type: 1,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
        { name: "我参与的", type: 2, isDeptHead: 1 },
        {
          name: "下属负责的",
          type: 3,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
      ],
      taskOpen: false, //任务弹窗
      AddSalesOpen: false, //新增编辑
      TransferCustomerOpen: false, //转为客户
      editId: "",
      open: false,
      queryParams: {
        homeType: null,
      },
      customerLifeCycle: [],
      TaskStatusList: [],
      chooseStaffIds: [],
      userList: [],
      time:'',
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    this.getDicts("sys_job_status").then((res) => {
      this.TaskStatusList = res.data;
    });
  },
  computed: {
    filterTabList() {
      return this.tabList.filter((item, index) => {
        if (item.isDeptHead == 1) {
          return item;
        }
      });
    },
  },
  methods: {
    tabquery(type) {
      this.queryParams.homeType = type;
      this.$refs.TaskTable.queryParams.homeType = type;
      this.getData(this.queryParams);
    },
    getData(query) {
      this.$refs.TaskTable.getList(query);
    },
    exports(ob) {
      workderive(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "任务列表" + ".xlsx"
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
          link.setAttribute("download", "任务列表" + ".xlsx");
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
    handleStaffAction(type) {
      if (type != "" || type != undefined) {
        if (this.chooseStaffIds.length <= 0) {
          this.$message({
            showClose: true,
            message: "请选择客户后操作",
            type: "warning",
          });
          return;
        } else {
          // 转为客户
          if (type == 1) {
            if (this.chooseStaffIds.length > 1) {
              this.$message({
                showClose: true,
                message: "单次只能转移一个客户",
                type: "warning",
              });
              return;
            } else {
              this.TransferCustomerOpen = true;
              this.$nextTick(() => {
                this.$refs.TransferCustomer.open = true;
              });
            }
          }
          if (type == 3) {
            this.$confirm("是否确定删除对应的记录", "是否确定删除对应的记录", {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            })
              .then(() => {
                deleteByIds({ ids: this.chooseStaffIds }).then((res) => {
                  this.getData();
                  this.$message({
                    type: "success",
                    message: "企业删除成功!",
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
          if (type == 4) {
            this.taskOpen = true;
            this.$nextTick(() => {
              this.$refs.Task.open = true;
            });
          }
        }
      } else {
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
    // 删除记录
    handleDel() {
      this.$confirm("是否确定删除对应的记录", "是否确定删除对应的记录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          this.$message({
            type: "success",
            message: "企业删除成功!",
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleAdd() {
      this.taskOpen = true;
      this.$nextTick(() => {
        this.$refs.Task.open = true;
      });
    },
    handleQuery() {
      if (this.time != "" && this.time != null) {
        this.queryParams.startTime = this.time[0];
        this.queryParams.endTime = this.time[1];
      } else if (this.time == null) {
        this.queryParams.startTime = "";
        this.queryParams.endTime = "";
      }
      this.$refs.TaskTable.getList(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.queryParams = {};
      this.$refs.TaskTable.getList(this.queryParams);
    },
  },
};
</script>

<style lang='scss' scoped>
.tabWarp {
  display: flex;
  align-items: center;
  background: rgb(249, 249, 249);
  padding: 20px;
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