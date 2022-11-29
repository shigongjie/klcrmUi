<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="name">
          <el-input
            v-model="queryParams.name"
            placeholder="模板名称"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item prop="visitorSource">
          <el-select
            placeholder="审核状态"
            size="small"
            v-model="queryParams.templateType"
          >
            <el-option
              v-for="(item, index) in list"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="创建开始时间"
            end-placeholder="创建结束时间"
          />
        </el-form-item>
        <el-form-item prop="description" label="">
          <el-date-picker
            size="small"
            v-model="time1"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="审核时间"
            end-placeholder="审核时间"
          />
        </el-form-item>

        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >

          <el-button type="" size="small" @click="reset()">重置</el-button>
          <el-button type="primary" size="small" @click="handleAdd()"
            >新增</el-button
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
        >
          <el-table-column prop="name" label="模板名称" width="" align="center">
          </el-table-column>
          <el-table-column prop="noteDetail" label="短信内容" width="" align="center">
            <template slot-scope="scope">
              <el-tooltip class="item" effect="dark" placement="top-start">
                <div slot="content" style="">
                  {{ scope.row.noteDetail }}
                </div>
                <div class="texteclip">
                  {{ scope.row.noteDetail }}
                </div>
              </el-tooltip>
            </template>
          </el-table-column>
          <el-table-column prop="type" label="状态" width="150" align="center">
          </el-table-column>
          <el-table-column
            prop="createTime"
            width="180"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="checkTime"
            width="180"
            label="审核时间"
            align="center"
          ></el-table-column>
          <el-table-column
            width="150"
            prop="shortName"
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.type == '通过' || scope.row.type == '失败'"
                @click.native.prevent="seeDetail(scope.row)"
                size="mini"
              >
                修改
              </el-button>
              <el-button
                v-else
                @click.native.prevent="seeDetail(scope.row)"
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
        <AddTemplate ref="AddTemplate" @reload="getList" :id="editId" />
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
import { getlist, noteremove } from "@/api/sms/tempate";
import AddTemplate from "./components/addtemplete.vue";
export default {
  components: {
    AddTemplate,
  },
  data() {
    return {
      time1: "",
      time: "",
      editId: "",
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      total: 0,
      tableData: [],
      list: [
        { name: "审核中", id: "0" },
        { name: "通过", id: "1" },
        { name: "失败", id: "2" },
      ],
    };
  },
  beforeMount() {},
  mounted() {
    this.getList();
  },
  methods: {
    handleAdd() {
      this.editId = "";
      this.$refs.AddTemplate.open = true;
    },
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
      this.time1 = "";
      this.getList();
    },
    seeDetail(row) {
      this.editId = row.id;
      this.$refs.AddTemplate.open = true;
    },
    handleQuery() {
      if (this.time != "" && this.time != null && this.time != undefined) {
        this.queryParams.startFoundTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endFoundTime = this.time[1] + " " + "23:59:59";
      }
      if (this.time1 != "" && this.time1 != null && this.time1 != undefined) {
        this.queryParams.startCheckTime = this.time1[0] + " " + "00:00:00";
        this.queryParams.endCheckTime = this.time1[1] + " " + "23:59:59";
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
          noteremove({ ids: [ob.id] }).then((res) => {
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
  //width: 200px;
  height: auto;
  word-wrap: break-word; /*强制换行*/
  overflow: hidden; /*超出隐藏*/
  text-overflow: ellipsis; /*隐藏后添加省略号*/
  white-space: nowrap; /*强制不换行*/
  cursor: pointer;
}
</style>
