/**员工管理 */
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
        <el-cascader
          size="small"
          placeholder="请选择部门"
          :options="deptTree"
          :show-all-levels="false"
          filterable
          v-model="queryParams.dept"
          :props="{
            emitPath: false,
            checkStrictly: true,
            children: 'list',
            label: 'name',
            value: 'id',
          }"
          clearable
          style="width: 100%"
        ></el-cascader>
        <!-- <el-select
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
        </el-select> -->
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="账号类型"
          clearable
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="启用" value="0" />
          <el-option label="停用" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.bussinessType"
          placeholder="业务类型"
          clearable
          size="small"
        >
          <el-option label="全部" value="" />
          <el-option label="解冻" value="0" />
          <el-option label="冻结" value="1" />
        </el-select>
      </el-form-item>

      <el-form-item label="" prop="startCreateTime">
        <el-date-picker
          size="small"
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始创建日期"
          end-placeholder="最后创建日期"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="" prop="endLastLoginTime">
        <el-date-picker
          size="small"
          v-model="time2"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="开始登录时间"
          end-placeholder="最后登录时间"
        >
        </el-date-picker>
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
      <el-button
        type="primary"
        icon="el-icon-plus"
        size="small"
        @click="handleAdd"
        >新增员工</el-button
      >
      <el-button icon="el-icon-plus" size="small" @click="handleImport"
        >导入</el-button
      >
      <el-dropdown
        trigger="click"
        style="margin-right: 10px; margin-left: 10px"
      >
        <el-button icon="el-icon-upload" size="small">导出</el-button>
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
        @click="handleStaffAction('4')"
        >修改部门</el-button
      >
      <el-button
        plain
        icon="el-icon-circle-close"
        size="small"
        @click="handleStaffAction('1')"
        >停用员工</el-button
      >
      <el-button
        plain
        icon="el-icon-switch-button"
        size="small"
        @click="handleStaffAction('3')"
        >冻结员工</el-button
      >
      <el-button
        plain
        icon="el-icon-key"
        size="small"
        @click="handleStaffAction('6')"
        >重置密码</el-button
      >
      <el-button
        plain
        icon="el-icon-delete"
        size="small"
        @click="handleStaffAction('7')"
        >删除记录</el-button
      >
    </div>

    <div style="margin-top: 20px">
      <StaffList ref="StaffList" @getIds="getIds" />
    </div>
    <AddStaff ref="AddStaff" @closeAdd="closeAdd" />
    <EditStaff ref="EditStaff" @closeAdd="closeAdd" />
    <HandleStaff ref="HandleStaff" @close="closeAdd" :action="actionType" />
    <ImportBussiness
      v-if="importOpen"
      ref="ImportBussiness"
      @reroad="closeAdd"
    />
  </div>
</template>

<script>
import { getdeptTree } from "@/api/organization/index";
import EditStaff from "./component/editdept.vue";
import HandleStaff from "./component/handlestaff.vue";
import { handleStaff, staffexport } from "@/api/staff/index";
import StaffList from "./staffList.vue";
import AddStaff from "./component/addstaff.vue";
import ImportBussiness from "./component/import.vue";
export default {
  components: { StaffList, AddStaff, EditStaff, HandleStaff, ImportBussiness },
  data() {
    return {
      actionType: 0, //停用1启用0
      open: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      deptTree: [],
      time: "",
      time2: "",
      importOpen: false, //导入模态框
    };
  },
  mounted() {
    this.getdeptTree();
  },
  methods: {
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
      });
    },
    // 导入员工
    handleImport() {
      this.importOpen = true;
      this.$nextTick(() => {
        this.$refs.ImportBussiness.open = true;
        this.$refs.ImportBussiness.active = 1;
        this.$refs.ImportBussiness.fileList = [];
      });
    },
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
            "员工列表" + ".xlsx"
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
          link.setAttribute("download", "员工列表" + ".xlsx");
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
      console.log(ids);
      this.chooseStaffIds = ids;
      this.$refs.EditStaff.staffList = val;
      this.$refs.EditStaff.form.ids = ids;
      this.$refs.HandleStaff.staffList = val;
      this.$refs.HandleStaff.form.ids = ids;
    },
    handleStaffAction(type) {
      if (type != "" || type != undefined)
        if (this.chooseStaffIds.length <= 0) {
          this.$message({
            showClose: true,
            message: "请选择要操作得员工",
            type: "warning",
          });
          return;
        }
      if (type == 4) {
        this.$refs.EditStaff.dialogVisible = true;
        return;
      }
      if (type == 7) {
        this.$confirm("是否确定删除对应的记录?", "确认提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let data = {};
            data.status = type;
            data.ids = [];
            data.ids = this.chooseStaffIds;
            handleStaff(data).then((res) => {
              this.$refs.StaffList.getData();
              this.$message({
                type: "success",
                message: "操作成功！",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      } else {
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
    handleAdd() {
      this.open = true;
      this.$refs.AddStaff.open = true;
    },
    closeAdd() {
      this.$refs.StaffList.getData();
    },
    handleQuery() {
      if (this.time != "" && this.time != null) {
        this.queryParams.startCreateTime = this.time[0];
        this.queryParams.endCreateTime = this.time[1];
      } else if (this.time == null) {
        this.queryParams.startCreateTime = "";
        this.queryParams.endCreateTime = "";
      }
      if (this.time2 != "" && this.time2 != null) {
        this.queryParams.startLastLoginTime = this.time2[0];
        this.queryParams.endLastLoginTime = this.time2[1];
      } else if (this.time2 == null) {
        this.queryParams.startLastLoginTime = "";
        this.queryParams.endLastLoginTime = "";
      }
      this.$refs.StaffList.getDataQuery(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.time2 = "";
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.$refs.StaffList.getDataQuery(this.queryParams);
    },
  },
};
</script>

<style lang='scss' scoped>
</style>