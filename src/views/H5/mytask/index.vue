<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title_task">我的任务</span>
      <span></span>
    </div>
    <!-- @click="jumpDetail(item)" -->
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="nodata" v-if="loading">
        <van-loading color="#1989fa" />
      </div>
      <div v-if="!loading">
        <div style="height:5px;background: #f3f3f3;"></div>
        <van-tabs @click="clickTab" color="#2A81FC" :line-width="'20px'" title-active-color="#212121"
          title-inactive-color="#666666" v-model="activeName">

          <!-- <div style="height:5px;background: #FFFFFF;"></div> -->
          <van-tab title="单点外呼任务" name="a">
            <div class="nodata" v-if="callList.length == 0">
              <img src="@/assets/images/nodata.png" alt="" />
              暂时什么都没有
            </div>
            <div class="contant" @click="jumpDetailPhone(item, 1)" v-for="(item, index) in callList" :key="index">
              <div class="info">
                <div class="eachInfo">
                  <span class="customer_name">{{ item.taskName }}</span>
                  <span class="font13" :class="item.taskStatus === '处理中' ?'red':''">{{ item.taskStatus }}</span>
                </div>
                <div class="eachInfo span3">
                  <span style="padding: 15px 0" class="font13">已外呼:{{ item.complete == null ? "无" : item.complete
                  }}</span>
                  <div style="margin: 0 15px;height: 15px; color: #E5E5E5;border-left: 1px solid #E5E5E5;"></div>
                  <span class="font13">未外呼:{{ item.undone == null ? "无" : item.undone }}</span>
                </div>
                <div class="eachInfo">

                  <span class="font13">创建时间:{{ item.createTime == null ? "-" : item.createTime }}</span>
                </div>
              </div>
            </div>
          </van-tab>
          <van-tab title="AI外呼任务" name="b">
            <div class="nodata" v-if="AiList.length == 0">
              <img src="@/assets/images/nodata.png" alt="" />
              暂时什么都没有
            </div>
            <div class="contant" @click="jumpDetailPhone(item, 2)" v-for="(item, index) in AiList" :key="index">
              <div class="info">
                <div class="eachInfo">
                  <span class="customer_name">{{ item.taskName }}</span>
                  <span class="font13">{{ item.status == 0 ? '待启动' : item.status == 1 ? '处理中' : item.status == 2 ? '已暂停'
                  : '已完成' }}</span>
                </div>
                <div class="eachInfo span3">
                  <span style="margin: 15px 0" class="font13">已外呼:{{ item.complete == null ? "无" : item.complete
                  }}</span>
                  <div style="margin: 0 15px;height: 15px; color: #E5E5E5;border-left: 1px solid #E5E5E5;"></div>
                  <span class="font13">未外呼:{{ item.undone == null ? "无" : item.undone }}</span>
                </div>
                <div class="eachInfo">
                  <!-- <span class="font13">未外呼:{{  item.undone == null ? "无" : item.undone  }}</span> -->
                  <span class="font13">创建时间：{{ item.createTime == null ? "-" : item.createTime }}</span>
                  <div v-if="item.status == 0 || item.status == 2" class="btn" @click.stop="startTask(item)">启动</div>
                  <div v-else-if="item.status == 1" class="btnStop" @click.stop="endTask(item)">暂停</div>
                </div>
              </div>

            </div>
          </van-tab>
          <!--<van-tab title="短信群发任务" name="c">
            <div class="nodata" v-if="customerList.length == 0">
              <img src="@/assets/images/nodata.png" alt="" />
              暂时什么都没有
            </div>
            <div class="contant" @click="jumpDetail(item)" v-for="(item, index) in customerList" :key="index">
              <div class="info">
                <div class="eachInfo">
                  <span class="customer_name">{{ item.taskName }}</span>
                  <span class="font13">{{ item.taskStatus }}</span>
                </div>
                <div class="eachInfo">
                  <span style="margin: 15px 0" class="font13">已发送:{{ item.sent == null ? "无" : item.sent }}</span>
                </div>
                <div class="eachInfo">
                  <span class="font13">未发送:{{ item.notSent == null ? "无" : item.notSent }}</span>
                  <span class="font13">创建时间:{{ item.createTime == null ? "-" : item.createTime }}</span>
                </div>
              </div>

            </div>
          </van-tab>-->
        </van-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import { getlist } from "@/api/sms/index";
