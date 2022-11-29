/**销售线索 */
<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="realName">
        <el-input
          v-model="queryParams.name"
          placeholder="姓名/手机/邮箱"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="" prop="dept">
        <el-select
          v-model="queryParams.dept"
          placeholder="选择部门"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="dict in customerLifeCycle"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="账号类型"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="dict in followStatus"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="startCreateTime">
        <el-date-picker
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="添加时间"
          v-model="queryParams.startCreateTime"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="endLastLoginTime">
        <el-date-picker
          type="datetime"
          size="small"
          value-format="yyyy-MM-dd HH:mm:ss"
          placeholder="最后登录时间"
          v-model="queryParams.endLastLoginTime"
          @keyup.enter.native="handleQuery"
        ></el-date-picker>
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
        >添加</el-button
      >
      <el-dropdown trigger="click" style="margin-right: 10px;margin-left:10px">
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
        @click="handleStaffAction('4')"
        >新建任务</el-button
      >
      <el-button
        plain
        icon="el-icon-circle-close"
        size="small"
        @click="handleStaffAction('1')"
        >转移客户</el-button
      >
      <el-button
        plain
        icon="el-icon-switch-button"
        size="small"
        @click="handleStaffAction('3')"
        >移入公海</el-button
      >
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      open: false,
      queryParams: {},
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
    };
  },
  methods: {
    exports(ob) {
      staffexport(ob).then((data) => {
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
      datas.ids = this.chooseStaffIds;
      // this.chooseStaffIds.forEach((item, index) => {
      //   datas.ids.push(item.id);
      // });
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
      this.$refs.EditStaff.staffList = val;
      this.$refs.EditStaff.form.ids = ids;
      this.$refs.HandleStaff.staffList = val;
      this.$refs.HandleStaff.form.ids = ids;
    },
    handleStaffAction(type) {
      if (type == 4) this.$refs.EditStaff.dialogVisible = true;
      else {
        if (type != "" || type != undefined)
          if (this.chooseStaffIds.length <= 0) {
            this.$message({
              showClose: true,
              message: "请选择要操作得员工",
              type: "warning",
            });
            return;
          }
        this.$refs.HandleStaff.status = type;
        this.$refs.HandleStaff.dialogVisible = true;
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
      this.$refs.AddStaff.open = true;
    },
    closeAdd() {
      this.$refs.StaffList.getData();
    },
    handleQuery() {
    },
    resetQuery() {},
  },
};
</script>

<style lang='scss' scoped>
</style>