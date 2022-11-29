/**客户列表 */
<template>
  <div>
    <div class="tabWarp" v-if="!diaOpen">
      <div v-for="(item, index) in filterTabList" :key="index"
        :class="item.type == queryParams.tag ? 'color-active' : ''" @click="tabquery(item.type)">
        <!-- :class="item.type == queryParams.tag ? 'color-active' : '111'" -->

        {{  item.name  }}
      </div>
    </div>
    <AdvancedFilter v-if="diaOpen" ref="AdvancedFilter" />
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="realName" v-if="!diaOpen">
          <el-input v-model="queryParams.keyword" placeholder="搜索关键词" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item label="" prop="affiliationStaff" v-if="!diaOpen">
          <el-cascader style="width: 100%" size="small" placeholder="归属人员" v-model="queryParams.userId"
            :options="userList" :show-all-levels="false" :props="props" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="" prop="dept" v-if="!diaOpen">
          <el-select v-model="queryParams.state" placeholder="客户状态" clearable size="small">
            <el-option label="全部" value="" />
            <el-option v-for="(item, index) in customerStateList" :key="index" :label="item.dictLabel"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="type" v-if="!diaOpen">
          <el-select size="small" v-model="queryParams.type" placeholder="客户类型">
            <el-option v-for="dict in dict.type.customer_type" :key="dict.dictCode" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="type" v-if="!diaOpen">
          <el-select size="small" v-model="queryParams.star" placeholder="客户星级">
            <el-option v-for="(item, index) in customerStarList" :key="index" :label="item.dictLabel"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>

        <!--<el-form-item label="" prop="endLastLoginTime" v-if="!diaOpen">
          <el-date-picker
            type="datetime"
            size="small"
            value-format="yyyy-MM-dd HH:mm:ss"
            placeholder="最后跟进"
            v-model="queryParams.endLastLoginTime"
            @keyup.enter.native="handleQuery"
          ></el-date-picker>
        </el-form-item>-->
        <el-form-item label="" prop="endLastLoginTime" v-if="!diaOpen">
          <el-date-picker size="small" v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="跟进开始日期" end-placeholder="跟进结束日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button v-if="!diaOpen" type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询
          </el-button>
          <el-button v-else type="primary" icon="el-icon-search" size="mini" @click="handleQueryHighSearch">查询
          </el-button>
          <el-button v-if="!diaOpen" icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button v-else icon="el-icon-refresh" size="mini" @click="resetHighSearchQuery">重置</el-button>
          <el-button v-btnPermi="['kh_advanced_filter']" icon="el-icon-s-flag" size="mini" type="text"
            @click="diaOpen = !diaOpen">高级筛选</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd"
          v-btnPermi="['kh_create_customer']">添加</el-button>
        <el-button icon="el-icon-plus" size="small" @click="handleImport" style="margin-right: 10px"
          v-btnPermi="['kh_create_customer']">导入</el-button>
        <el-dropdown v-btnPermi="['kh_export_customers']" trigger="click" style="margin-right: 10px">
          <el-button type="primary" icon="el-icon-upload" size="small">导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams">当前分类</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="exportByChoose">选中导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button plain icon="el-icon-date" size="small" v-btnPermi="['kh_new_task']" @click="handleStaffAction('4')">
          新建任务</el-button>
        <el-button plain icon="el-icon-circle-close" size="small" v-btnPermi="['kh_transfer_customer']"
          @click="handleStaffAction('1')">转移客户</el-button>
        <el-button plain v-btnPermi="['kh_move_into_the_high_seas']" icon="el-icon-switch-button" size="small"
          @click="handleStaffAction('3')">移入公海</el-button>
        <!--<el-button plain v-btnPermi="['kh_move_into_the_high_seas']" icon="el-icon-switch-button" size="small"
          @click="handleStaffAction('5')">短信群发</el-button>-->
        <el-button plain icon="el-icon-switch-button" size="small" @click="handleStaffAction('6')">电话任务</el-button>
      </div>

      <div style="margin-top: 20px">
        <CustomerTable ref="CustomerTable" @getIds="getIds" />
      </div>
      <Customer v-if="customerOpen" ref="Customer" :id="editId" @reload="closeAdd" />
      <ShiftInHigiSeas ref="ShiftInHigiSeas" @reload="closeAdd" @getIds="getIds" :ids="chooseStaffIds" />
      <TransferCustomer ref="TransferCustomer" :ids="chooseStaffIds" @reload="getData" />
      <Task ref="Task" v-if="taskOpen" :customerId="chooseStaffIds" @reload="getData" :type="0" />
      <ImportBussiness v-if="importOpen" ref="ImportBussiness" @reroad="closeAdd" />
      <!--type 0 销售线索 1客户管理 2公海客户 -->
      <MessageSend :ids="chooseStaffIds" :type="1" ref="MessageSend" />
      <PhoneCall :ids="chooseStaffIds" :type="1" ref="PhoneCall" />
    </div>
  </div>
</template>

<script>
import {
  customerexport,
  customerexportbyCondition,
  getstaffList,
} from "@/api/customer/index";
import TransferCustomer from "./components/transfercustomer.vue";
import ShiftInHigiSeas from "./components/shiftinhighseas.vue";
import CustomerTable from "./components/customertable.vue";
import Customer from "../add/customer.vue";
import Task from "../add/task.vue";
import Dict from "@/components/dict/dict.vue";
import ImportBussiness from "./components/import.vue";
import AdvancedFilter from "./components/advancedFilter.vue";
import MessageSend from "../components/icons/messageSend.vue";
import PhoneCall from "../components/icons/call.vue";

