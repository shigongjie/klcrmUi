<!-- 工单列表  -->
<template>
  <div class="app-container">
    <div class="btn_list">
      <div class="btn_panel">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="openAdd"
          v-btnPermi="['workorder_add']"
          >添加</el-button
        >
        <el-dropdown v-btnPermi="['workorder_export']" class="lefr">
          <el-button size="small" icon="el-icon-upload2">
            导出<i class="el-icon-arrow-down el-icon--right"></i>
          </el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="exportByparams"
              >当前分类</el-dropdown-item
            >
            <el-dropdown-item @click.native="exportByChoosed"
              >选中数据</el-dropdown-item
            >
          </el-dropdown-menu>
        </el-dropdown>
        <!--          -->
        <el-button
          class="lefr"
          icon="el-icon-refresh"
          size="small"
          @click="openChangeWorkOrder"
          v-btnPermi="['workorder_allot']"
          >分配工单</el-button
        >
        <!--  -->
        <el-button
          v-btnPermi="['workorder_delete']"
          class="lefr"
          icon="el-icon-delete"
          size="small"
          @click="deleteWorks"
          >删除工单</el-button
        >
      </div>
      <div>
        <el-dropdown
          class="downMenu"
          @command="handleCommand"
          :hide-on-click="false"
        >
          <el-button icon="el-icon-sort" size="small">排序</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              class="down"
              v-for="(item, index) in orderList"
              :key="index"
              :command="item.id"
              >{{ item.name
              }}<i class="el-icon-check cheakIco" v-if="orUP == item.id"></i
            ></el-dropdown-item>

            <el-dropdown-item divided command="asc"
              >正序排序<i
                class="el-icon-check cheakIco"
                v-if="orDo == 'asc'"
              ></i
            ></el-dropdown-item>
            <el-dropdown-item command="desc"
              >倒序排序<i
                class="el-icon-check cheakIco"
                v-if="orDo == 'desc'"
              ></i
            ></el-dropdown-item>
            <el-dropdown-item command="reset">恢复默认</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
        <el-button
          icon="el-icon-date"
          size="small"
          @click="tableSort_dia = true"
          >列表</el-button
        >
      </div>
    </div>
    <br />
    <div>
      <el-table
        class="list_table"
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        border
        stripe
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="50"
          class="check_List"
          align="center"
          :resizable="false"
        >
        </el-table-column>
        <el-table-column
          prop="workTitle"
          label="工单标题"
          sortable
          :resizable="false"
          show-overflow-tooltip
          :sort-method="sortOrderTitle"
        >
        </el-table-column>
        <template v-for="(item, index) in tableShowList">
          <el-table-column
            v-if="item.id == 'workStatus'"
            :key="item.id"
            :label="item.name"
            sortable
            :resizable="false"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <div v-if="scope.row.workStatus == '1'" class="order_type">
                <div class="light_stay"></div>
                处理中
              </div>
              <div v-else-if="scope.row.workStatus == '2'" class="order_type">
                <div class="light_over"></div>
                已完结
              </div>
              <div v-else-if="scope.row.workStatus == '3'" class="order_type">
                <div class="light_back"></div>
                已退回
              </div>
            </template>
          </el-table-column>
          <el-table-column
            :key="index"
            v-else-if="item.id == 'urgencyIndex'"
            :label="item.name"
            sortable
            :resizable="false"
            show-overflow-tooltip
            :sort-method="sortQuickType"
          >
            <template slot-scope="scope">
              <div v-if="scope.row.urgencyIndex == '1'">一般</div>
              <div v-else-if="scope.row.urgencyIndex == '2'">非常紧急</div>
              <div v-else-if="scope.row.urgencyIndex == '3'">紧急</div>
            </template>
          </el-table-column>
          <el-table-column
            v-else
            :key="item.name"
            :label="item.name"
            :prop="item.id"
            sortable
            :resizable="false"
            show-overflow-tooltip
          >
          </el-table-column>
        </template>
        <el-table-column label="操作" :resizable="false" fixed="right">
          <template slot-scope="scope">
            <el-button
              type="text"
              icon="el-icon-position"
              size="small"
              v-btnPermi="['workorder_details']"
              @click="handleEdit(scope.$index, scope.row)"
              >详情</el-button
            >
            <el-button
              type="text"
              icon="el-icon-delete"
              size="small"
              v-btnPermi="['workorder_delete']"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <br />
      <div class="btn_list">
        <div>
          <el-button icon="el-icon-success" @click="allCheak()">全选</el-button>
          <el-button
            icon="el-icon-circle-check"
            @click="unAllCheak([tableData])"
            >反选</el-button
          >
        </div>
        <div>
          <!-- <pagination
            v-show="listTotal > 0"
            :total="listTotal"
            :page.sync="queryParamsSelf.pageNum"
            :limit.sync="queryParamsSelf.pageSize"
            @pagination="getList"
          /> -->
          <el-pagination
            background
            @size-change="sizeChange"
            @current-change="currentChange"
            :current-page.sync="currentPage"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="pageSize"
            layout=" prev, pager, next,sizes"
            :total="listTotal"
          >
          </el-pagination>
        </div>
      </div>
    </div>
    <el-dialog width="40%" :visible.sync="changeOpen">
      <div solt="title">
        <div class="title_font"><b>分配工单</b></div>
      </div>
      <div class="dia_content">
        <el-form
          ref="form"
          :rules="rules"
          :model="form_dia"
          label-width="100px"
        >
          <el-form-item label="选择人员" prop="operationStaff">
            <el-cascader
              style="width: 100%"
              v-model="form_dia.operationStaff"
              :options="userList"
              :show-all-levels="false"
              :props="areaListprops"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item label="备注原因" prop="workDetails">
            <el-input
              type="textarea"
              v-model="form_dia.workDetails"
              placeholder="请输入备注信息"
              show-word-limit
              maxlength="300"
              resize="none"
              :autosize="{ minRows: 6, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeOpen = false">取 消</el-button>
        <el-button type="primary" @click="changeOrder">确定</el-button>
      </div>
    </el-dialog>
    <el-dialog :visible.sync="dialogVisible" width="20%">
      <span slot="title"> <b>确认提示</b></span>
      <div class="msg_panel">
        <div class="im_g">
          <i class="el-icon-question"></i>
        </div>
        <div class="ms_g">
          <b>是否确定删除对应的记录</b>
          <div>是否确定删除对应的记录</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deleteOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="tableSort_dia" width="40%">
      <div solt="title">
        <div class="title_font">
          <b>自定义显示列项</b>
          <div class="titleTip">
            列项显示不得少于5项，最多支持自定义10个列项，灰色选中列不支持隐藏和排序
          </div>
        </div>
      </div>
      <div class="dia_content">
        <el-table :data="showList" stripe border style="width: 100%">
          <el-table-column
            label="显示"
            :resizable="false"
            align="center"
            width="100"
          >
            <template slot-scope="scope">
              <el-checkbox
                v-model="scope.row.isPre"
                :disabled="scope.row.disable"
              >
              </el-checkbox
            ></template>
          </el-table-column>
          <el-table-column :resizable="false" prop="name" label="列名">
          </el-table-column>
          <el-table-column
            :resizable="false"
            width="180"
            align="center"
            label="拖动调整顺序"
          >
            <div>
              <i class="el-icon-s-unfold"></i>
            </div>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <div>
          <el-button @click="reSetTable" type="text">恢复默认</el-button>
        </div>
        <div>
          <el-button @click="tableSort_dia = false">取 消</el-button>
          <el-button type="primary" @click="sortChange">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <newWorkOrder
      ref="workOrder"
      :staffList="userList"
      @addOver="overClose"
    ></newWorkOrder>
  </div>
