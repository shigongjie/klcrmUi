/**高级搜索 */
<template>
  <div v-if="open">
    <el-dialog
      :title="isSet ? '快捷搜索配置' : '高级搜索'"
      :visible.sync="open"
      width="50%"
    >
      <el-form
        class="selfForm"
        ref="queryParams"
        :model="queryParams"
        label-width="120px"
        size="small"
      >
        <div>
          <div class="inputWarp">
            <div class="width48">
              <el-input
                v-model="queryParams.name"
                placeholder="搜索关键词"
                clearable
                size="small"
              />
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.topSort"
                placeholder="线索分类"
              >
                <el-option
                  v-for="(item, index) in filterTabList"
                  :key="index"
                  :label="item.name"
                  :value="item.type"
                ></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>
          <div class="inputWarp">
            <div class="width48">
              <el-cascader
                style="width: 100%"
                v-model="queryParams.clueLabel"
                :options="labelList"
                placeholder="线索标签"
                size="small"
                :show-all-levels="false"
                :props="propsArray"
                separator=","
                clearable
              ></el-cascader>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.allow"
                placeholder="线索分配"
              >
                <el-option label="全部" value="0"></el-option>
                <el-option label="已分配" value="1"></el-option>
                <el-option label="未分配" value="2"></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.followState"
                placeholder="跟进状态"
              >
                <el-option label="待跟进" value="0"></el-option>
                <el-option label="跟进中" value="1"></el-option>
                <el-option label="跟进结束" value="2"></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.industry"
                placeholder="所属行业"
              >
                <el-option
                  v-for="dict in dict.type.industry"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.role"
                placeholder="角色"
              >
                <el-option
                  v-for="dict in dict.type.contact_role"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.sex"
                placeholder="尊称"
              >
                <el-option value="0" label="保密">保密</el-option>
                <el-option value="2" label="女士">女士</el-option>
                <el-option value="1" label="先生">先生</el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.source"
                placeholder="线索来源"
              >
                <el-option
                  v-for="dict in dict.type.customer_source"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-select
                size="small"
                v-model="queryParams.sourceStatus"
                placeholder="线索状态"
              >
                <el-option
                  v-for="dict in dict.type.market_source_status"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                ></el-option>
              </el-select>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <div class="width48">
              <el-cascader
                style="width: 100%"
                placeholder="归属人员"
                size="small"
                v-model="queryParams.affiliationStaff"
                :options="userList"
                :show-all-levels="false"
                :props="props"
                clearable
              ></el-cascader>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>

            <div class="width48">
              <el-cascader
                placeholder="请选择部门"
                :options="deptTree"
                :show-all-levels="false"
                filterable
                v-model="queryParams.affiliationDept"
                :props="{
                  emitPath: false,
                  checkStrictly: true,
                  children: 'list',
                  label: 'name',
                  value: 'id',
                }"
                clearable
                style="width: 100%"
              ></el-cascader>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <!-- <div class="width48">
            <el-select
              size="small"
              v-model="queryParams.source"
              placeholder="最后跟进"
            >
              <el-option
                v-for="dict in dict.type.customer_source"
                :key="dict.value"
                :label="dict.label"
                :value="dict.value"
              ></el-option>
            </el-select>
            <div class="rightIcon" v-if="isSet">
              <el-checkbox v-model="queryParams.checked"></el-checkbox>
            </div>
          </div> -->

            <div class="width48">
              <el-cascader
                style="width: 100%"
                size="small"
                placeholder="创建人员"
                v-model="queryParams.createBy"
                :options="userList"
                :show-all-levels="false"
                :props="propsCreateBy"
                clearable
              ></el-cascader>
              <div class="rightIcon" v-if="isSet">
                <el-checkbox v-model="queryParams.checked"></el-checkbox>
              </div>
            </div>
          </div>

          <div class="inputWarp">
            <el-date-picker
              size="small"
              v-model="time"
              class="width100"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始跟进时间"
              end-placeholder="结束跟进时间"
            >
            </el-date-picker>
            <div class="rightIcon" v-if="isSet">
              <el-checkbox v-model="queryParams.checked"></el-checkbox>
            </div>
          </div>

          <div class="inputWarp">
            <el-date-picker
              size="small"
              v-model="time1"
              class="width100"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始创建时间"
              end-placeholder="结束创建时间"
            >
            </el-date-picker>
            <div class="rightIcon" v-if="isSet">
              <el-checkbox v-model="queryParams.checked"></el-checkbox>
            </div>
          </div>

          <div class="inputWarp">
            <el-date-picker
              size="small"
              v-model="time2"
              class="width100"
              type="daterange"
              value-format="yyyy-MM-dd"
              range-separator="至"
              start-placeholder="开始分配时间"
              end-placeholder="结束分配时间"
            >
            </el-date-picker>
            <div class="rightIcon" v-if="isSet">
              <el-checkbox v-model="queryParams.checked"></el-checkbox>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="sure">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getdeptTree } from "@/api/organization/index";
