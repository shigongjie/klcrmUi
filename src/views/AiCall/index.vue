<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
        <el-form-item prop="taskName">
          <el-input v-model="queryParams.taskName" placeholder="任务名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="templateName">
          <el-input v-model="queryParams.templateName" placeholder="话术模板" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-date-picker size="small" v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始创建时间" end-placeholder="结束创建时间" />
        </el-form-item>
        <el-form-item prop="status">
          <el-select placeholder="任务状态" size="small" v-model="queryParams.status">
              <el-option label="待启动" value="0"></el-option>
              <el-option label="进⾏中" value="1"></el-option>
              <el-option label="已暂停" value="2"></el-option>
              <el-option label="已完成" value="3"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)">查询</el-button>
          <!-- <el-button type="primary" size="small" @click="pauseTask('pause')">暂停</el-button>
          <el-button type="primary" size="small" @click="startTask('start')">启动</el-button> -->
          <el-button type="" size="small" @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
      <div>
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
          @selection-change="handleSelectionChange">
          <el-table-column type="selection" width="55" align="center"> </el-table-column>
          <el-table-column prop="taskName" label="任务名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="templateName" label="话术模板" width="" align="center">
          </el-table-column>
          <el-table-column prop="callNum" width="100" label="呼叫数量" align="center"></el-table-column>
          <el-table-column prop="createTime" width="180" label="创建时间" align="center"></el-table-column>
          <el-table-column prop="endTime" width="180" label="结束时间" align="center"></el-table-column>
          <el-table-column prop="status" width="180" label="任务状态" align="center">
             <template slot-scope="scope">
                <span v-if="scope.row.status === 0">待启动</span>
                <span v-else-if="scope.row.status === 1">进⾏中</span>
                <span v-else-if="scope.row.status === 2">已暂停</span>
                <span v-else-if="scope.row.status === 3">已完成</span>
            </template>
          </el-table-column>
          <el-table-column prop="connectRate" width="180" label="接通率" align="center" :formatter="connectRate"></el-table-column>
          <el-table-column prop="shortName" fixed="right" label="操作" align="center" width="150">
            <template slot-scope="scope">
              <el-button @click.native.prevent="jumpLogs(scope.row)" size="mini">
                查看
              </el-button>
              <el-button @click.native.prevent="confirmDel(scope.row)" size="mini">
                删除
              </el-button>
                <el-button @click.native.prevent="pauseTask(scope.row)" size="mini" v-if="scope.row.status === 1">
                暂停
              </el-button>
              <el-button @click.native.prevent="startTask(scope.row)" size="mini" v-if="scope.row.status === 0 || scope.row.status === 2">
                启动
              </el-button>
            </template>
          </el-table-column>
        </el-table>
          <!-- 全选和反选 -->
        <div class="footer" v-if="tableData.length !== 0">
            <div class="left">
                <el-button icon="el-icon-success" @click="allCheak()">全选</el-button>
                <el-button icon="el-icon-circle-check" @click="unAllCheak([tableData])">反选</el-button>
            </div>
            <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
            :limit.sync="queryParams.pageSize" @pagination="getList"></pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  visitordelete,
  platformChannelList,
} from "@/api/chat/index";
import { getAiList , aiTaskRemove,aiStartTask,aiPauseTask } from "@/api/Ai/task";
export default {
  dicts: ["crm_note_status"],
  data() {
    return {
      time: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      list: [],
      startTaskId:[],
    };
  },
  beforeMount() {
    platformChannelList().then((res) => {
      this.list = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    connectRate(row,column){
      if(row.connectRate){
        return Math.floor(row.connectRate * 100) + '%'
      }
    },
    // 全选
    allCheak() {
      this.$refs.multipleTable.toggleAllSelection();
    },
    //反选
    unAllCheak(rows) {
      // 所有的选中未选中都做一个切换
      if (rows) {
        rows[0].forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      }
    },
    handleSelectionChange(val) {
      // console.log(val);
    },
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      getAiList(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
        // console.log(res);
      });
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
      };
      this.time = "";
      this.getList();
    },
    // 查询
    handleQuery() {
      if (this.time != "" && this.time != null && this.time != undefined) {
        this.queryParams.startTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endTime = this.time[1] + " " + "23:59:59";
      }
      this.getList();
    },
    // 启动
    startTask(rows){
      // console.log(rows);
      // if(rows.status !== 1){
      //   return this.$message({
      //         type: "error",
      //         message: "任务必须是待启动或已暂停状态",
      //       });
      // }
      aiStartTask({id:rows.id}).then((res) =>{
        console.log(res);
      }).catch((error)=>{
        console.log(error);
      })
    },
    // 暂停
    pauseTask(rows){
    //  if(rows.status !== 0 || rows.status !== 2){
    //     return this.$message({
    //           type: "error",
    //           message: "任务必须是进行中的状态",
    //         });
    //   }
      aiPauseTask({id:rows.id}).then((res) =>{
        console.log(res);
      }).catch((error)=>{
        console.log(error);
      })
    },
    jumpLogs(row) {
     this.$router.push({
        // name: "/AiCall/logs",
        path: "/Aicall/ailogs",
        query: {
          id: row.id,
        },
      });
    },
    confirmDel(ob) {
      this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          aiTaskRemove({ id: ob.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
  },
};
</script>

<style  lang='scss' scoped>
.topDiv {
  .tips {
    font-size: 13px;
    padding: 0 20px;
    color: #999999;
  }
}

.color4 {
  color: #409eff;
  cursor: pointer;
}

.footer{
  display: flex;
  padding: 10px 0;
  align-items:center;
  justify-content: space-between;
  .pagination-container{
      flex: 1;
      display: flex;
      align-items:center;
  }
}
</style>
