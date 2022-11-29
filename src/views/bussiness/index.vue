<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="realName">
        <el-input
          v-model="queryParams.name"
          placeholder="企业名称/简称/联系人"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="" prop="industry">
        <el-select
          v-model="queryParams.industry"
          placeholder="所属行业"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="item in industryList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="企业类型"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="item in companyTypeList"
            :key="item.dictValue"
            :label="item.dictLabel"
            :value="item.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="createTimeEnd">
        <el-date-picker
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="使用期限"
          v-model="queryParams.period"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="phone">
        <el-input
          v-model.number="queryParams.contactPhone"
          maxlength="11"
          placeholder="联系人电话"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <div>
      <el-dropdown trigger="click" style="margin-right: 10px">
        <el-button type="primary" icon="el-icon-plus" size="small"
          >新增企业</el-button
        >
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus" @click.native="handleAdd"
            >手动创建</el-dropdown-item
          >
          <el-dropdown-item icon="el-icon-circle-plus"
            >导入数据</el-dropdown-item
          >
        </el-dropdown-menu>
      </el-dropdown>
      <!-- <el-button icon="el-icon-upload" size="small">导出</el-button> -->
      <el-dropdown trigger="click" style="margin-right: 10px">
        <el-button type="primary" icon="el-icon-upload" size="small"
          >导出</el-button
        >
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item icon="el-icon-plus" @click.native="exportByParams"
            >检索导出</el-dropdown-item
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
        @click="handleserviceLife"
        >使用期限</el-button
      >
      <el-button
        plain
        icon="el-icon-key"
        size="small"
        @click="handleResetPassword"
        >重置密码</el-button
      >
      <el-button plain icon="el-icon-delete" size="small" @click="handleDel"
        >删除记录</el-button
      >
    </div>

    <div style="margin-top: 20px">
      <BussinessList ref="bussinessList" @getIds="getIds" />
    </div>
    <Addbussiness ref="Addbussiness" :action="0" @closeAdd="closeAdd" />
    <ServiceLife
      ref="ServiceLife"
      :chooseCompany="chooseCompany"
      @reroad="reroad"
    />
    <ResetPassword ref="ResetPassword" @reroad="reroad" />
  </div>
</template>

<script>
import BussinessList from "./bussinessList.vue";
import Addbussiness from "./addbussiness.vue";
import ServiceLife from "./servicelife.vue";
import ResetPassword from "./resetpassword.vue";
import { delcompany, companyexport } from "@/api/bussiness/index";
export default {
  components: { BussinessList, Addbussiness, ServiceLife, ResetPassword },
  data() {
    return {
      chooseCompany: [], //选择的企业
      open: false,
      queryParams: {},
      companyTypeList: [],
      industryList: [],
      followStatus: [],
    };
  },
  mounted() {
    this.getDicts("company_type").then((res) => {
      this.companyTypeList = res.data;
    });
    this.getDicts("industry").then((res) => {
      this.industryList = res.data;
    });
  },
  methods: {
    exports(ob) {
      companyexport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "fileName" + ".xlsx"
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
          link.setAttribute("download", "fileName" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      let datas = {};
      datas.ids = [];
      this.chooseCompany.forEach((item, index) => {
        datas.ids.push(item.id);
      });
      this.exports(datas);
    },
    exportByParams() {
      this.exports(this.queryParams);
    },
    closeAdd() {
      this.open = false;
      this.$refs.bussinessList.getlist();
    },
    reroad() {
      this.$refs.bussinessList.getlist();
    },
    // 删除记录

    handleDel() {
      if (this.chooseCompany.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除记录的企业",
          type: "warning",
        });
        return;
      }
      let ids = [];
      this.chooseCompany.forEach((item) => {
        ids.push(item.id);
      });
      this.$confirm("是否确定删除对应的记录", "是否确定删除对应的记录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          delcompany({ ids: ids }).then((res) => {
            this.$message({
              type: "success",
              message: "企业删除成功!",
            });
            this.$refs.bussinessList.getlist();
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
      if (this.chooseCompany.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要设置期限的企业",
          type: "warning",
        });
        return;
      }
      this.$refs.ServiceLife.dialogVisible = true;
    },
    handleAdd() {
      this.open = true;
      this.$refs.Addbussiness.open = true;
    },
    handleQuery() {
      this.$refs.bussinessList.searchquery = this.queryParams;
      this.$refs.bussinessList.getlist();
    },
    resetQuery() {
      this.$refs.bussinessList.searchquery = {};
      this.queryParams = {};
      this.$refs.bussinessList.getlist();
    },
    // 从列表页获取ids
    getIds(val) {
      this.chooseCompany = val;
      this.$refs.ServiceLife.options = val;
      this.$refs.ServiceLife.form.ids = [];
      this.$refs.ResetPassword.options = val;
      this.$refs.ResetPassword.form.ids = [];
      val.forEach((item, index) => {
        this.$refs.ServiceLife.form.ids.push(item.id);
        this.$refs.ResetPassword.form.ids.push(item.id);
      });
    },
  },
};
</script>

<style lang='scss' scoped>
</style>