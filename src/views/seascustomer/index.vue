/**客户列表 */
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="realName">
        <el-input v-model="queryParams.keyword" placeholder="关键词" clearable size="small"
          @keyup.enter.native="handleQuery" />
      </el-form-item>

      <el-form-item label="" prop="dept">
        <el-select v-model="queryParams.state" placeholder="客户状态" clearable size="small">
          <el-option v-for="(item, index) in customerStateList" :key="index" :label="item.dictLabel"
            :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="dept">
        <el-select v-model="queryParams.type" placeholder="客户类型" clearable size="small">
          <el-option label="企业客户" value="0"></el-option>
          <el-option label="个人客户" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="dept">
        <el-select v-model="queryParams.star" placeholder="客户星级" clearable size="small">
          <el-option v-for="(item, index) in customerStarList" :key="index" :label="item.dictLabel"
            :value="item.dictValue"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">查询</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <div>
      <el-button type="primary" icon="el-icon-plus" size="small" @click="handleAdd" v-btnPermi="['kh_create_customer']">
        添加</el-button>
      <el-button icon="el-icon-plus" size="small" @click="handleImport" style="margin-right: 10px"
        v-btnPermi="['kh_create_customer']">导入</el-button>
      <el-dropdown trigger="click" style="margin-right: 10px" v-btnPermi="['ghkh_export_customers']">
        <el-button plain icon="el-icon-upload" size="small">导出</el-button>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams">当前分类</el-dropdown-item>
          <el-dropdown-item icon="el-icon-circle-plus" @click.native="exportByChoose">选中导出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
      <el-button plain icon="el-icon-date" size="small" v-btnPermi="['ghkh_pick_up_customers']"
        @click="handleAction('1')">领取客户</el-button>
      <el-button plain icon="el-icon-date" size="small" v-btnPermi="['ghkh_transfer_customer']"
        @click="handleAction('2')">转移客户</el-button>
      <el-button plain icon="el-icon-date" size="small" v-btnPermi="['ghkh_delete_customer']"
        @click="handleAction('3')">删除客户</el-button>
      <!--<el-button plain icon="el-icon-chat-square" size="small" v-btnPermi="['ghkh_delete_customer']"
        @click="handleAction('5')">短信群发</el-button>-->
      <el-button plain icon="el-icon-chat-square" size="small" v-btnPermi="['ghkh_delete_customer']"
        @click="handleAction('6')">电话任务</el-button>
    </div>
    <div style="margin-top: 20px">
      <CustomerTable ref="CustomerTable" @getIds="getIds" />
    </div>
    <Customer ref="Customer" @reload="getTabledata" />
    <TransferCustomer ref="TransferCustomer" :ids="chooseStaffIds" @reload="getTabledata" />
    <el-dialog v-if="seaopen" :title="'新增公海客户'" :visible.sync="seaopen" width="700px">
      <el-form class="selfForm" ref="rulesForm" :rules="seaFormrules" :model="seaForm" label-width="120px" size="small">
        <el-form-item prop="name" label="客户名称：">
          <el-input v-model="seaForm.name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item prop="contactPhone" label="手机号：">
          <el-input maxlength="11" v-model="seaForm.contactPhone" placeholder="请输入手机号"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submit()">保存</el-button>
      </span>
    </el-dialog>
    <ImportBussiness v-if="importOpen" ref="ImportBussiness" @reroad="getTabledata" />
    <!--type 0 销售线索 1客户管理 2公海客户 -->
    <MessageSend :ids="chooseStaffIds" :type="2" ref="MessageSend" />
    <PhoneCall :ids="chooseStaffIds" :type="2" ref="PhoneCall" />
  </div>
</template>