export default {
  dicts: ["company_manage_status", "company_cash", "customer_type"],
  mixins: [Dict],
  components: {
    PhoneCall,
    CustomerTable,
    Customer,
    ShiftInHigiSeas,
    TransferCustomer,
    Task,
    ImportBussiness,
    AdvancedFilter,
    MessageSend,
  },
  data() {
    return {
      diaOpen: false,
      importOpen: false, //导入模态框
      tabList: [
        { name: "全部客户", type: 0, isDeptHead: 1 },
        {
          name: "我的客户",
          type: 1,
          isDeptHead: 1,
        },
        {
          name: "下属客户",
          type: 2,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
        { name: "重点客户", type: 3, isDeptHead: 1 },
        { name: "我协作的", type: 4, isDeptHead: 1 },
        {
          name: "下属协作",
          type: 5,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
      ],
      taskOpen: false,
      customerOpen: false, //新增编辑客户
      editId: "",
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        tag: 0,
      },
      time: "",
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      userList: [],
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
  mounted() { },
  methods: {
    // 导入员工
    handleImport() {
      this.importOpen = true;
      this.$nextTick(() => {
        this.$refs.ImportBussiness.open = true;
        this.$refs.ImportBussiness.active = 1;
        this.$refs.ImportBussiness.fileList = [];
      });
    },
    tabquery(type) {
      this.queryParams.tag = type;
      console.log(type, this.queryParams.tag);
      this.$refs.CustomerTable.queryParams.tag = type;
      this.getData(this.queryParams);
    },
    getData(query) {
      if (query == null) {
        query = this.queryParams;
      }
      this.$refs.CustomerTable.getData(query);
    },
    customerexportbyCondition(ob) {
      customerexportbyCondition(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "客户列表" + ".xlsx"
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
          link.setAttribute("download", "客户列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          /* 下载完成移除元素 */
          document.body.removeChild(link);
          /* 释放掉blob对象 */
          window.URL.revokeObjectURL(url);
        }
      });
    },
    exports(ob) {
      customerexport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "客户列表" + ".xlsx"
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
          link.setAttribute("download", "客户列表" + ".xlsx");
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
      if (this.chooseStaffIds.length <= 0) {
        this.$message.error("请至少选择一条数据");
        return false;
      }
      this.exports(datas);
    },
    exportByParams() {
      this.customerexportbyCondition(this.queryParams);
    },
    /* 从列表页获取ids */
    getIds(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseStaffIds = ids;
    },
    handleStaffAction(type) {
      if (type == 4) {
        if (this.chooseStaffIds.length <= 0) {
          this.$message.error("最少选择一个客户");
          return;
        } else if (this.chooseStaffIds.length > 10) {
          this.$message.error("最多选择十个客户");
          return;
        }
        this.taskOpen = true;
        this.$nextTick(() => {
          this.$refs.Task.open = true;
        });
      } else {
        if (type != "" || type != undefined) {
          if (this.chooseStaffIds.length <= 0) {
            this.$message({
              showClose: true,
              message: "请选择客户后操作",
              type: "warning",
            });
            return;
          } else {
            if (type == 1) this.$refs.TransferCustomer.open = true;
            if (type == 3) this.$refs.ShiftInHigiSeas.open = true;
            if (type == 5) this.$refs.MessageSend.open = true;
            if (type == 6) this.$refs.PhoneCall.open = true;
          }
        } else {
        }
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
    /* 删除记录 */
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
    /* 重置密码 */
    handleResetPassword() {
      this.$refs.ResetPassword.dialogVisible = true;
    },
    /* 使用期限 */
    handleserviceLife() {
      this.$refs.ServiceLife.dialogVisible = true;
    },
    handleAdd() {
      this.customerOpen = true;
      this.$nextTick(() => {
        this.$refs.Customer.open = true;
      });
    },
    closeAdd() {
      this.$refs.CustomerTable.getData(this.queryParams);
    },
    handleQuery() {
      if (this.time != "" && this.time != null) {
        this.queryParams.startTime = this.time[0] + " 00:00:00";
        this.queryParams.endTime = this.time[1] + " 23:59:59";
      } else {
        this.queryParams.startTime = null;
        this.queryParams.endTime = null;
      }
      this.$refs.CustomerTable.getHighSearchData(this.queryParams, 1);
    },
    resetQuery() {
      this.time = "";
      this.queryParams = {
        tag: 0,
        pageNum: 1,
        pageSize: 10,
      };
      this.$refs.CustomerTable.getHighSearchData(this.queryParams, 1);
    },
    handleQueryHighSearch() {
      if (this.$refs.AdvancedFilter) {
        let obj = Object.assign(
          this.$refs.AdvancedFilter.form,
          this.queryParams
        );
        // 高级筛选传2
        obj.status = 0;
        this.$refs.CustomerTable.getHighSearchData(obj, 2);
        return;
      }
    },
    resetHighSearchQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10, status: 0 };
      this.$refs.AdvancedFilter.form = {};
      let obj = Object.assign(this.$refs.AdvancedFilter.form, this.queryParams);
      this.$refs.CustomerTable.getHighSearchData(obj, 2);
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
}

.color-active {
  color: #409eff !important;
}
</style>
