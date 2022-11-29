<template>
  <div class="app-container">
    <el-row :gutter="20">
      <!--部门数据-->
      <el-col :span="5" :xs="24">
        <div style="display: flex; align-items: baseline; justify-content: space-around;">
          <div class="head-container">
            <el-input
              v-model="labelGroup"
              placeholder="查询分组名称"
              clearable
              size="mini"
              prefix-icon="el-icon-search"
              style="margin-bottom: 20px"
            />
          </div>
          <div>
            <el-button type="primary" plain icon="el-icon-plus" size="mini" @click="showAdd()">新增</el-button>
          </div>
        </div>

        <div class="head-container">
          <!-- <el-tree
            :data="labelGoupOptions"
            :props="defaultProps"
            :expand-on-click-node="false"
            :filter-node-method="filterNode"
            ref="tree"
            default-expand-all
            @node-click="handleNodeClick"
          />-->
          <div
            v-for="(item, index) in labelGoupOptions"
            :key="item.id"
            class="label-group"
            :class="isActive == index ? 'labelbg' : ''"
            @click="selectLG(index, item)"
          >
            <span>{{ item.label }}</span>
            <span
              class="el-icon-delete"
              style="cursor:pointer"
              slot="reference"
              @click="deleteLabelGroup(item)"
            ></span>
          </div>
        </div>
        <el-pagination
          layout="prev, pager, next"
          :current-page="labelCurrent.pageNum"
          :total="labelGroupTotal"
          @current-change="changeLabelPag"
        ></el-pagination>
      </el-col>
      <!--用户数据-->
      <el-col :span="19" :xs="24">
        <el-form
          :model="queryParams"
          ref="queryForm"
          :inline="true"
          v-show="showSearch"
          label-width="68px"
        >
          <el-form-item label="标签名称" prop="labelName">
            <el-input
              v-model="queryParams.labelName"
              placeholder="请输入标签名称"
              clearable
              size="mini"
              style="width: 240px"
              @keyup.enter.native="handleQuery"
              maxlength="20"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
          </el-form-item>
        </el-form>

        <el-row :gutter="10" class="mb8">
          <el-col :span="1.5">
            <el-button
              type="primary"
              plain
              icon="el-icon-plus"
              size="mini"
              @click="handleAdd"
              v-if="labelGoupOptions"
            >新增</el-button>
          </el-col>
          <right-toolbar :showSearch.sync="showSearch" @queryTable="getList"></right-toolbar>
        </el-row>

        <el-table v-loading="loading" :data="userList" @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="50" align="center" />
          <el-table-column
            label="标签名称"
            align="center"
            key="labelName"
            prop="labelName"
            v-if="columns[0].visible"
            :show-overflow-tooltip="true"
          />
          <el-table-column label="标签颜色" prop="labelColor" v-if="columns[1].visible">
            <template slot-scope="scope">
              <div style="width: 40px;height: 40px" :style="{background:scope.row.labelColor}"></div>
            </template>
          </el-table-column>
           <el-table-column
            label="引用次数"
            align="center"
            prop="useNumber"
          />
          <el-table-column
            label="操作"
            align="center"
            width="160"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="scope">
              <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
              >修改</el-button>
              <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
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
      </el-col>
    </el-row>

    <!-- 添加或修改参数配置对话框 -->
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签名称" prop="labelName">
              <el-input v-model="form.labelName" placeholder="请输入标签名称" maxlength="20" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="标签颜色" prop="labelColor">
              <div
                style=" display: flex; width: 300px; justify-content: space-between; align-items: center; "
              >
                <div
                  :style="{
                    background: item.color,
                    width: item.num + 'px',
                    height: item.num + 'px',
                  }"
                  v-for="item in colorList"
                  :key="item.id"
                  @click="selectColor(item.id)"
                ></div>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="标签分组" prop="labelId">
          <el-input v-model="selcetLBG.label" maxlength="30" disabled />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitForm">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>

    <!-- 新建标签分组 -->
    <el-dialog title="新建标签分组" :visible.sync="labelAdd.open" width="500px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="分组名称" prop="labelGroupName">
          <el-input v-model="labelAdd.labelGroupName" placeholder="请输入标签分组名称" />
        </el-form-item>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="submitLabelGroup">确 定</el-button>
        <el-button @click="cancel">取 消</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import {
  labelPage,
  delLabel,
  addLabel,
  updateLabel,
  treeselect,
  delLabelGroup,
  groupAdd
} from "@/api/label";

