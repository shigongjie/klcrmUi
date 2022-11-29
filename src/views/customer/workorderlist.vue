/**工单列表 */
<template>
  <div class="app-container">
    <div>
      <el-tabs
        class="top_tipsTitle"
        type="border-card"
        v-model="activeName"
        @tab-click="changeStatus"
      >
        <el-tab-pane label="全部工单" name="0"></el-tab-pane>
        <el-tab-pane label="我发起的" name="1"></el-tab-pane>
        <el-tab-pane label="我处理的" name="2"></el-tab-pane>
        <el-tab-pane label="抄送给我的" name="3"></el-tab-pane>
      </el-tabs>
      <div class="search_Title">
        <el-form :model="queryParams" ref="queryForm" :inline="true">
          <el-form-item>
            <el-input
              v-model="queryParams.name"
              placeholder="输入关键词"
              clearable
              size="small"
              @keyup.enter.native="handleQuery"
            />
          </el-form-item>

          <el-form-item label="">
            <el-select
              v-model="queryParams.workStatus"
              placeholder="工单状态"
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
          <el-form-item label="">
            <el-select
              v-model="queryParams.workType"
              placeholder="工单类型"
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
          <el-form-item label="">
            <el-select
              v-model="queryParams.urgencyType"
              placeholder="紧急程度"
              clearable
              size="small"
            >
              <el-option label="全部" value />
              <el-option
                v-for="dict in quickStatus"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <!-- <el-form-item label="">
            <el-select
              v-model="queryParams.waitTime"
              placeholder="等待时间"
              clearable
              size="small"
            >
              <el-option label="全部" value />
              <el-option
                v-for="dict in timeState"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item> -->

          <!-- <el-form-item label="" prop="startCreateTime">
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
        </el-form-item> -->

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
            <el-button
              icon="el-icon-s-flag"
              size="mini"
              type="text"
              v-btnPermi="['workorder_advanced_filter']"
              @click="diaOpen = true"
              >高级搜索</el-button
            >
          </el-form-item>
        </el-form>
      </div>
    </div>

    <div>
      <workerlist ref="workerlist" :queryParams="queryParams"></workerlist>
    </div>
    <el-dialog title="高级搜索" :visible.sync="diaOpen" width="30%">
      <div class="searchContent">
        <el-form ref="searchForm" :model="highSearch" :inline="true">
          <el-form-item>
            <el-input
              v-model="highSearch.name"
              placeholder="输入搜索关键词"
              clearable
              size="small"
            />
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.status"
              placeholder="工单分类"
              clearable
              size="small"
            >
              <el-option label="全部" value="0" />
              <el-option
                v-for="dict in sendType"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.workType"
              placeholder="工单类型"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in followStatus"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.workStatus"
              placeholder="工单状态"
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
          <el-form-item label="">
            <el-select
              v-model="highSearch.urgencyType"
              placeholder="紧急程度"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in quickStatus"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.waitTime"
              placeholder="等待时间"
              clearable
              size="small"
            >
              <el-option label="全部" value />
              <el-option
                v-for="dict in timeState"
                :key="dict.key"
                :label="dict.value"
                :value="dict.key"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-cascader
              placeholder="发起人员"
              v-model="highSearch.createBy"
              :options="userList"
              :props="areaListprops"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-cascader
              placeholder="处理人员"
              v-model="highSearch.operationStaff"
              :options="userList"
              :props="areaListprops"
              :show-all-levels="false"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.createDept"
              placeholder="发起部门"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in deptList.list"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-select
              v-model="highSearch.operationStaffDept"
              placeholder="处理部门"
              clearable
              size="small"
            >
              <el-option
                v-for="dict in deptList.list"
                :key="dict.id"
                :label="dict.name"
                :value="dict.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              type="date"
              size="small"
              value-format="yyyy-MM-dd "
              placeholder="发起时间"
              v-model="highSearch.createTime"
            ></el-date-picker>
          </el-form-item>
          <el-form-item label="">
            <el-date-picker
              type="date"
              size="small"
              value-format="yyyy-MM-dd "
              placeholder="处理时间"
              v-model="highSearch.updateTime"
            ></el-date-picker>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="diaOpen = false">取 消</el-button>
        <el-button type="primary" @click="goHighSearch">搜 索</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import workerlist from "./components/workerlist";
import { getstaffList } from "@/api/customer/index";
import { getDeptTree } from "@/api/workOrder/index";
export default {
  components: { workerlist },
  data() {
    return {
      open: false,
      queryParams: {
        //搜索表单
        name: "",
      },
      highSearch: {
        //高级搜索类型
        // name:'',
        // status:'',
        // workType:'',
        // workStatus:'',
        // urgencyType:'',
        // waitTime:'',
        // createBy:'',
        // operationStaff:'',
        // createDept:'',
        // operationStaffDept:'',
        // createTime:'',
        // updateTime:'',
      },
      activeName: "0", //置顶标签页选项

      customerLifeCycle: [
        //工单状态选项
        { value: "处理中", key: "1" },
        { value: "已完结", key: "2" },
        { value: "被退回", key: "3" },
      ],
      followStatus: [
        //工单类型选项
        { value: "普通工单", key: "0" },
      ],
      quickStatus: [
        //紧急程度选项
        { value: "非常紧急", key: "2" },
        { value: "紧急", key: "3" },
        { value: "一般", key: "1" },
      ],
      timeState: [
        //经过时间选项
        { value: "1小时", key: "1" },
        { value: "2小时", key: "2" },
        { value: "4小时", key: "4" },
        { value: "8小时", key: "8" },
        { value: "12小时", key: "12" },
        { value: "24小时", key: "24" },
        { value: "3天", key: "72" },
        { value: "7天", key: "168" },
        { value: "7天以上", key: "0" },
      ],
      sendType: [
        //工单分类--发送
        { value: "我发起的", key: "1" },
        { value: "我处理的", key: "2" },
        { value: "抄送我的", key: "3" },
      ],
      chooseStaffIds: [],
      diaOpen: false, //高级搜索弹窗
      areaListprops: {
        //多选条件
        value: "id",
        label: "name",
        children: "list",
        multiple: true,
        emitPath: false,
      },
      userList: [], //人员列表
      deptList: [], //部门列表
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getDeptTree().then((res) => {
      this.deptList = res.data;
    });
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
    //开始查询
    handleQuery() {
      this.$refs.workerlist.getList(this.queryParams);
    },
    //重置查询条件
    resetQuery() {
      for (var key in this.queryParams) {
        this.queryParams[key] = null;
      }
      // this.$refs.queryForm.resetFields();
      this.$refs.workerlist.getList();
    },
    //开始高级搜索
    goHighSearch() {
      this.$refs.workerlist.getList(this.highSearch);
      this.activeName = this.highSearch.status;
      this.diaOpen = false; //关闭弹窗
      // this.$refs.searchForm.resetFields();
      for (var key in this.highSearch) {
        this.highSearch[key] = null;
      }
    },
    //切换置顶标签
    changeStatus() {
      this.$refs.workerlist.changeStatus(this.activeName);
    },
  },
};
</script>

<style lang='scss' scoped>
.top_tipsTitle {
  margin-bottom: 10px;
  ::v-deep .el-tabs__content {
    padding: 0;
  }
}
.search_Title {
  padding: 10px;
  background-color: rgb(255, 255, 255);
}
</style>