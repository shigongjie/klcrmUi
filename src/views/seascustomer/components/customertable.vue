/**List */
<template>
  <div>
    <SetColumn
      ref="SetColumn"
      :showLists="showList"
      :startFollowUpModel="false"
      :cacheColunm="'seacustomerColumn'"
      @getTableList="getTableList"
      @reload="getData"
      @reset="resetColumn"
    />
    <el-table
      border
      ref="multipleTable"
      :data="tableData"
      tooltip-effect="dark"
      style="width: 100%"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <!-- <el-table-column prop="name" label="客户名称" width="180">
        <template slot-scope="scope">
          <span
            style="color: #46a6ff; cursor: pointer"
            @click="jumpDetial(scope.row.id)"
            >{{ scope.row.name }}</span
          >
        </template>
      </el-table-column> -->

      <template v-for="item in columnShow">
        <el-table-column
          v-if="item.id == 'name'"
          :key="item.id"
          :label="item.name"
          :width="item.width"
          :resizable="false"
          show-overflow-tooltip
          align="center"
        >
          <template slot-scope="scope">
            <span
              style="color: #46a6ff; cursor: pointer"
              @click="jumpDetial(scope.row.id)"
              >{{ scope.row.name }}</span
            >
          </template>
        </el-table-column>

        <el-table-column
          v-else-if="item.id == 'labelIds'"
          :key="item.id"
          :label="item.name"
          width="120"
          :resizable="true"
          align="center"
        >
          <template slot-scope="scope">
            <el-tag
              v-for="(item, index) in scope.row.labelIds"
              :key="index"
              :color="item.split(':')[1]"
              effect="dark"
              >{{ item.split(":")[0] }}</el-tag
            >
          </template>
        </el-table-column>

        <el-table-column
          v-else
          :key="item.name"
          :label="item.name"
          :prop="item.id"
          :width="item.width"
          :resizable="false"
          show-overflow-tooltip
          align="center"
        >
        </el-table-column>
      </template>
      <!-- <el-table-column prop="state" label="客户状态" width="180">
      </el-table-column>

      <el-table-column prop="star" label="客户星级" width="100">
      </el-table-column>
      <el-table-column prop="contactName" label="首要联系人" width="140">
      </el-table-column>
      <el-table-column prop="contactPhone" label="手机号码" width="130">
      </el-table-column>
      <el-table-column prop="followTime" label="最后跟进">
      </el-table-column>
      <el-table-column prop="beforeUserId" label="前归属人" width="100">
      </el-table-column> -->

      <el-table-column prop="" fixed="right" label="操作" width="150" align="center">
        <template slot-scope="scope">
          <el-button
            style="margin-right: 10px"
            @click.native.prevent="edit(scope.row.id)"
            size="mini"
            type="primary"
            v-btnPermi="['ghkh_edit_customer']"
            plain
          >
            编辑
          </el-button>
          <el-popconfirm
            v-btnPermi="['ghkh_delete_customer']"
            title="确定删除吗？"
            @confirm="del(scope.row.id)"
          >
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNum"
      :limit.sync="queryParams.pageSize"
      @pagination="getData"
    />
    <Customer v-if="open" :id="editId" ref="Customer" @reload="getData" />
  </div>
</template>

<script>
//自定义排序列表项
// const showList = [
//   { name: "客户名称", id: "name", disable: true, isPre: true },
//   { name: "客户状态", id: "state", disable: true, isPre: true },
//   { name: "客户星级", id: "star", disable: false, isPre: true },
//   { name: "首要联系人", id: "contactName", disable: false, isPre: true },
//   { name: "手机号码", id: "contactPhone", disable: false, isPre: true },
//   { name: "最后跟进", id: "followTime", disable: false, isPre: true },
//   { name: "前归属人", id: "beforeUserId", disable: false, isPre: true },
// ];
import SetColumn from "@/components/Setcolumn/index";
import Dict from "@/components/dict/dict.vue";
import Customer from "../components/add.vue";
import { customerremove, getlist } from "@/api/customer/index";
import { getShowList } from "@/api/common/index";
export default {
  mixins: [Dict],
  components: {
    Customer,
    SetColumn,
  },
  data() {
    return {
      tableShowList: [], //列表项
      showList: [], //默认列表项
      editId: "",
      open: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
        status: 1,
      },
      // 总条数
      total: 1,
      tableData: [],
      multipleSelection: [],
    };
  },
  created() {
    window.getseaCurtomerData = this.getData;
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
    getShowList({ type: 1 }).then((res) => {
      if (sessionStorage.getItem("seacustomerColumn")) {
        this.showList = JSON.parse(sessionStorage.getItem("seacustomerColumn"));
      } else {
        this.showList = res.data;
      }
    });
  },
  mounted() {
    this.getData(this.queryParams);
  },
  methods: {
    resetColumn() {
      getShowList({ type: 1 }).then((res) => {
        this.showList = res.data;
        sessionStorage.setItem("seacustomerColumn", JSON.stringify(res.data));
        this.$refs.SetColumn.showList = res.data;
      });
    },
    // 获取到列表项
    getTableList(val) {
      this.showList = val;
    },
    getDataQuery(query) {
      this.queryParams = query;
      this.getData(query);
    },
    /**获取数据 */
    getData(query) {
      // if (!query) {
      //   query = this.queryParams;
      // } else {
      //   query.status = 1;
      // }
      if (query) {
        this.queryParams = Object.assign(this.queryParams, query);
      }
      getlist(this.queryParams).then((res) => {
        this.total = res.total;
        this.tableData = res.rows;
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
      customerremove({ ids: [id] }).then((res) => {
        this.getData(this.queryParams);
      });
    },
    edit(id) {
      this.editId = id;
      // this.$refs.Customer.open = true;
      this.open = true;
      this.$nextTick(() => {
        this.$refs.Customer.open = true;
      });
    },
    ActionRow(type, row) {},
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
    jumpDetial(id) {
      this.$router.push({
        path: "/customerManager/seacustomerdetail",
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
</style>
