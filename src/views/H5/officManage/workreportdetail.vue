<template>
  <div class="container">
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
      <span class="workReportName">{{ customerInfo.headline }}</span>
      <span><i class=""></i></span>
    </div>
    <div class="pd" :style="$store.state.user.isApp == 2 ? 'padding-top: 116px;' : ''">
      <div class="customer_info">
        <div>
          <div>提交人员</div>
          <div>{{ customerInfo.founderId }}</div>
        </div>
        <div>
          <div>批阅状态</div>
          <div>{{ customerInfo.auditStatus }}</div>
        </div>
        <div>
          <div>提交时间</div>
          <div>{{ customerInfo.submitTime }}</div>
        </div>
      </div>
      <div class="tab" style="padding-bottom: 56px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="详细信息" name="1">
            <div class="work" v-if="activeName == 1">
              <div class="workTitle">
                <!-- <i class="el-icon-s-flag"></i>  -->
                工作总结
              </div>
              <div class="workdetail">{{ customerInfo.summarize }}</div>
              <div class="workTitle">
                <!-- <i class="el-icon-s-flag"></i>  -->
                工作计划
              </div>
              <div class="workdetail">{{ customerInfo.workPlan }}</div>
              <div class="workTitle">
                <!-- <i class="el-icon-s-flag"></i>  -->
                系统信息
              </div>
              <!-- <div style="margin-top: 10px" class="base_info_card"> -->
              <div class="base_info_card">
                <span>报告标题</span>
                <span>{{ customerInfo.headline }}</span>
              </div>
              <div class="base_info_card">
                <span>提交时间</span>
                <span>{{ customerInfo.submitTime }}</span>
              </div>
              <div class="base_info_card">
                <span>批阅状态</span>
                <span>{{ customerInfo.auditStatus }}</span>
              </div>
              <div class="base_info_card">
                <span>提交人员</span>
                <span>{{ customerInfo.founderId }}</span>
              </div>
              <div class="base_info_card">
                <span>批阅人员</span>
                <span>{{ customerInfo.readId }}</span>
              </div>
              <div class="base_info_card">
                <span>抄送人员</span>
                <span>{{ customerInfo.copyId }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="数据统计" name="2">
            <div class="work">
              <div
                class="pBtn"
                v-for="(item, key, index) in workReportList"
                :key="index"
              >
                <div class="pitem">
                  <span>{{ key }}</span
                  ><span>{{ item }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="批阅记录" name="3">
            <div class="nodata" v-if="commondataList.length == 0">暂无数据</div>
            <div class="work" v-if="activeName == 3">
              <div
                v-for="(items, index) in commondataList"
                :key="index"
                class="contant"
              >
                <div class="dynamic_card">
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
                      <span
                        ><i class="el-icon-time"></i
                        >{{ items.createTime }}</span
                      >
                    </div>

                    <div class="dynamic_conent">
                      {{ items.commentContent }}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="相关图片" name="4">
            <div class="nodata" v-if="imageList.length == 0">暂无数据</div>
            <div>
              <div
                class="opera_card"
                v-for="(item, index) in imageList"
                :key="index"
              >
                <div class="operaUser">
                  <div class="person_info">
                    <img :src="item" alt="" />
                    <span>{{ item.userId }}</span>
                  </div>
                  <span>{{ item.time }}</span>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer" v-if="customerInfo.isAlter == 1">
      <div
        @click="handleAction(item.action)"
        v-for="(item, index) in footerList"
        :key="index"
      >
        <span></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
    <!-- 删除提示 -->
    <el-dialog title="删除确认" :visible.sync="deldia" width="300px" top="30%">
      <span>确定要删除该条记录吗？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="deldia = false">取 消</el-button>
        <el-button type="primary" @click.native="delconfirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 批阅提示 -->
    <el-dialog title="发布批阅" :visible.sync="piyue" width="300px" top="50%">
      <span>
        <van-field
          v-model="summarize"
          rows="3"
          autosize
          type="textarea"
          maxlength="1000"
          placeholder="请输入批阅内容"
          show-word-limit
        />
      </span>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="piyue = false">取 消</el-button>
        <el-button type="primary" @click.native="sendpiyue">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  generalInfo,
  followRecordList,
  operaLogList,
  customerremove,
  getIntradayWork,
} from "@/api/customer/index";
import { getCommentByFkId } from "@/api/task";
import {
  particularsData,
  addComment,
  workreportAlter,
  detailRremove,
} from "@/api/officeManagement";
export default {
  data() {
    return {
      piyue: false,
      summarize: "",
      workReportList: [],
      customerInfo: {},
      dynamicList: [],
      dataVO: {},
      activeName: "1",
      followRecordData: [],
      imageList: [],
      operaLogData: [],
      deldia: false,
      commondataList: [],
      footerList: [
        { name: "批阅", icon: "", action: "0" },
        { name: "编辑报告", icon: "", action: "1" },
        { name: "删除报告", icon: "", action: "3" },
        // { name: "删除客户", icon: "", action: "3" },
      ],
    };
  },
  mounted() {
    this.getcustomerdetail();
    this.getcommonData();
  },
  methods: {
    sendpiyue() {
      addComment({
        commentContent: this.summarize,
        fkId: this.$route.query.id,
      }).then((res) => {
        this.getcustomerdetail();
        this.getcommonData();
      });
      this.summarize = "";
      this.piyue = false;
    },
    getcommonData() {
      getCommentByFkId({ fkId: this.$route.query.id }).then((res) => {
        this.commondataList = res.data;
      });
    },
    delconfirm() {
      detailRremove({ ids: [this.$route.query.id] }).then((res) => {
        this.$router.push({
          path: "/workreporth5",
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
          path: "/addworkreporth5",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 0) {
        this.piyue = true;
        // this.$router.push({
        //   path: "/transforwithperson",
        //   query: {
        //     id: this.$route.query.id,
        //   },
        // });
        return;
      }
      if (type == 3) {
        this.deldia = true;
      }
    },
    jumpgo() {
      this.$router.go(-1);
    },
    // 操作记录
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
      particularsData({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data;
        if (res.data.image) {
          this.imageList = res.data.image.split(",");
        }
        getIntradayWork({
          startTime: this.customerInfo.startTime,
          endTime: this.customerInfo.endTime?this.customerInfo.endTime:this.customerInfo.startTime,
        }).then((Res) => {
          this.workReportList = Res.data;
        });
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
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
.workReportName{
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
}
.pd {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 56px;
  background: RGB(249, 249, 249);
}
.tab {
  margin-top: 8px;
  ::v-deep .el-tabs__nav-wrap {
    background-color: #ffffff;
    margin-bottom: 17px
  }
  // ::v-deep .is-top:nth-child(2) {
  //   padding-left: 20px;
  // }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: #f9f9f9 !important;
  }
  ::v-deep .el-tabs__item {
    font-size: 14px !important;
    font-weight: bold;
    color: #666666;
  }
  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    justify-content: space-evenly;
    background-color: #f9f9f9;
  }
  ::v-deep .el-tabs__item.is-active{
    color: #212121 !important;
  }
  ::v-deep .el-tabs__active-bar{
    width: 20px !important;
    height: 3px !important;
    left:18px;
    border-radius: 1.5px;
  }
  ::v-deep .date span[data-v-3978390f]{
    font-size: 14px;
    margin-top: 0px;
  }
}

.customer_info {
  // display: grid;
  // align-items: center;
  // justify-content: center;
  // grid-template-columns: repeat(3, 33.3%);
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  margin-top: 1px;
  padding: 14px 0;
  div {
    text-align: center;
    font-size: 13px;
    // padding: 6px 0;
    :last-child{
      color: #212121;
      font-size: 15px;
      margin-top: 7px;
    }
  }
}
.work {
  // padding: 0 20px;
  padding-bottom: 64px;
  background: RGB(249, 249, 249);
}
.contant {
  padding: 0 16px;
}
.dynamic_card {
  border-radius: 6px;
  margin-bottom: 10px;
  background: #ffffff;
  // padding: 10px 0;
  .card {
    // border: 1px solid;
      padding: 0 12px;
    // padding: 8px 10px;
    // border-radius: 12px;
    // box-shadow: 2px 4px 5px 2px rgb(0 0 0 / 10%);
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E7E7E7;
      padding: 10px 0;
    }
    font-size: 14px;

    .person_info {
      display: flex;
      align-items: center;
      span{
        color: #212121;
        margin-left: 10px;
      }
    }
    img {
      width: 22px;
      height:22px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .dynamic_conent {
      padding: 20px 0 30px;
      margin-left: 1px;
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
  font-size: 15px;
  padding: 8px 15px;
  display: flex;
  // justify-content: space-between;
  // border-bottom: 1px solid #e9eaec;
  :last-child{
    margin-left: 40px;
    color: #212121;
    font-size: 16px;
    font-family: PingFang SC;
  }
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
      width: 100px;
      height: 100px;
      //   border-radius: 50%;
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
.workTitle {
  font-size: 15px;
  font-weight: 600;
  padding: 15px 10px 10px;
  background: #ffffff;
  color: #212121;
  // border-bottom: 1px solid #e9eaec;
  // margin-bottom: 20px;
}
.workdetail {
  font-size: 15px;
  padding: 12px 10px;
  background: #ffffff;
  margin-bottom: 10px;
  
}
.pBtn {
  padding: 15px 12px;
  font-size: 15px;
  background-color: #fff;
  // border-bottom: 1px solid #e9eaec;
}
.pitem {
  display: flex;
  // justify-content: space-between;
  :first-child{
    width: 75px;
  }
  :last-child{
    color: #212121;
    font-size:16px;
    font-family: PingFang SC;
    margin-left: 25px;
  }
}
</style>
