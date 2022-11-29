<template>
  <div class="pd10">
    <el-table :data="tableData" style="width: 100%" border>
      <el-table-column prop="date" label="操作编号" width="120">
      </el-table-column>
      <el-table-column prop="name" label="操作时间" width="180">
      </el-table-column>
      <el-table-column prop="name" label="操作人员" width="180">
      </el-table-column>
      <el-table-column prop="name" label="操作类型" width="180">
      </el-table-column>
      <el-table-column prop="name" label="操作IP" >
      </el-table-column>
      <el-table-column prop="name" label="操作终端" width="180">
      </el-table-column>
      <el-table-column prop="name" label="备注" >
      </el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isStart: true,
      tableData: [
        {
          date: "组织架构",
          name: "组织架构",
          address: "组织架构组织架构",
        },
      ],
    };
  },
  methods:{
      handleChange(data){
      },
  }
};
</script>

<style lang='scss' scoped>
.pd10{
    padding: 20px;
}
</style>