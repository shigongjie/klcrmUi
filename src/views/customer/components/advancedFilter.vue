<template>
  <div class="container">
    <div class="titles"><i class="el-icon-s-flag"></i> 高级筛选</div>
    <div class="content">
      <div class="checkboxWarp" v-if="filterSetFiled('tag')">
        <div class="checkboxlable">客户分类：</div>
        <el-radio-group
          border
          @change="changeItem(customerSort, 'tag')"
          v-model="form.tag"
          size="mini"
        >
          <el-radio-button
            size="mini"
            v-for="(item, index) in customerSort"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="checkboxWarp" v-if="filterSetFiled('type')">
        <div class="checkboxlable">客户类型：</div>
        <el-radio-group
          @change="changeItem(customerTypeList, 'type')"
          v-model="form.type"
          size="mini"
        >
          <el-radio-button
            size="mini"
            v-for="(item, index) in customerTypeList"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="checkboxWarp" v-if="filterSetFiled('state')">
        <div class="checkboxlable">客户状态：</div>
        <el-radio-group
          @change="changeItem(customerStateList, 'state')"
          v-model="form.state"
          size="mini"
        >
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button
            size="mini"
            v-for="(item, index) in customerStateList"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="checkboxWarp" v-if="filterSetFiled('star')">
        <div class="checkboxlable">客户星级：</div>
        <el-radio-group
          @change="changeItem(customerStarList, 'star')"
          v-model="form.star"
          size="mini"
        >
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button
            size="mini"
            v-for="(item, index) in customerStarList"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>
      <div class="checkboxWarp" v-if="filterSetFiled('nextFollowTime')">
        <div class="checkboxlable">下次跟进时间：</div>
        <el-radio-group
          @change="changeItem(nextFollowTime, 'nextFollowTime')"
          v-model="form.nextFollowTime"
          size="mini"
        >
          <el-radio-button
            size="mini"
            v-for="(item, index) in nextFollowTime"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('initial')">
        <div class="checkboxlable">首字母筛选：</div>
        <el-radio-group
          @change="changeItem(initialList, 'initial')"
          v-model="form.initial"
          size="mini"
        >
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button
            size="mini"
            v-for="(item, index) in initialList"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('industry')">
        <div class="checkboxlable">所属行业：</div>
        <el-radio-group
          @change="changeItem(industryList, 'industry')"
          v-model="form.industry"
          size="mini"
        >
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button
            size="mini"
            v-for="(item, index) in industryList"
            :key="index"
            :label="item.dictValue"
            >{{ item.dictLabel }}</el-radio-button
          >
        </el-radio-group>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('userId')">
        <div class="checkboxlable">归属人员：</div>
        <el-cascader
          size="mini"
          @change="changetreeItem(userList, 'userId')"
          placeholder="归属人员"
          v-model="form.userId"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </div>

       <div class="checkboxWarp" v-if="filterSetFiled('createId')">
        <div class="checkboxlable">创建人员：</div>
        <el-cascader
          size="mini"
          @change="changetreeItem(userList, 'createId')"
          placeholder="创建人员"
          v-model="form.createId"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </div>

       <div class="checkboxWarp" v-if="filterSetFiled('beforeUserId')">
        <div class="checkboxlable">前归属人：</div>
        <el-cascader
          size="mini"
          @change="changetreeItem(userList, 'beforeUserId')"
          placeholder="前归属人"
          v-model="form.beforeUserId"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('deptId')">
        <div class="checkboxlable">所属部门：</div>
        <el-cascader
          size="mini"
          @change="changetreeItem(dettListTree, 'deptId')"
          placeholder="所属部门"
          v-model="form.deptId"
          :options="dettListTree"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('beforeDeptId')">
        <div class="checkboxlable">前所属部门：</div>
        <el-cascader
          size="mini"
          @change="changetreeItem(dettListTree, 'beforeDeptId')"
          placeholder="前所属部门"
          v-model="form.beforeDeptId"
          :options="dettListTree"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('source')">
        <div class="checkboxlable">客户来源：</div>
        <el-select
          size="mini"
          @change="changeItem(customerSourceList, 'source')"
          v-model="form.source"
          placeholder="客户来源"
        >
          <el-option
            v-for="(item, index) in customerSourceList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('scale')">
        <div class="checkboxlable">人员规模：</div>
        <el-select
          size="mini"
          @change="changeItem(customerScaleList, 'scale')"
          v-model="form.scale"
          placeholder="人员规模"
        >
          <el-option
            v-for="(item, index) in customerScaleList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </div>
      <div class="checkboxWarp" v-if="filterSetFiled('address')">
        <div class="checkboxlable">所在地区：</div>
        <el-cascader
          @change="changeAreaItem(areaList, 'address')"
          v-model="form.address"
          :options="areaList"
          :props="areaListprops"
          clearable
          size="mini"
        ></el-cascader>
      </div>

      <div class="checkboxWarp" v-if="filterSetFiled('followTime')">
        <div class="checkboxlable">最后跟进时间：</div>
        <el-date-picker
          size="small"
          v-model="time"
          type="daterange"
          value-format="yyyy-MM-dd"
          range-separator="至"
          start-placeholder="跟进开始日期"
          end-placeholder="跟进结束日期"
        >
        </el-date-picker>
      </div>

      <div class="checkboxWarp" v-if="saveSortList.length > 0">
        <div class="checkboxlable">已选条件：</div>
        <el-tag
          v-for="(item, index) in saveSortList"
          :key="index"
          closable
          style="margin-right: 8px"
          :type="index + ''"
          @close="handleClosetag(item, index)"
        >
          {{ item.dictLabel }}
        </el-tag>
        <el-tag
          @click="saveAsQuickSearch"
          type="plain"
          style="cursor: pointer; margin-right: 8px"
        >
          保存为快速搜索
        </el-tag>
        <el-tag @click="resetQuickSearch" type="plain" style="cursor: pointer">
          清空所有搜索条件
        </el-tag>
      </div>
      <div class="setfieldName">
        <el-button size="mini" @click="handlequicklySearch">快速搜索</el-button>
        <el-button size="mini" @click="setFileName">设置字段</el-button>
      </div>
    </div>
    <!-- 保存快速搜索弹窗 -->
    <el-dialog :visible.sync="saveAsQuickSearchOpen" width="40%">
      <div solt="titles">
        <div class="title_font">
          <b>新建快速搜索</b>
        </div>
      </div>
      <div class="dia_content">
        <div class="demo-input-suffix">
          <div style="width: 90px">新建名称：</div>
          <el-input placeholder="请输入内容" v-model="quicklySearchName">
          </el-input>
        </div>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <div>
          <el-button @click="saveAsQuickSearchOpen = false">取 消</el-button>
          <el-button type="primary" @click="saveQuicklySure">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 快速搜索 -->
    <el-dialog :visible.sync="quicklySearchListShow" width="40%">
      <div solt="titles">
        <div class="title_font">
          <b>快速搜索列表</b>
          <div class="titleTip">点击名称切换快速搜索</div>
        </div>
      </div>
      <div class="dia_content">
        <el-table :data="quicklySearchList" stripe border style="width: 100%">
          <el-table-column :resizable="false" prop="name" label="快速搜索名称">
            <template slot-scope="scope">
              <span
                @click="searchByfastList(scope.row)"
                style="color: #46a6ff"
                >{{ scope.row.name }}</span
              >
            </template>
          </el-table-column>
          <el-table-column
            label="操作"
            :resizable="false"
            align="center"
            width="200"
          >
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit"
                >编辑</el-button
              > -->
              <el-button
                @click.native="delquick(scope.row)"
                size="mini"
                type="text"
                icon="el-icon-delete"
                >删除</el-button
              >
              <el-button
                @click.native="setTop(scope.row)"
                size="mini"
                type="text"
                icon="el-icon-upload2"
                v-if="scope.row.isTop == 0"
                >置顶</el-button
              >
              <el-button
                @click.native="setTop(scope.row)"
                size="mini"
                type="text"
                v-else
                icon="el-icon-download"
                >取消置顶</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <div>
          <el-button @click="setFileNameDio = false">取 消</el-button>
          <el-button type="primary" @click="sortChange">确 定</el-button>
        </div>
      </div>
    </el-dialog>
    <!-- 设置字段 -->
    <el-dialog :visible.sync="setFileNameDio" width="40%">
      <div solt="titles">
        <div class="title_font">
          <b>设置筛选字段</b>
          <div class="titleTip">筛选字段不得少于5项，最多支持7个筛选字段</div>
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
          <el-button @click="setFileNameDio = false">取 消</el-button>
          <el-button type="primary" @click="sortChange">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import Dict from "@/components/dict/dict.vue";
