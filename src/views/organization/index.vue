<template>
  <div class="container">
    <div class="leftDiv">
      <el-tree
        ref="treeData2"
        default-expand-all
        :data="deptTree"
        node-key="id"
        :props="defaultProps"
        @check-change="getTree2"
        :check-strictly="true"
      ></el-tree>
    </div>
    <div class="rightDiv">
      <div>
        <el-button type="primary" size="small" @click="handleAdd(0)"
          >新增部门</el-button
        >
        <span class="tips" @click="tipsClick"><i style="margin-right:5px" class="el-icon-question"></i>帮助提示</span>
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
            prop="name"
            width=""
            label="部门名称"
            align="center"
          ></el-table-column>
          <el-table-column prop="number" label="成员数量" width="150" align="center">
          </el-table-column>

          <el-table-column prop="userNames" label="负责人员" width="180" align="center">
          </el-table-column>

          <el-table-column prop="description" label="部门描述" width="" align="center">
            <template slot-scope="scope">
              {{
                scope.row.description == null
                  ? "暂无相关描述"
                  : scope.row.description
              }}
            </template>
          </el-table-column>
          <el-table-column prop="status" label="启用" width="120" align="center">
            <template slot-scope="scope">
              <!-- {{
                scope.row.status == 0
                  ? "启用"
                  : scope.row.status == 1
                  ? "停用"
                  : ""
              }} -->
              <el-switch
                @change="changeDeptStatus(scope.row)"
                v-model="scope.row.status"
                :active-value="0"
                :inactive-value="1"
              >
              </el-switch>
              <!-- <el-rate @change="change" v-model="value1"></el-rate> -->
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="180" align="center">
          </el-table-column>

          <el-table-column
            prop="shortName"
            fixed="right"
            label="操作"
            width="200"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="ActionRow(1, scope)"
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
                @confirm="ActionRow(7, scope)"
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
              <!-- <el-button
                @click.native.prevent="ActionRow(7, scope)"
                size="mini"
              >
                删除
              </el-button> -->
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getdeptlist"
        />
      </div>
    </div>
    <el-dialog title="帮助提示" :visible.sync="tipsdialogVisible" width="30%">
      <div style="margin-top: -20px">
        <p>
          1、公司组织架构非常重要，部分管理功能以及数据权限是依赖于公司组织架构的，因此建议在正式使用系统前进行相关配置。
        </p>
        <p>
          2、部门组织架构支持多级、最多支持5级，点击左侧层级列表可切换至查看对应部分的子级部门；
        </p>
        <p>3、需要删除部门时必须先清除该部分下的所有成员；</p>
      </div>
    </el-dialog>
    <DeptAction
      v-if="open"
      :deptTree="deptTree"
      :action="actionType"
      ref="DeptAction"
      :choosedDept="choosedDept"
      @closeEdit="closeEdit"
    />
  </div>
</template>

<script>
import DeptAction from "./deptaction.vue";
import {
  getdeptTree,
  getdeptlist,
  updateDeptStatus,
  deptremove,
} from "@/api/organization/index";
export default {
  components: { DeptAction },
  data() {
    return {
      value1: 0,
      tipsdialogVisible: false,
      choosedDept: "", //已选中的部门ID
      defaultProps: {
        children: "list",
        label: "name",
        checkStrictly: true,
      },
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      open: false,
      deptTree: [],
      tableData: [],
      actionType: 0,
    };
  },
  mounted() {
    this.getdeptlist();
    this.getdeptTree();
  },
  methods: {
    getTree2(data, checked) {
      if (checked) {
        this.$refs.treeData2.setCheckedKeys([data.id]);
        this.choosedDept = data.id;
        //data 即为选择的集合值
      } else {
        this.choosedDept = "";
      }
    },
    change() {},
    tipsClick() {
      this.tipsdialogVisible = true;
    },
    closeEdit() {
      this.open = false;
      this.$refs.DeptAction.open = true;
      this.$message({
        message: "操作成功",
        type: "success",
      });
      this.getdeptlist();
      this.getdeptTree();
    },
    changeDeptStatus(ob) {
      updateDeptStatus({ id: ob.id }).then((res) => {
        this.getdeptlist();
      });
    },
    getdeptlist() {
      getdeptlist(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    getdeptTree() {
      getdeptTree().then((res) => {
        this.deptTree = res.data;
      });
    },
    ActionRow(i, row) {
      // console.log(row);
      if (i == 1) {
        this.open = true;
        this.actionType = i;
        this.$nextTick(() => {
          this.$refs.DeptAction.params = row;
          this.$refs.DeptAction.geteditData(row);
          this.$refs.DeptAction.open = true;
        });

        // this.$refs.DeptAction.open = true;
      }
      if (i == 7) {
        deptremove({ id: row.row.id })
          .then((res) => {
            this.$message({
              message: "操作成功",
              type: "success",
            });
            this.getdeptlist();
            this.getdeptTree();
          })
          .catch((err) => {});
      }
    },
    handleAdd(i) {
      this.open = true;
      this.actionType = i;
      this.$nextTick(() => {
        this.$refs.DeptAction.open = true;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  min-height: calc(100vh - 84px);
  padding: 20px;
  background: #f5f5f5;
  display: flex;
  .leftDiv {
    padding: 20px;
    width: 250px;
    margin-right: 20px;
    background: #ffffff;
  }
  .rightDiv {
    padding: 20px;
    flex: 1;
    background: #ffffff;
    .tips {
      font-size: 13px;
      padding: 0 20px;
      color: #999999;
    }
  }
}
</style>
