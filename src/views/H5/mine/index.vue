<template>
  <div>
    <Navbar :title="'个人中心'" @jump="jumpgo" />
    <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <!-- <div class="header" v-if="$store.state.user.isApp != 2">
        <span class="titleH5">我的</span>
      </div> -->
      <div class="pd">
        <div class="avatar">
          <div>
            <img :src="submitParams.avatar" alt="" />
          </div>
          <div class="name">
            <div class="userName">
              {{  submitParams.name  }}
              <span class="deptName" style="font-size: 12px">{{
                 submitParams.deptName
                }}</span>
            </div>
            <div style="margin-top:5px">{{  submitParams.phone  }}</div>
          </div>

        </div>
        <div class="package">
          <div class="cash">
            <div @click="JumpRecharge">话费余额</div>
            <div>{{  $store.state.user.callCharges  }}</div>
          </div>
          <!--  -->
          <div @click="packageDetail" v-if="$store.state.user.isComboOpen">
            套餐详情
          </div>
        </div>
        <div class="line"></div>
        <div class="infocard">
          <div @click="jumpuserInfo">
            <span><img src="@/assets/images/mine2.png" alt="" /> 个人资料</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>
          <div @click="jumppsd">
            <span><img src="@/assets/images/password.png" alt="" /> 修改密码</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>
          <div @click="jumprecharge">
            <span><img src="@/assets/images/huafei.png" alt="" /> 话费充值</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>
          <!--<div @click="jumppackage">
            <span><img src="@/assets/images/taocan.png" alt="" /> 套餐充值</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>-->
          <div @click="jumporder">
            <span><img src="@/assets/images/dingdan.png" alt="" /> 我的订单</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>
          <div @click="jumpTask">
            <span><img src="@/assets/images/task.png" alt="" /> 我的任务</span><span><i
                class="el-icon-arrow-right"></i></span>
          </div>
          <div @click="jumpPhonelogsh5">
            <span><img src="@/assets/images/phonemine.png" alt="" /> 通话记录</span><span><i
            class="el-icon-arrow-right"></i></span>
          </div>
          <!-- <div>
          <span><i class="el-icon-s-data"></i> 企业详情</span
          ><span><i class="el-icon-arrow-right"></i></span>
        </div> -->
        </div>
        <div>
          <div class="btn" @click="layout">退出登录</div>
        </div>
        <van-dialog v-model="packageShow" :title="
          packageDetailOb.comboName + '(' + packageDetailOb.comboPrice + '元)'
        " show-cancel-button>
          <div class="packageDetailDiv">
            <span>单点通话：{{  packageDetailOb.singleCallMinutes  }}分钟</span>
            <span>短信条数：{{  packageDetailOb.smsCount  }}条</span>
            <span>AI外呼：{{  packageDetailOb.aiCallMinutes  }}分钟</span>
          </div>
        </van-dialog>
        <el-dialog title="确认退出" :visible.sync="layoutDia" width="300px" top="30%">
          <span>确定注销并退出系统吗？</span>
          <span slot="footer" class="dialog-footer">
            <el-button size="mini" @click.native="layoutDia = false">取 消</el-button>
            <el-button size="mini" type="primary" @click.native="sure">确 定</el-button>
          </span>
        </el-dialog>
        <Footer />
      </div>
    </div>
  </div>
</template>

