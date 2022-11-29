<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="taskName">
          <el-input
            v-model="queryParams.taskName"
            placeholder="任务名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="customerName">
          <el-input
            v-model="queryParams.customerName"
            placeholder="客户姓名"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="customerPhone">
          <el-input
            v-model="queryParams.customerPhone"
            placeholder="客户手机号"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="createBy">
          <el-input
            v-model="queryParams.createBy"
            placeholder="短信发送人"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="noteStatus">
          <el-select
            size="small"
            placeholder="发送状态"
            v-model="queryParams.noteStatus"
          >
            <el-option label="成功" value="0"></el-option>
            <el-option label="失败" value="1"></el-option>
          </el-select>
          <!-- <el-input
            v-model="queryParams.noteStatus"
            placeholder="发送状态"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          /> -->
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="发送时间"
            end-placeholder="发送时间"
          />
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >

          <el-button type="" size="small" @click="reset()">重置</el-button>
          <el-button type="" size="small" @click="exportByChoose()"
            >导出</el-button
          >
          <el-button type="" size="small" @click="addCall()"
            >单点外呼</el-button
          >
        </el-form-item>
      </el-form>
      <!-- <Tips ref="Tips" /> -->
      <div>
        <el-table
          border
          ref="multipleTable"
          :data="tableData"
          tooltip-effect="dark"
          style="width: 100%"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"></el-table-column>
          <el-table-column prop="taskName" label="任务名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="noteTemplateName" label="模板名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="customerName" label="客户姓名" width="180" align="center">
          </el-table-column>
          <el-table-column
            prop="customerPhone"
            width="180"
            label="手机号"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="noteDetails"
            width=""
            label="短信详情"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createBy"
            width="200"
            label="短信发送人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="noteStatus"
            width="200"
            label="短信状态"
            align="center"
          ></el-table-column>
          <!-- <el-table-column
            prop="noteReply"
            width="200"
            label="回复内容"
          ></el-table-column> -->
          <el-table-column
            prop="sendTime"
            width="180"
            label="发送时间"
            align="center"
          ></el-table-column>
          <!-- <el-table-column prop="shortName" fixed="right" label="操作">
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="confirmDel(scope.row)"
                size="mini"
              >
                查看
              </el-button>
              <el-button
                @click.native.prevent="confirmDel(scope.row)"
                size="mini"
              >
                删除
              </el-button>
            </template></el-table-column
          > -->
        </el-table>
        <AddCall ref="AddCall" />
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNum"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { getlistByid, massTextingexport } from "@/api/sms/index";
import AddCall from "./components/addCall.vue";
export default {
  components: {
    AddCall,
  },
  data() {
    return {
      time: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      chooseIds: [],
      list: [],
    };
  },
  beforeMount() {
    if (this.$route.query.id) {
      this.queryParams.id = this.$route.query.id;
    }
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleSelectionChange(val) {
      let ids = [];
      console.log(val);
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseIds = ids;
    },
    exports(ob) {
      massTextingexport({ids:ob}).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "短信发送记录" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "短信发送记录" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      if (this.chooseIds.length <= 0) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      this.exports(this.chooseIds);
    },
    addCall() {
      this.$refs.AddCall.open = true;
    },
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      getlistByid(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
      });
    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        id: this.$route.query.id,
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
