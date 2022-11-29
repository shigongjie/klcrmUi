/**销售线索 */
<template>
  <div>
    <div class="tabWarp">
      <div v-for="(item, index) in filterTabList" :key="index"
        :class="item.type == queryParams.topSort ? 'color-active' : ''" @click="tabquery(item.type)">
        {{  item.name  }}
      </div>
    </div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="realName" v-if="quickSearchList.includes('name')">
          <el-input v-model="queryParams.name" placeholder="搜索关键词" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>

        <el-form-item prop="clueLabel" v-if="quickSearchList.includes('clueLabel')">
          <el-cascader style="width: 100%" v-model="queryParams.clueLabel" :options="labelList" placeholder="线索标签"
            size="small" :show-all-levels="false" :props="props" separator="," clearable></el-cascader>
        </el-form-item>

        <el-form-item prop="realName" v-if="quickSearchList.includes('industry')">
          <el-select size="small" v-model="queryParams.industry" clearable="" placeholder="所属行业">
            <el-option v-for="dict in dict.type.industry" :key="dict.value" :label="dict.label" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" v-if="quickSearchList.includes('source')">
          <el-select size="small" v-model="queryParams.source" placeholder="线索来源">
            <el-option v-for="dict in dict.type.customer_source" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="sourceStatus" v-if="quickSearchList.includes('sourceStatus')">
          <el-select v-model="queryParams.sourceStatus" placeholder="线索状态" clearable size="small">
            <el-option v-for="dict in dict.type.market_source_status" :key="dict.value" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="" v-if="quickSearchList.includes('role')">
          <el-select style="width: 100%" v-model="queryParams.role" placeholder="角色" size="small">
            <el-option v-for="dict in dict.type.contact_role" :key="dict.value" :label="dict.label" :value="dict.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="sex">
          <el-select style="width: 100%" v-model="queryParams.sex" placeholder="尊称" size="small">
            <el-option value="0" label="保密">保密</el-option>
            <el-option value="2" label="女士">女士</el-option>
            <el-option value="1" label="先生">先生</el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="userId" label="" v-if="quickSearchList.includes('affiliationStaff')">
          <el-cascader style="width: 100%" placeholder="归属人员" size="small" v-model="queryParams.affiliationStaff"
            :options="userList" :show-all-levels="false" :props="props" clearable></el-cascader>
        </el-form-item>

        <el-form-item prop="affiliationDept" label="" v-if="quickSearchList.includes('affiliationDept')">
          <el-cascader placeholder="请选择部门" :options="deptTree" :show-all-levels="false" filterable
            v-model="queryParams.affiliationDept" :props="{
              emitPath: false,
              checkStrictly: true,
              children: 'list',
              label: 'name',
              value: 'id',
            }" clearable style="width: 100%"></el-cascader>
        </el-form-item>

        <el-form-item label="" v-if="quickSearchList.includes('address')">
          <el-cascader placeholder="请选择所在地区" style="width: 100%" v-model="queryParams.address" :options="areaList"
            :props="areaListprops" clearable></el-cascader>
        </el-form-item>

        <el-form-item label="" prop="createBy" v-if="quickSearchList.includes('createBy')">
          <el-cascader style="width: 100%" size="small" placeholder="创建人员" v-model="queryParams.createBy"
            :options="userList" :show-all-levels="false" :props="props" clearable></el-cascader>
        </el-form-item>

        <el-form-item label="" prop="followUpTimeEnd" v-if="quickSearchList.includes('time')">
          <el-date-picker size="small" v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="跟进开始时间" end-placeholder="跟进结束时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="followUpTimeEnd" v-if="quickSearchList.includes('time2')">
          <el-date-picker size="small" v-model="time2" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始创建时间" end-placeholder="结束创建时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="" prop="followUpTimeEnd" v-if="quickSearchList.includes('time3')">
          <el-date-picker size="small" v-model="time3" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始转移时间" end-placeholder="结束转移时间">
          </el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
          <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          <el-button icon="el-icon-connection" size="mini" v-btnPermi="['marketclue_advanced_filter']"
            @click="handleHighSearchOpen(0)">高级搜索</el-button>
          <el-button icon="el-icon-help" size="mini" v-btnPermi="['marketclue_advanced_filter']"
            @click="handleHighSearchOpen(1)">快捷搜索</el-button>
        </el-form-item>
      </el-form>

      <div>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd" v-btnPermi="['marketclue_add']">添加
        </el-button>
        <el-button type="primary" icon="el-icon-plus" size="small" @click="handleImport" style="margin-right: 10px"
          v-btnPermi="['marketclue_add']">导入</el-button>
        <el-dropdown trigger="click" style="margin-right: 10px">
          <el-button v-btnPermi="['marketclue_export']" type="primary" icon="el-icon-upload" size="small">导出</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams">当前分类</el-dropdown-item>
            <el-dropdown-item icon="el-icon-circle-plus" @click.native="exportByChoose">选中导出</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button plain v-btnPermi="['marketclue_change_contacts']" icon="el-icon-switch-button" size="small"
          @click="handleStaffAction('1')">转为客户</el-button>
        <el-button plain icon="el-icon-circle-close" size="small" v-btnPermi="['marketclue_change_clue']"
          @click="handleStaffAction('2')">转移线索</el-button>
        <el-button plain v-btnPermi="['marketclue_add_task']" icon="el-icon-date" size="small"
          @click="handleStaffAction('4')">新建任务</el-button>

        <el-button plain v-btnPermi="['marketclue_detele']" icon="el-icon-circle-close" size="small"
          @click="handleStaffAction('3')">删除线索</el-button>
        <!--<el-button plain v-btnPermi="['marketclue_detele']" icon="el-icon-chat-square" size="small"
          @click="handleStaffAction('5')">短信群发</el-button>-->
        <el-button plain v-btnPermi="['marketclue_detele']" icon="el-icon-chat-square" size="small"
          @click="handleStaffAction('6')">电话任务</el-button>
      </div>

      <div style="margin-top: 40px">
        <SalesTable ref="SalesTable" @getIds="getIds" />
      </div>
      <AddSales v-if="AddSalesOpen" ref="AddSales" @reload="getData" />
      <Task ref="Task" v-if="taskOpen" :customerId="chooseStaffIds" :type="4" />
      <TransferCustomer v-if="TransferCustomerOpen" ref="TransferCustomer" :id="chooseStaffIds" @reload="getData" />
      <TransferSales v-if="TransferSalesOpen" ref="TransferSales" :ids="chooseStaffIds" @reload="getData" />
      <ImportBussiness v-if="importOpen" ref="ImportBussiness" @reroad="getData" />
      <!--type 0 销售线索 1客户管理 2公海客户 -->
      <MessageSend v-if="MessageSendOpen" :ids="chooseStaffIds" :type="0" ref="MessageSend" />
      <PhoneCall :ids="chooseStaffIds" :type="0" ref="PhoneCall" />
      <HighSearch ref="HighSearchOpen" @searchByparams="searchByparams" />
      <QuickSearch ref="QuickSearch" v-if="isQuickSearch" @getQuickSearchSet="getQuickSearchSet" />
    </div>
  </div>