<script>
import MessageSend from "../components/icons/messageSend.vue";
import TransferCustomer from "../customer/components/transfercustomer.vue";
import Dict from "@/components/dict/dict.vue";
import CustomerTable from "./components/customertable.vue";
import Customer from "./components/add.vue";
import ImportBussiness from "./components/import.vue";
import PhoneCall from "../components/icons/call.vue";
import {
  customerexportbyCondition,
  customerexport,
  receivehighseascustomer,
  customerremove,
  seasinsert,
} from "@/api/customer/index";
export default {
  mixins: [Dict],
  components: {
    PhoneCall,
    CustomerTable,
    Customer,
    TransferCustomer,
    ImportBussiness,
    MessageSend,
  },
  data() {
    return {
      seaopen: false, //公海客户弹窗
      seaFormrules: {
        name: [
          { required: true, message: "请输入客户名称", trigger: "change" },
        ],
        contactPhone: [
          { required: true, message: "请输入客户手机号", trigger: "blur" },
        ],
      },
      seaForm: {},
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
        status: 1,
      },
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      importOpen: false, //导入模态框
    };
  },
  methods: {
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          seasinsert(this.seaForm).then((res) => {
            this.seaopen = false;
            this.$message.success("新增成功");
            this.$refs.CustomerTable.getData();
          });
        }
      });
    },
    handleImport() {
      this.importOpen = true;
      this.$nextTick(() => {
        this.$refs.ImportBussiness.open = true;
        this.$refs.ImportBussiness.active = 1;
        this.$refs.ImportBussiness.fileList = [];
      });
    },
    // 刷新子页面数据
    getTabledata() {
      this.open = false;
      this.$refs.CustomerTable.getData();
    },
    exports(ob) {
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
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      let datas = {};
      datas.ids = this.chooseStaffIds;
      if (this.chooseStaffIds.length <= 0) {
        this.$message.warning("请选择到导出的条目");
        return;
      }
      customerexport(datas).then((data) => {
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
    handleAction(type) {
      if (this.chooseStaffIds.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要操作的条目",
          type: "warning",
        });
        return;
      } else {
        if (type == 1) {
          this.$confirm(
            // "领取后*天后未跟进/成交，客户将自动放回公海",
            "是否确认领取所选择的客户？",
            {
              confirmButtonText: "确定",
              cancelButtonText: "取消",
              type: "warning",
            }
          )
            .then(() => {
              receivehighseascustomer({ ids: this.chooseStaffIds }).then(
                (res) => {
                  this.$refs.CustomerTable.getData(this.queryParams);
                  this.$message({
                    type: "success",
                    message: "领取成功!",
                  });
                }
              );
            })
            .catch(() => {
              this.$message({
                type: "info",
                message: "已取消",
              });
            });
        }
        if (type == 2) {
          this.$refs.TransferCustomer.open = true;
        }
        if (type == 5) {
          this.$refs.MessageSend.open = true;
        }
        if (type == 3) {
          this.$confirm("是否确定删除对应的记录", "是否确定删除对应的记录", {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning",
          })
            .then(() => {
              customerremove({ ids: this.chooseStaffIds }).then((res) => {
                this.$refs.CustomerTable.getData(this.queryParams);
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
        if (type == 6) { this.$refs.PhoneCall.open = true; }
      }
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
    // 重置密码
    handleResetPassword() {
      this.$refs.ResetPassword.dialogVisible = true;
    },
    //使用期限
    handleserviceLife() {
      this.$refs.ServiceLife.dialogVisible = true;
    },
    handleAdd() {
      this.seaopen = true;
      this.seaForm = this.$options.data().seaForm;
    },
    closeAdd() {
      this.$refs.StaffList.getData();
    },
    handleQuery() {
      this.$refs.CustomerTable.getDataQuery(this.queryParams);
    },
    resetQuery() {
      this.queryParams = { status: 1, pageNum: 1, pageSize: 10 };
      this.$refs.CustomerTable.getDataQuery(this.queryParams);
    },
  },
};
</script>

<style lang='scss' scoped>

</style>
