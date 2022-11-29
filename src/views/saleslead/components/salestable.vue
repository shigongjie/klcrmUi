/**List */
<template>
  <div>
    <SetColumn ref="SetColumn" :showLists="showList" :startFollowUpModel="true" :cacheColunm="'saleleadsColumn'"
      @getTableList="getTableList" @reload="getData" @changeFollowModel="changeFollowModel" @reset="resetColumn" />
    <el-table border="" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <template v-for="(item, index) in columnShow">
        <el-table-column v-if="item.id == 'customerName'" :key="item.id" :label="item.name" :resizable="false" :width="item.width"
          show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span style="color: #46a6ff; cursor: pointer" @click="jumpDetial(scope.row.id)">{{ scope.row.customerName
            }}</span>
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.id == 'labels'" :key="index" :label="item.name" width="120" :resizable="true" align="center">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.labels" :key="index" :color="item.split(':')[1]" effect="dark">{{
                item.split(":")[0]
            }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column v-else :key="item.name" :label="item.name" :prop="item.id" :resizable="false" :width="item.width"
          show-overflow-tooltip align="center">
        </el-table-column>
      </template>
      <el-table-column prop="" fixed="right" label="操作" width="250" align="center">
        <template slot-scope="scope">
          <el-button style="margin-right: 10px" @click.native.prevent="handleAction(scope.row.id)" size="mini"
            type="success" plain v-btnPermi="['marketclue_add_follow_up']">
            跟进
          </el-button>
          <el-button style="margin-right: 10px" @click.native.prevent="edit(scope.row.id)" size="mini" type="primary"
            plain v-btnPermi="['marketclue_update']">
            编辑
          </el-button>
          <!-- <el-button
            style="margin-right: 10px"
            size="mini"
            type="primary"
            plain
            v-btnPermi="['marketclue_detele']"
          >
            置顶
          </el-button> -->
          <el-popconfirm v-btnPermi="['marketclue_detele']" title="确定删除吗？" @confirm="del(scope.row.id)">
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getData" />
    <AddSaleLead v-if="open" :id="editId" ref="AddSaleLead" @reload="getData" />
    <FollowUp v-if="FollowUpopen" ref="FollowUp" @closeAdd="getData" :saleId="currentSaleId" />
  </div>
</template>

<script>
//自定义排序列表项
// const showList = [
//   { name: "客户名称", id: "customerName", disable: true, isPre: true },
//   { name: "联系人姓名", id: "contactName", disable: true, isPre: true },
//   { name: "手机号码", id: "phone", disable: false, isPre: true },
//   { name: "归属人员", id: "affiliationStaff", disable: false, isPre: true },
//   { name: "线索状态", id: "sourceStatus", disable: false, isPre: true },
//   { name: "最后跟进", id: "followUpTime", disable: false, isPre: true },
//   { name: "未跟进天数", id: "noFollowDays", disable: false, isPre: true },
// ];
import { getShowList } from "@/api/common/index";
import SetColumn from "@/components/Setcolumn/index";
import FollowUp from "../../add/followup.vue";
import AddSaleLead from "./add.vue";
import { getsalesleadlist, deleteByIds } from "@/api/saleslead/index";
export default {
  components: {
    AddSaleLead,
    FollowUp,
    SetColumn,
  },
  data() {
    return {
      tableShowList: [], //列表项
      showList: [], //默认列表项
      editId: "",
      open: false,
      FollowUpopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        topSort: 1,
      },
      // 总条数
      total: 1,
      tableData: [],
      multipleSelection: [],
      currentSaleId: "", //当前创建跟进客户ID
    };
  },
  created() {
    window.getsaleleadData = this.getData;
  },
  computed: {
    columnShow() {
      return this.showList.filter((item, index) => {
        if (item.isPre == 1) {
          return item;
        }
      });
    },
  },
  beforeMount() {
    getShowList({ type: 0 }).then((res) => {
      if (sessionStorage.getItem("saleleadsColumn")) {
        this.showList = JSON.parse(sessionStorage.getItem("saleleadsColumn"));
      } else {
        this.showList = res.data;
      }
    });
  },
  mounted() {
    this.getData(this.queryParams);
    this.$nextTick(() => {
      this.$refs.SetColumn.defaultList = this.showList;
    });
  },
  methods: {
    resetColumn() {
      getShowList({ type: 0 }).then((res) => {
        this.showList = res.data;
        sessionStorage.setItem("saleleadsColumn", JSON.stringify(res.data));
        this.$refs.SetColumn.showList = res.data;
      });
    },
    changeFollowModel(val) {
      if (val) {
        this.queryParams.followUpMode = 1;
      } else {
        this.queryParams.followUpMode = 0;
      }
      this.getData(this.queryParams);
    },
    // 获取到列表项
    getTableList(val) {
      this.showList = val;
    },
    handleAction(id) {
      this.currentSaleId = id;
      this.FollowUpopen = true;
      this.$nextTick(() => {
        this.$refs.FollowUp.open = true;
      });
    },
    getDataQuery(query) {
      this.queryParams = query;
      this.getData(query);
    },
    /**获取数据 */
    getData(query) {
      // if (query == null) {
      //   query = this.queryParams;
      // }
      if (query) {
        this.queryParams = Object.assign(this.queryParams, query);
      }
      getsalesleadlist(this.queryParams).then((res) => {
        this.tableData = res.rows;
        this.total = res.total;
      });
    },
    /**设置企业 */
    setUpRow(row) {
      this.$router.push({
        path: "/staffManager/staffdetail",
        query: {
          id: row.id,
        },
      });
    },
    del(id) {
      deleteByIds({ ids: [id] }).then((res) => {
        this.$message.success("删除成功");
        this.getData();
      });
    },
    edit(id) {
      this.editId = id;
      this.open = true;
      this.$nextTick(() => {
        this.$refs.AddSaleLead.open = true;
      });
    },
    ActionRow(type, row) { },
    /** 查询用户列表 */
    getList() {
      this.loading = true;
      let tenantId = this.tenantId
        ? this.tenantId
        : this.$store.getters.user.tenantId;
      listUser(
        this.addDateRange(this.queryParams, this.dateRange),
        tenantId
      ).then((response) => {
        this.userList = response.rows;
        this.total = response.total;
        this.loading = false;
      });
    },
    toggleSelection(rows) {
      if (rows) {
        rows.forEach((row) => {
          this.$refs.multipleTable.toggleRowSelection(row);
        });
      } else {
        this.$refs.multipleTable.clearSelection();
      }
    },
    handleSelectionChange(val) {
      this.$emit("getIds", val);
    },
    // 跳转详情页
    jumpDetial(id) {
      this.$router.push({
        path: "salesleadDetail",
        query: {
          id: id,
        },
      });
    },
  },
};
</script>
<style lang='scss' scoped>
.none {
  border: none;
}

.name {
  color: rgb(70, 166, 255);
  cursor: pointer;
}
</style>
