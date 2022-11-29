<template>
  <div class="container">
    <div class="">
      <el-button icon="el-icon-search" size="mini" @click="highSearchdialog = !highSearchdialog">高级筛选</el-button>
    </div>
    <div class="content" v-if="highSearchdialog">
      <div class="selectBox">
        <div class="checkboxlable">省市区:</div>
        <el-select size="small" style="width: 200px;" @change="changeProvince" v-model="form.province_code"
          placeholder="选择省">
          <el-option v-for="dict in provinceList" :key="dict.id" :label="dict.name" :value="dict.id"></el-option>
        </el-select>
        <el-select size="small" style="width: 200px;margin-left: 10px;" @change="changeCity" v-model="form.city_code"
          placeholder="选择市">
          <el-option v-for="dict in cityList" :key="dict.id" :label="dict.name" :value="dict.id"></el-option>
        </el-select>
        <el-select size="small" style="width: 200px;margin-left: 10px;" @change="changeRegion"
          v-model="form.region_code" placeholder="选择区">
          <el-option v-for="dict in regionList" :key="dict.id" :label="dict.name" :value="dict.id"></el-option>
        </el-select>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable"><span style="color:red">*</span> 行业：</div>
        <el-cascader @change="changeIndustry" style="width: 200px" placeholder="所属行业" v-model="form.industry"
          :options="industryLists" :props="areaListprops" size="small" clearable></el-cascader>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">企业经营状态：</div>
        <el-radio-group border @change="changeItem(dict.type.company_manage_status, 'manage_type')"
          v-model="form.manage_type" size="mini">
          <el-radio-button size="mini" v-for="dict in dict.type.company_manage_status" :key="dict.dictCode"
            :label="dict.label" :value="dict.label"></el-radio-button>
        </el-radio-group>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">企业电话：</div>
        <el-radio-group @change="changeItem(phoneList, 'phone')" v-model="form.phone" size="mini">
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button size="mini" label="1">有</el-radio-button>
          <el-radio-button size="mini" label="0">无</el-radio-button>
        </el-radio-group>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">企业固话：</div>
        <el-radio-group @change="changeItem(telList, 'tel')" v-model="form.tel" size="mini">
          <el-radio-button size="mini" :label="null">全部</el-radio-button>
          <el-radio-button size="mini" label="1">有</el-radio-button>
          <el-radio-button size="mini" label="0">无</el-radio-button>
        </el-radio-group>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">成立日期：</div>
        <el-date-picker size="mini" v-model="time" type="daterange" value-format="yyyy-MM-dd" range-separator="至"
          start-placeholder="企业成立开始日期" end-placeholder="企业成立结束日期">
        </el-date-picker>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">注册资金：</div>
        <el-radio-group @change="changeItem(dict.type.company_cash, 'register_money')" v-model="form.register_money"
          size="mini">
          <el-radio-button size="mini" v-for="dict in dict.type.company_cash" :key="dict.value" :label="dict.value"
            :value="dict.value">{{ dict.label }}</el-radio-button>
        </el-radio-group>
      </div>
      <div class="checkboxWarp">
        <div class="checkboxlable">企业类型：</div>
        <el-radio-group @change="changeItem(dict.type.saled_company_type, 'company_type')" v-model="form.company_type"
          size="mini">
          <el-radio-button size="mini" v-for="dict in dict.type.saled_company_type" :key="dict.dictCode"
            :label="dict.label" :value="dict.label"></el-radio-button>
        </el-radio-group>
      </div>


      <div class="checkboxWarp">
        <div class="checkboxlable">已选条件：</div>
        <el-tag v-for="(item, index) in saveSortList" :key="index" closable style="margin-right: 8px" :type="index + ''"
          @close="handleClosetag(item, index)">
          {{ item.label }}
        </el-tag>
        <el-tag @click="saveAsQuickSearch" type="plain" style="cursor: pointer; margin-right: 8px">
          保存为快速搜索
        </el-tag>
        <el-tag @click="resetQuickSearch" type="plain" style="cursor: pointer">
          清空所有搜索条件
        </el-tag>
        <el-button style="margin-left:10px" type="primary" icon="el-icon-search" size="mini" @click="submit">采集
        </el-button>
      </div>
      <div class="checkboxWarp">

      </div>
      <div class="setfieldName">
        <el-button size="mini" @click="handlequicklySearch">快速搜索</el-button>
        <!-- <el-button size="mini" @click="setFileName">设置字段</el-button> -->
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
              <span @click="searchByfastList(scope.row)" style="color: #46a6ff">{{ scope.row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" :resizable="false" align="center" width="200">
            <template slot-scope="scope">
              <!-- <el-button size="mini" type="text" icon="el-icon-edit"
                >编辑</el-button
              > -->
              <el-button @click.native="delquick(scope.row)" size="mini" type="text" icon="el-icon-delete">删除
              </el-button>
              <el-button @click.native="setTop(scope.row)" size="mini" type="text" icon="el-icon-upload2"
                v-if="scope.row.isTop == 0">置顶</el-button>
              <el-button @click.native="setTop(scope.row)" size="mini" type="text" v-else icon="el-icon-download">取消置顶
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <div slot="footer" class="dialog-footer footerBtn">
        <div>
          <el-button @click="quicklySearchListShow = false">取 消</el-button>
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
          <el-table-column label="显示" :resizable="false" align="center" width="100">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isPre" :disabled="scope.row.disable">
              </el-checkbox>
            </template>
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

  SetSearchtop,
} from "@/api/customer/index";
import {
  fastsearchlist,
  fastsearchsave,
  fastsearchremove,
} from "@/api/saleLeadquickSearch/index"
import { getDeptTree } from "@/api/workOrder/index";
import { getprovinceList, getcityList, getregionList } from "@/api/city/index"
import {
  getIndustryList,
} from "@/api/publicSaleds/index";
export default {
  mixins: [Dict],
  dicts: ["company_manage_status", "company_cash", "saled_company_type"],
  data() {
    return {
      time: "", //最后跟进时间
      quicklySearchListShow: false,
      quicklySearchList: [],
      quicklySearchName: "",
      saveAsQuickSearchOpen: false,
      form: {
        industry: '',
        region_code: "",
        city_code: '',
        province_code: ''
      },
      showList: [],
      provinceList: [],
      regionList: [],
      cityList: [],
      industryLists: [],
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      //   客户类型
      customerTypeList: [
      ],
      //
      initialList: [],
      // 下次跟进时间
      nextFollowTime: [
      ],
      setFileNameDio: false,
      saveSortList: [],
      dettListTree: [],
      userList: [],
      highSearchdialog: false,
      phoneList: [
        { label: '有企业电话', value: '1' },
        { label: '无企业电话', value: '0' }
      ],
      telList: [{ label: '有企业固话', value: '1' },
      { label: '无企业固话', value: '0' }],
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
    saveSortList(val) {
      Object.keys(this.form).forEach((key) => {
        if (!this.saveSortList.find((ev) => {
          return ev.id == key;
        })) {
          this.form[key] = ""
        }
      })
    },
    highSearchdialog(val) {
      this.$emit("getVal", !val)
    },
    time(val) {
      this.changeTime(val);
    },
  },
  beforeMount() {
    getprovinceList().then(res => {
      this.provinceList = res.data
    })
    getIndustryList().then((res) => {
      this.industryLists = res.data;
    });
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
    changeProvince(val) {
      this.form.city_code = "";
      this.form.region_code = "";
      getcityList({ provinceCode: val }).then(res => {
        this.cityList = res.data
      })
      this.saveAdressQuicklySearch(this.provinceList, 'province_code')
      this.saveSortList = this.saveSortList.filter((item, index) => {
        return item.id != 'region_code' && item.id != 'city_code'
      })
    },
    // 更改地区时保存快速搜索
    saveAdressQuicklySearch(list, key) {
      list.forEach((item, index) => {
        if (item.id) {
          if (item.id == this.form[key]) {
            let falg = this.saveSortList.find((ev) => {
              return ev.id == key;
            });
            if (falg) {
              this.saveSortList.forEach((o, i) => {
                if (o.id == key) {
                  o.label = item.name;
                  o.value = item.id;
                }
              });
            } else {
              this.saveSortList.push({
                id: key,
                value: item.id,
                label: item.name,
              });
            }
          }
        }
      });
    },
    changeRegion() {
      this.saveAdressQuicklySearch(this.regionList, 'region_code')

    },

    changeCity(val) {
      this.form.region_code = "";
      getregionList({ cityCode: val }).then(res => {
        this.regionList = res.data
      })
      this.saveAdressQuicklySearch(this.cityList, 'city_code')
      this.saveSortList = this.saveSortList.filter((item, index) => {
        return item.id != 'region_code'
      })

    },
    // 递归查找树形结构节点
    deepQuery(tree, id) {
      var isGet = false;
      var retNode = null;
      function deepSearch(tree, id) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].list && tree[i].list.length > 0) {
            deepSearch(tree[i].list, id);
          }
          if (id === tree[i].id || isGet) {
            isGet || (retNode = tree[i]);
            isGet = true;
            break;
          }
        }
      }
      deepSearch(tree, id);
      return retNode;
    },
    changeIndustry() {
      let item = this.deepQuery(this.industryLists, this.form.industry)
      let falg = this.saveSortList.find((ev) => {
        return ev.id == 'industry';
      });
      if (falg) {
        this.saveSortList.forEach((o, i) => {
          if (o.id == 'industry') {
            o.label = item.name;
            o.value = item.id;
          }
        });
      } else {
        this.saveSortList.push({
          id: 'industry',
          value: item.id,
          label: item.name,
        });
      }
    },
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
    reSetTable() { },
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
        this.form[o.id] = o.value;
      });
      // this.$parent.handleQuery();
      // this.quicklySearchListShow = false;
      this.$router.push({
        path: "/customerManager/searchResult",
        query: {
          parmter: JSON.stringify(this.form),
          type: 'highSearch'
        }
      })
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
      console.log(ob)
      console.log(this.form[key])
      ob.forEach((item, index) => {
        if (item.value) {
          if (item.value == this.form[key]) {
            let falg = this.saveSortList.find((ev) => {
              return ev.id == key;
            });
            if (falg) {
              this.saveSortList.forEach((o, i) => {
                if (o.id == key) {
                  o.label = item.label;
                  o.value = item.value;
                }
              });
            } else {
              this.saveSortList.push({
                id: key,
                value: item.value,
                label: item.label,
              });
            }
          }
        }
      });
    },
    changeAreaItem() {
      if (
        this.form.address != null &&
        this.form.address != undefined &&
        this.form.address != []
      ) {
        this.form.address = this.form.address.toString();
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
        this.form.on_start_time = val[0] + " " + "00:00:00";
        this.form.on_end_time = val[1] + " " + "23:59:59";
      } else {
        this.form.on_start_time = "";
        this.form.on_end_time = "";
        return;
      }
      let falg = this.saveSortList.find((ev) => {
        return ev.id == "on_start_time";
      });
      let falgNext = this.saveSortList.find((ev) => {
        return ev.id == "on_end_time";
      });
      if (falg) {
        this.saveSortList.forEach((o, i) => {
          if (o.id == "on_start_time") {
            o.label = "企业成立开始日期";
            o.value = val[0] + " " + "00:00:00";
          }
        });
      } else {
        this.saveSortList.push({
          id: "on_start_time",
          value: val[0] + " " + "00:00:00",
          label: "企业成立开始日期",
        });
      }
      console.log(this.saveSortList)
      if (falgNext) {
        this.saveSortList.forEach((o, i) => {
          if (o.id == "on_end_time") {
            o.label = "企业成立结束日期";
            o.value = val[1] + " " + "23:59:59";
          }
        });
      } else {
        this.saveSortList.push({
          id: "on_end_time",
          value: val + " " + "23:59:59",
          label: "企业成立结束日期",
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
    submit() {
      if (!this.form.industry) {
        this.$message.error("请选择行业")
        return
      }
      this.$router.push({
        path: "/customerManager/searchResult",
        query: {
          parmter: JSON.stringify(this.form),
          type: 'highSearch'
        }
      })
    },
    resetQuickSearch() {
      this.form = {};
      this.time = '';
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



.content {
  padding: 20px;
  position: relative;
  width: 100%;

  .setfieldName {
    position: absolute;
    right: 10px;
    top: 10px;
  }
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

  .el-radio-button__orig-radio:checked+.el-radio-button__inner {
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

.selectBox {
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
