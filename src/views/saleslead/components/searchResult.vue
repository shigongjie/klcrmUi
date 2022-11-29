/**List */
<template>
  <div style="padding: 20px">
    <el-button plain icon="el-icon-switch-button" size="mini" @click="handleStaffAction('1')">移入公海</el-button>
    <div style="margin-top: 20px">
      <el-table border="" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
        empty-text="请检索后展示数据" @select-all="seleceAll" @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <template v-for="(item, index) in columnShow">
          <el-table-column v-if="item.id == 'distance' && $route.query.type == 'map'" :key="index"
            :label="item.name" width="120" :resizable="true" align="center">
            <template slot-scope="scope">
              {{ scope.row.distance }}km
            </template>
          </el-table-column>
          <el-table-column v-else :key="item.name" :label="item.name" :prop="item.id" :width="item.width" :resizable="false"
            show-overflow-tooltip align="center">
          </el-table-column>
        </template>
      </el-table>
      <pagination v-if="$route.query.type == 'map'" v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize" @pagination="changePage" />
      <pagination v-else v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize" @pagination="getData" />
      <el-dialog :close-on-click-modal="false" :title="'移入公海'" :visible.sync="open" width="600px">
        <el-form class="selfForm" ref="rulesForm" :model="submitParams" label-width="100px" size="small">
          <el-form-item label="备注信息">
            <el-input type="textarea" v-model="submitParams.remark" placeholder="请输入备注信息" :rows="6"></el-input>
          </el-form-item>
          <el-form-item label="">
            *
            转移到公海后此客户数据将属于公共资源，原归属人员不能再维护跟进和更新此客户数据。
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="open = false">取 消</el-button>
          <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
//自定义排序列表项
import { getShowList } from "@/api/common/index";
import FollowUp from "../../add/followup.vue";
import AddSaleLead from "./add.vue";
import PublicHighSearch from "./publicHighSearch.vue";
import { getsalesleadlist, deleteByIds, searchByMap } from "@/api/saleslead/index";
import { commonCluelist, copyMarketClue } from "@/api/publicSaleds/index";

export default {
  components: {
    AddSaleLead,
    FollowUp,
    PublicHighSearch,
  },
  data() {
    return {
      loading: false,
      areaList: [],
      choosedIds: [],
      provinceList: [],
      regionList: [],
      cityList: [],
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      tableShowList: [], //列表项
      showList: [
        { name: "线索编号", id: "id", disable: true, isPre: true, width: 120 },
        { name: "企业名称", id: "companyName", disable: true, isPre: true },
        { name: "统一社会信用代码", id: "socialCode", disable: false, isPre: true, width: 220 },
        { name: "企业经营状态", id: "manageType", disable: false, isPre: true, width: 150 },
        { name: "法定代表人", id: "legalPerson", disable: false, isPre: true, width: 180 },
        { name: "企业电话", id: "companyPhone", disable: false, isPre: true, width: 180 },
        { name: "企业固话", id: "companyTel", disable: false, isPre: true, width: 180 },
        { name: "企业邮箱", id: "email", disable: false, isPre: true, width: 180 },
        { name: "成立日期", id: "onTime", disable: false, isPre: true, width: 150 },
        { name: "距离", id: "distance", disable: false, isPre: this.$route.query.type == 'map' ? true : false, width: 120 },
      ], //默认列表项
      editId: "",
      open: false,
      industryList: [],
      submitParams: {
        remark: ''
      },
      FollowUpopen: false,
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 10,
        region_code: "",
        city_code: '',
        province_code: ''
      },
      // 总条数
      total: 0,
      currentPage: 1,
      AllData: [],
      tableData: [],
      multipleSelection: [],
      currentSaleId: "", //当前创建跟进客户ID
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.submitParams.remark = ""
      }
    }
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

  },
  mounted() {
    // this.getData(this.queryParams);
    if (this.$route.query.type == 'map') {
      searchByMap(JSON.parse(this.$route.query.parmter)).then(res => {
        this.AllData = res.data;
        this.total = Math.ceil(this.AllData.length)
        this.setCurrentPageData()
      })
    }
    if (this.$route.query.type == 'highSearch') {
      this.getData(JSON.parse(this.$route.query.parmter));
    }
  },
  methods: {
    changePage(val) {
      let begin = (val.pageNum - 1) * this.queryParams.pageSize;
      let end = val.pageNum * this.queryParams.pageSize;
      this.tableData = this.AllData.slice(
        begin,
        end
      );
      this.$nextTick(() => {
        this.tableData.forEach(row => {
          if (this.choosedIds.indexOf(row.id) >= 0) {
            this.$refs.multipleTable.toggleRowSelection(row, true);
          }
        })
      })
    },
    setCurrentPageData() {
      let begin = (this.currentPage - 1) * this.queryParams.pageSize;
      let end = this.currentPage * this.queryParams.pageSize;
      this.tableData = this.AllData.slice(
        begin,
        end
      );
    },
    submit() {
      this.loading = true;
      copyMarketClue({
        ids: this.choosedIds,
        remark: this.submitParams.remark,
      }).then((res) => {
        if (res.success) {
          this.loading = false;
          this.open = false;
          this.$message.success("移入成功");
          this.choosedIds = [];
          this.$refs.multipleTable.clearSelection();
        } else {
          this.$message.error(res.message);
        }
      });
    },
    handleStaffAction() {
      if (this.choosedIds.length <= 0) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      this.open = true;
    },
    handleHighQuery() { },
    handleQuery() {
      this.queryParams = Object.assign(this.queryParams, this.$refs.PublicHighSearch.form)
      this.getData(this.queryParams);

    },
    reset() {
      this.queryParams = {
        pageNum: 1,
        pageSize: 10,
        region_code: "",
        city_code: '',
        province_code: ''
      };
      // this.getData(this.queryParams);
    },
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
      commonCluelist(this.queryParams).then((res) => {
        this.tableData = res.data.records;
        this.total = res.data.total;
        this.$nextTick(() => {
          this.tableData.forEach(row => {
            if (this.choosedIds.indexOf(row.id) >= 0) {
              this.$refs.multipleTable.toggleRowSelection(row, true);
            }
          })
        })
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
    seleceAll(val) {
      console.log(val)
    },
    handleSelectionChange(val) {
      val.forEach((item) => {
        if (this.choosedIds.indexOf(item.id) == -1) {
          this.choosedIds.push(item.id);
        }
      });
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
