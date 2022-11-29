<template>
  <div>
    <el-dialog :visible.sync="tableSort_dia" width="40%" title="快捷搜索配置">
      <div solt="title">
        <div class="title_font">
          <div class="titleTip">
            快捷搜索配置不得少于5项，最多支持自定义10个列项，灰色选中列不支持隐藏和排序
          </div>
        </div>
      </div>
      <div class="dia_content">
        <el-table
          :data="showList"
          stripe
          border
          style="width: 100%"
          max-height="400px"
        >
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
          <el-table-column :resizable="false" prop="name" label="搜索列表">
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <!-- <div>
          <el-button @click="reSetTable" type="text">恢复默认</el-button>
        </div> -->
        <div>
          <el-button @click="tableSort_dia = false">取 消</el-button>
          <el-button type="primary" @click="sortChange">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tableSort_dia: false,
      showList: [
        { name: "关键词", isPre: true, disable: false, filed: "name" },
        // { name: "线索分类", isPre: true, disable: false, filed: "topSort" },
        { name: "线索标签", isPre: true, disable: false, filed: "clueLabel" },
        // { name: "线索分配", isPre: true, disable: false, filed: "name" },
        // { name: "跟进状态", isPre: true, disable: false, filed: "name" },
        { name: "所属行业", isPre: true, disable: false, filed: "industry" },
        { name: "角色", isPre: true, disable: false, filed: "role" },
        { name: "尊称", isPre: true, disable: false, filed: "sex" },
        { name: "线索来源", isPre: false, disable: false, filed: "source" },
        {
          name: "线索状态",
          isPre: false,
          disable: false,
          filed: "sourceStatus",
        },
        {
          name: "归属人员",
          isPre: false,
          disable: false,
          filed: "affiliationStaff",
        },
        {
          name: "所属部门",
          isPre: false,
          disable: false,
          filed: "affiliationDept",
        },
        // { name: "下次跟进", isPre: false, disable: false, filed: "nextMoreIntoStart" },
        // { name: "最后联系人", isPre: false, disable: false, filed: "name" },
        // { name: "最后跟进时间", isPre: false, disable: false, filed: "name" },
        { name: "创建人员", isPre: false, disable: false, filed: "createBy" },
        { name: "跟进时间", isPre: false, disable: false, filed: "time" },
        { name: "创建时间", isPre: false, disable: false, filed: "time2" },
        { name: "分配时间", isPre: false, disable: false, filed: "time3" },
      ],
    };
  },
  methods: {
    reSetTable() {},
    sortChange() {
      let Arr = this.showList.filter((item) => {
        return item.isPre == true;
      });
      if (Arr.length < 5) {
        this.$message.error("最少选择5个搜索项");
        return;
      }
      if (Arr.length > 10) {
        this.$message.error("最多选择10个搜索项");
        return;
      }
      this.$emit("getQuickSearchSet", Arr);
      this.tableSort_dia = false;
    },
  },
};
</script>

<style>
</style>