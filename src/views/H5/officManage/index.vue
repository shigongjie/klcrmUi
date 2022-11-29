<template>
  <div class="h5-container">
    <Navbar :title="'办公'" @jump="jumpgo" />
    <div
      class="container"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 76px;' : ''"
    >
      <div style="background: #f3f3f3; height: 10px"></div>
      <div class="titleh5" v-if="$store.state.user.isApp != 2">办公</div>
      <!-- <div class="adv_logo"><img src="@/assets/images/adv_logo.png" alt=""></div>-->
      <div class="crm_div">
        <div
          class="crm_card"
          v-for="(item, index) in menuList"
          :key="index"
          @click="jump(item.path)"
        >
          <div class="icon_div">
            <span class="icon_warp"><img :src="item.icon" alt="" /></span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="data_div">
        <div class="titleh4">我的任务</div>
        <div class="nodata" v-if="todayList.length === 0">
          <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
        </div>
        <div v-for="(item, index) in todayList" :key="index">
          <div
            class="todoCard"
            :style="{ 'border-left': '2px solid' + item.sign }"
          >
            <div>
              <div>
                <span>{{ item.beginTime }}</span>
              </div>
              <div style="margin-top: 15px; color: #212121; font-size: 13px">
                {{ item.headline }}
              </div>
            </div>
            <div>
              <span
                class="businessSpan"
                :class="
                  item.taskType == '0'
                    ? 'color1'
                    : item.taskType == '1'
                    ? 'color2'
                    : item.taskType == '2'
                    ? 'color3'
                    : item.taskType == '3'
                    ? 'color4'
                    : item.taskType == '4'
                    ? 'color5'
                    : 'color6'
                "
              />
              {{ item.taskType }}
            </div>
          </div>
        </div>
      </div>
      <div class="data_div">
        <div class="titleh4">我的日程</div>
        <div class="nodata" v-if="scheduleList.length == 0">
          <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
        </div>
        <div v-for="(item, index) in scheduleList" :key="index">
          <div
            class="todoCard"
            :style="{ 'border-left': '2px solid' + item.sign }"
          >
            <div>
              <div>
                <span>{{ item.beginTime }}</span>
              </div>
              <div class="descripiton" style="margin-top: 15px">
                {{ item.businessName }}
              </div>
            </div>
            <div>
              <!-- <span
                class="businessSpan"
                :class="
                  item.scheduleStatus == '0'
                    ? 'color1'
                    : item.scheduleStatus == '1'
                    ? 'color2'
                    : item.scheduleStatus == '2'
                    ? 'color3'
                    : item.scheduleStatus == '3'
                    ? 'color4'
                    : item.scheduleStatus == '4'
                    ? 'color5'
                    : 'color6'
                "
              /> -->
              {{ item.scheduleStatus }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { taskpage } from "@/api/task/index";
import { business } from "@/api/officeManagement";
import { getHome } from "@/api/customer/index";
import Footer from "../components/footer.vue";
import Navbar from "../components/navbar.vue";
export default {
  components: {
    Footer,
    Navbar,
  },
  data() {
    return {
      isApp: 1,
      queryParams: {
        pageSize: 10,
        homeType: 1,
      },
      menuList: [
        {
          name: "工单管理",
          icon: require("@/assets/images/gongdan.png"),
          path: "/workerlisth5",
        },
        {
          name: "任务管理",
          icon: require("@/assets/images/renwu.png"),
          path: "/tasklisth5",
        },
        {
          name: "日程管理",
          icon: require("@/assets/images/richeng.png"),
          path: "/scheduleh5",
        },
        {
          name: "工作报告",
          icon: require("@/assets/images/gongzuo.png"),
          path: "/workreporth5",
        },
      ],
      scheduleList: [],
      scheduleParams: {},
      reportDataList: [],
      todayList: [],
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getList(this.queryParams);
    this.getscheduleList();
    // this.getHome();
  },
  methods: {
    jumpgo() {
      this.$router.push("/home");
    },
    getList(query) {
      if (query == null) {
        query = this.queryParams;
      }
      taskpage(query).then((res) => {
        this.todayList = res.rows;
      });
    },
    getscheduleList(query) {
      if (query == null) {
        query = this.scheduleParams;
      }
      business(query).then((res) => {
        this.scheduleList = res.rows;
      });
    },
    jump(path) {
      this.$router.push({
        path: path,
      });
    },
    getHome(data) {
      getHome(data).then((res) => {
        this.reportDataList = res.data;
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  padding-bottom: 80px;
  background: #f3f3f3;
}
.crm_div {
  display: flex;
  justify-content: space-around;
  background: #ffffff;

  .icon_div {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    font-size: 13px;
    .icon_warp {
      height: 46px;
      width: 46px;
      text-align: center;
      line-height: 46px;
      font-size: 20px;
      margin-bottom: 10px;
      color: white;
      img {
        height: 46px;
        width: 46px;
      }
    }
  }
}
.adv_logo{
  width: 100%;
  height: 102px;
  margin-bottom: 11px;
  img{
    width: 100%;
    height: 100%;
  }
}
.titleh5 {
  font-size: 17px;
  font-weight: 600;
  background: #ffffff;
  color: #323232;
  padding: 18px 0px 10px;
  text-align: center;
  // padding-top: 20px;
  // margin-bottom: 5px;
}
.titleh4 {
  // margin-top: 20px;
  font-size: 14px;
  font-weight: 500;
  padding: 15px 0;
}
.reportDiv {
  box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  margin-top: 20px;
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(4, 25%);
  .reportEachDiv {
    font-size: 14px;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    span:nth-child(2) {
      font-size: 24px;
    }
  }
}
.nodata {
  // width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #c0c4cc;
  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}
.data_div {
  padding: 0px 10px;
}
.todoCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  // width: 320px;
  height: 79px;
  margin: auto;
  margin-bottom: 10px;
  // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  background: #ffffff;
  padding: 10px 10px;
  font-size: 13px;
}
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: red;
  margin-left: 20px;
}
.cricle {
  margin-right: 5px;
}
.color1 {
  background: #409eff;
}
.color2 {
  background: #67c23a;
}
.color3 {
  background: #f56c6c;
}
.color4 {
  background: #cccccc;
}
.color5 {
  background: #909399;
}
.color6 {
  background: rgb(251, 98, 96);
}
.descripiton {
  flex-shrink: 0;
  overflow: hidden;
}
</style>
