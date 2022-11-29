<template>
  <div class="pd10">
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="time" label="登录时间" width="120">
      </el-table-column>
      <el-table-column prop="type" label="终端类型" width="180">
      </el-table-column>
      <el-table-column prop="version" label="浏览器/终端版本" width="180">
      </el-table-column>
      <el-table-column prop="operaSystem" label="操作系统" width="180">
      </el-table-column>
      <el-table-column prop="deviceName" label="设备名称"> </el-table-column>
      <el-table-column prop="mac" label="MAC地址" width="180">
      </el-table-column>
      <el-table-column prop="ip" label="登录IP" width="180"> </el-table-column>
      <el-table-column prop="address" label="地址" width="180">
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
import { loginlog } from "@/api/bussiness/index";
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
     this.queryParams.userId=this.$route.query.id
    this.getList(this.queryParams)
  },
  methods: {
    getList(data) {
      loginlog(data).then((res) => {
        this.tableData = res.rows;
        this.total = res.total
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