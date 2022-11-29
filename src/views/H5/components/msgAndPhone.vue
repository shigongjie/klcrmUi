<template>
  <div class="imgWarp">
    <audio ref="audio" id='remoteAudio' autoPlay></audio>
    <audio id='notifySound' autoPlay></audio>
    <img @click="stopIt()" :src="phoneImg" alt="" />
    <div class="clickCopy" data-clipboard-text="list.url"></div>
    <!-- <img @click="jumpSms()" :src="msgImg" alt="" /> -->
    <van-popup v-model="showBrowser" :style="{ width: '85%', 'border-radius': '6px' }">
      <div class="callModel">
        <div>跳转提示</div>
        <div>是否同意跳转到浏览器进行呼出</div>
        <div>
          <span @click="showBrowser = false">取消</span>
          <span @click="openBrowser">确认</span>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getToken } from "@/utils/auth";
import { getCallNum } from "@/api/chat/index"
export default {
  props: {
    ob: {},
    name: {},
    callPhone: {},
    type: {},
  },
  data() {
    return {
      ____phone: null,
      user: '4001',// OPEN API放回
      ha1: '2a4e2a1ce4edef01e31c3580d05c12da', // OPEN API放回
      realm: 'hidcc.cn',// OPEN API放回
      server: 'hidcc.cn', // OPEN的IP地址和端口
      phoneImg: require("@/assets/images/phone.png"),
      msgImg: require("@/assets/images/msg.png"),
      showBrowser: false
    };
  },
  mounted() {
  },
  methods: {
    openBrowser() {
      this.showBrowser = false;
    },
    webphoneHandle(type, data, options) {
      // console.log(type, data, options);
    },
    stopIt() {
      getCallNum().then(res=> {
        if (res.success) {
          var data = res.data;
          if (data.callNum >= data.callNumMax) {
            this.$toast({
              message: '企业已达同时外呼数量限制，请稍后重试!',
              duration: 2000,
            })
          } else {
            let phone = "";
            phone =
              this.ob.contactPhone == undefined ||
              this.ob.contactPhone == null ||
              this.ob.contactPhone == ""
                ? this.ob.phone
                : this.ob.contactPhone;
            if (!phone) {
              this.$toast("暂无联系方式");
              return;
            } else {
              this.$dialog
                .confirm({
                  title: "是否确定联系",
                  message: this.name + this.callPhone,
                  className: "dialogcallConfirm",
                  confirmButtonColor: "linear-gradient(90deg, #5B9EFC, #3C8BFA)",
                  confirmButtonText: "确认",
                })
                .then(() => {
                  this.$router.push({
                    path: '/phoneOnline',
                    query: {
                      calleeName: this.name,
                      phone: this.callPhone,
                      // calleeName: this.ob.id
                      type: this.type
                    }
                  })
                }).catch(() => {
              })
              /*var isIOS = navigator.userAgent.indexOf('iPhone') > -1 || navigator.userAgent.indexOf('iPad') > -1;
              var message = "Android系统升级，暂时无法使用单点外呼功能，请通过浏览器使用此功能；给您带来的不便敬请谅解！"
              if(isIOS) {
                message = "IOS系统升级，暂时无法使用单点外呼功能，请使用Android或Windows进行通话操作；给您带来的不便敬请谅解！";
              }
              if (this.$store.state.user.isApp == 2 || isIOS) {
                this.$dialog
                  .confirm({
                    title: "温馨提示",
                    message: message,
                    // 样式在index.scss里面修改生效
                    className: "dialogConfirm",
                    confirmButtonText: "我知道了",
                    cancelButtonText: '复制链接'
                  })
                  .then(() => {
                    //done();
                  }).catch(() => {
                  let copyContent = window.location.href + "?token=" + getToken();
                  var input = document.createElement("input"); // 直接构建input
                  input.value = copyContent ? copyContent : " "; // 设置内容
                  document.body.appendChild(input); // 添加临时实例
                  input.select(); // 选择实例内容
                  document.execCommand("Copy"); // 执行复制
                  document.body.removeChild(input); // 删除临时实例
                  this.$toast("已复制链接");
                })
              } else {
                if(this.$store.state.user.isApp == 2) {
                  this.showBrowser = true;
                } else {
                  this.$dialog
                    .confirm({
                      title: "是否确定联系",
                      message: this.name + this.callPhone,
                      className: "dialogcallConfirm",
                      confirmButtonColor: "linear-gradient(90deg, #5B9EFC, #3C8BFA)",
                      confirmButtonText: "确认",
                    })
                    .then(() => {
                      this.$router.push({
                        path: '/phoneOnline',
                        query: {
                          calleeName: this.name,
                          phone: this.callPhone,
                          // calleeName: this.ob.id
                          type: this.type
                        }
                      })
                    }).catch(() => {
                  })
                }
              }*/
            }
          }
        }
      });
    },
    jumpSms() {

      let phone = "";
      phone =
        this.ob.contactPhone == undefined ||
          this.ob.contactPhone == null ||
          this.ob.contactPhone == ""
          ? this.ob.phone
          : this.ob.contactPhone;
      if (!phone) {
        this.$toast("暂无联系方式");
        return;
      }
      this.$router.push({
        path: "/smsh5",
        query: {
          phone: phone,
          id: this.ob.id,
          type: this.type,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.imgWarp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  //   padding-right: 20px;
  height: 100%;
  //   margin-right: 30px;
}

img {
  width: 20px;
  height: 20px;
  // margin-bottom: 10px;
}

.van-dialog__footer {
  padding: 10px 0 !important;
  background: red !important;
}
.callModel {
  width: 100%;
  padding: 10px;

  div:nth-child(1) {
    padding: 10px 0;
    text-align: center;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
  }

  div:nth-child(2) {
    padding: 10px 0;
    text-align: center;
    font-size: 16px;
    margin-top: 8px;
    margin-bottom: 30px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }

  div:nth-child(3) {
    padding: 10px 0;
    text-align: center;
    display: flex;
    justify-content: space-evenly;

    span {
      width: 110px;
      height: 36px;
      line-height: 36px;
      background: #FFFFFF;

      border-radius: 6px;
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: 500;
    }

    span:nth-child(1) {
      font-size: 14px;
      color: #212121;
      border: 1px solid #E5E5E5;
    }

    span:nth-child(2) {
      background: linear-gradient(90deg, #5B9EFC 0%, #3C8BFA 100%);
      color: #FFFFFF;
    }
  }
}
</style>
