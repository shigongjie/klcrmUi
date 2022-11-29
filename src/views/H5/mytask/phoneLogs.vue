<template>
  <div class="container">
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title_task">通话记录</span>
      <span></span>
    </div>
    <!-- @click="jumpDetail(item)" -->
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <audio ref="listenDiv" id="listenDiv" autoplay></audio>
      <van-overlay :show="showPopover" @click="showPopover = false" />
      <div class="search_div">
        <div class="order">
          <div class="text">
            创建时间
          </div>
          <div @click="getListByOrder" class="imgWarp" v-if="asc">
            <img src="@/assets/images/order-asc-choosed.png" alt="">
            <img src="@/assets/images/order-dec-unchoose.png" alt="">
          </div>
          <div @click="getListByOrder" class="imgWarp" v-else>
            <img src="@/assets/images/order-asc-unchoose.png" alt="">
            <img src="@/assets/images/order-dec-choosed.png" alt="">

          </div>
        </div>
        <div :style="showPopover ? 'color:#2A81FC' : ''" style="padding:0 10px" @click="showPopover = true"><img
            style="width:13px;height:13px;margin-right:5px;" src="@/assets/images/searchHigh.png" alt="" />筛选查询</div>
        <transition name="van-fade">
          <div class="search" v-if="showPopover">
            <div class="arrow"></div>
            <div>
              <div class="fileWarp">
                <div class="srarch_contant">
                  <div class="name">客户姓名</div>
                  <van-field v-model="searchParams.name" placeholder="请输入客户姓名" />
                </div>
                <div class="srarch_contant">
                  <div class="name">联系电话</div>
                  <van-field v-model="searchParams.phone" placeholder="请输入联系电话" />
                </div>
              </div>

              <div class="btnWarp">
                <div class="btn_contant">
                  <div @click="reset">重置</div>
                  <div @click="serach">查询</div>
                </div>
              </div>
            </div>
          </div>
        </transition>


      </div>

      <div v-if="!loading">
        <div style="height:5px;background:#F3F3F3"></div>
        <van-tabs @click="clickTab" color="#2A81FC" v-model="activeName" :line-width="'20px'"
          title-active-color="#212121" title-inactive-color="#666666">
          <van-tab title="单点外呼" name="1">
            <div class="nodata" v-if="loading">
              <van-loading color="#1989fa" />
            </div>
            <div class="nodata" v-if="customerList.length == 0 && !loading">
              <img src="@/assets/images/nodata.png" alt="" />
              暂时什么都没有
            </div>

            <audio id='remoteAudio' autoPlay></audio>
            <audio id='notifySound' autoPlay></audio>
            <div class="contant" v-for="(item, index) in customerList" :key="index">
              <div class="info">
                <div class="eachInfo">
                  <span class="customer_name">{{ item.clientName }}</span>
                  <span class="font13">{{ item.callStatus == 1 ? '已呼叫' : '未呼叫' }}</span>
                </div>
                <div class="eachInfo" style="margin-top:15px">
                  <div>
                    <span class="font13">联系电话：</span>
                    <span class="font13">{{ item.clientPhone }}</span>
                  </div>
                </div>
                <div class="eachInfo">
                  <span style="margin: 15px 0" class="font13">外呼人员：{{ item.userName }}</span>

                </div>
                <div class="eachInfo" v-if="item.callStatus == 1">
                  <span class="font13">呼叫时间：{{
                  item.createTime == null ? "-" : item.createTime
                  }}</span>
                  <span @click="listenClick(item,customerList)" v-if="item.callStatus == 1" class="listenWarp"> <img
                      :src="item.isPlaying?playing:listen" alt="" />{{ item.callTime }}</span>
                </div>
                <div class="bottomBtn">
                  <div @click="call(item)">
                    <img :src="phoneImg" alt="" />呼叫
                  </div>
                </div>
              </div>
            </div>
            <van-popup v-model="showCall" :style="{ width: '85%', 'border-radius': '6px' }">
              <div class="callModel">
                <div>是否确认联系</div>
                <div>{{ currentName }}{{ currentPhone }}</div>
                <div>
                  <span @click="showCall = false">取消</span>
                  <span @click="sureCall">确认</span>
                </div>
              </div>
            </van-popup>
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
          </van-tab>
          <van-tab title="AI外呼" name="2">
            <div class="nodata" v-if="loading">
              <van-loading color="#1989fa" />
            </div>
            <div class="nodata" v-if="AiList.length == 0 && !loading">
              <img src="@/assets/images/nodata.png" alt="" />
              暂时什么都没有
            </div>
            <div class="contant" v-for="(item, index) in AiList" :key="index">
              <div class="info">
                <div class="eachInfo">
                  <span class="customer_name">{{ item.clientName }}</span>
                  <span class="font13">{{ item.status == 0 ? '未呼叫' : item.status == 2 ? '已接通' : '未接听' }}</span>
                </div>
                <div class="eachInfo" style="margin-top:15px">
                  <div>
                    <span class="font13">联系电话：</span>
                    <span class="font13">{{ item.clientPhone }}</span>
                  </div>
                </div>
                <!-- <div class="eachInfo">
                  <span style="margin: 15px 0" class="font13">外呼人员：{{  item.userName  }}</span>

                </div> -->
                <div class="eachInfo">
                  <span style="margin: 15px 0" class="font13">呼叫时间：{{
                  item.createTime == null ? "-" : item.createTime
                  }}</span>
                  <!-- <Audio v-if="item.status == 2&&item.callTime" :callTime="item.callTime" :src="item.recordFile"
                    :duration="item.duration"></Audio> -->
                  <span @click="listenClick(item,AiList)" v-if="item.status == 2" class="listenWarp"> <img
                      :src="item.isPlaying?playing:listen" alt="" />{{ item.callTime }}</span>
                </div>
                <van-popup v-model="showCall" :style="{ width: '85%', 'border-radius': '6px' }">
                  <div class="callModel">
                    <div>是否确认联系</div>
                    <div>{{ currentName }}{{ currentPhone }}</div>
                    <div>
                      <span @click="showCall = false">取消</span>
                      <span @click="sureCall">确认</span>
                    </div>
                  </div>
                </van-popup>
                <!-- <div class="bottomBtn">
                  <div @click="call(item)">
                    <img :src="phoneImg" alt="" />呼叫
                  </div>
                </div> -->
              </div>
            </div>
          </van-tab>
        </van-tabs>

      </div>
    </div>
  </div>
