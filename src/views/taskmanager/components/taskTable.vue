/**任务管理列表 */
<template>
  <div v-loading="loading">
    <div
      style="text-align: center; padding-top: 30px; color: #999999"
      v-if="workRecordData.length == 0"
    >
      暂无数据
    </div>
    <div class="TaskCard" v-for="(item, index) in workRecordData" :key="index">
      <div>
        <span>开始时间</span>
        <span>{{ item.beginTime }}</span>
      </div>
      <div>
        <span>任务标题</span>
        <span>{{ item.headline }}</span>
      </div>
      <div>
        <span>负责人员</span>
        <span>{{ item.personId }}</span>
      </div>
      <div>
        <span>任务状态</span>
        <span
          ><i
            :class="
              item.taskType == '未开始'
                ? 'color1'
                : item.taskType == '进行中'
                ? 'color2'
                : item.taskType == '已超时'
                ? 'color3'
                : item.taskType == '已完成'
                ? 'color4'
                : item.taskType == '未完成'
                ? 'color5'
                : 'color6'
            "
            class="el-icon-message-solid cricle"
          ></i
          >{{ item.taskType }}</span
        >
      </div>
      <div>
        <span>紧要程度</span>
        <span>{{ item.urgencydegree }}</span>
      </div>
      <div>
        <span>完成进度</span>
        <span>
          <el-progress
            style="display: block; width: 200px"
            :percentage="item.schedule"
          ></el-progress>
        </span>
      </div>
      <div style="width: 100px">
        <el-button
          plain
          icon="el-icon-date"
          size="small"
          v-btnPermi="['rm_task_details']"
          @click="jumpDetail(item.id)"
          >详情</el-button
        >
      </div>
    </div>
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
import { taskpage } from "@/api/task/index";
export default {
  data() {
    return {
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        homeType: null,
      },
      workRecordData: [],
      loading: true,
      total: 0,
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    getList(query) {
      if (query == null) {
        query = this.queryParams;
      }
      taskpage(query).then((res) => {
        this.workRecordData = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    jumpDetail(id) {
      this.$router.push({
        path: "/officeManagement/taskDetail",
        query: { id: id },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.TaskCard:nth-child(2n) {
  background: #f9f9f9;
}
.TaskCard {
  margin-top: 10px;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #e9e9e9;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 30%;
    font-size: 13px;
    padding-left: 20px;
    justify-content: center;
    span {
      display: block;
      height: 40px;
      padding: 10px 0;
      color: #9999b2;
    }
    span:nth-child(2) {
      padding: 10px 0;
      color: #666666;
    }
  }
}
.cricle {
  margin-right: 5px;
}
.color1 {
  color: #409EFF;
}
.color2 {
  color: #67C23A;
}
.color3 {
  color: #F56C6C;
}
.color4 {
  color: #cccccc;
}
.color5 {
  color: #909399;
}
.color6 {
  color: skyblue;
}
</style>