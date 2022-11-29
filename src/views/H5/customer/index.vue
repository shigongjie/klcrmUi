<template>
  <div class="h5-container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">客户管理</span>
      <!-- <span><i @click="handleAdd" class="el-icon-plus"></i></span> -->
       <span class="add-ai" @click="handleAdd"
        ><div class="imgWarp">
          <img src="@/assets/images/add.png" alt="" />
        </div>
        新增</span
      >
    </div>
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <div class="nodata" v-if="customerList.length === 0">
        <img src="@/assets/images/nodata.png" alt="" />
        暂时什么都没有
      </div>
      <div class="background: #F3F3F3;" v-if="!loading">
        <van-checkbox-group v-model="result" ref="checkboxGroup">
          <div class="contant" v-for="(item, index) in customerList" :key="index">
            <div class="customer_info">
              <div style="display: flex">
                <van-checkbox v-if="choose" :name="item.id" style="margin-right: 10px">
                  <template #icon="props">
                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                  </template>
                </van-checkbox>
                <span class="customer_name">{{  item.name  }}</span>
              </div>

              <span class="font13 blue">{{  item.state  }}</span>
            </div>
            <div class="customer_right">
              <div class="customer_status">
                <span style="margin-bottom: 10px" class="font13">最后跟进：{{
                   item.updateTime == null ? "无" : item.updateTime
                  }}</span>
                <span class="font13">客户星级：
                  <!-- {{  item.star == null ? "无" : item.star  }} -->
                     <span v-if="item.star" class="img">
                       <img src="@/assets/images/user_start.png" v-for="i in parseInt(item.star)" :key="i">
                     </span>
                </span>
                <!-- <div class="font13">
                   <span>客户星级： <img src="@/assets/images/user_start.png" alt=""></span>
                </div> -->
              </div>
              <div class="">
                <MsgAndPhone :type="1" :ob="item" :name="item.name" :callPhone="getPhone(item)" />
                <div class="right_icon">
                  <i @click="jumpDetail(item)" class="el-icon-arrow-right"></i>
                </div>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
      
    </div>
    <div class="footer" v-if="!choose">
      <!-- <div>
        <span></span>
        <span></span>
      </div> -->
      <div @click="handleChoose(0)">
        <span></span>
        <span>电话任务</span>
      </div>
      <!--<div @click="handleChoose(1)">
        <span></span>
        <span>短信任务</span>
      </div>-->
      <div @click="handleChoose(2)">
        <span></span>
        <span>客户转移</span>
      </div>
      <div @click="handleChoose(3)">
        <span></span>
        <span>移入公海</span>
      </div>
    </div>
    <div class="footer" v-else>
      <van-checkbox style="flex-shrink: 0; margin-right: 20px" v-model="checked">全选({{  result.length  }})
        <template #icon="props">
          <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
        </template>
      </van-checkbox>
      <van-button :disabled="result.length == 0" class="btnself" @click="handleConfirm(handleType)" round type="info"
        style="width: 200px">{{
         handleType == 1
     ? "创建短信任务"
     : handleType == 3
       ? "移入公海" : handleType == 0 ? '创建电话任务'
         : "客户转移"


        }}</van-button>
      <div @click="choose = false">取消</div>
    </div>
    <!-- 0线索1客户2公海 -->
    <messageSendVue :type="1" :ids="result" ref="messageSendVue" />
    <phoneTask :ids="result" :type="1" ref="phoneTask" />
  </div>
</template>

<script>
import { getlist } from "@/api/customer/index";
import messageSendVue from "../components/messageSend.vue";
import phoneTask from "../components/phoneTask.vue"
import MsgAndPhone from "../components/msgAndPhone.vue";
export default {
  components: {
    messageSendVue,
    phoneTask,
    MsgAndPhone,
    // Sms,
  },
  data() {
    return {
      activeIcon: require("@/assets/images/checked.png"),
      inactiveIcon: require("@/assets/images/check.png"),

      isApp: 2,
      result: [],
      choose: false,
      loading: true,
      checked: false,
      handleType: "",
      total: 0,
      customerList: [],
      queryParams: {},
      smsPhone: "",
    };
  },
  watch: {
    choose(val) {
      if (!val) {
        this.result = [];
      }
    },
    result(val) {
      console.log(val.length, this.customerList.length);
      if (val.length == this.customerList.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    checked(val) {
      if (val) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        if (!val && this.result.length == this.customerList.length) {
          this.$refs.checkboxGroup.toggleAll();
        }
      }
    },
  },
  mounted() {
    console.log(this.$store.state.user.isApp);
    this.isApp = LukeappApi.getattribute().header;
    this.getData(this.queryParams);
  },
  methods: {
    getPhone(item) {
      let a = item.phone ? item.phone : item.contactPhone;
      return a;
    },
    jumpSms(ob) {
      console.log(ob);
      this.$router.push({
        path: "/smsh5",
        query: {
          phone: ob.contactPhone,
          id: ob.id,
        },
      });
    },
    handleConfirm(type) {
      if (type == 0) {
        this.$refs.phoneTask.smsDialog = true;
        return;
      }
      if (type == 1) {
        this.$refs.messageSendVue.smsDialog = true;
        return;
      }

      if (type == 3) {
        this.$router.push({
          path: "/transformsea",
          query: {
            ids: JSON.stringify(this.result),
          },
        });
        return;
      }
      if (type == 2) {
        this.$router.push({
          path: "/transforwithperson",
          query: {
            ids: JSON.stringify(this.result),
          },
        });
        return;
      }
    },
    handleChoose(item) {
      this.handleType = item;
      this.choose = true;
    },
    handleAdd() {
      this.$router.push({
        path: "/addcustomer",
      });
    },
    jumpGo() {
      this.$router.push("/crm");
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      getlist(query).then((res) => {
        this.customerList = res.rows;
        // console.log('this.customerList------',this.customerList);
        this.total = res.total;
        this.loading = false;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/customerDetailh5",
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
  background: #f3f3f3;
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
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
    margin-left: 26px;
}

.work {
  padding-bottom: 76px;
  background: #f3f3f3;
  overflow: auto;
  padding-top: 56px;
}

.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  // display: flex;
  // justify-content: space-between;
  background: #ffffff;
  border-radius: 6px;

  .customer_info {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e7e7e7;
    padding: 14px 15px;

    // flex-direction: column;
    .customer_name {
      color: #212121;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
      font-weight: 600;
    }
  }

  .customer_status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 10px;
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.customer_right {
  position: relative;
  padding: 20px 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .imgWarp {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding-right: 20px;
    height: 100%;
    margin-right: 30px;
  }

  img {
    width: 20px;
    height: 20px;
    // margin-bottom: 10px;
  }

  .right_icon {
    display: flex;
    align-items: center;
    padding-left: 20px;
    position: absolute;
    right: 10px;
    top: 0;
    bottom: 0;
    margin: auto;
    color: #e3e3e3;
    font-size: 30px;
  }
}

.font13 {
  font-size: 13px;
  img{
    width: 12px;
    height: 12px;
    vertical-align: center;
    margin-right: 5px;
  }
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

.footer {
  padding: 0 20px;
  height: 56px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  align-items: center;
  font-size: 13px;
  border-top: 1px solid #e9eaec;
}
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
.blue{
  color: #2B82FC;
}
</style>
