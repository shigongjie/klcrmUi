/**操作日志 */
<template>
  <div class="pd10">
    <el-table :data="tableData" style="width: 100%" border>
      <!-- <el-table-column prop="id" label="操作编号111" width="120">
      </el-table-column> -->

      <el-table-column prop="operating" label="操作" width="180">
      </el-table-column>
      <el-table-column prop="time" label="操作时间" width="180">
      </el-table-column>
      <el-table-column prop="createName" label="操作人员" width="180">
      </el-table-column>
      <!-- <el-table-column prop="module" label="所属模块" width="180">
      </el-table-column> -->
      <el-table-column prop="remark" label="备注信息"> </el-table-column>
      
      <!-- <el-table-column prop="field" label="字段名" width="180">
      </el-table-column>
      <el-table-column prop="fieldOld" label="旧字段值" width="180">
      </el-table-column> -->
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
import { logpage } from "@/api/bussiness/index";
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
        data.fkId = this.$route.query.id;
      }
      logpage(data).then((res) => {
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