export default {
  name: "Label",
  data() {
    return {
      // 遮罩层
      loading: false,
      // 导出遮罩层
      exportLoading: false,
      // 选中数组
      ids: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      // 显示搜索条件
      showSearch: true,
      // 总条数
      total: 0,
      //标签分组总条数
      labelGroupTotal: 0,
      labelCurrent: {
        pageNum: 1,
        pageSize: 10
      },
      // 用户表格数据
      userList: null,
      // 弹出层标题
      title: "",
      // 部门树选项
      labelGoupOptions: undefined,
      // 是否显示弹出层
      open: false,
      // 部门名称
      labelGroup: undefined,
      // 默认密码
      initPassword: undefined,
      // 岗位选项
      postOptions: [],
      // 角色选项
      roleOptions: [],
      // 表单参数
      form: {},
      labelAdd: {
        open: false,
        labelGroupName: "",
        labelId: ""
      },
      defaultProps: {
        children: "children",
        label: "label"
      },
      // 用户导入参数
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        labelName: undefined,
        labelGroupId: undefined
      },
      // 列信息
      columns: [
        { key: 0, label: `用户编号`, visible: true },
        { key: 1, label: `用户名称`, visible: true },
        { key: 2, label: `用户昵称`, visible: true },
        { key: 3, label: `部门`, visible: true },
        { key: 4, label: `手机号码`, visible: true },
        { key: 5, label: `状态`, visible: true },
        { key: 6, label: `创建时间`, visible: true }
      ],
      // 表单校验
      rules: {
        labelName: [
          { required: true, message: "标签名称不能为空", trigger: "blur" },
          {
            min: 2,
            max: 20,
            message: "标签名称长度必须介于 2 和 20 之间",
            trigger: "blur"
          }
        ]
      },
      isActive: 0,
      selcetLBG: {},
      colorList: [
        {
          id: 1,
          color: "#ffff99",
          num: "40"
        },
        {
          id: 2,
          color: "#ffcc99",
          num: "30"
        },
        {
          id: 3,
          color: "#ff9999",
          num: "30"
        },
        {
          id: 4,
          color: "#ff6699",
          num: "30"
        },
        {
          id: 5,
          color: "#cc3399",
          num: "30"
        },
        {
          id: 6,
          color: "#99cc66",
          num: "30"
        }
      ]
    };
  },
  watch: {
    // 根据名称筛选部门树
    labelGroup(val) {
      let obj = {
        labelGroupName: val
      };
      treeselect(obj).then(response => {
        this.labelGoupOptions = response.rows.map(item => {
          return {
            id: item.id,
            label: item.labelGroupName
          };
        });
        this.labelGroupTotal = response.total;
        this.queryParams.labelGroupId = this.labelGoupOptions[0].id;
        this.selcetLBG = this.labelGoupOptions[0];
        this.getList();
      });
      //   this.$refs.tree.filter(val);
    }
  },
  created() {
    this.getTreeselect();
  },
  methods: {
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      labelPage(this.addDateRange(this.queryParams)).then(response => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    /** 查询部门下拉树结构 */
    getTreeselect() {
      treeselect(this.labelCurrent).then(response => {
        if (response.rows.length > 0) {
          this.labelGoupOptions = response.rows.map(item => {
            return {
              id: item.id,
              label: item.labelGroupName
            };
          });
          this.labelGroupTotal = response.total;
          this.queryParams.labelGroupId = this.labelGoupOptions[0].id;
          this.selcetLBG = this.labelGoupOptions[0];
          this.getList();
        } else {
          this.labelGoupOptions = []
        }
      });
    },
    changeLabelPag(val) {
      this.labelCurrent.pageNum = val;
      this.getTreeselect();
    },
    // 筛选节点
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    // 节点单击事件
    handleNodeClick(data) {
      this.queryParams.id = data.id;
      this.getList();
    },
    // 取消按钮
    cancel() {
      this.open = false;
      this.labelAdd.open = false;
      this.labelAdd.labelGroupName = "";
      this.labelAdd.labelId = "";
      this.reset();
    },
    // 表单重置
    reset() {
      this.form = {
        id: undefined,
        labelName: undefined,
        labelColor: "#ffff99",
        labelGroupId: this.selcetLBG.id
      };
      this.resetForm("form");
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.queryParams.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    // 多选框选中数据
    handleSelectionChange(selection) {
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    /** 新增按钮操作 */
    handleAdd() {
      this.reset();
      this.open = true;
      this.title = "新建标签";
    },
    /** 修改按钮操作 */
    handleUpdate(row) {
      this.reset();
      this.colorList.forEach(item => {
        item.num = 30;
        if (item.color == row.labelColor) {
          item.num = 40;
        }
      });
      this.form = Object.assign({}, row);
      this.open = true;
      this.title = "修改标签";
    },
    /** 提交按钮 */
    submitForm: function() {
      this.$refs["form"].validate(valid => {
        if (valid) {
          if (this.form.id != undefined) {
            updateLabel(this.form).then(response => {
              this.$modal.msgSuccess("修改成功");
              this.open = false;
              this.getList();
            });
          } else {
            addLabel(this.form).then(response => {
              this.$modal.msgSuccess("新增成功");
              this.open = false;
              this.getList();
            });
          }
        }
      });
    },
    submitLabelGroup() {
      let obj = {
        labelGroupName: this.labelAdd.labelGroupName
      };
      groupAdd(obj).then(res => {
        this.labelAdd.open = false;
        this.getTreeselect();
        this.labelAdd.labelGroupName = "";
      });
    },
    /** 删除按钮操作 */
    handleDelete(row) {
      this.$modal
        .confirm("是否确认删除？")
        .then(function() {
          return delLabel({id: row.id});
        })
        .then(() => {
          this.getList();
          this.$modal.msgSuccess("删除成功");
        })
        .catch(() => {});
    },
    //选择标签
    selectColor(index) {
      for (let i of this.colorList) {
        i.num = 30;
      }
      this.colorList[index - 1].num = 40;
      this.form.labelColor = this.colorList[index - 1].color;
    },
    selectLG(index, item) {
      this.isActive = index;
      this.selcetLBG = item;
      this.queryParams.labelGroupId = item.id;
      this.getList();
    },
    deleteLabelGroup(item) {
      this.$modal
        .confirm("确定删除该标签分组吗？")
        .then(() => {
          console.log(item);
          delLabelGroup({id: item.id}).then(res => {
            this.$message.success("删除成功");
            this.getTreeselect();
            this.getList();
          });
        })
        .catch(() => {});
    },
    showAdd() {
      this.labelAdd.open = true;
      this.labelAdd.labelGroupName = "";
    }
  }
};
</script>

<style scoped>
.labelbg {
  background: #1890ff;
  color: #fff;
}
.label-group {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 30px;
  border-radius: 5px;
  line-height: 30px;
  padding: 0 10px;
}
</style>
