<template>
  <div class="h5-container">
    <Navbar :title="'公共线索'" @jump="jumpgos" />
    <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 56px;' : ''">
      <div class="headers" v-if="$store.state.user.isApp != 2">
        <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
        <span>公共线索</span>
        <span></span>
      </div>
      <div class="work">
        <div class="nodata">
          <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
          <div class="clickSearch" @click="clickSearch">去搜索公共线索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getlist } from "@/api/customer/index";
export default {
  data() {
    return {
      loading: true,
      isApp: 2,
      total: 0,
      customerList: [],
      queryParams: {},
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getData(this.queryParams);
  },
  methods: {
    clickSearch() {
      // this.$router.push("/searchpublicSaleh5");
      this.$router.push("/maph5");
    },
    jumpgos() {
      if (window.location.href.indexOf("token") != -1) {
        LukeappApi.clt_close_browser("paysuccess");
      } else {
        this.jumpGo();
      }
    },
    jumpGo() {
      this.$router.push("/crm");
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      getlist(query).then((res) => {
        this.customerList = res.rows;
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
  height: 500px;
  color: #999999;
  img {
    width: 150px;
    height: 150px;
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}
.clickSearch {
  width: 166px;
  height: 44px;
  background: linear-gradient(90deg, #5b9efc, #3c8bfa);
  border-radius: 6px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #ffffff;
  line-height: 44px;
  text-align: center;
  margin-top: 30px;
}
</style>
