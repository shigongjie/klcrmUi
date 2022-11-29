<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
        <el-form-item prop="visitorName">
          <el-input v-model="queryParams.visitorName" placeholder="客户名称" clearable size="small"
            @keyup.enter.native="handleQuery" />
        </el-form-item>
        <el-form-item prop="isReply">
          <el-select placeholder="是否接入会话" size="small" v-model="queryParams.isReply">
            <el-option label="是" value="0"></el-option>
            <el-option label="否" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="visitorSource">
          <el-select placeholder="客户来源" size="small" v-model="queryParams.visitorSource">
            <el-option v-for="(item, index) in list" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-date-picker size="small" v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
            start-placeholder="开始到访时间" end-placeholder="结束到访时间" />
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)">查询</el-button>
          <el-button type="" size="small" @click="reset()">重置</el-button>
        </el-form-item>
        <!-- <el-form-item prop="real">
          <span class="tips" @click="tipsClick"><i style="margin-right:5px" class="el-icon-question"></i>帮助提示</span>
        </el-form-item> -->
      </el-form>
      <!-- <Tips ref="Tips" /> -->
      <div>
        <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%">
          <el-table-column prop="visitorName" label="客户名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="visitorAccount" label="登录账户" width="" align="center">
          </el-table-column>
          <el-table-column prop="platformId" label="客户来源" width="" align="center">
          </el-table-column>
          <el-table-column prop="visitorClass" width="" label="客户等级" align="center"></el-table-column>
          <el-table-column prop="beginTime" width="180" label="到访时间" align="center"></el-table-column>
          <el-table-column prop="endTime" width="180" label="结束时间" align="center"></el-table-column>
          <el-table-column prop="isReply" width="120" label="是否发起会话" align="center"></el-table-column>
          <el-table-column prop="shortName" fixed="right" label="操作" width="120" align="center">
            <template slot-scope="scope">
              <el-button @click.native.prevent="confirmDel(scope.row)" size="mini">
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize" @pagination="getList" />
      </div>
    </div>
  </div>
</template>

<script>
import {
  visitorlistpage,
  visitordelete,
  platformChannelList,
} from "@/api/chat/index";

export default {
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
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      visitorlistpage(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
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
    handleQuery() {
      if (this.time != "" && this.time != null && this.time != undefined) {
        this.queryParams.startTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endTime = this.time[1] + " " + "23:59:59";
      }
      this.getList();
    },
    jumpStaff(row) {
      this.$router.push({
        name: "/setpermission",
        // path: `/setpermission/:${JSON.stringify(row)}`,
        query: {
          id: row.id,
          data: JSON.stringify(row),
          type: 3,
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
          visitordelete({ ids: [ob.id] }).then((res) => {
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
</style>