import { getstaffList, getareaList, getlabelList } from "@/api/customer/index";
export default {
  dicts: [
    "customer_source",
    "sys_normal_disable",
    "industry",
    "market_source_status",
    "customer_source",
    "contact_role",
  ],
  data() {
    return {
      time: "",
      time1: "",
      time2: "",
      isSet: true,
      open: false,
      submitParams: {},
      queryParams: {},
      labelList: [],
      tabList: [
        { name: "全部线索", type: 1, isDeptHead: 1 },
        {
          name: "我的线索",
          type: 2,
          isDeptHead: 1,
        },
        {
          name: "下属的线索",
          type: 3,
          isDeptHead: 1,
        },
        { name: "已转客户", type: 4, isDeptHead: 1 },
      ],
      propsArray: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      propsCreateBy: {
        value: "name",
        label: "name",
        children: "list",
        emitPath: false,
      },
      deptTree: [],
    };
  },
  watch: {
    open(val) {
      this.queryParams = this.$parent.$data.queryParams
      console.log(val);
      if (val) {
      } else {
        this.queryParams = this.$options.data().queryParams;
      }
    },
  },
  computed: {
    filterTabList() {
      return this.tabList.filter((item, index) => {
        if (item.isDeptHead == 1) {
          return item;
        }
      });
    },
  },
  // beforeDestroy(){
  //   this.queryParams = this.$options.data().queryParams;
  // },

  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getdeptTree().then((res) => {
      this.deptTree = res.data;
    });
    getlabelList().then((res) => {
      this.labelList = res.data;
    });
  },
  methods: {
    sure() {
      if (this.time != "" && this.time != null) {
        this.queryParams.followUpTimeStart = this.time[0] + " " + "00:00:00";
        this.queryParams.followUpTimeEnd = this.time[1] + " " + "23:59:59";
      } else if (this.time == null) {
        this.queryParams.followUpTimeStart = "";
        this.queryParams.followUpTimeEnd = "";
      }
      if (this.time1 != "" && this.time1 != null) {
        this.queryParams.createStartTime = this.time1[0] + " " + "00:00:00";
        this.queryParams.createEndTime = this.time1[1] + " " + "23:59:59";
      } else if (this.time1 == null) {
        this.queryParams.createStartTime = "";
        this.queryParams.createEndTime = "";
      }
      if (this.time2 != "" && this.time2 != null) {
        this.queryParams.allotStartTime = this.time2[0] + " " + "00:00:00";
        this.queryParams.allotEndTime = this.time2[1] + " " + "23:59:59";
      } else if (this.time2 == null) {
        this.queryParams.allotStartTime = "";
        this.queryParams.allotEndTime = "";
      }
      // console.log(this.queryParams);
      this.open = false;
      this.queryParams.type = 1;
      this.$emit("searchByparams", this.queryParams);
    },
  },
};
</script>

<style lang='scss' scoped>
.inputWarp {
  display: flex;
  justify-content: space-between;
  margin-top: 15px;
  .rightIcon {
    display: flex;
    align-items: center;
    width: 50px;
    flex-shrink: 0;
    justify-content: center;
    background-color: #f5f7fa;
    color: #909399;
    border: 1px solid #dcdfe6;
    border-radius: 0;
    border-left: none;
  }
  .width48 {
    width: 48%;
    display: flex;
    ::v-deep .el-input__inner {
      border-radius: 0;
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    ::v-deep .el-select {
      width: 100%;
      //   border-top-right-radius: 0px;
      //   border-bottom-right-radius: 0px;
    }
  }
}
.width100 {
  width: 100%;
  border-radius: 0;
}
</style>
