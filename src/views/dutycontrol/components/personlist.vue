/**成员列表 */
<template>
  <div>
    <div>
      <el-table
        border
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
      >
        <el-table-column prop="staffName" label="姓名"> </el-table-column>
        <el-table-column prop="deptName" label="部门"> </el-table-column>
        <el-table-column prop="createTime" label="添加时间"> </el-table-column>
      </el-table>
    </div>
    <pagination
    style="height:59px"
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getstaffList } from "@/api/role/index";
export default {
  data() {
    return {
      tableData: [],
      total: 0,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    save() {
      let data = {};
      data.dataType = this.radio;
      data.roleId = this.$route.query.id;
      saveDatapermission(data).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.getList();
      });
    },
    change() {},
    getList() {
      getstaffList({ roleId: this.$route.query.id }).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
  },
};
</script>

<style  lang='scss' scoped>
.warp {
  padding: 6px 12px;
  .pid {
    padding: 15px 0;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
  .checkboxself {
    margin-top: 15px;
  }
}
.btnWarp {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
</style>