</template>

<script>
import { getdeptTree } from "@/api/organization/index";
import { getstaffList, getareaList, getlabelList } from "@/api/customer/index";
import { salesleadExport, deleteByIds } from "@/api/saleslead/index";
import SalesTable from "./components/salestable.vue";
import AddSales from "./components/add.vue";
import Task from "../add/task.vue";
import TransferCustomer from "./components/transformcustomer.vue";
import TransferSales from "./components/transfersales.vue";
import ImportBussiness from "./components/import.vue";
import HighSearch from "./components/highsearch.vue";
import QuickSearch from "./components/setquicklysearch.vue";
import MessageSend from "../components/icons/messageSend.vue";
import PhoneCall from "../components/icons/call.vue";

export default {
  // mixins: [Dict],
  dicts: [
    "customer_source",
    "sys_normal_disable",
    "industry",
    "market_source_status",
    "customer_source",
    "contact_role",
  ],
  components: {
    PhoneCall,
    HighSearch,
    SalesTable,
    AddSales,
    Task,
    TransferCustomer,
    TransferSales,
    ImportBussiness,
    QuickSearch,
    MessageSend,
  },
  data() {
    return {
      deptTree: [],
      propsArray: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      isQuickSet: false,
      isHighSearchOpen: false,
      isQuickSearch: false,
      time2: "",
      time3: "",
      importOpen: false, //导入模态框
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      time: "",
      areaList: [],
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      userList: [],
      tabList: [
        { name: "全部线索", type: 1, isDeptHead: 1 },
        {
          name: "我的线索",
          type: 2,
          isDeptHead: 1,
        },
        {
          name: "下属的线索",
          type: 3,
          isDeptHead: this.$store.state.user.isDeptHead,
        },
        { name: "已转客户", type: 4, isDeptHead: 1 },
      ],
      taskOpen: false, //任务弹窗
      MessageSendOpen: false,
      AddSalesOpen: false, //新增编辑
      TransferCustomerOpen: false, //转为客户
      TransferSalesOpen: false, //转移线索
      editId: "",
      open: false,
      queryParams: {
        pageSize: 10,
        pageNum: 1,
        topSort: 1,
      },
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      sourceSatusList: [],
      labelList: [],
      quickSearchList: [
        "name",
        "topSort",
        "clueLabel",
        "industry",
        "role",
        // "sex",
        // "source",
        // "sourceStatus",
        // "affiliationStaff",
        // "affiliationDept",
        // "createBy",
        // "time",
        // "time2",
        // "time3",
      ], //搜索配置项
    };
  },
  beforeMount() {
    getlabelList().then((res) => {
      this.labelList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getdeptTree().then((res) => {
      this.deptTree = res.data;
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
    // 获取快捷搜索
    getQuickSearchSet(val) {
      console.log(val);
      this.quickSearchList = [];
      val.forEach((item) => {
        this.quickSearchList.push(item.filed);
      });
    },
    handleHighSearchOpen(ob) {
      if (ob == 0) {
        this.isHighSearchOpen = true;
        this.$nextTick(() => {
          if (ob == 1) {
            this.$refs.HighSearchOpen.isSet = true;
          } else {
            this.$refs.HighSearchOpen.isSet = false;
          }
          this.$refs.HighSearchOpen.open = true;
        });
      } else {
        this.isQuickSearch = true;
        this.$nextTick(() => {
          this.$refs.QuickSearch.tableSort_dia = true;
        });
      }
    },
    searchByparams(val) {
      this.queryParams = Object.assign(this.queryParams, val);
      console.log(this.queryParams);
      this.getData(this.queryParams);
    },
    // 导入线索
    handleImport() {
      this.importOpen = true;
      this.$nextTick(() => {
        this.$refs.ImportBussiness.open = true;
        this.$refs.ImportBussiness.active = 1;
        this.$refs.ImportBussiness.fileList = [];
      });
    },
    tabquery(type) {
      this.queryParams.type = 0;
      this.queryParams.topSort = type;
      this.$refs.SalesTable.queryParams.topSort = type;
      this.getData(this.queryParams);
    },
    getData(query) {
      this.$refs.SalesTable.getData(query);
    },
    exports(ob) {
      salesleadExport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "销售线索列表" + ".xlsx"
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
          link.setAttribute("download", "销售线索列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      if (this.chooseStaffIds.length <= 0) {
        this.$message.error("请至少选中一条数据");
        return;
      }
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
          } else if (type == 2) {
            this.TransferSalesOpen = true;
            this.$nextTick(() => {
              this.$refs.TransferSales.submitParams = {};
              this.$refs.TransferSales.open = true;
            });
          } else if (type == 3) {
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
          } else if (type == 4) {
            this.taskOpen = true;
            this.$nextTick(() => {
              this.$refs.Task.open = true;
            });
          } else if (type == 5) {
            this.MessageSendOpen = true;
            this.$nextTick(() => {
              this.$refs.MessageSend.open = true;
            });
            // this.$refs.MessageSend.open = true;
            // this.$refs.ids = this.chooseStaffIds;
          }
          else if (type == 6) this.$refs.PhoneCall.open = true;
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
            message: "删除成功!",
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
      this.AddSalesOpen = true;
      this.$nextTick(() => {
        this.$refs.AddSales.open = true;
      });
    },
    handleQuery() {
      /*if (this.time != "" && this.time != null) {
        this.queryParams.followUpTimeStart = this.time[0] + " " + "00:00:00";
        this.queryParams.followUpTimeEnd = this.time[1] + " " + "23:59:59";
      } else if (this.time == null) {
        this.queryParams.followUpTimeStart = "";
        this.queryParams.followUpTimeEnd = "";
      }
      if (this.time2 != "" && this.time2 != null) {
        this.queryParams.createStartTime = this.time2[0] + " " + "00:00:00";
        this.queryParams.createEndTime = this.time2[1] + " " + "23:59:59";
      } else if (this.time2 == null) {
        this.queryParams.createStartTime = "";
        this.queryParams.createEndTime = "";
      }
      if (this.time3 != "" && this.time3 != null) {
        this.queryParams.allotStartTime = this.time3[0] + " " + "00:00:00";
        this.queryParams.allotEndTime = this.time3[1] + " " + "23:59:59";
      } else if (this.time3 == null) {
        this.queryParams.allotStartTime = "";
        this.queryParams.allotEndTime = "";
      }*/
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        topSort: 1,
        type: 0,
        clueLabel: this.queryParams.clueLabel,
        name: this.queryParams.name,
        industry: this.queryParams.industry,
        role: this.queryParams.role,
        sex: this.queryParams.sex,
      };
      this.$refs.SalesTable.getDataQuery(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.time2 = "";
      this.time3 = "";
      this.queryParams = {
        pageSize: 10,
        pageNum: 1,
        topSort: 1,
        type: 0,
      };
      this.$refs.SalesTable.getDataQuery(this.queryParams);
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
