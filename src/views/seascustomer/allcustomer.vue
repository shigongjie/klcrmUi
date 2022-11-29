/**客户列表 */
<template>
  <div class="app-container">
    <AdvancedFilter v-if="diaOpen" ref="AdvancedFilter" />
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="realName" v-if="!diaOpen">
        <el-input
          v-model="queryParams.keyword"
          placeholder="关键词"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="affiliationStaff" v-if="!diaOpen">
        <el-cascader
          style="width: 100%"
          size="small"
          placeholder="归属人员"
          v-model="queryParams.userId"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="" prop="dept" v-if="!diaOpen">
        <el-select
          v-model="queryParams.state"
          placeholder="客户状态"
          clearable
          size="small"
        >
          <el-option
            v-for="(item, index) in customerStateList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="dept" v-if="!diaOpen">
        <el-select
          v-model="queryParams.type"
          placeholder="客户类型"
          clearable
          size="small"
        >
          <el-option label="企业客户" value="0"></el-option>
          <el-option label="个人客户" value="1"></el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="dept" v-if="!diaOpen">
        <el-select
          v-model="queryParams.star"
          placeholder="客户星级"
          clearable
          size="small"
        >
          <el-option
            v-for="(item, index) in customerStarList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          v-if="!diaOpen"
          >查询</el-button
        >
        <el-button
          v-else
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQueryHighSearch"
          >查询</el-button
        >
        <el-button
          v-if="!diaOpen"
          icon="el-icon-refresh"
          size="mini"
          @click="resetQuery"
          >重置</el-button
        >
        <el-button
          v-else
          icon="el-icon-refresh"
          size="mini"
          @click="resetHighSearchQuery"
          >重置</el-button
        >
        <el-button
          v-btnPermi="['ghkh_advanced_filter']"
          icon="el-icon-s-flag"
          size="mini"
          type="text"
          @click="diaOpen = !diaOpen"
          >高级筛选</el-button
        >
      </el-form-item>
    </el-form>

    <div>
      <el-dropdown
        trigger="click"
        style="margin-right: 10px"
        v-btnPermi="['ghkh_export_customers']"
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
      <el-button
        plain
        icon="el-icon-date"
        size="small"
        v-btnPermi="['ghkh_pick_up_customers']"
        @click="handleAction('1')"
        >领取客户</el-button
      >
      <el-button
        plain
        icon="el-icon-date"
        size="small"
        v-btnPermi="['ghkh_transfer_customer']"
        @click="handleAction('2')"
        >转移客户</el-button
      >
      <el-button
        plain
        icon="el-icon-date"
        size="small"
        v-btnPermi="['ghkh_delete_customer']"
        @click="handleAction('3')"
        >删除客户</el-button
      >
    </div>
    <div style="margin-top: 20px">
      <CustomerTable ref="CustomerTable" @getIds="getIds" />
    </div>
    <Customer ref="Customer" @reload="getTabledata" />
    <TransferCustomer
      ref="TransferCustomer"
      :ids="chooseStaffIds"
      @reload="getTabledata"
    />
  </div>
</template>

<script>
import TransferCustomer from "../customer/components/transfercustomer.vue";
import Dict from "@/components/dict/dict.vue";
import Customer from "./components/add.vue";
import CustomerTable from "./components/allcustomerstable.vue";
import AdvancedFilter from "../customer/components/advancedFilter.vue";
import {
  customerexportbyCondition,
  customerexport,
  receivehighseascustomer,
  customerremove,
  getstaffList,
} from "@/api/customer/index";
export default {
  mixins: [Dict],
  components: { CustomerTable, Customer, TransferCustomer, AdvancedFilter },
  data() {
    return {
      diaOpen: false,
      CustomerTableOpen: false,
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
      },
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
  methods: {
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
      // this.chooseStaffIds.forEach((item, index) => {
      //   datas.ids.push(item.id);
      // });
      // this.exports(datas);
    },
    exportByParams() {
      let data = {};
      data.status = 2;
      let obj = Object.assign(this.queryParams, data);
      this.exports(obj);
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
    // 重置密码
    handleResetPassword() {
      this.$refs.ResetPassword.dialogVisible = true;
    },
    //使用期限
    handleserviceLife() {
      this.$refs.ServiceLife.dialogVisible = true;
    },
    handleAdd() {
      this.open = true;
      this.$refs.Customer.open = true;
    },
    closeAdd() {
      this.$refs.StaffList.getData();
    },
    handleQueryHighSearch() {
      if (this.$refs.AdvancedFilter) {
        let obj = Object.assign(
          this.$refs.AdvancedFilter.form,
          this.queryParams
        );
        // 高级筛选传2
        this.$refs.CustomerTable.getHighSearchData(obj, 2);
        return;
      }
    },
    resetHighSearchQuery() {
      this.queryParams = { pageNum: 1, pageSize: 10 };
      this.$refs.AdvancedFilter.form = {};
      let obj = Object.assign(this.$refs.AdvancedFilter.form, this.queryParams);
      this.$refs.CustomerTable.getHighSearchData(obj, 2);
    },
    handleQuery() {
      this.$refs.CustomerTable.getHighSearchData(this.queryParams, 1);
    },
    resetQuery() {
      this.$refs.CustomerTable.queryParams = {
        pageNum: 1,
        pageSize: 10,
        status: 1,
      };
      this.queryParams = { pageNum: 1, pageSize: 10, status: 1 };
      this.$refs.CustomerTable.getData(this.queryParams, 1);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>
