<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''"
    >
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">联系人管理</span>
      <span class="add-ai" @click="handleAdd"
        ><div class="imgWarp">
          <img src="@/assets/images/add.png" alt="" />
        </div>
        新增</span
      >
      
    </div>
    <!-- @click="jumpDetail(item)" -->
    <div
      class="work"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <div class="nodata" v-if="customerList.length == 0&&!loading">
        <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
      </div>
      <div v-if="!loading">
        <div class="contant" v-for="(item, index) in customerList" :key="index">
          <div class="info">
            <div class="eachInfo">
              <span class="customer_name"
                >{{ item.contactName }}
                <img
                  v-if="item.sex == 2"
                  src="@/assets/images/woman.png"
                  alt=""
                />
                <img
                  v-if="item.sex == 1"
                  src="@/assets/images/man.png"
                  alt=""
                />

                <span v-if="item.deptRole" class="deptRole">{{
                  item.deptRole
                }}</span>
                <span v-if="item.role" class="role">{{ item.role }}</span>
              </span>
            </div>
            <div class="companyName">
              {{ item.relevancyClient }}
            </div>
            <div class="eachInfo telAndbir">
              <span class="phone"
                ><img src="@/assets/images/contantphone.png" alt="" />{{
                  item.phone == null ? "无" : item.phone
                }}</span
              >
              <span class="bir"
                ><img src="@/assets/images/gift.png" alt="" />生日：{{
                  item.birthday == null ? "-" : item.birthday
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
import {
  contactlistAll,
  deleteByIds,
  contactexport,
} from "@/api/customer/index";
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
      this.$router.push("/crm");
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      contactlistAll(query).then((res) => {
        this.customerList = res.rows;
        // this.total = res.total;
        this.loading = false;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/saleleaddetailh5",
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
    margin-left:26px;
}
.work {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
  // background-color: #ff7926;
}
.contant {
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
    .companyName {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #666666;
      padding: 18px 0;
      border-bottom: 1px solid #eeeeee;
    }
    .telAndbir {
      padding-top: 10px;
      .phone {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 600;
        color: #212121;
        display: flex;
        align-items: center;
      }
      .bir {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #999999;
        margin-top: 5px;
        display: flex;
        align-items: center;
      }
      img {
        width: 15px;
        height: 15px;
        margin-right: 5px;
      }
    }
    .eachInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .customer_name {
        color: #212121;
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #212121;
        font-weight: 600;
        display: flex;
        align-items: center;
        img {
          width: 15px;
          height: 15px;
          margin-left: 10px;
        }
        .deptRole {
          // height: 16px;
          background: #ebf5fe;
          border-radius: 5px;
          font-family: PingFang SC;
          font-weight: 500;
          color: #2b82fc;
          // line-height: 16px;
          font-size: 12px;
          padding: 2px 5px;
          margin-left: 10px;
        }
        .role {
          padding: 2px 5px;
          // height: 16px;
          background: #fff4ea;
          border-radius: 5px;
          font-family: PingFang SC;
          font-weight: 500;
          font-size: 12px;
          color: #ff7926;
          margin-left: 10px;
          // line-height: 16px;
        }
      }
    }
  }
  .customer_info {
    display: flex;
    flex-direction: column;
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
</style>
