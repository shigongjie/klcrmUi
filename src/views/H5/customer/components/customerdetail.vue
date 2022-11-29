<template>
  <div class="container">
    <div style="height: 54px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{ customerInfo.name }}</span>
      <span><i class=""></i></span>
    </div>
    <div class="pd">
      <div class="customer_info">
        <div class="customer_item">
          <div>客户状态</div>
          <div class="height">{{ customerInfo.state }}</div>
        </div>
        <div class="customer_item">
          <div>客户星级</div>
          <div class="height">{{ customerInfo.star }}</div>
        </div>
        <div class="customer_item">
          <div>客户归属</div>
          <div class="height">{{ customerInfo.userId }}</div>
        </div>
        <div class="customer_item">
          <div>客户类型</div>
          <div class="height">{{ customerInfo.type }}</div>
        </div>
        <div class="customer_item">
          <div>首联系人</div>
          <div class="height">{{ customerInfo.contactName }}</div>
        </div>
        <div>
          <div>下次跟进</div>
          <div class="height">
            {{
              customerInfo.nextFollowTime == null
                ? "无"
                : customerInfo.nextFollowTime
            }}
          </div>
        </div>
      </div>
      <div class="tab" style="padding-bottom: 56px">
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="客户动态" name="1">
            <div class="work" v-if="activeName == 1">
              <div class="nodata" v-if="dynamicList.length == 0">暂无数据</div>
              <div
                v-for="(item, index) in dynamicList"
                :key="index"
                class="contant"
              >
                <div class="date">
                  <span>{{ item.date }}</span>
                </div>
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
                      <span>
                        <i class="el-icon-time"></i>{{ items.createTime }}</span
                      >
                      <span @click="toast"
                        ><i class="el-icon-chat-round"></i
                        >{{ items.list == null ? "0" : items.list.length
                        }}<i
                          style="margin-left: 10px"
                          class="el-icon-arrow-right"
                        ></i
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="资料详情" name="2">
            <div style="margin-bottom:15px">
              <div class="base_info_card" style="font-size: 15px;font-weight: bold;">
                <!-- <i class="el-icon-s-flag"></i>  -->
                基本信息
              </div>
              <div class="base_info_card">
                <span>客户名称</span>
                <span>{{ customerInfo.name }}</span>
              </div>
              <div class="base_info_card">
                <span>助记名称</span>
                <span>{{ customerInfo.shortName ? customerInfo.shortName:"-" }}</span>
              </div>
              <div class="base_info_card">
                <span>客户类型</span>
                <span>{{ customerInfo.type }}</span>
              </div>
              <div class="base_info_card">
                <span>客户星级</span>
                <!-- <span>{{ typeof (parseInt(customerInfo.star))}}</span> -->
                <span class="imgSpan" v-if="customerInfoStart">
                  <img src="@/assets/images/user_start.png" v-for="start in customerInfoStart" :key="start" class="img">
                </span>
              </div>
              <div class="base_info_card">
                <span>客户状态</span>
                <span>{{ customerInfo.state }}</span>
              </div>
              <div class="base_info_card">
                <span>所属行业</span>
                <span>{{ customerInfo.industry }}</span>
              </div>
              <div class="base_info_card">
                <span>客户来源</span>
                <span>{{ customerInfo.source }}</span>
              </div>
              <div class="base_info_card">
                <span>客户归属</span>
                <span>{{ customerInfo.userId }}</span>
              </div>
            </div>

            <div style="margin-bottom:15px">
              <div class="base_info_card" style="font-size: 15px;font-weight: bold;">
                <!-- <i class="el-icon-s-flag"></i>  -->
                附加信息
              </div>
              <div class="base_info_card">
                <span>所在地区</span>
                <span>{{ customerInfo.address }}</span>
              </div>
              <div class="base_info_card">
                <span>详细地址</span>
                <span>{{ customerInfo.detailAddress }}</span>
              </div>
              <div class="base_info_card">
                <span>企业规模</span>
                <span>{{ customerInfo.scale }}</span>
              </div>
              <div class="base_info_card">
                <span>备注信息</span>
                <span>{{ customerInfo.remark }}</span>
              </div>
            </div>

            <div>
              <div class="base_info_card" style="font-size: 15px;font-weight: bold;">
                <!-- <i class="el-icon-s-flag"></i> -->
                系统信息
              </div>
              <div class="base_info_card">
                <span>系统编号</span>
                <span>{{ customerInfo.sysNo }}</span>
              </div>
              <div class="base_info_card">
                <span>创建人员</span>
                <span>{{ customerInfo.createBy }}</span>
              </div>
              <div class="base_info_card">
                <span>所属部门</span>
                <span>{{ customerInfo.deptId }}</span>
              </div>
              <div class="base_info_card">
                <span>协作人员</span>
                <span>{{ customerInfo.collaborators }}</span>
              </div>
              <div class="base_info_card">
                <span>前归属人</span>
                <span>{{ customerInfo.beforeUserId }}</span>
              </div>
              <div class="base_info_card">
                <span>前所属部门</span>
                <span>{{ customerInfo.beforeDeptId }}</span>
              </div>
              <div class="base_info_card">
                <span>创建时间</span>
                <span>{{ customerInfo.createTime }}</span>
              </div>
              <div class="base_info_card">
                <span>更新时间</span>
                <span>{{ customerInfo.updateTime }}</span>
              </div>
              <div class="base_info_card">
                <span>最后跟进</span>
                <span>{{ customerInfo.followTime }}</span>
              </div>
              <div class="base_info_card">
                <span>下次跟进</span>
                <span>{{ customerInfo.nextFollowTime }}</span>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="跟进记录" name="3">
            <div class="nodata" v-if="followRecordData.length == 0">
              暂无数据
            </div>
            <div class="work" v-if="activeName == 3">
              <div
                v-for="(item, index) in followRecordData"
                :key="index"
                class="contant"
              >
                <div class="date">
                  <span>{{ item.date }}</span>
                </div>
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
                      <span>
                        <i class="el-icon-time"></i>{{ items.createTime }}</span
                      >
                      <span @click="toast"
                        ><i class="el-icon-chat-round"></i
                        >{{ items.list == null ? "0" : items.list.length
                        }}<i
                          style="margin-left: 10px"
                          class="el-icon-arrow-right"
                        ></i
                      ></span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </el-tab-pane>
          <el-tab-pane label="操作日志" name="4">
            <div class="nodata" v-if="operaLogData.length == 0">暂无数据</div>
            <div style="background: #f9f9f9;padding:0 16px">
              <div
                class="opera_card"
                v-for="(item, index) in operaLogData"
                :key="index"
              >
                <div class="operaUser">
                  <div class="person_info">
                    <img
                      :src="
                        item.avatar == '' || item.avatar == null
                          ? $store.state.user.avatar
                          : item.avatar
                      "
                      alt=""
                    />
                    <span>{{ item.userId }}</span>
                  </div>
                  <span>{{ item.time }}</span>
                </div>
                <div class="opera_text_card">
                  <div>操作类型：<div class="optionName">{{ item.type }}</div></div>
                  <div>字段名称：<div class="optionName">{{ item.fieldName }}</div></div>
                  <div>旧字段值：<div class="optionName">{{ item.fieldOld }}</div></div>
                  <div>新字段值：<div class="optionName">{{ item.field }}</div> </div>
                  <div>备注信息：-</div>
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <div class="footer">
      <div
        class="footerIconWarp"
        @click="handleAction(item.action)"
        v-for="(item, index) in footerList"
        :key="index"
      >
        <span><i :class="item.icon"></i></span>
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
  </div>