</template>

<script>
import {
  getWorkOrderList,
  removeWorkOrder,
  workOrderExport,
  changeTaskOrder,
} from "@/api/workOrder/index";
import { getstaffList } from "@/api/customer/index";
import newWorkOrder from "../../add/newWorkOrder.vue";

export default {
  props: {
    queryParams: {
      type: Object,
      default: {},
    },
  },
  components: { newWorkOrder },
  data() {
    return {
      queryParamsSelf: {
        pageNum: 1,
        pageSize: 10,
      },
      tableData: [], //表格数据
      cheakBoxList: [], //选中列
      userList: [], //处理人列表
      currentPage: 1, //当前页
      dialogVisible: false, //开关弹窗
      deleteId: undefined, //删除工单id
      pageSize: 10, //页面显示数量
      listTotal: 0, //列表总数_有几条消息
      changeOpen: false, //分配工单
      tableSort_dia: false,
      showStatus: "0", //显示状态
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      form_dia: {
        //切换处理人表单
        operationStaff: "",
        workDetails: "",
      },
      rules: {
        workDetails: [
          { required: true, message: "请输入备注原因", trigger: "change" },
        ],
        operationStaff: [
          { required: true, message: "请选择分配人员", trigger: "change" },
        ],
      },
      orderList: [
        //排序显示列表
        { name: "工单编号", id: "workId" },
        { name: "发起人员", id: "createBy" },
        { name: "处理人员", id: "operationStaff" },
        { name: "发起时间", id: "createTime" },
        { name: "工单状态", id: "workStatus" },
        { name: "评论记录", id: "commentCount" },
        { name: "发起部门", id: "createDept" },
        { name: "处理部门", id: "operationStaffDept" },
        { name: "工单内容", id: "workDetails" },
      ],
      preOr: ["workId", "asc"], //默认状态
      orUP: "workId", //排列类型
      orDo: "asc", //排列顺序
      showList: [
        { name: "工单标题", id: "workTitle", disable: true, isPre: true },
        { name: "操作", id: "cheakTo", disable: true, isPre: true },
        { name: "工单编号", id: "workId", disable: false, isPre: true },
        { name: "处理人员", id: "operationStaff", disable: false, isPre: true },
        { name: "发起时间", id: "createTime", disable: false, isPre: true },
        { name: "工单状态", id: "workStatus", disable: false, isPre: true },
        { name: "紧急程度", id: "urgencyIndex", disable: false, isPre: true },
        { name: "评论记录", id: "commentCount", disable: false, isPre: false },
        { name: "发起部门", id: "createDept", disable: false, isPre: false },
        {
          name: "处理部门",
          id: "operationStaffDept",
          disable: false,
          isPre: false,
        },
        { name: "处理时间", id: "updateTime", disable: false, isPre: false },
      ], //自定义排序列表项
      tableShowList: [
        { name: "工单编号", id: "workId", disable: false, isPre: true },
        { name: "处理人员", id: "operationStaff", disable: false, isPre: true },
        { name: "发起时间", id: "createTime", disable: false, isPre: true },
        { name: "工单状态", id: "workStatus", disable: false, isPre: true },
        { name: "紧急程度", id: "urgencyIndex", disable: false, isPre: true },
      ],
    };
  },
  beforeMount() {
    this.getList();
    this.openChangeOrder();
  },
  methods: {
    exports(ob) {
      workOrderExport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "工单列表" + ".xlsx"
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
          link.setAttribute("download", "工单列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByparams() {
      this.exports(this.queryParams);
    },
    exportByChoosed() {
      if (this.cheakBoxList.length <= 0) {
        this.$message.error("请至少选中一条数据");
        return;
      }
      let datas = {};
      datas.ids = [];
      this.cheakBoxList.forEach((item, index) => {
        datas.ids.push(item.id);
      });
      this.exports(datas);
    },
    //开启添加弹窗
    openAdd() {
      this.$refs.workOrder.open = true;
    },
    //跳转详情弹窗
    handleEdit(i, row) {
      this.$router.push({
        path: "menu/workOrderDetails",
        query: {
          id: row.id,
        },
      });
    },
    //打开更换处理人弹窗
    openChangeOrder() {
      getstaffList().then((res) => {
        this.userList = res.data;
      });
    },
    //打开删除
    handleDelete(i, row) {
      this.dialogVisible = true;
      this.deleteId = row.id;
    },
    // 工单类型排序
    sortWorkType(a, b) {
      return a.workType - b.workType;
    },
    //工单状态排序
    sortOrderType(a, b) {
      return a.workStatus - b.workStatus;
    },
    //紧急程度排序
    sortQuickType(a, b) {
      return a.urgencyIndex - b.urgencyIndex;
    },
    //工单标题排序
    sortOrderTitle(a, b) {
      return this.sortName(a.workTitle, b.workTitle);
    },
    //文字类排序
    sortName(str1, str2) {
      let res = 0;
      for (let i = 0; ; i++) {
        if (!str1[i] || !str2[i]) {
          res = str1.length - str2.length;
          break;
        }
        const char1 = str1[i];
        const char1Type = this.getChartType(char1);
        const char2 = str2[i];
        const char2Type = this.getChartType(char2);
        // 类型相同的逐个比较字符
        if (char1Type[0] === char2Type[0]) {
          if (char1 === char2) {
            continue;
          } else {
            if (char1Type[0] === "zh") {
              res = char1.localeCompare(char2);
            } else if (char1Type[0] === "en") {
              res = char1.charCodeAt(0) - char2.charCodeAt(0);
            } else {
              res = char1 - char2;
            }
            break;
          }
        } else {
          // 类型不同的，直接用返回的数字相减
          res = char1Type[1] - char2Type[1];
          break;
        }
      }
      return res;
    },
    getChartType(char) {
      // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
      if (/^[\u4e00-\u9fa5]$/.test(char)) {
        return ["zh", 300];
      }
      if (/^[a-zA-Z]$/.test(char)) {
        return ["en", 200];
      }
      if (/^[0-9]$/.test(char)) {
        return ["number", 100];
      }
      return ["others", 999];
    },

    //点击多选框事件
    handleSelectionChange(val) {
      this.cheakBoxList = val;
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
    //显示条数切换
    sizeChange(val) {
      this.pageSize = val;
      this.getList();
    },
    //页码切换
    currentChange(val) {
      this.currentPage = val;
      this.getList();
    },
    //打开分配工单
    openChangeWorkOrder() {
      if (this.cheakBoxList.length == 0) {
        this.$message({
          message: "请勾选需要分配的工单",
          type: "warning",
        });
      } else {
        this.changeOpen = true;
      }
    },
    // 确定删除工单
    deleteOrder() {
      const ids = [];
      ids.push(this.deleteId);
      let datas = {
        ids: ids,
      };
      removeWorkOrder(datas).then((res) => {
        this.$notify.success({
          title: "工单删除成功",
          message: "工单删除成功",
          position: "bottom-right",
        });
        this.dialogVisible = false;
        this.closeDia();
        this.getList();
      });
    },
    //关闭删除弹窗
    closeDia() {
      this.deleteId = undefined;
    },
    //获取工单列表
    getList(res) {
      let datas = {};
      if (res != undefined) {
        //等待时间暂无--res.waitTime
        datas = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          // pageNum: this.queryParamsSelf.pageNum,
          // pageSize: this.queryParamsSelf.pageSize,

          status: this.showStatus,
          name: res.name,
          workType: res.workType,
          workStatus: res.workStatus,
          urgencyType: res.urgencyType,
          createBy: res.createBy,
          operationStaff: res.operationStaff,
          createDept: res.createDept,
          operationStaffDept: res.operationStaffDept,
          createTime: res.createTime,
          updateTime: res.updateTime,
          field: this.orUP,
          waitTime: res.waitTime,
        };
        if (res.status != "") {
          datas.status = res.status;
        }
      } else {
        datas = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          status: this.showStatus,
          field: this.orUP,
        };
      }
      if (datas.status == "") {
        datas.status = "  ";
      }
      getWorkOrderList(datas).then((res) => {
        this.tableData = res.data.records;
        this.listTotal = res.data.total;
      });
    },
    //添加工单完成后做的事
    overClose() {
      this.getList();
    },
    //切换置顶status状态
    changeStatus(res) {
      this.showStatus = res;
      this.getList();
    },
    //删除多个工单
    deleteWorks() {
      if (this.cheakBoxList.length == 0) {
        this.$message({
          message: "请勾选需要删除的工单",
          type: "warning",
        });
      } else {
        this.$confirm("此操作将删除已选工单, 是否继续?", "删除工单", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            let datas = {
              ids: [],
            };
            this.cheakBoxList.forEach((row) => {
              datas.ids.push(row.id);
            });
            removeWorkOrder(datas).then((res) => {
              this.$notify.success({
                title: "工单删除成功",
                message: "工单删除成功",
                position: "bottom-right",
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
      }
    },
    //分配工单--批量
    changeOrder() {
      if (
        this.form_dia.operationStaff == "" ||
        this.form_dia.operationStaff == null ||
        this.form_dia.operationStaff == undefined
      ) {
        this.$message.error("请选择人员");
        return;
      }

      if (
        this.form_dia.workDetails == "" ||
        this.form_dia.workDetails == null ||
        this.form_dia.workDetails == undefined
      ) {
        this.$message.error("请填写备注原因");
        return;
      }
      this.$confirm("此操作将分配工单, 是否继续?", "分配工单", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let datas = {
            ids: [],
            remark: this.form_dia.workDetails,
            staffId: this.form_dia.operationStaff,
          };
          this.cheakBoxList.forEach((row) => {
            datas.ids.push(row.id);
          });
          changeTaskOrder(datas).then((res) => {
            this.$notify.success({
              title: "工单分配成功",
              message: "工单分配成功",
              position: "bottom-right",
            });
            this.changeOpen = false;
            this.getList();
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    //排序--先按照发起时间
    handleCommand(comm) {
      if (comm == "asc") {
        this.orDo = comm;
        this.getList();
        return;
      }
      if (comm == "desc") {
        this.orDo = comm;
        this.getList();
        return;
      }
      if (comm == "reset") {
        this.orUP = this.preOr[0];
        this.orDo = this.preOr[1];
        this.getList();
        return;
      }
      this.orUP = comm;
      this.getList();
    },
    //确定自定义列表
    sortChange() {
      let a = 0;
      this.showList.forEach((row) => {
        if (row.isPre) {
          a++;
        }
      });
      if (a < 7) {
        this.$message({
          message: "请至少选择五个列项进行显示",
          type: "warning",
        });
        return;
      }
      if (a > 12) {
        this.$message({
          message: "最多只能选择10个列项进行显示",
          type: "warning",
        });
        return;
      }
      this.$message({
        message: "保存成功",
        type: "success",
      });
      this.tableShowList = [];
      for (let i = 0; i < this.showList.length; i++) {
        if (this.showList[i].isPre) {
          if (i > 1) {
            this.tableShowList.push(this.showList[i]);
          }
        }
      }
      this.tableSort_dia = false;
    },
    //重置列表显示
    reSetTable() {
      this.showList = this.$options.data.call(this).showList; //恢复默认data值
    },
  },
};
</script>
<style lang='scss' scoped>
.btn_list {
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  .btn_panel {
    width: 40%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;
    .lefr {
      margin-left: 10px;
    }
  }
}
.order_type {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;

  .light_over {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #4bd863;
    margin: auto 3px;
  }
  .light_stay {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #0079fe;
    margin: auto 3px;
  }
  .light_back {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background-color: #ff3b31;
    margin: auto 3px;
  }
}
::v-deep .el-dialog {
  min-width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -80%);
}
.msg_panel {
  width: 100%;

  min-height: 120px;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-start;
  border-bottom: 1px solid rgba($color: #606266, $alpha: 0.5);
  .ms_g {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    > b {
      font-size: 16px;
    }
    div {
      margin-top: 5px;
    }
  }
  .im_g {
    width: 20%;
    height: 100%;
    text-align: center;
    margin-top: -20px;
    i {
      font-size: 40px;
      color: #fe9400;
    }
  }
}
::v-deep .el-dialog__body {
  padding: 0;
}
::v-deep .el-dialog {
  min-width: 300px;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -60%) !important;
}
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
  padding-bottom: 0;
}
.dia_content {
  padding: 20px;
  max-height: 380px;
  overflow: auto;
}
::v-deep .el-input__count {
  margin-bottom: -42px;
}
.title_font {
  width: 100%;
  height: 40px;
  margin-top: -5px;
  padding-left: 20px;
  font-size: 16px;
  background-color: #f2f2f2;
}
::v-deep .el-dropdown-menu--medium .el-dropdown-menu__item {
  padding: 0px 20px;
  margin: 0;
  text-align: end;
}
.cheakIco {
  color: #0079fe;
  margin-left: 10px;
}
.downMenu {
  margin-right: 10px;
}
.footerBtn {
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
}
.titleTip {
  font-size: 10px;
}
</style>