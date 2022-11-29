<template>
  <div class="h5-container">
    <Navbar :title="'话费充值'" @jump="jumpGo" />
    <div class="container" :style="isApp == 2 ? 'padding-top: 56px;' : ''">
      <div class="headers" v-if="isApp != 2">
        <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
        <span>话费充值</span>
        <span></span>
      </div>
      <div class="work" :style="isApp == 2 ? 'padding-top: 26px;' : ''">
        <div class="total">
          <span>当前账户剩余（条）</span>
          <span
            ><i class="count">{{ lastNum }}</i></span
          >
        </div>
        <div class="list">
          <div @click="jumpRechargeRecord()">
            <span
              ><img src="@/assets/images/recharge.png" alt="" /> 充值记录</span
            ><span><i class="el-icon-arrow-right"></i></span>
          </div>
          <div @click="jumpusageRecord()">
            <span><img src="@/assets/images/usage.png" alt="" />使用记录</span
            ><span><i class="el-icon-arrow-right"></i></span>
          </div>
        </div>
        <div style="padding: 20px">
          <van-button type="info" block @click="confirmRecharge"
            >去充值</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { callpage } from "@/api/Ai/index";
import { rechargesave, getConfig } from "@/api/wallet/index";
export default {
  data() {
    return {
      loading: true,
      total: 0,
      customerList: [],
      queryParams: {},
      isApp: 2,
      lastNum: 0,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    getConfig().then((res) => {
      this.lastNum = res.data.lastNum;
    });
  },
  methods: {
    confirmRecharge() {
      this.$router.push({
        path: "/recharge",
      });
    },
    jumpRechargeRecord() {
      this.$router.push({
        path: "/rechargeRecord",
      });
    },
    jumpusageRecord() {
      this.$router.push({
        path: "/usageRecord",
      });
    },
    jumpwallet() {
      this.$router.push({
        path: "/wallet",
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/AIh5",
      });
    },
    jumpgoApp() {
      LukeappApi.clt_close_browser("paysuccess");
    },
    jumpGo() {
      this.$router.go(-1);
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      callpage(query).then((res) => {
        this.customerList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/AIdetailh5",
        query: {
          id: ob.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
body {
  background: #f3f3f3;
}
.container {
  height: 100%;
  color: #606266;
}

.headers {
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

.work {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
}

.contant {
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;

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
    justify-content: space-between;

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

.total {
  width: 90%;
  padding: 20px;
  height: 98px;
  background: #ffffff;
  border-radius: 10px;
  margin: auto;
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  i {
    font-style: normal;
    font-weight: 600;
  }

  .count {
    font-style: normal;
    font-size: 30px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
    padding-top: 30px;
  }
}

.list {
  // padding:0 20px;
  width: 90%;
  margin: auto;
  background: #ffffff;
  border-radius: 10px;
  margin-top: 10px;
  div {
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #f1f1f1;
    align-items: center;
    font-size: 13px;
  }
  span {
    display: flex;
    align-items: center;
    color: #323232;
  }
  img {
    width: 20px;
    height: 20px;
    margin-right: 5px;
  }
}
</style>
