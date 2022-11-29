<template>
  <div class="container">
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{ customerInfo.customerName }}</span>
      <span><i class=""></i></span>
    </div>
    <div class="pd">
      <div class="customer_info">
        <div class="customer_item">
          <div>线索状态</div>
          <div class="height">
            {{
              customerInfo.sourceStatus == null
                ? "无"
                : customerInfo.sourceStatus
            }}
          </div>
        </div>
        <div class="customer_item">
          <div>联系人姓名</div>
          <div class="height">
            {{
              customerInfo.contactName == null ? "无" : customerInfo.contactName
            }}
          </div>
        </div>
        <div class="customer_item">
          <div>手机号码</div>
          <div class="height">
            {{ customerInfo.phone == null ? "无" : customerInfo.phone }}
          </div>
        </div>
        <div class="customer_item">
          <div>联系人角色</div>
          <div class="height">
            {{ customerInfo.role == null ? "无" : customerInfo.role }}
          </div>
        </div>
        <div class="customer_item">
          <div>部门职务</div>
          <div class="height">
            {{ customerInfo.deptRole == null ? "无" : customerInfo.deptRole }}
          </div>
        </div>
        <div class="customer_item">
          <div>线索归属</div>
          <div class="height">
            {{
              customerInfo.affiliationStaff == null
                ? "无"
                : customerInfo.affiliationStaff
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
            <div>
              <div class="base_info_title"></div>
              <div class="base_info_card" style="font-weight: 600">
                基本信息
              </div>
              <div class="base_info_card">
                <span>客户名称</span>
                <span>{{ customerInfo.customerName }}</span>
              </div>
              <div class="base_info_card">
                <span>联系人姓名</span>
                <span>{{
                  customerInfo.contactName == ""
                    ? "-"
                    : customerInfo.contactName
                }}</span>
              </div>
              <div class="base_info_card">
                <span>尊称</span>
                <span>{{
                  customerInfo.sex == "" ? "-" : customerInfo.sex
                }}</span>
              </div>
              <div class="base_info_card">
                <span>部门职务</span>
                <span>{{
                  customerInfo.deptRole == "" ? "-" : customerInfo.deptRole
                }}</span>
              </div>
              <div class="base_info_card">
                <span>角色</span>
                <span>{{
                  customerInfo.deptRole == "" ? "-" : customerInfo.deptRole
                }}</span>
              </div>
              <div class="base_info_card">
                <span>手机号码</span>
                <span>{{
                  customerInfo.phone == "" ? "-" : customerInfo.phone
                }}</span>
              </div>
              <div class="base_info_card">
                <span>固定电话</span>
                <span>{{
                  customerInfo.tel == "" ? "-" : customerInfo.tel
                }}</span>
              </div>
              <div class="base_info_card">
                <span>电子邮箱</span>
                <span>{{
                  customerInfo.email == "" ? "-" : customerInfo.email
                }}</span>
              </div>
              <div class="base_info_card">
                <span>QQ号码</span>
                <span>{{ customerInfo.qq == "" ? "-" : customerInfo.qq }}</span>
              </div>
              <div class="base_info_card">
                <span>传真号码</span>
                <span>{{
                  customerInfo.faxNo == "" ? "-" : customerInfo.faxNo
                }}</span>
              </div>
              <div class="base_info_card">
                <span>微信账号</span>
                <span>{{ customerInfo.vx == "" ? "-" : customerInfo.vx }}</span>
              </div>
              <div class="base_info_card">
                <span>线索来源</span>
                <span>{{
                  customerInfo.source == "" ? "-" : customerInfo.source
                }}</span>
              </div>
              <div class="base_info_card">
                <span>线索状态</span>
                <span>{{
                  customerInfo.sourceStatus == ""
                    ? "-"
                    : customerInfo.sourceStatus
                }}</span>
              </div>
              <div class="base_info_card">
                <span>线索归属</span>
                <span>{{
                  customerInfo.affiliationStaff == ""
                    ? "-"
                    : customerInfo.affiliationStaff
                }}</span>
              </div>
            </div>
            <div>
              <div
                class="base_info_title"
                style="padding: 10px; background: RGB(249, 249, 249)"
              ></div>
              <div class="base_info_card" style="font-weight: 600">
                系统信息
              </div>
              <div class="base_info_card">
                <span>系统编号</span>
                <span>{{
                  customerInfo.clueSn == "" ? "-" : customerInfo.clueSn
                }}</span>
              </div>
              <div class="base_info_card">
                <span>创建人员</span>
                <span>{{
                  customerInfo.createBy == "" ? "-" : customerInfo.createBy
                }}</span>
              </div>
              <div class="base_info_card">
                <span>所属部门</span>
                <span>{{
                  customerInfo.affiliationDept == ""
                    ? "-"
                    : customerInfo.affiliationDept
                }}</span>
              </div>
              <div class="base_info_card">
                <span>前归属人</span>
                <span>{{
                  customerInfo.beforeUserId == ""
                    ? "-"
                    : customerInfo.beforeUserId
                }}</span>
              </div>
              <div class="base_info_card">
                <span>前归属部门</span>
                <span>{{
                  customerInfo.beforeDeptId == ""
                    ? "-"
                    : customerInfo.beforeDeptId
                }}</span>
              </div>
              <div class="base_info_card">
                <span>创建时间</span>
                <span>{{
                  customerInfo.createTime == "" ? "-" : customerInfo.createTime
                }}</span>
              </div>
              <div class="base_info_card">
                <span>更新时间</span>
                <span>{{
                  customerInfo.updateTime == "" ? "-" : customerInfo.updateTime
                }}</span>
              </div>
              <div class="base_info_card">
                <span>最后跟进</span>
                <span>{{
                  customerInfo.followUpTime == ""
                    ? "-"
                    : customerInfo.followUpTime
                }}</span>
              </div>
              <div class="base_info_card">
                <span>下次跟进</span>
                <span>{{
                  customerInfo.nextMoreInto == ""
                    ? "-"
                    : customerInfo.nextMoreInto
                }}</span>
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
            <div class="work">
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
                  <div>新字段值：<div class="optionName">{{ item.field }}</div></div>
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
    <!-- 领取线索 -->
    <el-dialog
      title="是否确认变更线索状态？"
      :visible.sync="pickdia"
      width="300px"
      top="30%"
    >
      <el-select
        style="width: 100%"
        v-model="sourceStatus"
        placeholder="线索状态"
        clearable
        size="small"
      >
        <el-option
          v-for="(item, index) in sourceSatusList"
          :key="index"
          :label="item.dictLabel"
          :value="item.dictValue"
        ></el-option>
      </el-select>
      <span slot="footer" class="dialog-footer">
        <el-button @click.native="pickdia = false">取 消</el-button>
        <el-button type="primary" @click.native="pickcomfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import {
  getMarketClueDetailById,
  getlogpage,
  getdynamicList,
  deleteByIds,
  updatesaleleadStatus,
} from "@/api/saleslead/index";
export default {
  data() {
    return {
      sourceStatus: "",
      sourceSatusList: [],
      customerInfo: {},
      dynamicList: [],
      dataVO: {},
      activeName: "1",
      followRecordData: [],
      operaLogData: [],
      deldia: false,
      pickdia: false,
      footerList: [
        // { name: "转为客户", icon: "", action: "0" },
        // { name: "变更状态", icon: "", action: "1" },
        { name: "短信", icon: "el-icon-chat-line-round", action: "0" },
        { name: "跟进", icon: "el-icon-edit-outline", action: "1" },
        { name: "编辑线索", icon: "el-icon-edit", action: "2" },
        { name: "删除线索", icon: "el-icon-delete", action: "3" },
      ],
    };
  },
  mounted() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
    this.getcustomerdetail();
    this.followRecordList();
    this.operaLogList();
  },
  methods: {
    pickcomfirm() {
      updatesaleleadStatus({
        commentContent: this.sourceStatus,
        fkId: this.$route.query.id,
      }).then((res) => {
        this.pickdia = false;
        this.getcustomerdetail();
        this.$message.success("变更成功");
      });
    },
    delconfirm() {
      deleteByIds({ ids: [this.$route.query.id] }).then((res) => {
        this.$message.success("删除成功");
        this.$router.push({
          path: "/saleleadh5",
        });
      });
    },
    handleAction(type) {
      if (type == 2) {
        this.$router.push({
          path: "/addsalelead",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 1) {
        // this.pickdia = true;
        // return;
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
            phone: this.customerInfo.phone,
            id: this.$route.query.id,
            type: 0,
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
      getlogpage({ objectId: this.$route.query.id }).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    // 跟进记录
    followRecordList() {
      getdynamicList({ fkId: this.$route.query.id }).then((res) => {
        this.followRecordData = res.data.records;
        this.dynamicList = res.data.records;
        console.log(this.dynamicList);
      });
    },
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    handleClick() {},
    // 客户详情
    getcustomerdetail() {
      getMarketClueDetailById({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data;
        // this.dynamicList = res.data.list;
        // this.dataVO = res.data.dataVO;
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
::v-deep .el-dialog:not(.is-fullscreen) {
  margin-top: 30vh !important;
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
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
}
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
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
  ::v-deep .el-tabs__item.is-active{
    color: #212121 !important;
  }
  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    // justify-content: space-between;
    justify-content: space-evenly;
    background-color: #f9f9f9;
  }
  ::v-deep .el-icon-arrow-left{
    top: -2px;
  }
  ::v-deep .el-tabs__active-bar{
    width: 20px !important;
    height: 3px !important;
    left:18px;
    border-radius: 1.5px;
  }
  ::v-deep .date span[data-v-7ad7163d]{
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
  div {
    text-align: center;
    font-size: 13px;
    color: #666666;
  }
  .customer_item {
    padding: 12px 0;
  }
  .height{
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
  // padding: 10px 0;
  .card {
    margin-bottom: 20px;
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 0;
      border-bottom: 1px solid #e7e7e7;
      color: #212121;
      .dynamic_title {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        // color: #212121;
      }
      .userName {
        font-size: 14px;
        font-family: PingFang SC;
        font-weight: 500;
        // color: #212121;
      }
    }
    font-size: 13px;
    padding: 0 12px;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      margin-right: 14px;
    }
    .dynamic_conent {
      background: #f8f8f8;
      padding: 10px 8px 20px;
      margin: 10px 0;
    }
    .dynamic_time {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 15px 0 !important;
      border-top: 1px solid #e7e7e7;
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
  padding: 13px 20px;
  display: flex;
  color: #212121;
  span:nth-child(1) {
    width: 100px;
    font-size: 15px;
    color: #666666;
  }
  span:nth-child(2) {
    font-size: 16px;
    color: #212121;
    font-weight: 500;
  }
}
.opera_card {
  background: #ffffff;
  // width: 95%;
  padding: 0 12px;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  .operaUser {
    border-bottom: 1px solid #e9eaec;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 10px 0;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 21px;
      height: 21px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .opera_text_card {
    font-size: 13px;
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
.height {
  // height: 40px;
  // line-height: 40px;
  font-size: 16px !important;
  font-weight: 500;
  font-family: PingFang SC;
  color: #212121;
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
</style>
