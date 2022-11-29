/**操作日志 */
<template>
  <div class="pd10">
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="operaName" label="操作" >
      </el-table-column>
      <el-table-column prop="time" label="时间" >
      </el-table-column>
      <el-table-column prop="userName" label="操作人员" >
      </el-table-column>
      <el-table-column prop="reason" label="操作原因" width="180">
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
  </div>
</template>

<script>
import { getlogList } from "@/api/bussiness/index";
export default {
  data() {
    return {
      total: 1,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      isStart: true,
      tableData: [],
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    getList(query) {
      let data = {};
      data.pageNum = query.pageNum;
      data.pageSize = query.pageSize;
      if (this.$route.query.id != undefined) {
        data.roleId = this.$route.query.id;
      }
      getlogList(data).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    handleChange(data) {
    },
  },
};
</script>

<style lang='scss' scoped>
.pd10 {
  padding: 20px;
}
</style>