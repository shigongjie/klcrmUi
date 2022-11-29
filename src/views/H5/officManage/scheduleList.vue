<template>
  <div class="container">
    <Navbar :title="'日程管理'" @jump="jumpGo" />
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="add" @click="addreport">+</div>
    <div class="header" v-if="$store.state.user.isApp != 2">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span style="color:#212121;font-weight:600;">日程管理</span>
      <span></span>
    </div>
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="nodata" v-if="todayList.length == 0">
        <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
      </div>
      <div @click="jumpDetail(item)" :style="{ 'border-left': '3px solid' + item.sign }" class="contant" v-for="(item, index) in todayList" :key="index">
        <div class="customer_info">
          <span class="customer_name">{{ item.headline }}</span>
          <span style="margin: 15px 0" class="font13"
            >{{ item.createTime == null ? "无" : item.createTime }}
            <span style="display: inline-block; width: 15px"></span></span
          >
          <span class="font13"
            >{{item.scheduleTitle}}</span>
        </div>
        <div class="customer_right">
          <div class="customer_status">
            <span class="font13"></span>
            <div>
              <!-- <img src="@/assets/images/defaultAvatar.png" alt="" /> -->
              <span class="font13">{{ item.scheduleStatus }}</span>
            </div>
          </div>
          <div class="right_icon">
            <!-- <i class="el-icon-arrow-right"></i> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  business,
  delSchedule,
  saveSchedule,
  scheduleSchedule,
} from "@/api/officeManagement";
import { getsalesleadlist, deleteByIds } from "@/api/saleslead/index";
export default {
  data() {
    return {
      total: 0,
      todayList: [],
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
      },
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    //获取工单列表
    getList(query) {
      if (query == null) {
        query = this.queryParams;
      }
      business(query).then((res) => {
        this.todayList = res.rows;
        this.loading = false;
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/addsalelead",
      });
    },
    jumpGo() {
      this.$router.push("/offich5");
    },
    addreport(){
        this.$router.push({
        path: "/addreporth5",
      });
    },
    /**获取数据 */
    getData(query) {
      business(query).then((res) => {
        this.customerList = res.data.records;
        // this.total = res.total;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/scheduledetailh5",
        query: {
          id: ob.id,
          data:JSON.stringify(ob)
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  color: #606266;
}
.add{
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
    color: #FFFFFF;
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
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.contant {
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 10px 10px;
  background: #ffffff;
//   border-radius: 6px;
  .customer_info {
    display: flex;
    flex-direction: column;
    .customer_name {
      font-size: 15px;
      font-weight: 600;
    }
  }
  .customer_status {
    display: flex;
    flex-direction: column;
    justify-content: center;
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
</style>
