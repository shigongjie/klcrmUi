<template>
  <div class="container">
    <!-- <div>数据总览</div> -->
    <div>
      <div></div>
    </div>
    <div class="title">今日客服活动</div>
    <div>
      <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
        <el-table-column prop="name" label="客服"> </el-table-column>
        <el-table-column prop="status" label="在线状态"> </el-table-column>
        <el-table-column prop="reception" label="今日接待量"> </el-table-column>
        <el-table-column prop="message" label="累计消息量"> </el-table-column>
        <el-table-column prop="time" label="今日在线时长"> </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script>
import { getCsData } from "@/api/chat";
export default {
  data() {
    return {
      totalData: [
        { count: 23, title: "正在咨询人数" },
        { count: 23, title: "正在排队人数" },
        { count: 23, title: "今日会话量" },
        { count: 23, title: "今日未接入会话量" },
      ],
      tableData: [],
    };
  },
  mounted() {
    this.getCsData();
  },
  methods: {
    getCsData() {
      getCsData().then((res) => {
        this.tableData = res.data;
      });
    },
  },
};
</script>

<style lang="scss">
.container {
  min-height: calc(100vh - 84px);
  padding: 20px;
  background: #f5f5f5;
}

.title {
  padding: 10px 0;
}
</style>