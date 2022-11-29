<template>
  <div class="h5-container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <Navbar :title="'员工管理'" @jump="jumpGo" />
    <div class="header" v-if="$store.state.user.isApp != 2">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">员工管理</span>
    </div>
    <div style="height: 56px"></div>
    <div class="operation">
      <span class="add-ai" @click="handleAdd">
        <div class="imgWarp">
          <img src="@/assets/images/add.png" alt="" />
        </div>
        新增
      </span>
      <span>
        <div
          :style="showPopover ? 'color:#2A81FC' : ''"
          style="padding: 0 10px"
          @click="closeDailog"
        >
          <img
            style="width: 13px; height: 13px; margin-right: 5px"
            src="@/assets/images/searchHigh.png"
            alt=""
          />筛选
        </div>
      </span>
    </div>

    <div
      class="work"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <div class="nodata" v-if="staffList.length == 0" :style="staffList.length === 0 ? 'display:none;':''">
        <img src="@/assets/images/nodata.png" alt="" />
        暂时什么都没有
      </div>

      <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <!-- 员工列表部分 -->
        <van-list
          v-model="loading"
          :finished="finished"
          :offset='50'
          finished-text="没有更多了"
          @load="onLoad"
        >
          <div class="contant" v-for="(item, index) in staffList" :key="index">
            <!-- 在线状态 -->
            <div class="customer_info">
              <span class="customer_name">禄可科技集团有限公司</span>
              <div class="customer_status">
                <img
                  v-if="item.onlineStatus == '0'"
                  class="statusImg"
                  src="@/assets/images/staff_statusY.png"
                  alt=""
                />
                <img
                  v-else
                  class="statusImg"
                  src="@/assets/images/staff_statusN.png"
                  alt=""
                />
                <span class="font13">
                  {{
                    item.onlineStatus == "0"
                      ? "在线"
                      : item.onlineStatus == "1"
                      ? "离线"
                      : ""
                  }}
                </span>
              </div>
            </div>
            <!-- 基本信息 -->
            <div class="staff_info">
              <div class="login_status">
                <span class="font13"
                  >最后登录：{{
                    item.lastLoginTime == null ? "无" : item.lastLoginTime
                  }}</span
                >
                <span class="font13"
                  >账号状态：{{
                    item.accountStatus == 0
                      ? "正常"
                      : item.accountStatus == 1
                      ? "停用"
                      : ""
                  }}</span
                >
              </div>
              <div class="staff_img">
                <img
                  v-if="item.avatar == null"
                  src="@/assets/images/defaultAvatar.png"
                  alt=""
                />
                <img v-else :src="item.avatar" alt="" />
                <span class="font13">{{ item.name }}</span>
              </div>
              <div class="staff_detial">
                <i class="el-icon-arrow-right" @click="jumpDetail(item)"></i>
              </div>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <staffFilter
      :showPopover="showPopover"
      @close="closeDailog"
      @getstaffList="getStaffList"
    />
  </div>
</template>

<script>
// 员工列表接口
import { getstaffList, handleStaff } from "@/api/staff/index";
import staffFilter from "./components/staffFilter.vue";
export default {
  components: {
    staffFilter,
  },
  data() {
    return {
      total: 0,
      customerList: [],
      staffList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
      showPopover: false,
      loading: false,
      finished: false,
      refreshing: false,
    };
  },
  mounted() {
    // this.getStaffList(this.queryParams);
  },
  methods: {
    // 获取员工列表数据
    getStaffList(value) {
      // console.log('1111',value);
      getstaffList(value).then((res) => {
        this.staffList = res.rows;
        this.total = res.total;
        // console.log(res);
      });
    },
    closeDailog() {
      this.showPopover = !this.showPopover;
    },

    // close(value){
    //   this.showPopover = value
    // },
    // 新增员工
    
    handleAdd() {
      this.$router.push({
        path: "/addStaff",
      });
    },
    jumpGo() {
      this.$router.push("/crm");
    },
    /**获取数据 */
    // getData(query) {
    //   getsalesleadlist(query).then((res) => {
    //     console.log(res);
    //     // this.customerList = res.data.rows;
    //     // this.total = res.total;
    //   });
    // },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/addStaff",
        query: {
          id: ob.id,
        },
      });
    },
    onLoad() {
      getstaffList(this.queryParams)
        .then((res) => {
          this.staffList = this.staffList.concat(res.rows);
          this.total = res.total;
          this.refreshing = false
          if (this.staffList.length >= res.total) {
            this.finished = true
          } else {
            this.finished = false;
            this.queryParams.pageNum += 1;
          }
          this.loading = false;
          // this.checked = true;
          // setTimeout(() => {
          //   this.$refs.checkboxGroup.toggleAll(true);
          //   res.rows.forEach((item) => {
          //     this.result.push(item.customerId);
          //   });
          // }, 100);
          // console.log(this.staffList);
        })
        .catch((err) => {});
    },
    onRefresh() {
      this.staffList = []
      this.queryParams.pageNum = 1
      this.onLoad()
    },
  },
};
</script>

<style lang="scss" scoped>
.h5-container {
  height: 100%;
  color: #606266;
}
.header {
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  // justify-content: space-around;
  align-items: center;
  z-index: 999;
  background: #ffffff;
}
.el-icon-arrow-left {
  font-size: 18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
  // margin-right: 130px;
}
.title-clue {
  font-size: 18px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #323232;
  flex: 1;
  text-align: center;
}
.work {
  min-height: 100%;
  // padding-top: 56px;
  background: RGB(249, 249, 249);
}
.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  border-radius: 6px;
  .customer_info {
    width: 100%;
    display: flex;
    padding: 14px 15px;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
    .customer_name {
      font-size: 14px;
      font-weight: 600;
      color: #212121;
    }
    .customer_status {
      display: flex;
      align-items: center;
      .statusImg {
        margin-right: 3px;
        height: 14px;
        width: 14px;
        margin-bottom: 0px;
      }
    }
  }
  .staff_info {
    width: 100%;
    display: flex;
    padding: 24px 10px 24px 14px;
    line-height: 30px;
    .login_status {
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .staff_img {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: space-between;
      margin-right: 8px;
    }
    img {
      width: 38px;
      height: 38px;
      border-radius: 20px;
    }
    .staff_detial {
      display: flex;
      align-items: center;
      .el-icon-arrow-right {
        font-size: 22px;
      }
    }
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
.operation {
  padding: 16px 17px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #fff;
  margin-top: 1px;
  .add-ai {
    color: #2a81fc;
    font-size: 14px;
    display: flex;
    align-items: center;
    .imgWarp {
      width: 15px;
      height: 15px;
      margin-right: 3px;
      img {
        width: 100%;
        height: 100%;
        background: cover;
      }
    }
  }
}
</style>
