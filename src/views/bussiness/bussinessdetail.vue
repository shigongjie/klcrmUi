/**企业详情 */
<template>
  <div>
    <div class="warp">
      <div class="userInfoDiv">
        <div><img :src="companyData.logo" alt="" /></div>
        <div class="textDiv">
          <p>{{ companyData.name }}</p>
          <p>
            企业简称：{{ companyData.shortName }}，所属行业：{{ industryName }}
          </p>
        </div>
      </div>
      <div class="btnWarp">
        <el-button size="medium" icon="el-icon-edit" @click="edit">
          编辑企业
        </el-button>
        <el-button size="medium" icon="el-icon-edit" @click="changeTime">
          修改期限
        </el-button>
        <el-button size="medium" icon="el-icon-delete"> 删除企业 </el-button>
      </div>
    </div>
    <div class="pd">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsSelf">
        <el-tab-pane label="企业详情" name="first"
          ><BussinessInfo :companyData="companyData"
        /></el-tab-pane>
        <el-tab-pane label="企业限制" name="second"
          ><BussinessLimit :companyData="companyData"
        /></el-tab-pane>
        <el-tab-pane label="模块配置" name="third"
          ><ModelSet :companyData="companyData"
        /></el-tab-pane>
        <el-tab-pane label="操作日志" name="fourth"
          ><ActionLogs :objectId="companyId" v-if="activeName == 'fourth'"
        /></el-tab-pane>
        <!-- <el-tab-pane label="系统日志" name="firth"><SystemLogs /></el-tab-pane> -->
        <el-tab-pane label="登录日志" name="sixth"><LoginLogs v-if="activeName == 'sixth'" /></el-tab-pane>
      </el-tabs>
    </div>
    <Addbussiness
      v-if="open"
      ref="Addbussiness"
      :action="1"
      :id="companyData.id"
      @closeEdit="closeEdit"
    />
    <ServiceLife v-if="openServe" ref="ServiceLife" :ids="companyData" />
  </div>
</template>

<script>
import Addbussiness from "./addbussiness.vue";
import ServiceLife from "./servicelife.vue";
import { getcompanyDetail } from "@/api/bussiness/index";
import BussinessInfo from "./components/bussinessInfo.vue";
import BussinessLimit from "./components/bussinesslimit.vue";
import ModelSet from "./components/modelset.vue";
import ActionLogs from "../logsmanage/actionlogs.vue";
import SystemLogs from "../logsmanage/systemlogs.vue";
import LoginLogs from "../logsmanage/loginlogs.vue";
export default {
  components: {
    BussinessInfo,
    BussinessLimit,
    ModelSet,
    ActionLogs,
    SystemLogs,
    LoginLogs,
    Addbussiness,
    ServiceLife,
  },
  data() {
    return {
      openServe: false,
      open: false,
      activeName: "first",
      companyData: {},
      industryList: [],
      industryName: "",
      companyId: "",
    };
  },
  mounted() {
    this.companyId = this.$route.query.id;
    this.getDicts("industry").then((res) => {
      this.industryList = res.data;
      this.getdata();
    });
  },
  methods: {
    getdata() {
      let data = {};
      data.id = this.$route.query.id;
      getcompanyDetail(data).then((res) => {
        this.companyData = res.data;
        this.industryList.forEach((item, index) => {
          if (item.dictValue == res.data.industry) {
            this.industryName = item.dictLabel;
          }
        });
      });
    },
    closeEdit() {
      this.open = false;
      this.getdata();
    },
    edit() {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.Addbussiness.open = true;
      });
    },
    changeTime() {
      this.openServe = true;
      this.$nextTick(() => {
        this.$refs.ServiceLife.dialogVisible = true;
      });
    },
    handleClick() {},
  },
};
</script>

<style lang='scss' scoped>
.warp {
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .btnWarp {
    display: flex;
    align-items: center;
  }
}
.userInfoDiv {
  display: flex;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 30px;
  }
  .textDiv {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    p {
      padding: 0;
      margin: 0;
    }
    p:nth-child(2) {
      margin-top: 15px;
      color: #999999;
      font-size: 13px;
    }
  }
}
.pd {
  padding: 10px 30px;
}
::v-deep {
  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
  }
}
</style>