<script>
import { getAdminInfo, getComboDetail } from "@/api/system/user";
import Footer from "../components/footer.vue";
import Navbar from "../components/navbar.vue";
export default {
  components: {
    Footer,
    Navbar,
  },
  data() {
    return {
      packageDetailOb: {},
      isApp: 1,
      layoutDia: false,
      submitParams: {},
      packageShow: false,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    getAdminInfo().then((res) => {
      this.submitParams = res.data;
    });
  },
  methods: {
    JumpRecharge() {
      this.$router.push({
        path: "/rechargeh5",
      });
    },
    packageDetail() {
      getComboDetail().then((res) => {
        this.packageDetailOb = res.data;
        this.packageShow = true;
      });
    },
    jumpPhonelogsh5() {
      this.$router.push("/phonelogsh5");
    },
    jumpTask() {
      this.$router.push("/mytaskh5");
    },
    jumporder() {
      this.$router.push("/orderh5");
    },
    jumpgo() {
      this.$router.push("/home");
    },
    jumppsd() {
      this.$router.push("/resetpsd");
    },
    jumpuserInfo() {
      this.$router.push("/userInfoh5");
    },
    jumprecharge() {
      this.$router.push("/rechargeh5");
    },
    jumppackage() {
      this.$router.push("/packageh5");
    },
    sure() {
      this.$store.dispatch("LogOut").then(() => {
        location.href = "/index";
      });
    },
    layout() {
      this.layoutDia = true;
    },
    jumpGo() {
      this.$router.go(-1);
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  color: #606266;
  padding-bottom: 40px;
}

::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 30vh !important;
}

.header {
  font-size: 13px;
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

// .pd {
//   // padding-top: 56px;
//   // background: RGB(249, 249, 249);
// }
.titleH5 {
  font-size: 17px;
  font-weight: 600;
}

::v-deep .el-input.is-disabled .el-input__inner {
  background: #ffffff;
  color: #606266;
}

::v-deep input {
  border: none;
  text-align: right;
}

::v-deep .el-select {
  width: 100%;
}

::v-deep .el-form-item {
  background: #ffffff;
  padding: 6px 20px;
  // padding-bottom: 15px;
  margin-bottom: 0;
  border-bottom: 1px solid #ebeff3;
}

::v-deep .el-input__prefix {
  display: none;
}

::v-deep .el-form-item__error {
  right: 15px;
  text-align: right;
}

::v-deep .el-radio-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  padding-right: 10px;
}

.avatar {
  padding-top: 18px;
  padding-left: 20px;
  background: url("~@/assets/images/userbg.png") no-repeat;
  background-size: 100% 100%;
  height: 130px;
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;

  .name {
    margin-left: 20px;
    color: #212121;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 13px;
  }

  img {
    width: 49px;
    height: 49px;
    border-radius: 50%;
  }
}

.line {
  height: 10px;
  background: RGB(249, 249, 249);
  border-bottom: 1px solid #ebeff3;
}

.btn {
  width: 90%;
  color: white;
  background: #267efa;
  margin: auto;
  margin-top: 15px;
  border-radius: 20px;
  border: 1px solid #267efa;
  padding: 10px 12px;
  font-size: 14px;
  text-align: center;
  border-radius: 6px;

}

.infocard {
  img {
    width: 22px;
    height: 22px;
    margin-right: 10px;
  }

  div {
    padding: 16px 20px;
    display: flex;
    font-size: 13px;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ebeff3;
  }

  span {
    display: flex;
    align-items: center;
  }
}

.userName {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  display: flex;
  align-items: center;
}

.deptName {
  display: block;
  background: #339dff;
  color: white;
  padding: 5px 10px;
  margin-left: 5px;
  border-radius: 12px;
  max-width: 100px !important;
  white-space: nowrap;
  /*强制不换行*/
  text-overflow: ellipsis;
  /*隐藏后添加省略号*/
  overflow: hidden;
}

.package {
  padding: 10px 20px;
  margin-top: -50px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  // background: #EEF6FF;

  .cash {
    display: flex;
    align-items: center;
    font-family: PingFang SC;
    font-weight: 500;
    color: #000000;

    div:nth-child(2) {
      margin: 0 10px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #2A81FC;
    }
  }

  div {
    font-size: 13px;
  }


}

.packageDetailDiv {
  display: flex;
  flex-direction: column;
  padding: 20px 10px;

  span {
    margin-bottom: 10px;
  }
}
</style>
