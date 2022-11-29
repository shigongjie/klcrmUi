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
        <el-form-item prop="noteTemplateName">
          <el-select
            placeholder="短信模板"
            size="small"
            v-model="queryParams.noteTemplateName"
          >
            <el-option
              v-for="(item, index) in templateList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
            <!-- <el-option label="否" value="1"></el-option> -->
          </el-select>
        </el-form-item>

        <el-form-item prop="description" label="">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始创建时间"
            end-placeholder="结束创建时间"
          />
        </el-form-item>
        <el-form-item prop="visitorSource">
          <el-select
            placeholder="任务状态"
            size="small"
            v-model="queryParams.taskStatus"
          >
            <el-option
              v-for="dict in dict.type.crm_note_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >
          <el-button type="" size="small" @click="reset()">重置</el-button>
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
        >
          <el-table-column prop="taskName" label="任务名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="noteTemplateName" label="短信模板" width="" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" style="width: 300px">
                  {{ scope.row.noteTemplateName }}
                </div>
                <div class="texteclip">
                  {{ scope.row.noteTemplateName }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="count" label="短信数量" width="150" align="center">
          </el-table-column>
          <el-table-column prop="noteCount" label="套餐数量" width="150" align="center">
          </el-table-column>
          <el-table-column
            prop="noteMoney"
            width="150"
            label="短信费用"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createBy"
            width="150"
            label="创建人"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            width="180"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="endTime"
            width="180"
            label="结束时间"
            align="center"
          ></el-table-column>
          <el-table-column prop="taskStatus" width="150" label="任务状态" align="center">
            <!-- <template slot-scope="scope">
            {{scope.row.taskStatus==0?'':''}}
          </template> -->
          </el-table-column>
          <el-table-column
            width="150"
            prop="shortName"
            fixed="right"
            label="操作"
          >
            <template slot-scope="scope">
              <el-button
                @click.native.prevent="Jumplogs(scope.row)"
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
          ></el-table
        >
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
import { getlist, massTextingdelete } from "@/api/sms/index";
import { noteTemplateList } from "@/api/messageSend/index";

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
      templateList: [],
    };
  },
  beforeMount() {
    noteTemplateList().then((res) => {
      this.templateList = res.data;
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
      getlist(this.queryParams).then((res) => {
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
        this.queryParams.createstStartTime = this.time[0] + " " + "00:00:00";
        this.queryParams.createstEndTime = this.time[1] + " " + "23:59:59";
      }
      this.getList();
    },
    Jumplogs(row) {
      this.$router.push({
        // name: "/sms/smslogs",
        path: `/sms/smslogs`,
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
          massTextingdelete({ ids: [ob.id] }).then((res) => {
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
.texteclip {
  width: 200px;
  height: auto;
  word-wrap: break-word; /*强制换行*/
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis; /*隐藏后添加省略号*/
  white-space: nowrap; /*强制不换行*/
  cursor: pointer;
}
</style>