import { getcalltasklist, getAiList, aiStartTask, aiPauseTask } from "@/api/Ai/task";
export default {
  data() {
    return {
      activeName: "",
      loading: true,
      total: 0,
      customerList: [],
      callList: [],
      AiList: [],
      queryParams: {
        // type: 2,
      },
    };
  },
  watch: {

  },
  mounted() {
    this.getData(this.queryParams);
    this.getCallData(this.queryParams)
  },
  methods: {
    // 启动任务
    startTask(item) {
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "是否确定启动该任务！",
          // 样式在index.scss里面修改生效
          className: "dialogConfirm",
          confirmButtonText: "确定",
          cancelButtonText: '取消'
        })

        .then(() => {aiStartTask({ id: item.id }).then(res => {
            if (res.success) {
              getAiList().then((res) => {
                this.AiList = res.rows;
              });
              this.$toast('启动成功')
            } else {
              this.$toast(res.message)
            }
          })
        }).catch((err) => {
          console.log(err)
          // this.$toast(res.message)
        })

    },
    endTask(item) {
      this.$dialog
        .confirm({
          title: "温馨提示",
          message: "是否确定暂停该任务！",
          // 样式在index.scss里面修改生效
          className: "dialogConfirm",
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
        .then(() => {
          aiPauseTask({ id: item.id }).then(res => {
            if (res.success) {
              this.getAiData()
              this.$toast('暂停成功')
            } else {
              this.$toast(res.message)
            }
          })
        }).catch((err) => {
        console.log(err)
        // this.$toast(res.message)
      })
    },
    clickTab(name) {
      if (name == 'a') {
        this.getCallData()
        return
      }
      if (name == 'b') {
        this.getAiData()
        return
      }
    },
    handleAdd() {
      this.$router.push({
        path: "/addconnectpersonh5",
      });
    },
    jumpGo() {
      this.$router.push("/mine");
    },
    getCallData(query) {
      this.loading = true;
      getcalltasklist(query).then((res) => {
        this.callList = res.data;
        this.loading = false;
      });
    },
    getAiData(query) {
      this.loading = true;
      getAiList(query).then((res) => {
        this.AiList = res.rows;
        this.loading = false;
      });
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      getlist(query).then((res) => {
        this.customerList = res.rows;
        this.loading = false;
      });
    },
    // 跳转详情

    jumpDetailPhone(ob, type) {
      this.$router.push({
        path: "/phoneTaskDetailh5",
        query: {
          id: ob.id,
          name: ob.taskName,
          type: type
        },
      });
    },
    jumpDetail(ob) {
      console.log(ob)
      this.$router.push({
        path: "/smslogsh5",
        query: {
          id: ob.id,
          name: ob.taskName
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
  background: #f3f3f3;
  padding-bottom: 20px;
  // background: RGB(249, 249, 249);
}

.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  // padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;

  .info {
    width: 100%;
    :first-child.eachInfo{
     padding-top: 14px;
     padding-bottom: 12px;
     border-bottom: 1px solid #F1F1F1;
    }
    :last-child.eachInfo{
     padding-bottom: 20px;
    }
    .eachInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      // color: #666666;
      padding: 0 15px;
      .customer_name {
        font-size: 15px;
        font-weight: 600;
        max-width: 220px !important;
        color: #212121;
        white-space: nowrap;
        /*强制不换行*/
        text-overflow: ellipsis;
        /*隐藏后添加省略号*/
        overflow: hidden;
      }
    }

    .btn {
      width: 44px;
      height: 20px;
      border: 1px solid #F75E5E;
      border-radius: 20px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #F75E5E;
      text-align: center;
      // position: absolute;
    }
    .btnStop{
      width: 44px;
      height: 20px;
      border: 1px solid #EFA61A;
      border-radius: 20px;
      font-size: 13px;
      font-family: PingFang SC;
      font-weight: 500;
      color: #EFA61A;
      text-align: center;
    }

    .span3 {
      justify-content: flex-start;

      span:nth-child(2) {
        padding: 0 15px;
        color: #E5E5E5;
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

.title_task {
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
  margin-left: -20px;
}
.red{
  color: #F75E5E;
}
</style>
