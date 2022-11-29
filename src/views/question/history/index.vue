<template>
  <div class="app-container">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item label="工单号" prop="id">
        <el-input
          v-model="queryParams.id"
          placeholder="请输入工单号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户手机号" prop="phone">
        <el-input
          v-model="queryParams.phone"
          placeholder="请输入客户手机号"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="客户姓名" prop="name">
        <el-input
          v-model="queryParams.name"
          placeholder="请输入客户姓名"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>

      <el-form-item label="工单创建时间" prop="createTime">
        <el-date-picker
          v-model="queryParams.createTime"
          type="daterange"
          align="right"
          unlink-panels
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          value-format="yyyy-MM-dd"
          :picker-options="datePickerOptions"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="归属平台" prop="sourcePlatform">
        <el-select
          v-model="queryParams.sourcePlatform"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="dict in isTenant ? tenantpaltformOptions : paltformOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item label="状态" prop="feedbackStatus">
        <el-select
          v-model="queryParams.feedbackStatus"
          placeholder="请选择"
          clearable
          size="small"
        >
          <el-option label="全部" value />
          <el-option
            v-for="dict in statusOptions"
            :key="dict.key"
            :label="dict.value"
            :value="dict.key"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >搜索</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>

    <el-table v-loading="loading" :data="list" style="width: 100%">
      <el-table-column
        label="服务工单号"
        align="center"
        prop="id"
        width="200"
        fixed="left"
      />
      <el-table-column
        label="客户手机号"
        align="center"
        prop="phone"
        width="140"
      />
      <el-table-column label="客户姓名" align="center" prop="name" />
      <el-table-column
        label="归属平台"
        align="center"
        :formatter="useSourcePlatformRender"
        v-if="!isTenant"
      />
      <el-table-column
        label="归属平台"
        align="center"
        :formatter="useTenantSourcePlatformRender"
        v-if="isTenant"
      />
      <el-table-column
        label="文字内容"
        align="center"
        prop="feedbackContent"
        width="200"
      />
      <el-table-column
        label="工单创建时间"
        align="center"
        prop="createTime"
        width="160"
      />
      <el-table-column
        label="工单更新时间"
        align="center"
        prop="updateTime"
        width="160"
      />
      <el-table-column
        label="状态"
        align="center"
        prop="newStaffName"
        :formatter="useStatusRender"
      />
      <el-table-column
        label="客服回复"
        align="center"
        prop="remark"
        :formatter="useRemarkContentRender"
        width="200"
      />
      <el-table-column
        label="操作"
        align="center"
        fixed="right"
        width="160"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-order"
            @click="handleDetail(scope.row)"
            >查看详情</el-button
          >

          <el-button
            size="mini"
            type="text"
            icon="el-icon-s-check"
            v-if="
              scope.row.feedbackStatus == 0 || scope.row.feedbackStatus == 2
            "
            @click="handleEnding(scope.row)"
            >操作工单</el-button
          >

          <el-popconfirm
            title="确认发送短信通知吗？"
            @confirm="handleSendMessage(scope.row)"
          >
            <el-button
              slot="reference"
              size="mini"
              type="text"
              icon="el-icon-message"
              >短信通知</el-button
            >
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <el-dialog
      title="工单操作"
      :before-close="handleCloseDialog"
      :visible="dialogVisible"
      center
      width="400px"
    >
      <div>
        <div>
          <el-radio-group v-model="radio" style="margin-bottom: 10px">
            <el-radio :label="1">结束工单</el-radio>
            <el-radio :label="2">驳回工单</el-radio>
            <el-radio :label="3">作废工单</el-radio>
          </el-radio-group>
        </div>
        <el-input
          v-model="remark"
          type="textarea"
          :rows="3"
          :maxlength="200"
          show-word-limit
          placeholder="反馈解答"
        ></el-input>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitForm()">确 定</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="工单详情"
      :before-close="handleCloseDialog2"
      :visible="dialogVisible2"
      center
      width="1000px"
    >
      <div>
        <el-descriptions title="用户信息" :column="2" border>
          <el-descriptions-item label="工单编号" :span="2">{{
            selectCustomer.id
          }}</el-descriptions-item>
          <el-descriptions-item label="客户姓名">{{
            selectCustomer.name
          }}</el-descriptions-item>
          <el-descriptions-item label="手机号">{{
            selectCustomer.phone
          }}</el-descriptions-item>
          <el-descriptions-item label="工单创建时间">{{
            selectCustomer.createTime
          }}</el-descriptions-item>
          <el-descriptions-item label="工单更新时间">{{
            selectCustomer.updateTime
          }}</el-descriptions-item>
          <el-descriptions-item label="问题反馈" :span="2">{{
            selectCustomer.feedbackContent
          }}</el-descriptions-item>
        </el-descriptions>
        <p>图片</p>
        <div>
          <el-image
            width="200px"
            class="pic"
            :src="item"
            v-for="(item, index) in selectCustomer.feedbackPic"
            :key="index"
            :preview-src-list="selectCustomer.feedbackPic"
            v-show="selectCustomer.feedbackPic.length > 0"
          ></el-image>
        </div>
        <p>电子签名</p>
        <el-image
          width="200px"
          class="pic"
          v-if="selectCustomer.signPic"
          :src="selectCustomer.signPic"
          :preview-src-list="[selectCustomer.signPic]"
        ></el-image>
        <p>操作记录</p>
        <div>
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="operator" label="操作人"></el-table-column>
            <el-table-column
              label="工单操作"
              :formatter="useStatusRender"
            ></el-table-column>
            <el-table-column prop="tenantName" label="企业名称">
              <template slot-scope="scope">{{
                scope.row.tenantName ? scope.row.tenantName : "内部用户"
              }}</template>
            </el-table-column>
            <el-table-column
              prop="remarkContent"
              label="备注"
            ></el-table-column>
            <el-table-column
              prop="remarkTime"
              label="操作时间"
            ></el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible2 = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { list, operation, message } from "@/api/question/index";
