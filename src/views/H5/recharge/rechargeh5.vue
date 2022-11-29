<template>
  <div class="h5-container">
    <Navbar :title="'话费充值'" @jump="jumpGo" />
    <div class="container" :style="isApp == 2 ? 'padding-top: 56px;' : ''">
      <div class="headers" v-if="isApp != 2">
        <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
        <span class="title_task">话费充值</span>
        <span></span>
      </div>
      <div class="work" :style="isApp == 2 ? 'padding-top: 26px;' : ''">
        <div class="total">
          <span>企业名称</span>
          <span
            ><i class="count">{{ $store.state.user.companyName }}</i></span
          >
        </div>

        <div class="list">
          <div
            @click="chooseThis(item)"
            v-for="(item, index) in list"
            :key="index"
            :class="{ isActive: item == currentob }"
          >
            <span class="iscount">{{ item }}元</span>
          </div>
        </div>
        <div style="padding: 20px; background: #ffffff">
          <van-button class="btnself" type="info" block @click="confirmRecharge"
            >确认充值</van-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { addCharges } from "@/api/sms/package";
export default {
  data() {
    return {
      lastNum: 0,
      loading: true,
      total: 0,
      currentob: {},
      list: [10, 30, 50, 100, 200, 300, 400, 500],
      queryParams: {},
      isApp: 2,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
  },
  methods: {
    chooseThis(ob) {
      this.currentob = ob;
    },
    confirmRecharge() {
      if (this.currentob == undefined || null) {
        this.$message.error("请选择要充值的金额");
        return;
      }
      let data = {};
      data.rechargeAmount = this.currentob;
      data.payWay = 0;
      data.payAmount = this.currentob;
      addCharges(data).then((res) => {
        if (res.success) {
          window.location.href = res.data;
        }
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
  },
};
</script>

<style lang="scss" scoped>
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

.title_task {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  margin-left: -20px;
}
.el-icon-arrow-left{
  font-size:16px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
.work {
  height: 100%;
  padding-top: 56px;
  display: flex;
  flex-direction: column;
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
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
    padding-top: 30px;
  }
}

.list {
  // padding:0 20px;
  flex: 1;
  background: #ffffff;
  margin-top: 20px;
  padding: 20px 20px;
  display: grid;
  grid-template-columns: 32% 32% 32%;
  grid-template-rows: 74px 74px 74px;
  grid-gap: 12px 6px;
  div {
    color: #212121;
    width: 100%;
    // min-width: 120px;
    height: 74px;
    background: #fafafa;
    border: 1px solid #cccccc;
    border-radius: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: 10px;
    justify-content: center;
    // margin-right: 8px;
    .iscount {
      font-size: 20px;
      font-weight: bold;

      font-family: PingFang SC;
    }
    .give {
      font-size: 12px;
      font-family: PingFang SC;
      font-weight: 500;
    }

    span {
      padding: 5px;
      font-size: 15px;
      font-weight: 600;
    }
  }
  .isActive {
    background: #f5fbff !important;
    border: 2px solid #2a81fc !important;
    color: #2a81fc !important;
  }
}
</style>
