/**List */
<template>
  <div style="padding: 20px">

    <div style="display: flex;margin-bottom: 20px;">
      <div style="flex:1">
        <PublicHighSearch @getVal="getVal" ref="PublicHighSearch" />
      </div>
    </div>
    <Earth v-if="dialog" />

  </div>
</template>

<script>
//自定义排序列表项
const showList = [
  { name: "线索编号", id: "id", disable: true, isPre: true },
  { name: "企业名称", id: "companyName", disable: true, isPre: true },
  { name: "统一社会信用代码", id: "socialCode", disable: false, isPre: true },
  { name: "企业经营状态", id: "manageType", disable: false, isPre: true },
  { name: "法定代表人", id: "legalPerson", disable: false, isPre: true },
  { name: "企业电话", id: "companyPhone", disable: false, isPre: true },
  { name: "企业固话", id: "companyTel", disable: false, isPre: true },
  { name: "企业邮箱", id: "email", disable: false, isPre: true },
  { name: "成立日期", id: "onTime", disable: false, isPre: true },
  //  { name: "距离", id: "onTime", disable: false, isPre: true },
];
import { getShowList } from "@/api/common/index";
import FollowUp from "../../add/followup.vue";
import AddSaleLead from "./add.vue";
import PublicHighSearch from "./publicHighSearch.vue";
import Earth from "../../components/icons/earth.vue"
// import { getareaList } from "@/api/customer/index";
import { getsalesleadlist, deleteByIds } from "@/api/saleslead/index";
import { commonCluelist, copyMarketClue } from "@/api/publicSaleds/index";
import { getprovinceList, getcityList, getregionList } from "@/api/city/index"
import {
  getIndustryList,
} from "@/api/publicSaleds/index";

export default {
  // dicts: ["industry"],
  components: {
    AddSaleLead,
    FollowUp,
    PublicHighSearch,
    Earth
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
      showList: showList, //默认列表项
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
      tableData: [],
      multipleSelection: [],
      currentSaleId: "", //当前创建跟进客户ID
      dialog: true,
    };
  },
  watch: {
    open(val) {
      if (val) {
        this.submitParams.remark = ""
      }
    },
    '$refs.PublicHighSearch.highSearchdialog'(val) {
      console.log(val)
    }
  },
  created() {
    window.getsaleleadData = this.getData;
  },
  computed: {
    searchType() {
      this.$nextTick(() => {
        return !this.$refs.PublicHighSearch.highSearchdialog
      })
    },
    columnShow() {
      return this.showList.filter((item, index) => {
        if (item.isPre == 1) {
          return item;
        }
      });
    },
  },
  beforeMount() {
    getprovinceList().then(res => {
      this.provinceList = res.data
    })
    getIndustryList().then((res) => {
      this.industryList = res.data;
    });
  },
  mounted() {
    // this.getData(this.queryParams);
  },
  methods: {
    getVal(val) {
      this.dialog = val
      console.log(this.val, 9999)
    },
    changeProvince(val) {
      console.log(val)
      this.queryParams.city_code = "";
      this.queryParams.region_code = "";
      getcityList({ provinceCode: val }).then(res => {
        this.cityList = res.data
      })
    },
    changeRegion() { },
    changeCity(val) {
      console.log(val)
      this.queryParams.region_code = "";
      getregionList({ cityCode: val }).then(res => {
        this.regionList = res.data
      })
    },
    submit() {
      this.loading = true;
      copyMarketClue({
        ids: this.choosedIds,
        remark: this.submitParams.remark,
      }).then((res) => {
        console.log(res);
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
      console.log(this.$refs.PublicHighSearch.form)
      this.queryParams = Object.assign(this.queryParams, this.$refs.PublicHighSearch.form)
      // if (
      //   this.queryParams.industry == "" ||
      //   this.queryParams.industry == null ||
      //   this.queryParams.industry == undefined
      // ) {
      //   this.$message.error("请选择所属行业");
      //   return;
      // }
      // checkSearching(this.queryParams).then((res) => {
      this.getData(this.queryParams);
      // });
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
    handleSelectionChange(val) {
      // this.choosedIds = [];
      val.forEach((item) => {

        if (this.choosedIds.indexOf(item.id) == -1) {
          this.choosedIds.push(item.id);
        }
      });
      console.log(this.choosedIds)
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
