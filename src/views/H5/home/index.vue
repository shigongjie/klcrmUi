<template>
  <div class="h5-container">
    <Navbar :title="'首页'" @jump="jumpgo" />
    <div
      class="tab_div"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 96px;' : ''"
    >
      <el-tabs v-model="activeName" @tab-click="handleClick">
        <el-tab-pane label="今日日程" name="first">
          <div class="work">
            <div class="contant">
              <div class="dateWarp">
                <div class="today">
                  {{ dates.year }}-{{ dates.month }}-{{ dates.date }}
                  <span
                    class="backToday"
                    @click="backToday"
                    v-if="chooseDay != dates.date"
                  >
                    回今天 <i class="el-icon-right"></i
                  ></span>
                </div>
                <div class="daysList">
                  <div
                    v-for="(item, index) in scheduleList"
                    :key="index"
                    @click="chooseList(item)"
                    :class="item.isToday ? 'colorblue' : ''"
                  >
                    <div class="eachDay" style="">
                      <div>
                        {{ item.week }}
                      </div>
                      <div class="days" style="margin-top: 10px">
                        {{ item.date.split("-")[2] }}
                        <div class="circle">
                          <div v-if="item.list.length > 0"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div class="nodata" v-if="todayList.length == 0">
                <!-- <i class="el-icon-hot-water"></i>
                 -->
                <img src="@/assets/images/nolist.png" alt="" />
                今天还没有日程安排哦
              </div>
              <div
                @click="toast"
                v-for="(item, index) in todayList"
                :key="index"
                style="padding: 0 10px"
              >
                <div
                  class="todoCard"
                  :style="{ 'border-left': '2px solid' + item.sign }"
                >
                  <div>
                    <div>
                      <span>{{ item.beginTime }}-{{ item.endTime }}</span>
                    </div>
                    <div
                      style="
                        margin-top: 15px;
                        font-family: PingFang SC;
                        font-weight: 500;
                        color: #212121;
                        font-size: 13px;
                      "
                    >
                      {{ item.scheduleTitle }}
                    </div>
                  </div>
                  <div>
                    {{ item.scheduleStatus }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="待办事项" name="second">
          <div class="work">
            <div class="contant todolistDiv">
              <div
                @click="toast"
                class="card"
                v-for="(item, index) in todoList"
                :key="index"
              >
                <div class="img_div">
                  <img :src="item.icon" alt="" />
                  <span class="fontStyle">{{ item.id }}</span>
                </div>

                <span>数量（{{ item.name }}）</span>
              </div>
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { scheduletoday } from "@/api/common/index";
import { getSchedule } from "@/api/customer/index";
import Footer from "../components/footer.vue";
import Navbar from "../components/navbar.vue";
export default {
  components: {
    Footer,
    Navbar,
  },
  data() {
    return {
      isApp: 2,
      activeName: "first",
      todoList: [],
      chooseDay: "",
      scheduleList: [],
      todayList: [],
      dates: {},
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getday();
    this.scheduletoday();
  },
  methods: {
    jumpgo() {
      LukeappApi.clt_close_browser("paysuccess");
    },
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    backToday() {
      this.scheduletoday();
    },
    //   待办事项
    getSchedule() {
      getSchedule().then((Res) => {
        this.todoList = Res.data;
        // console.log('待办事项',Res);
      });
    },
    chooseList(ob) {
      this.chooseDay = ob.date.split("-")[2];
      this.scheduleList.forEach((item) => {
        item.isToday = false;
      });
      ob.isToday = true;
      this.todayList = ob.list;
    },
    getday() {
      let nowDate = new Date();
      this.dates = {
        year: nowDate.getFullYear(),
        month: nowDate.getMonth() + 1,
        date: nowDate.getDate(),
      };
    },
    handleClick(a, b) {
      if (a.index == 1) {
        this.getSchedule();
      }
    },
    scheduletoday() {
      scheduletoday().then((res) => {
        this.scheduleList = res.data;
        // console.log('this.scheduleList',this.scheduleList);
        this.scheduleList.forEach((item) => {
          if (item.isToday) {
            this.todayList = item.list;
            this.chooseDay = item.date.split("-")[2];
          }
        });
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.home {
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.tab_div {
  flex: 1;
  // padding-left: 20px;
  // padding-right: 20px;
  padding-bottom: 56px;
  // background-color: #ffffff;
  height: 100%;
}
::v-deep .el-tabs__nav-wrap::after {
  background-color: #ffffff !important;
}
.work {
  max-height: 690px;
  overflow-y: auto;
  // background: #FFFFFF;
}
.nodata {
  // width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 300px;
  color: #999999;
  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}
.dateWarp {
  // height: 120px;
  // width: 320px;
  margin: auto;
  // margin-top: 10px;
  margin-bottom: 10px;
  // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  padding: 20px 10px;
  font-size: 13px;
  background: #ffffff;
  .eachDay {
    font-size: 14px;
    height: 80px;
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 13px 0;
  }
  .today {
    margin-bottom: 20px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #323232;
  }
  .days {
    // margin-top: 15px;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    line-height: 30px;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
  }
  .colorblue {
    background: #2a81fc;
    color: white !important;
    border-radius: 20px;
    width: 40px;
    .days {
      color: white !important;
    }
    .circle {
      // height: 25px;
      display: flex;
      justify-content: center;
      align-items: center;
      div {
        background: #ffffff;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        margin-top: 2px;
      }
    }
  }
}
.daysList {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.todolistDiv {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: baseline;
  overflow-y: hidden;

  // padding-right: 30px;
  // padding-left: 10px;
  .card {
    background: #ffffff;
    width: 100%;
    height: 61px;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
    display: flex;
    justify-content: space-between;
    align-items: center;
    cursor: pointer;
    margin-bottom: 10px;
    padding: 0 19px;
    .fontStyle {
      font-size: 15px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #323232;
    }
    // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
    .img_div {
      display: flex;
      align-items: center;
      img {
        width: 30px;
        height: 30px;
        margin-right: 14px;
      }
    }
  }
}
.backToday {
  margin-left: 8px;
  font-size: 12px;
  color: #409eff;
}
.todoCard {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 69px;
  width: 100%;
  margin: auto;
  margin-top: 10px;
  margin-bottom: 2px;
  // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  padding: 10px 10px;
  font-size: 13px;
  background: #ffffff;
}
.circle {
  // height: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
  div {
    background: #409eff;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    margin-top: 2px;
  }
}
::v-deep .el-tabs__nav-scroll {
  display: flex;
  justify-content: center;
  background: #ffffff;
}
::v-deep .el-tabs__header {
  margin-bottom: 10px;
}
::v-deep .el-tabs__item {
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #999999;
  height: 45px;
  // padding: 10px 20px;
}
::v-deep .el-tabs__item.is-active {
  width: 50%;
  color: #212121;
}
::v-deep .el-tabs__active-bar {
  width: 30px !important;
  left: 18px;
  height: 4px;
  border-radius: 5px;
  background-color: #2a81fc;
}
</style>