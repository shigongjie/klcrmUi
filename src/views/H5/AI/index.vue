<template>
  <div class="h5-container">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
    >
      <Navbar style="z-index: 99" :title="'创建AI外呼任务'" @jump="jumpgo" />
      <div class="container" >
        <div class="headers" :style="$store.state.user.isApp == 2 ? 'padding-top: 96px;' : ''">
          <div class="topNav" v-if="$store.state.user.isApp != 2">
            <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
            <span>创建AI外呼任务</span>
            <span><i class=""></i></span>
          </div>
          <van-dropdown-menu>
            <van-dropdown-item
              @change="changeorder"
              v-model="value1"
              :options="option1"
            />
            <van-dropdown-item
              @change="changeorder"
              v-model="value2"
              :options="option2"
            />
          </van-dropdown-menu>
        </div>
        <div
          class="pd"
          :style="$store.state.user.isApp == 2 ? 'padding-top: 146px;' : ''"
        >
          <van-checkbox-group v-model="result" ref="checkboxGroup">
            <div class="card" v-for="(item, index) in list" :key="index">
              <div>
                <div class="name">
                  {{ item.name }}
                </div>
                <div style="font-size: 12px">
                  {{ item.phone }}
                </div>
              </div>
              <!-- <van-checkbox :name="item.customerId"> </van-checkbox> -->
              <van-checkbox :name="item.customerId">
                <template #icon="props">
                  <img
                    class="img-icon"
                    :src="props.checked ? activeIcon : inactiveIcon"
                  />
                </template>
              </van-checkbox>
            </div>
          </van-checkbox-group>
        </div>

        <!-- 删除提示 -->
        <el-dialog
          title="删除确认"
          :visible.sync="deldia"
          width="300px"
          top="30%"
        >
          <span>确定要删除该条记录吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button @click.native="deldia = false">取 消</el-button>
            <el-button type="primary" @click.native="delconfirm"
              >确 定</el-button
            >
          </span>
        </el-dialog>
      </div>
    </van-list>
    <div class="footer">
      <van-checkbox style="flex-shrink: 0; margin-right: 20px" v-model="checked"
        >全选({{ result.length }})
        <template #icon="props">
          <img
            class="img-icon"
            :src="props.checked ? activeIcon : inactiveIcon"
          />
        </template>
      </van-checkbox>
      <van-button
        :disabled="result.length == 0"
        @click="submit"
        class="btnself"
        round
        type="info"
        style="width: 100%"
        >确认创建AI外呼任务</van-button
      >
    </div>
  </div>
</template>

<script>
import { getlist, callsave } from "@/api/Ai/index";
export default {
  data() {
    return {
      activeIcon: require("@/assets/images/checked.png"),
      inactiveIcon: require("@/assets/images/check.png"),
      isApp: 2,
      value1: "createTime",
      value2: "desc",
      option1: [
        { text: "客户名称", value: "name" },
        { text: "创建时间", value: "createTime" },
      ],
      option2: [
        { text: "正序排序", value: "asc" },
        { text: "倒序排序", value: "desc" },
      ],
      deldia: false,
      checked: false,
      list: [],
      result: [],
      loading: false,
      finished: false,
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    // this.commonCluelist();
  },
  filters: {
    test(val) {
      if (val != "" && val != undefined && val != null) {
        var resultPhone = val.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
        return resultPhone;
      } else {
        return val;
      }
    },
  },
  watch: {
    result(val) {
      console.log(val.length, this.list.length);
      if (val.length == this.list.length) {
        this.checked = true;
      } else {
        this.checked = false;
      }
    },
    checked(val) {
      if (val) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        if (!val && this.result.length == this.list.length) {
          this.$refs.checkboxGroup.toggleAll();
        }
      }
    },
  },
  methods: {
    submit() {
      callsave({ customerIds: this.result })
        .then((res) => {
          if (res.success) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
            this.$router.push("/Ailisth5");
          } else {
            console.log(this.Dialog);
            // console.log(1111);
            // alert("111");
            this.$dialog
              .alert({
                title: "剩余数量不足",
                message: res.message,
                theme: "round-button",
                className: "dialogself",
                confirmButtonColor: "linear-gradient(90deg, #5B9EFC, #3C8BFA)",
                confirmButtonText: "去充值",
              })
              .then(() => {
                // on close
                this.$router.push({
                  path: "/recharge",
                });
              });
          }
        })
        .catch((err) => {
          //  this.$notify('提示文案');
        });
    },
    commonCluelist() {
      getlist(this.queryParams).then((res) => {
        console.log(res);
        this.list = res.data;
        this.checked = true;
        setTimeout(() => {
          this.$refs.checkboxGroup.toggleAll(true);
        }, 100);
      });
    },
    onLoad() {
      this.loading = true;
      let data = {};
      data = Object.assign(this.queryParams, data);
      getlist(data)
        .then((res) => {
          // console.log(res);
          this.list = this.list.concat(res.rows);
          if (this.list.length >= res.total) {
            this.finished = true;
          } else {
            this.finished = false;
            this.queryParams.pageNum += 1;
          }
          // this.checked = true;
          this.loading = false;
          setTimeout(() => {
            // this.$refs.checkboxGroup.toggleAll(true);
            res.rows.forEach((item) => {
              this.result.push(item.customerId);
            });
          }, 100);
        })
        .catch((err) => {});
    },
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
    changeorder(val) {
      this.queryParams.field = this.value1;
      this.queryParams.order = this.value2;
      getlist(this.queryParams).then((res) => {
        console.log(res);
        this.list = res.rows;
      });
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
      followRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.followRecordData = res.rows;
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
.headers {
  position: fixed;
  width: 100%;
  background: #ffffff;
  z-index: 99;
  .topNav {
    width: 100%;
    height: 56px;
    display: flex;
    padding: 20px 15px;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    background: #ffffff;
  }
}
.pd {
  height: 100%;
  padding-top: 106px;
  padding-bottom: 76px;
  background: #f3f3f3;
  overflow: auto;
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
    background: #ffffff;
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
.nodata {
  padding: 50px 0;
  text-align: center;
}
.card {
  padding: 15px 20px;
  background: #ffffff;
  width: 95%;
  margin: auto;
  margin-top: 9px;
  border-radius: 10px;
  border-bottom: 1px solid #e9eaec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  div {
    font-size: 12px;
    font-family: "PingFang SC";
    font-weight: 500;
    color: #666666;
    .name {
      font-size: 14px;
      font-family: "PingFang SC";
      font-weight: 500;
      color: #212121;
      margin-bottom: 18px;
    }
  }
}
.img-icon {
  height: 20px;
}
::v-deep .van-dropdown-menu__title--active {
  color: #2a81fc !important;
}
::v-deep .van-dropdown-item__option--active .van-dropdown-item__icon {
  color: #2a81fc !important;
}
.dialogself {
  background: red !important;
  .van-button--default {
    background-color: red;
  }
}
</style>
