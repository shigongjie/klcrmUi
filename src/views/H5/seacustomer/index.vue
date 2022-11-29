<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">公海客户</span>
      <!-- <span><i @click="handleAdd" class="el-icon-plus"></i></span> -->
      <span class="add-ai" @click="handleAdd">
        <div class="imgWarp">
          <img src="@/assets/images/add.png" alt="" />
        </div>
        新增
      </span>
    </div>
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <!-- <div class="nodata" v-if="customerList.length == 0 && !loading">
        <i class="el-icon-hot-water"></i>
        暂无数据
      </div> -->
      <div class="nodata" v-if="customerList.length == 0 && !loading">
        <img src="@/assets/images/nodata.png" alt="" />
        暂时什么都没有
      </div>
      <div v-if="!loading">
        <van-checkbox-group v-model="result" ref="checkboxGroup">
          <div class="contant" v-for="(item, index) in customerList" :key="index">
            <div class="customer_info">
              <div style="display: flex">
                <van-checkbox v-if="choose" :name="item.id" style="margin-right:10px">
                  <template #icon="props">
                    <img class="img-icon" :src="props.checked ? activeIcon : inactiveIcon" />
                  </template>
                </van-checkbox>
                <span class="customer_name">{{  item.name  }}</span>
              </div>

              <span class="font13" style="margin-top: 15px">联系人姓名：{{
                 item.contactName == null ? "无" : item.contactName
                }}</span>
              <!-- <span class="font13">客户星级:{{ item.star }}</span> -->
            </div>
            <div class="customer_right">
              <div class="customer_status">
                <MsgAndPhone :type="2" :ob="item" :name="item.name" :callPhone="getPhone(item)" />
              </div>
              <div class="right_icon">
                <i @click="jumpDetail(item)" class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </van-checkbox-group>
      </div>
    </div>
    <div class="footer" v-if="!choose">
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
        <span>转移客户</span>
      </div>
      <div @click="handleChoose(3)">
        <span></span>
        <span>删除客户</span>
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
         ? "删除客户" : handleType == 0 ? '创建电话任务'
         : "转移客户"

        }}</van-button>
      <div @click="choose = false">取消</div>
    </div>
    <!-- 0线索1客户2公海 -->
    <messageSendVue :type="2" :ids="result" ref="messageSendVue" />
    <phoneTask :ids="result" :type="2" ref="phoneTask" />
    <!-- 删除提示 -->
    <el-dialog title="删除确认" :visible.sync="deldia" width="300px" top="30%">
      <span>确定要删除所选客户吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="deldia = false">取 消</el-button>
        <el-button type="primary" @click.native="delconfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import messageSendVue from "../components/messageSend.vue";
import phoneTask from "../components/phoneTask.vue"
import MsgAndPhone from "../components/msgAndPhone.vue";
import { getlist, customerremove } from "@/api/customer/index";
export default {
  components: {
    messageSendVue,
    phoneTask,
    MsgAndPhone
  },
  data() {
    return {
      deldia: false,
      activeIcon: require("@/assets/images/checked.png"),
      inactiveIcon: require("@/assets/images/check.png"),
      choose: false,
      loading: true,
      checked: false,
      handleType: "",
      result: [],
      loading: true,
      total: 0,
      customerList: [],
      queryParams: {
        status: 1,
      },
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
    this.getData(this.queryParams);
  },
  methods: {
    getPhone(item) {
      let a = item.phone ? item.phone : item.contactPhone;
      return a;
    },
    delconfirm() {
      customerremove({ ids: this.result }).then((res) => {
        this.$toast("删除成功");
        this.deldia = false;
        this.getData(this.queryParams);
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
        this.deldia = true;
        return;
      }
      if (type == 2) {
        this.$router.push({
          path: "/pickcustomerh5",
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
        path: "/addSeacustomer",
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
        this.total = res.total;
        this.loading = false;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/seacustomerdetailh5",
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
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
    margin-left:25px;
}
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
.work {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}

.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
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
    justify-content: space-between;

    .customer_name {
      font-family: PingFang SC;
      font-weight: 500;
      color: #212121;
      font-size: 14px;
      // margin-bottom: 15px;
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
    color: #dfdfdf;
    font-size: 24px;
  }
}

.font13 {
  font-size: 12px;
  color: #666666;
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
</style>