import {
  getstaffList,
  getHighSearchshowList,
  fastsearchlist,
  fastsearchsave,
  fastsearchremove,
  SetSearchtop,
} from "@/api/customer/index";
import { getDeptTree } from "@/api/workOrder/index";
export default {
  mixins: [Dict],
  data() {
    return {
      time: "", //最后跟进时间
      quicklySearchListShow: false,
      quicklySearchList: [],
      quicklySearchName: "",
      saveAsQuickSearchOpen: false,
      form: {},
      list: [],
      showList: [],
      //   客户分类
      customerSort: [
        { dictValue: null, dictLabel: "全部" },
        { dictValue: "0", dictLabel: "我的客户" },
        { dictValue: "1", dictLabel: "下属客户" },
        { dictValue: "2", dictLabel: "重点客户" },
        { dictValue: "3", dictLabel: "我协作的" },
        { dictValue: "4", dictLabel: "下属协作的" },
        { dictValue: "5", dictLabel: "今日新增" },
        { dictValue: "6", dictLabel: "公海客户" },
      ],
      //   客户类型
      customerTypeList: [
        { dictValue: null, dictLabel: "全部" },
        { dictValue: "0", dictLabel: "企业客户" },
        { dictValue: "1", dictLabel: "个人客户" },
      ],
      //
      initialList: [],
      // 下次跟进时间
      nextFollowTime: [
        { dictValue: null, dictLabel: "全部" },
        { dictValue: "0", dictLabel: "今天" },
        { dictValue: "1", dictLabel: "明天" },
        { dictValue: "2", dictLabel: "本周" },
        { dictValue: "3", dictLabel: "下周" },
        { dictValue: "4", dictLabel: "本月" },
        { dictValue: "5", dictLabel: "下月" },
        { dictValue: "6", dictLabel: "无" },
        // { dictValue: "7", dictLabel: "自定义时间段" },
      ],
      setFileNameDio: false,
      saveSortList: [],
      dettListTree: [],
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
    };
  },
  watch: {
    form: {
      immediate: true,
      deep: true,
      handler(obj) {
        // this.saveSortList = obj;
      },
    },
    time(val) {
      this.changeTime(val);
    },
  },
  beforeMount() {
    getDeptTree().then((res) => {
      this.dettListTree = res.data;
    });
    getHighSearchshowList({ type: 3 }).then((res) => {
      if (sessionStorage.getItem("showList")) {
        this.showList = JSON.parse(sessionStorage.getItem("showList"));
      } else {
        this.showList = res.data;
      }
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  mounted() {
    this.code();
  },
  methods: {
    delquick(row) {
      this.$confirm("此操作将永久删除该条件, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          fastsearchremove({ id: row.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            fastsearchlist().then((ress) => {
              this.quicklySearchList = ress.data;
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    setTop(row) {
      SetSearchtop({ id: row.id }).then((RES) => {
        fastsearchlist().then((ress) => {
          this.quicklySearchList = ress.data;
        });
      });
    },
    filterSetFiled(items) {
      let falg = false;
      this.showList.forEach((item, index) => {
        if (item.id == items) {
          falg = item.isPre;
        }
      });
      return falg;
    },
    reSetTable() {},
    sortChange() {
      let a = 0;
      this.showList.forEach((row) => {
        if (row.isPre) {
          a++;
        }
      });
      if (a < 5) {
        this.$message({
          message: "请至少选择5个筛选字段",
          type: "warning",
        });
        return;
      }
      if (a > 7) {
        this.$message({
          message: "最多只能选择7个筛选字段",
          type: "warning",
        });
        return;
      }
      sessionStorage.setItem("showList", JSON.stringify(this.showList));
      this.setFileNameDio = false;
    },
    setFileName() {
      this.setFileNameDio = true;
    },
    checkedHandle(obj) {
      for (let key in obj) {
        switch (key) {
          case "customerClassify":
            this.customerSort.forEach((item, index) => {
              if (item.id == obj[key]) {
                this.saveSortList.push({ item });
              }
            });
        }
      }
    },
    searchByfastList(row) {
      this.saveSortList = row.list;
      row.list.forEach((o, i) => {
        this.form[o.id] = o.dictValue;
      });
      this.$parent.handleQueryHighSearch();
      this.quicklySearchListShow = false;
    },
    removeDuplicate(arr) {
      const newArr = [];
      arr.forEach((item) => {
        if (newArr.indexOf(item) === -1) {
          newArr.push(item);
        }
      });
      return newArr; // 返回一个新数组
    },
    //
    changeItem(ob, key) {
      ob.forEach((item, index) => {
        if (item.dictValue) {
          if (item.dictValue == this.form[key]) {
            let falg = this.saveSortList.find((ev) => {
              return ev.id == key;
            });
            if (falg) {
              this.saveSortList.forEach((o, i) => {
                if (o.id == key) {
                  o.dictLabel = item.dictLabel;
                  o.dictValue = item.dictValue;
                }
              });
            } else {
              this.saveSortList.push({
                id: key,
                dictValue: item.dictValue,
                dictLabel: item.dictLabel,
              });
            }
          }
        }
      });
    },
    changeAreaItem() {
      console.log(this.form.address);
      if (this.form.address!=null&&this.form.address!=undefined&&this.form.address!=[]) {
        this.form.address = this.form.address.toString();
        console.log(this.form.address.toString())
      }
    },
    changetreeItem(list, key) {
      let obj = this.getParent(list, this.form[key]);
      console.log(obj);
      if (obj) {
        let falg = this.saveSortList.find((ev) => {
          return ev.id == key;
        });
        if (falg) {
          this.saveSortList.forEach((o, i) => {
            if (o.id == key) {
              o.dictLabel = obj.name;
              o.dictValue = obj.id;
            }
          });
        } else {
          this.saveSortList.push({
            id: key,
            dictValue: obj.id,
            dictLabel: obj.name,
          });
        }
      }
    },
    changeTime(val) {
      if (val) {
        this.form.followStartTime = val[0] + " " + "00:00:00";
        this.form.followEndTime = val[1] + " " + "23:59:59";
      } else {
        this.form.followStartTime = "";
        this.form.followEndTime = "";
        return;
      }
      let falg = this.saveSortList.find((ev) => {
        return ev.id == "followStartTime";
      });
      let falgNext = this.saveSortList.find((ev) => {
        return ev.id == "followEndTime";
      });
      if (falg) {
        this.saveSortList.forEach((o, i) => {
          if (o.id == "followStartTime") {
            o.dictLabel = "开始跟进时间";
            o.dictValue = val[0] + " " + "00:00:00";
          }
        });
      } else {
        this.saveSortList.push({
          id: "followStartTime",
          dictValue: val[0] + " " + "00:00:00",
          dictLabel: "开始跟进时间",
        });
      }
      if (falgNext) {
        this.saveSortList.forEach((o, i) => {
          if (o.id == "followEndTime") {
            o.dictLabel = "结束跟进时间";
            o.dictValue = val[1] + " " + "23:59:59";
          }
        });
      } else {
        this.saveSortList.push({
          id: "followEndTime",
          dictValue: val + " " + "23:59:59",
          dictLabel: "结束跟进时间",
        });
      }
    },
    //
    // 保存为快速搜索
    saveAsQuickSearch() {
      this.saveAsQuickSearchOpen = true;
    },
    saveQuicklySure() {
      let data = {};
      data.name = this.quicklySearchName;
      data.list = this.saveSortList;
      fastsearchsave(data).then((res) => {
        if (res.success) {
          this.$message.success("保存成功");
          this.saveAsQuickSearchOpen = false;
        }
      });
    },
    resetQuickSearch() {
      this.form = {};
      this.saveSortList = [];
    },
    handleClosetag(ob, index) {
      this.saveSortList.splice(this.saveSortList.indexOf(ob), 1);
    },
    handlequicklySearch() {
      fastsearchlist().then((res) => {
        this.quicklySearchListShow = true;
        this.quicklySearchList = res.data;
      });
    },
    code() {
      for (var i = 0; i < 25; i++) {
        this.initialList.push({
          dictValue: String.fromCharCode(65 + i),
          dictLabel: String.fromCharCode(65 + i),
        });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.titles {
  padding: 15px 20px;
  border-bottom: 1px solid #ccc;
  position: relative;
}
.setfieldName {
  position: absolute;
  right: 10px;
  top: 10px;
}
.content {
  padding: 20px;
}

::v-deep .el-radio-group {
  .el-checkbox ::after {
    border: none !important;
    transition: none !important;
  }
  .el-radio-button {
    outline: none;
  }
  .el-radio-button:first-child .el-radio-button__inner {
    border-radius: 0;
  }
  .el-radio-button__inner {
    border: 1px solid #ffffff;
  }
  .el-radio-button {
    // border: 1px solid #DCDFE6;
    margin-right: 5px;
  }
  .is-active {
    color: none;
    border: none;
  }
  .is-focus {
    border: none !important;
    color: none;
  }
  .el-radio-button__orig-radio:checked + .el-radio-button__inner {
    box-shadow: none;
    background-color: #f3f9ff;
    color: #1890ff;
    border: 1px solid #f3f9ff;
  }
}
.checkboxWarp {
  font-size: 12px;
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  .checkboxlable {
    padding-top: 6px;
    color: #606266;
    flex-shrink: 0;
    width: 90px;
  }
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
.demo-input-suffix {
  display: flex;
  align-items: center;
}
</style>
