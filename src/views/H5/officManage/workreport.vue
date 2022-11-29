<template>
  <div class="container">
     <Navbar :title="'工作报告'" @jump="jumpGo" />
    <van-popup v-model="drawer" position="bottom">
      <van-picker
        show-toolbar
        :columns="reportTypeArr"
        @confirm="onConfirm"
        @cancel="drawer = false"
        :value-key="'dictLabel'"
      />
    </van-popup>
    <div class="add" @click="addreport">+</div>
    <div class="header" v-if="$store.state.user.isApp != 2">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span style="color:#212121;font-weight:600;">工作报告</span>
      <span></span>
    </div>
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="tab_warp">
        <div
          @click="handleChangeTab(item)"
          v-for="(item, index) in tabList"
          :key="index"
          :class="item.active == activetab ? 'activeColor' : ''"
        >
          {{ item.name }}
        </div>
      </div>
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <div class="nodata" v-if="todayList.length == 0 && !loading">
        <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
      </div>
      <div v-if="!loading">
        <div
          @click="JumpDetail(item)"
          :style="{ 'border-left': '3px solid' + item.sign }"
          class="contant"
          v-for="(item, index) in todayList"
          :key="index"
        >
          <div class="customer_info">
            <div
              style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              "
            >
              <span class="customer_name">{{ item.createBy }}</span>
              <span class="font13">{{ item.headline }}</span>
            </div>

            <span style="margin: 15px 0" class="font13"
              >{{ item.workPlan == null ? "无" : item.workPlan }}
            </span>

            <div style="
                display: flex;
                justify-content: space-between;
                align-items: center;
              ">
              <!-- <img src="@/assets/images/defaultAvatar.png" alt="" /> -->
              <span class="font13">{{ item.createTime }}</span>
              <span class="font13"
                ><span
                  class="businessSpan"
                  :style="{
                    background:
                      item.auditStatus === '未批阅' ? '#fec03d' : '#4BD863',
                  }"
                />{{ item.auditStatus }}</span
              >
            </div>
          </div>
          <!-- <div class="customer_right">
            <div class="customer_status">
              <span class="font13">{{ item.headline }}</span>

            </div>
            <div class="right_icon">
            </div>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  staffList,
  workreportPage,
  workreportDerive,
  commonSubordinateList2,
} from "@/api/officeManagement";
export default {
  data() {
    return {
      drawer: false,
      direction: "btt",
      activetab: null,
      total: 0,
      todayList: [],
      reportTypeArr: [],
      tabList: [
        { name: "全部报告", id: null, type: "homeType", active: null },
        { name: "我提交的", id: "1", type: "homeType", active: "2" },
        { name: "提交给我的", id: "0", type: "homeType", active: "3" },
        // { name: "抄送给我的", id: "3" },
        { name: "未读报告", id: "0", type: "auditStatus", active: "4" },
        { name: "已读报告", id: "1", type: "auditStatus", active: "5" },
      ],
      loading: true,
      queryParams: {
        homeType: null,
        // pageNum: 1,
        // pageSize: 10,
      },
    };
  },
  beforeMount() {
    this.getDicts("report_type").then((res) => {
      this.reportTypeArr = res.data;
    });
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    JumpDetail(ob) {
      this.$router.push({
        path: "/workreportdetailh5",
        query: {
          id: ob.id,
        },
      });
      // this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    locBton(obj, typeId) {
      this.$router.push({
        path: "/addworkreporth5",
        query: {
          typeId: typeId,
          // reportObj: JSON.stringify(obj),
          reportObj: obj.dictValue,
        },
      });
      // this.reportObj = obj;
      // this.typeId = typeId;
      // this.reportVisible = true;
    },
    onConfirm(obj, typeId) {
      this.$router.push({
        path: "/addworkreporth5",
        query: {
          typeId: typeId,
          // reportObj: JSON.stringify(obj),
          reportObj: obj.dictValue,
        },
      });
    },
    handleChangeTab(ob) {
      this.activetab = ob.active;
      let data = {};
      data[ob.type] = ob.id;
      this.getList(data);
    },
    //获取工单列表
    getList(query) {
      this.loading = true;
      if (query == null) {
        query = this.queryParams;
      }
      workreportPage(query).then((res) => {
        this.todayList = res.rows;
        this.loading = false;
      });
    },
    addreport() {
      this.drawer = true;
      // this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
      //   this.$router.push({
      //   path: "/addworkreporth5",
      // });
    },
    jumpGo() {
      this.$router.push("/offich5");
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/saleleaddetailh5",
        query: {
          id: ob.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  color: #606266;
  //   position: relative;
}
.add {
  position: fixed;
  display: block;
  width: 40px;
  height: 40px;
  background: #409eff;
  border-radius: 50%;
  z-index: 999;
  bottom: 10px;
  right: 10px;
  font-size: 30px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
}
.locitem {
  position: fixed;
  width: 40px;
  height: 40px;
  background: #409eff;
  border-radius: 50%;
  z-index: 999;
  bottom: 10px;
  right: 10px;
  font-size: 30px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;
}
.header {
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
}
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
.work {
  min-height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  background: #ffffff;
  //   border-radius: 6px;
  .customer_info {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    .customer_name {
      font-size: 15px;
      font-weight: 600;
    }
  }
  .customer_status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
    img {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
.customer_right {
  display: flex;
  .right_icon {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
}
.font13 {
  font-size: 13px;
}
.nodata {
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 300px;
  color: #c0c4cc;
  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}
.tab_warp {
  background: #ffffff;
  display: flex;
  font-size: 13px;
  justify-content: space-between;
  overflow-x: scroll;
  div {
    padding: 8px 10px;
    flex-shrink: 0;
  }
}
.activeColor {
  color: #409eff;
}
::v-deep .el-drawer__header {
  margin-bottom: 5px;
}
.btnWarp {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  div {
    padding: 8px 0;
    color: #409eff;
  }
}
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  margin-right: 5px;
}
</style>
