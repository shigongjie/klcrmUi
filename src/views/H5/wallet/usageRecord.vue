<template>
  <div class="h5-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <Navbar :title="'使用记录'" @jump="jumpGo" />
      <div class="container" :style="isApp == 2 ? 'padding-top: 56px;' : ''">
        <div class="headers" v-if="isApp != 2">
          <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
          <span>使用记录</span>
          <span></span>
        </div>
        <div class="work" :style="isApp == 2 ? 'padding-top: 40px;' : ''">
          <div class="each" v-for="(item, index) in list" :key="index">
            <div class="more">
              <div>
                <span>创建时间:{{ item.createTime }}</span>
                <span>剩余条数:{{ item.lastNum }}</span>
              </div>

              <div class="user">
                <span
                  ><img
                    :src="
                      item.avatar == '' || item.avatar == null
                        ? $store.state.user.defaultAvatar
                        : item.avatar
                    "
                    alt=""
                /></span>
                <span>{{ item.userName }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </van-list>
  </div>
</template>

<script>
import { getusageList } from "@/api/wallet/index";
export default {
  data() {
    return {
      loading: false,
      finished: false,
      total: 0,
      list: [],
      queryParams: {},
      isApp: 2,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
  },
  methods: {
    onLoad() {
      console.log(111);

      this.loading = true;
      let data = {};
      getusageList().then((res) => {
        this.list = this.list.concat(res.rows);
        if (this.list.length >= res.total) {
          this.finished = true;
        } else {
          this.finished = false;
          this.paramas.pageNum += 1;
        }
        this.loading = false;
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
      getWorkOrderList(query).then((res) => {
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
body,
html {
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
  padding: 12px 12px;
  padding-top: 68px;
  background: #f3f3f3;
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
  padding: 20px;

  i {
    font-style: normal;
    font-weight: 600;
  }

  .count {
    font-style: normal;
    color: red;
  }
}

.list {
  // padding:0 20px;
  div {
    padding: 18px 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e9eaec;
    font-size: 13px;
  }

  div:first-child {
    border-top: 1px solid #e9eaec;
  }
}

.each {
  padding: 23px 16px;
  background: #ffffff;
  border-radius: 10px;
  margin-bottom: 12px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
}

.orderSn {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  align-items: center;

  .status {
    font-size: 13px;
  }
}

.more {
  font-size: 13px;
  display: flex;
  justify-content: space-between;

  // div{
  //   padding: 8px 0;
  // }
  span:first-child {
    padding: 5px 0;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }
  span {
    padding: 5px 0;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }

  div:first-child {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
  }

  .user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-end;
  }

  img {
    border-radius: 50%;
    width: 38px;
    height: 38px;
  }
}

.circle {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.color1 {
  background: #f56c6c;
}

.color2 {
  background: #409eff;
}

.color3 {
  background: #67c23a;
}

.color4 {
  background: #909399;
}
</style>
