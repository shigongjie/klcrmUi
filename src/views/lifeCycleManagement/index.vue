<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true" v-show="showSearch">
      <el-form-item label="生命周期名称：" prop="lifeCycleName">
        <el-input
          v-model="queryParams.lifeCycleName"
          placeholder="请输入"
          clearable
          size="small"
        />
      </el-form-item>

      <el-form-item>
        <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
      </el-form-item>
    </el-form>

    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="handleAdd">新增</el-button>
      </el-col>
      <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
    </el-row>

    <el-table
      v-if="refreshTable"
      v-loading="loading"
      :data="deptList"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55"></el-table-column>
      <el-table-column
        prop="lifeCycleName"
        label="生命周期名称"
        align="center"
        :show-overflow-tooltip="true"
      ></el-table-column>
      <el-table-column prop="remark" label="备注" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" align="center" :show-overflow-tooltip="true"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" align="center" :show-overflow-tooltip="true"></el-table-column>

      <el-table-column
        label="操作"
        align="center"
        class-name="small-padding fixed-width"
        fixed="right"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-edit"
            v-if="scope.row.enableEdit == 1"
            @click="handleUpdate(scope.row)"
          >修改</el-button>
          <el-button
            size="mini"
            type="text"
            icon="el-icon-delete"
            @click="handleDelete(scope.row)"
            v-if="scope.row.enableEdit == 1"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 添加或修改菜单对话框 -->
    <creat :visible.sync="open" @submit="submit" :eidtDate="eidtDate" :title="creatTitle" />
  </div>
</template>

<script>
import {
  getLifeCycle,
  addLifeCycle,
  editLifeCycle,
  deleteLifeCycle
} from "@/api/lifeCycleManagement/lifeCycle";
import Creat from "./creat.vue";
export default {
  name: "Menu",
  components: { Creat },
  data() {
    return {
      // 遮罩层
      loading: true,
      // 显示搜索条件
      showSearch: true,
      // 菜单表格树数据
      deptList: [],
      // 菜单树选项
      menuOptions: [],
      // 弹出层标题
      title: "",
      // 是否显示弹出层
      open: false,
      // 是否展开，默认全部折叠
      isExpandAll: false,
      // 重新渲染表格状态
      refreshTable: true,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        createTime: ""
      },
      // 表单参数
      form: {},
      postIdOptions: [],
      eidtDate: {},
      // 总条数
      total: 0,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      creatTitle: ""
    };
  },
  created() {
    this.getList();
  },
  methods: {
    selected(name) {
      this.form.icon = name;
    },
    /** 查询部门列表 */
    getList() {
      this.loading = true;
      getLifeCycle(this.queryParams).then(response => {
        this.deptList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 转换菜单数据结构 */
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children;
      }
      return {
        id: node.menuId,
        label: node.deptName,
        children: node.children
      };
    },

    // 取消按钮
    cancel() {
      this.open = false;
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        menuId: undefined,
        parentId: 0,
        deptName: undefined,
        icon: undefined,
        menuType: "M",
        orderNum: undefined,
        isFrame: "1",
        isCache: "0",
        visible: "0",
        status: "0"
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");

      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.ids = selection.map(item => item.id);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd(row) {
      this.reset();
      //   this.getTreeselect();
      if (row != null && row.menuId) {
        this.form.parentId = row.menuId;
      } else {
        this.form.parentId = 0;
      }
      this.eidtDate = {};
      this.creatTitle = "添加生命周期";
      this.open = true;
      this.$emit("open", "true");
    },
    /** 展开/折叠操作 */
    toggleExpandAll() {
      this.refreshTable = false;
      this.isExpandAll = !this.isExpandAll;
      this.$nextTick(() => {
        this.refreshTable = true;
      });
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.creatTitle = "编辑生命周期";
      this.open = true;
      this.eidtDate = Object.assign({}, row);
    },
    // 保存消息
    submit(a) {
      console.log(a);
      if (a.id) {
        editLifeCycle(a).then(res => {
          this.open = false;
          this.getList();
          this.$modal.msgSuccess(res.msg);
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        });
      } else {
        addLifeCycle(a).then(res => {
          this.open = false;
          this.getList();
          this.$modal.msgSuccess(res.msg);
          setTimeout(() => {
            window.location.reload()
          }, 1500)
        });
      }
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function() {
          return deleteLifeCycle(row.id);
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    }
  }
};
</script>
