/**List */
<template>
  <div>
    <SetColumn :showLists="showList" :startFollowUpModel="true" :cacheColunm="'customerColumn'"
      @getTableList="getTableList" @reload="getData" ref="SetColumn" @reset="resetColumn"
      @changeFollowModel="changeFollowModel" />
    <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
      @selection-change="handleSelectionChange">
      <el-table-column type="selection" width="55" align="center"> </el-table-column>
      <template v-for="(item, index) in columnShow">
        <el-table-column v-if="item.id == 'name'" :key="item.id" :label="item.name" :resizable="false" :width="item.width" show-overflow-tooltip align="center">
          <template slot-scope="scope">
            <span style="color: #46a6ff; cursor: pointer" @click="jumpDetial(scope.row.id)">{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column v-else-if="item.id == 'labelIds'" :key="index" :label="item.name" width="220"
          :resizable="true" align="center">
          <template slot-scope="scope">
            <el-tag v-for="(item, index) in scope.row.labelIds" :key="index" :color="item.split(':')[1]" effect="dark">
              {{ item.split(":")[0] }}</el-tag>
          </template>
        </el-table-column>

        <el-table-column v-else :key="item.name" :label="item.name" :prop="item.id" :resizable="false" :width="item.width"
          show-overflow-tooltip align="center">
        </el-table-column>
      </template>
      <el-table-column prop="" fixed="right" label="操作" width="220" align="center">
        <template slot-scope="scope">
          <el-button @click.native.prevent="handleAction(scope.row)" size="mini"
            type="success" v-btnPermi="['kh_new_follow_up']" plain>
            跟进
          </el-button>
          <el-button style="margin-right: 10px" @click.native.prevent="edit(scope.row.id)" size="mini" type="primary"
            v-btnPermi="['kh_edit_customer']" plain>
            编辑
          </el-button>
          <el-popconfirm v-btnPermi="['kh_delete_customer']" title="确定删除吗？" @confirm="del(scope.row.id)">
            <el-button slot="reference" size="mini" type="danger" plain>
              删除
            </el-button>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize"
      @pagination="getData" />
    <Customer v-if="open" :id="editId" ref="Customer" @reload="getData" />
    <FollowUp v-if="FollowUpopen" ref="FollowUp" @reload="getData" :contactIds="currentcontactId"
      :customerId="currentCustomerId" />
  </div>
</template>

<script>
import SetColumn from "@/components/Setcolumn/index";
import FollowUp from "../../add/followup.vue";
import Customer from "../../add/customer.vue";
import {
  getlist,
  customerremove,
  customerHighscreen,
} from "@/api/customer/index";
import { getShowList } from "@/api/common/index";
export default {
  components: {
    Customer,
    FollowUp,
    SetColumn,
  },
  data() {
    return {
      tableShowList: [],
      showList: [],
      editId: "",
      open: false,
      FollowUpopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        nickName: undefined,
        phonenumber: undefined,
        status: undefined,
        tag: 0,
      },
      type: 0,
      // 总条数
      total: 1,
      tableData: [],
      multipleSelection: [],
      currentCustomerId: "",
      currentcontactId: "",
    };
  },
  created() {
    window.getCustomerData = this.getData;
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
      if (sessionStorage.getItem("customerColumn")) {
        this.showList = JSON.parse(sessionStorage.getItem("customerColumn"));
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
        sessionStorage.setItem("customerColumn", JSON.stringify(res.data));
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
    handleAction(row) {
      this.currentcontactId = row.contactId;
      this.currentCustomerId = row.id;
      this.FollowUpopen = true;
      this.$nextTick(() => {
        this.$refs.FollowUp.open = true;
      });
    },
    getHighSearchData(params, type) {
      this.queryParams = params;
      this.type = type;
      this.getData(params, type);
    },
    /**获取数据 */
    getData(query) {
      console.log(query);
      if (query) {
        this.queryParams = Object.assign(this.queryParams, query);
      }
      if (this.type == 2) {
        customerHighscreen(this.queryParams).then((res) => {
          this.total = res.total;
          this.tableData = res.rows;
        });
        return;
      } else {
        getlist(this.queryParams).then((res) => {
          this.tableData = res.rows;
          this.total = res.total;
        });
      }
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
    // -
    jumpDetial(id) {
      this.$router.push({
        path: "/customerManager/customerdetail",
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

.follow_model {
  display: flex;
  justify-content: flex-end;
}
</style>