</template>

<script>
import {
  generalInfo,
  followRecordList,
  operaLogList,
  customerremove,
} from "@/api/customer/index";
export default {
  data() {
    return {
      customerInfo: {},
      customerInfoStart:'',
      dynamicList: [],
      dataVO: {},
      activeName: "1",
      followRecordData: [],
      operaLogData: [],
      deldia: false,
      footerList: [
        { name: "短信", icon: "el-icon-chat-line-round", action: "0" },
        { name: "跟进", icon: "el-icon-edit-outline", action: "1" },
        { name: "编辑客户", icon: "el-icon-edit", action: "2" },
        { name: "删除客户", icon: "el-icon-delete", action: "3" },
      ],
    };
  },
  mounted() {
    this.getcustomerdetail();
    this.followRecordList();
    this.operaLogList();
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
          path: "/followh5",
          query: {
            id: this.$route.query.id,
            type: 1,
            contantId: this.customerInfo.contactId,
          },
        });
        return;
      }
      if (type == 0) {
        this.$router.push({
          path: "/smsh5",
          query: {
            phone: this.customerInfo.contactPhone,
            id: this.$route.query.id,
            type: 1,
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
      followRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.followRecordData = res.rows;
        console.log('跟进记录',res.rows);
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
        // console.log(this.customerInfo.star);
        this.customerInfoStart = parseInt(this.customerInfo.star)
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
  // border-bottom: 1px solid #f3f3f3;
  // box-sizing: border-box;
}
.title-clue {
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 600;
    color: #323232;
}

.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: top;
}

.pd {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 56px;
  background: RGB(249, 249, 249);
}
.tab {
  margin-top: 15px;
  ::v-deep .el-tabs__nav-wrap {
    background-color: #ffffff;
    margin-bottom: 17px
  }
  // ::v-deep .is-top:nth-child(2) {
  //   // padding-left: 20px;
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
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(3, 33.3%);
  background: #ffffff;
  margin-top: 2px;
  div{
    text-align: center;
    font-size: 12px;
    color: #666666;
  }
  .customer_item {
    padding: 12px 0;
  }
  .height {
    // height: 40px;
    // line-height: 40px;
    color: #212121;
    font-family: PingFang SC;
    font-weight: 500;
    font-size: 15px;
    padding-top: 5px;
  }
}
.work {
  padding: 0 16px;
  padding-bottom: 64px;
  background: RGB(249, 249, 249);
}
.dynamic_card {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 0;
  margin-bottom: 17px;
  .card {
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 1px solid #E7E7E7;
      padding-bottom: 10px;
      :last-child{
        font-size: 14px;
        font-weight: 500;
        color: #212121;
      }
    }
    font-size: 13px;
    padding: 0 10px;
    .person_info {
      display: flex;
      align-items: center;
      :last-child{
        font-size: 14px;
        font-weight: 500;
        color: #212121;
      }
    }
    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 14px;
    }
    .dynamic_conent {
      background: #f8f8f8;
      padding: 10px 10px 19px;
      margin: 10px 0;
      font-size: 14px;
    }
    .dynamic_time {
      display: flex;
      justify-content: space-between;
      // padding-left: 40px;
      padding-top: 12px;
      border-top: 1px solid #E7E7E7;
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
  padding: 13px 20px;
  background: #ffffff;
  font-size: 16px;
  font-weight: 500;
  display: flex;
  color: #212121;
  span:nth-child(1) {
    width: 100px;
    font-size: 15px;
    color: #666666;
  }
  .imgSpan{
    img{
      width: 15px;
      height: 15px;
      margin-right: 5px;
      margin-bottom: -3px;
    }
  }
}
.opera_card {
  background: #ffffff;
  // width: 90%;
  padding: 0 12px;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  .operaUser {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e9eaec;
    align-items: center;
    font-size: 14px;
    padding: 10px 0;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 26px;
      height: 26px;
      border-radius: 50%;
      margin-right: 14px;
    }
  }
  .opera_text_card {
    font-size: 14px;
    // padding: 0 12px;
    div {
      line-height: 34px;
      display: flex;
    }
    .optionName{
      margin-left: 8px;
      font-weight: bold;
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
.date {
  text-align: center;
  span {
    display: inline-block;
    background: #ebebeb;
    font-size: 12px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
    padding: 5px 8px;
    // border-radius: 5px;
    border-radius: 5px;
    margin-bottom: 5px;
    margin-top: 15px;
  }
}
::v-deep .el-tabs__header {
  margin-bottom: 0 !important;
}
.footerIconWarp {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  i {
    font-size: 18px;
  }
}
.userName{
 font-size: 14px;
}
</style>