</template>
<script>
import { getToken } from "@/utils/auth";
import { recordslist, getCallNum } from "@/api/chat/index";
import { aitaskdetailList } from "@/api/Ai/task"
export default {
  data() {
    return {
      audio: null,
      currentAudioUrl: "",
      showCall: false,//确认拨打电话弹窗
      showPopover: false,
      showBrowser: false,
      activeName: '1',
      currentName: "",
      currentPhone: "",
      currentId: "",
      asc: true,
      searchParams: {},
      ____phone: null,
      user: '4001',// OPEN API放回
      ha1: '2a4e2a1ce4edef01e31c3580d05c12da', // OPEN API放回
      realm: 'hidcc.cn',// OPEN API放回
      server: 'hidcc.cn', // OPEN的IP地址和端口
      loading: true,
      total: 0,
      phoneImg: require("@/assets/images/AIphone.png"),
      // logsImg: require("@/assets/images/logs.png"),
      listen: require("@/assets/images/listen.png"),
      playing: require("@/assets/images/playing.gif"),
      customerList: [],
      AiList: [],
      queryParams: {
      },
    };
  },
  beforeMount() {
    if (this.$route.query.id) {
      this.queryParams.taskDetailId = this.$route.query.id;
    }
  },
  mounted() {
    this.getData(this.queryParams);
  },
  methods: {
    getAiData(query) {
      query = Object.assign(query, this.queryParams)
      aitaskdetailList(query).then(res => {
        this.total = res.total;
        this.AiList = res.rows;
        this.loading = false;
      })
    },
    clickTab(name) {
      if (name == '1') {
        this.getData({})
        return
      }
      if (name == '2') {
        this.getAiData({})
        return
      }
    },
    reset() {
      this.searchParams = {}
    },
    serach() {
      let data = {}
      data.sort = this.asc ? 1 : 0
      data.name = this.searchParams.name
      data.phone = this.searchParams.phone
      if (this.activeName == '1') {
        this.getData(data)
        return
      }
      if (this.activeName == '2') {
        this.getAiData(data)
        return
      }
      this.showPopover = false
    },
    getListByOrder() {
      this.asc = !this.asc
      let data = {}
      data.sort = this.asc ? 1 : 0
      data.name = this.searchParams.name
      data.phone = this.searchParams.phone
      if (this.activeName == '1') {
        this.getData(data)
        return
      }
      if (this.activeName == '2') {
        this.getAiData(data)
        return
      }
    },
    sureCall() {
      this.$router.push({
        path: '/phoneOnline',
        query: {
          name: this.currentName,
          phone: this.currentPhone,
          id: this.currentId
        }
      })
    },
    call(item) {
      getCallNum().then(res=> {
        if (res.success) {
          var data = res.data;
          if (data.callNum >= data.callNumMax) {
            this.$toast({
              message: '企业已达同时外呼数量限制，请稍后重试!',
              duration: 2000,
            })
          } else {
            this.currentName = item.clientName;
            this.currentPhone = item.clientPhone;
            this.currentId = item.taskDetailId
            this.showCall = true;
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
              this.currentName = item.clientName;
              this.currentPhone = item.clientPhone;
              this.currentId = item.taskDetailId
              this.showCall = true;
            }*/
          }
        }
      });
    },
    openBrowser() {
      this.showBrowser = false;
    },
    listenClick(item,list) {
      if (this.audio) {
        if (this.currentAudioUrl == item.recordFile) {
          if (this.audio.paused) {
            this.audio.play()
          } else {
            this.audio.pause()
          }
        } else {
          this.audio = document.getElementById("listenDiv")
          this.audio.src = item.recordFile
          this.currentAudioUrl = item.recordFile
          this.audio.addEventListener('play', () => {
            console.log("开始播放了")
            list.forEach(it => {
              if (it.recordFile == item.recordFile) {
                it.isPlaying = true
              } else {
                it.isPlaying = false
              }
            })
          })
          this.audio.addEventListener('pause', () => {
            console.log("暂停播放了")
            list.forEach(it => {
              it.isPlaying = false
            })
          })
          this.audio.addEventListener('ended', () => {
            console.log("播放结束了")
            list.forEach(it => {
              it.isPlaying = false
            })
          })
          this.audio.play()
        }

      } else {
        this.audio = document.getElementById("listenDiv")
        this.audio.src = item.recordFile
        this.currentAudioUrl = item.recordFile
        this.audio.addEventListener('play', () => {
          console.log("开始播放了")
          list.forEach(it => {
            if (it.recordFile == item.recordFile) {
              it.isPlaying = true
            }else{
              it.isPlaying = false
            }
          })
          console.log(item)
        })
        this.audio.addEventListener('pause', () => {
          console.log("暂停播放了")
          // item.isPlaying = false
          list.forEach(it => {
            it.isPlaying = false
          })
        })
        this.audio.addEventListener('ended', () => {
          console.log("播放结束了")
          list.forEach(it => {
            it.isPlaying = false
          })
        })
        this.audio.play()
      }

    },
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
      query = Object.assign(query, this.queryParams)
      this.loading = true;
      recordslist(query).then((res) => {
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
.el-icon-arrow-left{
  font-size:16px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}

.work {
  min-height: 100%;
  padding-top: 56px;
  background: #F3F3F3;
}

.contant {
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  padding-bottom: 10px;
  background: #ffffff;
  border-radius: 6px;

  .info {
    width: 100%;

    .eachInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 10px;
    }

    .bottomBtn {
      border-top: 1px solid #E7E7E7;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-top: 10px;
      padding: 0 10px;
      padding-bottom: 10px;
      padding-top: 10px;

      div {
        display: block;
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
          margin-top: 2px;
          margin-right: 2px;
        }
      }
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

.logs {
  font-size: 12px;
  background: #2B82FC;
  border-radius: 6px;
  padding: 3px 10px;
  color: #FFFFFF;
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

  img {
    width: 150px;
    height: 150px;
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }

  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}

.title_task {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  margin-left: -20px;
}

img {
  width: 20px;
  height: 20px;
  // margin-bottom: 10px;
}

.listenWarp {
  display: flex;
  align-items: center;
  border: 1px solid #EBF5FE;
  padding: 3px 10px;
  font-size: 12px;
  background: #EBF5FE;
  font-size: 13px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #2A81FC;
  border-radius: 6px;

  img {
    width: 15px;
    height: 15px;
    margin-right: 10px;
  }
}

.search_div {
  background: #FFFFFF;
  display: flex;
  justify-content: space-between;
  //   padding: 0 10px;
  font-size: 14px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;
  line-height: 48px;
  position: relative;

  .order {
    display: flex;
    align-items: center;
    padding: 0 10px;

    //   .text {
    //       margin-top: -3px;
    //   }

    .imgWarp {
      margin-top: 2px;
    }

    img {
      width: 5px;
      height: 13px;
      margin-left: 5px;
    }
  }

  .search {
    position: absolute;
    width: 100%;
    top: 48px;
    height: 100%;
    z-index: 2002;
    background: #FFFFFF;

    ::v-deep .van-cell,
    .dh-field {
      border-radius: 0;
    }

    .fileWarp {
      display: flex;
    }

    .btnWarp {
      background: #FFFFFF;
      padding: 25px 10px;

      .btn_contant {
        display: flex;
        //   border: 1px solid #2A81FC;
        border-radius: 6px;

        div {
          height: 36px;
          width: 50%;
          line-height: 36px;
          text-align: center;
          border: 1px solid #2A81FC;
        }

        div:nth-child(1) {
          border-top-left-radius: 6px;
          border-bottom-left-radius: 6px;
          color: #2A81FC;
        }

        div:nth-child(2) {
          background: #2A81FC;
          color: white;
          border-top-right-radius: 6px;
          border-bottom-right-radius: 6px;
          //   border-radius: 6px;
          //   border: 1px solid #2A81FC;
        }
      }
    }

    .srarch_contant {
      width: 100%;

      .name {
        padding: 0 21px;
        height: 35px;
        font-size: 15px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
        line-height: 52px;
        margin-bottom: 10px;
      }

      ::v-deep .van-field__body {
        background: #F2F2F2;
        padding: 5px 15px;
        border-radius: 6px;
      }
    }

    .arrow {
      display: block;
      width: 0;
      height: 0;
      border: 7px solid transparent;
      border-bottom-color: white;
      z-index: 200;
      position: absolute;
      top: -14px;
      right: 20px;
    }
  }

}

::v-deep .van-popup {
  width: 90% !important;
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
