<template>
  <div class="container1">
    <div class="leftDivs">
      <div class="leftTitle">
        常用语分类
        <el-button type="primary" size="mini" @click="AddNewSelect()"
          >新增</el-button
        >
      </div>
      <el-tree
        ref="treeData2"
        default-expand-all
        :data="treeData"
        node-key="id"
        :props="defaultProps"
        @check-change="getTree2"
        @node-click="getNode"
        :check-strictly="true"
      >
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span>{{ node.label }}</span>
          <span>
            <el-button
              type="text"
              size="mini"
              @click="removeTreeNode(node, data)"
            >
              <i class="el-icon-delete"></i>
            </el-button>
          </span>
        </span>
      </el-tree>
    </div>
    <div class="rightDiv">
      <div>
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
          <el-form-item label="常用语">
            <el-input
              size="small"
              v-model="SearchParams.content"
              placeholder="常用语"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="onSubmit"
              >搜索</el-button
            >
            <el-button size="mini" @click="reset">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
      <div>
        <el-button type="primary" size="small" @click="handleAddUseful"
          >新增</el-button
        >
      </div>
      <div>
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%; margin-top: 30px"
        >
          <el-table-column
            prop="contentTitle"
            width="280"
            label="标题"
          ></el-table-column>
          <el-table-column prop="contentDetails" label="内容">
          </el-table-column>

          <el-table-column
            prop="shortName"
            fixed="right"
            label="操作"
            width="230"
          >
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="edit(scope.row)"
                size="mini"
                type="primary"
                plain
                style="margin-right: 10px"
                icon="el-icon-edit"
              >
                编辑
              </el-button>
              <el-popconfirm
                title="这是一段内容确定删除吗？"
                @confirm="remove(scope.row)"
              >
                <el-button
                  size="mini"
                  type="danger"
                  plain
                  slot="reference"
                  icon="el-icon-delete"
                  >删除</el-button
                >
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getData"
        />
      </div>
    </div>
    <el-dialog title="新增" :visible.sync="dialogVisible" width="60%">
      <el-form label-width="100px" :model="formInline" class="demo-form-inline">
        <el-form-item label="上级分组名称">
          <el-cascader
            v-model="submitParams.id"
            :options="treeData"
            :props="defaultProps"
            clearable
            size="small"
          ></el-cascader>
        </el-form-item>
        <el-form-item label="下级分组名称">
          <el-input
            size="small"
            v-model="submitParams.name"
            placeholder="下级分组名称"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog
      :title="this.usefulParams.id ? '编辑' : '新建常用语'"
      :visible.sync="dialogVisible2"
      width="60%"
    >
      <el-form label-width="100px" :model="formInline" class="demo-form-inline">
        <el-form-item label="常用语标题">
          <el-input
            size="small"
            v-model="usefulParams.contentTitle"
            placeholder="常用语标题"
          ></el-input>
        </el-form-item>
        <el-form-item label="常用语内容">
          <el-input
            size="small"
            v-model="usefulParams.contentDetails"
            placeholder="常用语内容"
          ></el-input>
        </el-form-item>
        <el-form-item label="常用语分类">
          <el-cascader
            v-model="usefulParams.classifyId"
            :options="treeData"
            :props="defaultProps"
            clearable
            size="small"
          ></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">取 消</el-button>
        <el-button type="primary" @click="handleAdd2">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getTreeData,
  update,
  saveCommon,
  contentpage,
  commonremove,
  classifyremove,
} from "@/api/classifypage";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible2: false,
      formInline: {},
      SearchParams: {},
      usefulParams: {
        id: "",
        contentTitle: "",
        contentDetails: "",
        classifyId: "",
      },
      value1: 0,
      tipsdialogVisible: false,
      choosedDept: "", //已选中的部门ID
      defaultProps: {
        children: "list",
        label: "lowerGroupName",
        value: "id",
        checkStrictly: true,
        emitPath: false,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      submitParams: {},
      total: 0,
      open: false,
      treeData: [],
      tableData: [],
      actionType: 0,
    };
  },
  watch: {
    dialogVisible2(val) {
      if (val) {
      }
    },
  },
  mounted() {
    this.getTreeDatas();
  },
  methods: {
    AddNewSelect() {
      this.submitParams = {};
      this.dialogVisible = true;
    },

    removeTreeNode(node, data) {
      console.log(node, data);
      this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          console.log(1111);
          classifyremove({ classifyId: data.id, dataType: 0 }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getTreeDatas();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    remove(row) {
      commonremove({ id: row.id }).then((res) => {
        this.$message.success("删除成功");
        this.getTreeDatas();
      });
    },
    handleAddUseful() {
      this.dialogVisible2 = true;
      this.usefulParams = {
        id: "",
        contentTitle: "",
        contentDetails: "",
        classifyId: "",
      };
    },
    edit(row) {
      console.log(row);
      this.dialogVisible2 = true;
      this.usefulParams.id = row.id;
      this.usefulParams.contentDetails = row.contentDetails;
      this.usefulParams.contentTitle = row.contentTitle;
      this.usefulParams.classifyId = row.classifyId;
    },
    getData(data) {
      contentpage(data).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getTreeDatas() {
      getTreeData({ dataType: 0 }).then((res) => {
        this.treeData = res.rows;
        this.getData();
      });
    },
    getTree2() {},
    getNode(val) {
      let data = {};
      data.classifyId = val.id;
      data.dataType = "0";
      this.getData(data);
    },
    handleAdd() {
      let data = {};
      if (this.submitParams.id != "" && this.submitParams.id != null) {
        data.upperGroupId = this.submitParams.id.toString();
      }
      data.lowerGroupName = this.submitParams.name;
      data.dataType = "0";
      update(data).then((res) => {
        this.dialogVisible = false;
        this.getTreeDatas();
      });
    },
    handleAdd2() {
      let data = {};
      if (
        this.usefulParams.classifyId != "" &&
        this.usefulParams.classifyId != null
      ) {
        data.classifyId = this.usefulParams.classifyId.toString();
      }
      if (this.usefulParams.id != "") {
        console.log(this.usefulParams);
        data.id = this.usefulParams.id;
      }
      data.contentDetails = this.usefulParams.contentDetails;
      data.contentTitle = this.usefulParams.contentTitle;

      data.dataType = "0";
      saveCommon(data).then((res) => {
        this.dialogVisible2 = false;
        this.getData();
      });
    },
    onSubmit() {
      this.getData(this.SearchParams);
    },
    reset() {
      this.SearchParams = {};
      this.getData(this.SearchParams);
    },
  },
};
</script>

<style lang="scss">
.container1 {
  min-height: calc(100vh - 84px);
  //   padding: 20px;
  //   background: #f5f5f5;
  display: flex;
  .leftDivs {
    // padding: 20px;
    width: 250px;
    min-width: 250px;
    margin-right: 20px;
    background: #ffffff;
    border: 1px solid #f1f1f1;
    .leftTitle {
      padding: 10px;
      font-size: 13px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #f1f1f1;
    }
  }
  .rightDiv {
    padding: 10px;
    flex: 1;
    background: #ffffff;
    .tips {
      font-size: 13px;
      padding: 0 20px;
      color: #999999;
    }
  }
}
.custom-tree-node {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  padding-right: 10px;
  font-size: 13px;
}
</style>
