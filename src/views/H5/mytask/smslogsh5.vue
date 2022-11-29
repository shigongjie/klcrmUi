<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''"
    >
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span>{{ $route.query.name }}</span>
      <span></span>
    </div>
    <!-- @click="jumpDetail(item)" -->
    <div
      class="work"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <div class="nodata" v-if="customerList.length == 0">
        <i class="el-icon-hot-water"></i>
        暂无数据
      </div>
      <div v-if="!loading">
        <div
          class="contant"
          v-for="(item, index) in customerList"
          :key="index"
        >
          <div class="info">
            <div class="eachInfo">
              <span class="customer_name">{{ item.customerName }}</span>
              <span class="font13">{{ item.noteStatus }}</span>
            </div>
            <div class="" style="margin-top:5px">
              <span class="font13">联系电话：</span>
              <span class="font13">{{ item.customerPhone }}</span>
            </div>
            <div class="eachInfo">
              <span style="margin: 15px 0" class="font13"
                >发送内容：{{ item.noteDetails == null ? "无" : item.noteDetails }}</span
              >
            </div>
            <div class="eachInfo">
              <!-- <span class="font13"
                >回复内容：{{ item.noteReply == null ? "无" : item.noteReply }}</span
              > -->
              <span class="font13"
                >发送时间：{{
                  item.sendTime == null ? "-" : item.sendTime
                }}</span
              >
            </div>
          </div>

          <div class="customer_right">
            <!-- <div class="customer_status">
              <span class="font13">{{ item.relevancyClient }}</span>
            </div> -->
            <div class="right_icon">
              <!-- <i class="el-icon-arrow-right"></i> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { getlist, massTextingdelete } from "@/api/sms/index";
import { getlistByid, massTextingexport } from "@/api/sms/index";
export default {
  data() {
    return {
      loading: true,
      total: 0,
      customerList: [],
      queryParams: {
        type: 2,
      },
    };
  },
  beforeMount() {
    if (this.$route.query.id) {
      this.queryParams.id = this.$route.query.id;
    }
  },
  mounted() {
    this.getData(this.queryParams);
  },
  methods: {
    handleAdd() {
      this.$router.push({
        path: "/addconnectpersonh5",
      });
    },
    jumpGo() {
      this.$router.go(-1);
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      getlistByid(this.queryParams).then((res) => {
        this.total = res.total;
        this.customerList = res.rows;
        this.loading = false;
      });
      //   getlist(query).then((res) => {
      //     this.customerList = res.rows;
      //     // this.total = res.total;
      //     this.loading = false;
      //   });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/smslogsh5",
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
  .info {
    width: 100%;
    .eachInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }
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
</style>