import {
  getStatus,
  useStatusRender,
  useSourcePlatformRender,
  getSourcePlatform,
  getTenantSourcePlatform,
  useTenantSourcePlatformRender,
} from "@/utils/question/config";
import datePickerOptions from "@/utils/datePickerOptions";
export default {
  mixins: [datePickerOptions],
  data() {
    return {
      // 遮罩层
      loading: true,
      // 总条数
      total: 0,
      // 表格数据
      list: [],
      // 查询参数
      queryParams: {
        createTimeEnd: "",
        createTimeStart: "",
        feedbackStatus: "",
        sourcePlatform: "",
        id: "",
        name: "",
        phone: "",
        pageNum: 1,
        pageSize: 10,
        createTime: [],
      },
      statusOptions: getStatus(),
      dialogVisible: false,
      dialogVisible2: false,
      remark: "",
      selectCustomer: {},
      radio: 1,
      tableData: [],
      paltformOptions: getSourcePlatform(),
      tenantpaltformOptions: getTenantSourcePlatform(),
      isTenant: this.$store.getters.isTenant,
    };
  },
  created() {
    this.getList();
  },
  methods: {
    /** 查询登录日志列表 */
    getList() {
      this.loading = true;
      if (
        this.queryParams.createTime &&
        this.queryParams.createTime.length > 0
      ) {
        this.queryParams.createTimeStart =
          this.queryParams.createTime[0] + " " +"00:00:00";
        this.queryParams.createTimeEnd =
          this.queryParams.createTime[1] + " "+ "23:59:59";
      } else {
        this.queryParams.createTimeStart = "";
        this.queryParams.createTimeEnd = "";
      }
      console.log(this.queryParams)
      list(this.queryParams).then((response) => {
        // console.log(response);
        this.list = response.rows;
        this.total = response.total;
        this.list.forEach((el, index) => {
          this.list[index].remark = JSON.parse(this.list[index].remark);
        });
        this.loading = false;
      });
    },
    /** 搜索按钮操作 */
    handleQuery() {
      this.pageNum = 1;
      this.getList();
    },
    /** 重置按钮操作 */
    resetQuery() {
      this.resetForm("queryForm");
      this.handleQuery();
    },
    useStatusRender(row) {
      return useStatusRender(row.feedbackStatus);
    },
    handleCloseDialog() {
      this.dialogVisible = false;
    },
    handleCloseDialog2() {
      this.dialogVisible2 = false;
    },
    handleEnding(row) {
      this.remark = "";
      this.dialogVisible = true;
      this.selectCustomer = row;
      this.selectCustomer.feedbackPic = JSON.parse(
        this.selectCustomer.feedbackPic
      );
    },
    handleDetail(row) {
      this.dialogVisible2 = true;
      this.selectCustomer = Object.assign({}, row);
      this.selectCustomer.feedbackPic = JSON.parse(
        this.selectCustomer.feedbackPic
      );
      this.tableData = this.selectCustomer.remark;
    },
    submitForm() {
      if (this.isNull(this.remark)) {
        this.$message("请输入反馈解答");
        return;
      }
      this.dialogVisible = false;
      let sendForm = {
        id: this.selectCustomer.id,
        remarkContent: this.remark,
        operationFeedbackStatus: this.radio,
      };
      operation(sendForm).then((res) => {
        this.$message(res.message);
        this.getList();
      });
    },
    handleSendMessage(row) {
      let sendForm = {
        id: row.id,
        sendType: 0,
      };
      message(sendForm).then((res) => {
        this.$message(res.message);
        this.getList();
      });
    },
    isNull(str) {
      if (str == "") return true;
      var regu = "^[ ]+$";
      var re = new RegExp(regu);
      return re.test(str);
    },
    useRemarkContentRender(row) {
      return row.remark ? row.remark[0].remarkContent : "";
    },
    useSourcePlatformRender(row) {
      return useSourcePlatformRender(row.sourcePlatform);
    },
    useTenantSourcePlatformRender(row) {
      return useTenantSourcePlatformRender(row.sourcePlatform);
    },
  },
};
</script>
<style   scoped>
.pic {
  width: 200px;
  border: 1px solid #ccc;
  margin: 10px;
}
</style>
