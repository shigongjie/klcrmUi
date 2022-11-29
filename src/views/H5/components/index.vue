<template>
  <div class="container">
    <div class="header">
      <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
      <span>跟进记录</span>
      <span><i class=""></i></span>
    </div>
    <div class="pd">
      <div class="nodata" v-if="followRecordData.length == 0">暂无数据</div>
      <div class="work">
        <div
          v-for="(item, index) in followRecordData"
          :key="index"
          class="contant"
        >
          <div class="date_div"><i class="el-icon-time"></i> {{ item.date }}</div>
          <div
            class="dynamic_card"
            v-for="(items, indexs) in item.list"
            :key="indexs"
          >
            <div class="card">
              <div class="userInfo">
                <div class="person_info">
                  <img
                    :src="
                      items.avatar == '' || items.avatar == null
                        ? $store.state.user.avatar
                        : items.avatar
                    "
                    alt=""
                  />
                  <span>{{ items.userName }}</span>
                </div>
                <span>{{ items.dynamicTitle }}</span>
              </div>

              <div class="dynamic_conent">
                {{ items.dynamicContent }}
              </div>
              <div class="dynamic_time">
                <span> <i class="el-icon-time"></i>{{ items.createTime }}</span>
                <span @click="toast"
                  ><i class="el-icon-chat-round"></i
                  >{{ items.list == null ? "0" : items.list.length
                  }}<i style="margin-left: 10px" class="el-icon-arrow-right"></i
                ></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  generalInfo,
  followrecordpage,
  operaLogList,
  customerremove,
} from "@/api/customer/index";
export default {
  data() {
    return {
      customerInfo: {},
      dynamicList: [],
      dataVO: {},
      activeName: "1",
      followRecordData: [],
      operaLogData: [],
      deldia: false,
      footerList: [
        { name: "转移客户", icon: "", action: "0" },
        { name: "移入公海", icon: "", action: "1" },
        { name: "编辑客户", icon: "", action: "2" },
        { name: "删除客户", icon: "", action: "3" },
      ],
    };
  },
  mounted() {
    this.followRecordList();
  },
  methods: {
    delconfirm() {
      customerremove({ ids: [this.$route.query.id] }).then((res) => {
        this.$router.push({
          path: "/customerh5",
        });
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    handleAction(type) {
      if (type == 2) {
        this.$router.push({
          path: "/addcustomer",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 1) {
        this.$router.push({
          path: "/transformsea",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 0) {
        this.$router.push({
          path: "/transforwithperson",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 3) {
        this.deldia = true;
      }
    },
    jumpgo() {
      this.$router.go(-1);
    },
    //   操作记录
    operaLogList() {
      operaLogList({ customerId: this.$route.query.id }).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    // 跟进记录
    followRecordList() {
      followrecordpage().then((res) => {
        this.followRecordData = res.data.records;
      });
    },
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    handleClick() {},
    // 客户详情
    getcustomerdetail() {
      generalInfo({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data.customerEntity;
        if (res.data.customerEntity.contactEntity == null) {
          this.customerInfo.contactEntity = {};
        }
        this.dynamicList = res.data.list;
        this.dataVO = res.data.dataVO;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-message-box__wrapper {
  ::v-deep .zdylm {
    width: 300px !important;
  }
}

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

.pd {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 56px;
  // background: RGB(249, 249, 249);
}
.tab {
  margin-top: 15px;
  ::v-deep .el-tabs__nav-wrap {
    background-color: #ffffff;
  }
  ::v-deep .is-top:nth-child(2) {
    padding-left: 20px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: #ffffff !important;
  }
  ::v-deep .el-tabs__item {
    font-size: 12px;
  }
  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    justify-content: space-between;
  }
}

.customer_info {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(3, 33.3%);
  background: #ffffff;
  div {
    text-align: center;
    font-size: 13px;
    padding: 6px 0;
  }
}
.work {
  padding: 0 20px;
  padding-bottom: 64px;
  // background: RGB(249, 249, 249);
}
.dynamic_card {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 0;
  .card {
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    font-size: 13px;
    padding: 0 10px;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .dynamic_conent {
      padding-left: 40px;
      padding-top: 10px;
    }
    .dynamic_time {
      display: flex;
      justify-content: space-between;
      padding-left: 40px;
      padding-top: 20px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.base_info_title {
  font-size: 13px;
  padding-left: 10px;
  font-weight: 600;
}
.base_info_card {
  background: #ffffff;
  font-size: 13px;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9eaec;
}
.opera_card {
  background: #ffffff;
  width: 95%;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  .operaUser {
    border-bottom: 1px solid #e9eaec;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 10px 20px;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .opera_text_card {
    font-size: 13px;
    div {
      padding: 8px 20px;
    }
  }
}
.footer {
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
.nodata {
  padding: 50px 0;
  text-align: center;
}
.date_div{
    color: #409EFF;
    margin-top: 10px;
    font-size: 13px;
}
</style>