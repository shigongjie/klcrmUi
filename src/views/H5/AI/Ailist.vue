<template>
  <div class="h5-container">
    <div class="add" @click="jumpwallet">
      <img src="@/assets/images/mine.png" alt="" />
    </div>
    <div class="add2" @click="confirmRecharge()">
      <img src="@/assets/images/recharge1.png" alt="" />
    </div>
    <Navbar :title="'AI外呼'" @jump="jumpgoApp" />
    <span v-if="$store.state.user.isApp == 2" class="add-ai" @click="handleAdd"
      style="position: fixed; top: 55px; right: 10px; z-index: 9999">
      <div class="imgWarp"><img src="@/assets/images/add.png" alt="" /></div>
      新增
    </span>
    <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 56px;' : ''">
      <div class="headers" v-if="$store.state.user.isApp != 2">
        <span @click="jumpGo"><i class="el-icon-arrow-left"></i></span>
        <span>AI外呼</span>
        <span class="add-ai" @click="handleAdd">
          <div class="imgWarp">
            <img src="@/assets/images/add.png" alt="" />
          </div>
          新增
        </span>
      </div>
      <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 26px;' : ''">
        <div class="nodata" v-if="loading">
          <van-loading color="#1989fa" />
        </div>
        <div class="nodata" v-if="customerList.length == 0">
          <i class="el-icon-hot-water"></i>
          暂无数据
        </div>
        <div style="background: #f3f3f3; padding-bottom: 10px" v-if="!loading">
          <div @click="jumpDetail(item)" class="contant" v-for="(item, index) in customerList" :key="index">
            <div class="customer_info">
              <span class="customer_name">创建时间：{{  item.createTime  }}</span>
              <div class="customer_status">
                <span class="font13" :class="item.status == 0 ? 'done' : ''">{{
                   item.status == 0 ? "未处理" : "已处理" 
                  }}</span>
              </div>
            </div>
            <div class="customer_right">
              <div>
                <div style="margin: 15px 0" class="font13">
                  导入数量：{{  item.createNum == null ? "无" : item.createNum  }}
                </div>
                <div class="font13">剩余条数：{{  item.lastNum  }}</div>
              </div>

              <div class="right_icon">
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { callpage } from "@/api/Ai/index";
export default {
  data() {
    return {
      loading: true,
      total: 0,
      customerList: [],
      queryParams: {},
      isApp: 2,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getData(this.queryParams);
  },
  methods: {
    confirmRecharge() {
      this.$router.push({
        path: "/recharge",
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
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  // display: flex;
  // justify-content: space-between;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;

  .customer_info {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #eeeeee;
    padding-bottom: 10px;

    .customer_name {
      font-size: 15px;
      font-weight: 600;
      color: #212121;
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
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  // line-height: 48px;
  font-size: 13px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right_icon {
    display: flex;
    align-items: center;
    padding-left: 20px;
    font-size: 28px;
    color: #e1e1e1;
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

.add {
  position: fixed;
  width: 70px;
  height: 70px;
  // background: #409eff;
  border-radius: 50%;
  z-index: 999;
  bottom: 10px;
  right: 10px;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;

  img {
    width: 70px;
    height: 70px;
  }
}

.add2 {
  position: fixed;
  width: 70px;
  height: 70px;
  // background: #409eff;
  border-radius: 50%;
  z-index: 999;
  bottom: 80px;
  right: 10px;
  font-size: 20px;
  line-height: 40px;
  text-align: center;
  color: #ffffff;

  img {
    width: 70px;
    height: 70px;
  }
}

.done {
  color: #f75e5e;
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
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
  }
}
</style>
