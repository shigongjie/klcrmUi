<template>
  <div class="app-container">
    <div class="topDiv">
      <el-form
        :model="queryParams"
        ref="queryForm"
        :inline="true"
        @submit.native.prevent
      >
        <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="企业名称/企业联系方式"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>

        <!-- <el-form-item prop="keyword">
          <el-input
            v-model="queryParams.keyword"
            placeholder="企业联系方式"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item> -->
        <el-form-item prop="maxPrice">
          <el-input
            size="small"
            type="number"
            v-model="queryParams.maxPrice"
            placeholder="最大充值金额"
          ></el-input>
        </el-form-item>
        <el-form-item prop="minPrice">
          <el-input
            size="small"
            type="number"
            v-model="queryParams.minPrice"
            placeholder="最小充值金额"
          ></el-input>
        </el-form-item>
        <el-form-item prop="address" label="">
          <el-select
            clearable
            size="small"
            style="width: 100%"
            v-model="queryParams.status"
            placeholder="订单状态"
          >
            <el-option
              v-for="dict in dict.type.order_status"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address" label="">
          <el-select
            clearable
            size="small"
            style="width: 100%"
            v-model="queryParams.payType"
            placeholder="支付方式"
          >
            <el-option
              v-for="dict in dict.type.pay_type"
              :key="dict.value"
              :label="dict.label"
              :value="dict.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="" prop="followUpTimeEnd">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始付款时间"
            end-placeholder="结束付款时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="address" label="">
          <el-select
            clearable
            size="small"
            style="width: 100%"
            v-model="queryParams.type"
            placeholder="购买类型"
          >
            <el-option label="话费" value="0"></el-option>
            <el-option label="套餐" value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="address" label="">
          <el-select
            clearable
            size="small"
            style="width: 100%"
            v-model="queryParams.payWay"
            placeholder="购买渠道"
          >
            <el-option label="前台" value="0"></el-option>
            <el-option label="中台" value="1"></el-option>
            <el-option label="后台" value="2"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="real">
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >查询</el-button
          >
          <el-button type="" size="small" @click="reset()">重置</el-button>
          <!-- <el-button type="primary" size="small" @click="handleQuery(0)"
            >启动</el-button
          >
          <el-button type="primary" size="small" @click="handleQuery(0)"
            >暂停</el-button
          > -->
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
          <el-table-column type="selection" width="55" align="center">
          </el-table-column>
          <el-table-column prop="orderSn" label="订单编号" width="200" align="center">
          </el-table-column>
          <el-table-column prop="companyName" label="购买企业" width="" align="center">
          </el-table-column>
          <el-table-column prop="companyPhone" label="企业联系方式" width="" align="center">
          </el-table-column>
          <el-table-column prop="money" label="充值金额" width="100" align="center">
          </el-table-column>
          <el-table-column prop="type" label="购买类型" width="100" align="center">
            <template slot-scope="scope">
              {{ scope.row.type == 0 ? "话费" : "套餐" }}
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            width="120"
            label="订单状态"
            align="center"
          ></el-table-column>
          <el-table-column prop="payType" width="100" label="付款方式" align="center">
          </el-table-column>
          <el-table-column prop="payWay" width="100" label="购买渠道" align="center">
            <template slot-scope="scope">
              {{
                scope.row.payWay == 0
                  ? "前台"
                  : scope.row.payWay == 1
                  ? "中台"
                  : "后台"
              }}
            </template>
          </el-table-column>
          <el-table-column
            prop="createBy"
            width="120"
            label="充值人员"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="createTime"
            width="170"
            label="创建时间"
            align="center"
          ></el-table-column>
          <el-table-column
            prop="payTime"
            width="170"
            label="付款时间"
            align="center"
          ></el-table-column>
          <el-table-column
            width="120"
            prop="shortName"
            fixed="right"
            label="操作"
            align="center"
          >
            <template slot-scope="scope">
              <el-button
                v-if="scope.row.status == '待付款'"
                @click.native.prevent="returnOrder(scope.row)"
                size="mini"
              >
                重新支付
              </el-button>
            </template></el-table-column
          ></el-table
        >
        <el-dialog
          style="margin-top: 200px"
          :visible.sync="dialogVisible"
          width="240px"
        >
          <el-image style="width: 200px" :src="src"></el-image>
        </el-dialog>
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
import { orderpage, payRefound } from "@/api/order/index";
export default {
  dicts: ["pay_type", "order_status"],
  data() {
    return {
      dialogVisible: false,
      src: "",
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
    returnOrder(row) {
      this.src = row.codeUrl;
      this.dialogVisible = true;
      //   this.$confirm(
      //     `是否确定给${row.companyName}进行退款吗?退款金额${row.money}元`,
      //     "订单退款?",
      //     {
      //       confirmButtonText: "确定",
      //       cancelButtonText: "取消",
      //       type: "warning",
      //     }
      //   )
      //     .then(() => {
      //       payRefound({ id: row.id }).then((res) => {
      //         this.$message({
      //           type: "success",
      //           message: "退款成功!",
      //         });
      //         this.getList();
      //       });
      //     })
      //     .catch(() => {
      //       this.$message({
      //         type: "info",
      //         message: "已取消退款",
      //       });
      //     });
    },
    handleSelectionChange(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
    },
    handleAdd() {
      this.editId = "";
      this.$refs.AddTemplate.open = true;
    },
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
    getList() {
      orderpage(this.queryParams).then((res) => {
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
    seeDetail(row) {
      this.editId = row.id;
      this.$refs.AddTemplate.open = true;
    },
    handleQuery() {
      if (this.time != "" && this.time != null && this.time != undefined) {
        this.queryParams.startPayTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endPayTime = this.time[1] + " " + "23:59:59";
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
</style>
