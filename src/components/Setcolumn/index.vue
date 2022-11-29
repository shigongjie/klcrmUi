<template>
  <div>
    <div class="btnWarp">
      <div class="follow_model" v-if="startFollowUpModel">
        <el-checkbox v-model="isFollowModel" @change="changeFollowModel"
          >跟进模式

          <el-tooltip
            class="item"
            effect="dark"
            content="当对列表客户写跟进时,会自动将刚刚写过跟进的客户排到最后。"
            placement="top-start"
          >
            <i class="el-icon-question"></i>
          </el-tooltip>
        </el-checkbox>
      </div>
      <div style="margin-right: 10px">
        <el-dropdown
          class="downMenu"
          @command="handleCommand"
          :hide-on-click="false"
        >
          <el-button icon="el-icon-sort" size="small">排序</el-button>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item
              class="down"
              v-for="(item, index) in defaultList"
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
      </div>
      <el-button icon="el-icon-date" size="small" @click="tableSort_dia = true"
        >列表</el-button
      >
    </div>
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
  </div>
</template>

<script>
import { getShowList } from "@/api/common/index";
export default {
  props: {
    //   传过来的列表项
    showLists: {
      type: Array,
      default: () => {
        return [];
      },
    },
    //是否有跟进模式
    startFollowUpModel: {
      type: Boolean,
      default: false,
    },
    // 需要缓存的列表项
    cacheColunm: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isFollowModel: false, //跟进模式
      tableSort_dia: false,
      showList: [],
      orderList: [],
      orderList: [
        //排序显示列表
      ],
      defaultList: [], //默认表单
      preOr: ["", "asc"], //默认状态
      orUP: "", //排列类型
      orDo: "asc", //排列顺序
    };
  },
  watch: {
    showLists(val) {
      this.defaultList = [];
      JSON.parse(JSON.stringify(val)).forEach((item, index) => {
        if (item.isPre == true) {
          this.defaultList.push(item);
        }
      });
    },
    tableSort_dia(val) {
      if (val) {
        /* 拷贝列表项 */
        if (this.showList.length <= 0) {
          this.showList = JSON.parse(JSON.stringify(this.$props.showLists));
        }
        this.defaultList = [];
        JSON.parse(JSON.stringify(this.$props.showLists)).forEach(
          (item, index) => {
            if (item.isPre == true) {
              this.defaultList.push(item);
            }
          }
        );
      }
    },
  },
  beforeMount() {
    // if (sessionStorage.getItem("tableShowList")) {
    //   this.showList = JSON.parse(sessionStorage.getItem("tableShowList"));
    //   this.$emit("getTableList", this.showList);
    // } else {
    this.showList = JSON.parse(JSON.stringify(this.$props.showLists));
    // }
    this.defaultList = JSON.parse(JSON.stringify(this.$props.showLists));
  },
  methods: {
    changeFollowModel() {
      if (this.startFollowUpModel) {
        this.$emit("changeFollowModel", this.isFollowModel);
      }
    },
    //排序--先按照发起时间
    handleCommand(comm) {
      if (comm == "asc") {
        this.orDo = comm;
        let data = {};
        data.field = this.orUP;
        data.order = this.orDo;
        // console.log(data);
        this.$emit("reload", data);
        return;
      }
      if (comm == "desc") {
        this.orDo = comm;
        let data = {};
        data.field = this.orUP;
        data.order = this.orDo;
        // console.log(data);
        this.$emit("reload", data);
        return;
      }
      if (comm == "reset") {
        this.orUP = this.preOr[0];
        this.orDo = this.preOr[1];
        this.$emit("reload", {});
        return;
      }
      this.orUP = comm;
      let data = {};
      data.field = this.orUP;
      data.order = this.orDo;
      this.$emit("reload", data);
    },
    //确定自定义列表
    sortChange() {
      let a = 0;
      this.showList.forEach((row) => {
        if (row.isPre) {
          a++;
        }
      });
      if (a < 5) {
        this.$message({
          message: "请至少选择五个列项进行显示",
          type: "warning",
        });
        return;
      }
      if (a > 10) {
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
          //   if (i > ) {
          this.tableShowList.push(this.showList[i]);
          //   }
        }
      }
      this.$emit("getTableList", this.showList);
      // return;
      if (this.cacheColunm) {
        sessionStorage.setItem(this.cacheColunm, JSON.stringify(this.showList));
      }

      this.tableSort_dia = false;
    },
    //重置列表显示
    reSetTable() {
      // getShowList({ type: 1 }).then((res) => {
      //   this.showList = res.data;
      // });
      this.$emit("reset");
      // this.showList = JSON.parse(JSON.stringify(this.$props.showLists));
    },
  },
};
</script>

<style lang='scss' scoped>
.btnWarp {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 10px;
  margin-top: -30px;
}
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
  padding-bottom: 0;
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
.title_font {
  width: 100%;
  height: 40px;
  margin-top: -5px;
  padding-left: 20px;
  font-size: 14px;
  background-color: #f2f2f2;
}
.dia_content {
  padding: 20px;
  max-height: 380px;
  overflow: auto;
}
::v-deep .el-input__count {
  margin-bottom: -42px;
}
.follow_model {
  display: flex;
  align-items: center;
  margin-right: 20px;
}
</style>