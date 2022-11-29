/**线索详情 */
<template>
  <div>
    <div class="customerInfoCard">
      <div>
        <span class="customerName">{{ customerInfo.customerName }}</span>
        <!-- <span>客户网络资讯</span> -->
      </div>
      <div class="concatInfo">
        <span><i>客户归属：</i>{{ customerInfo.affiliationStaff }}</span>
        <span><i>首联系人：</i>{{ customerInfo.contactName }}</span>
        <span><i>下次跟进：</i>{{ customerInfo.followUpTime }}</span>
      </div>
      <div class="btnWarp">
        <el-select
          @change="changeSourceStatus"
          style="width: 100px; margin-right: 10px"
          v-model="customerInfo.sourceStatus"
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
        <!-- <el-select
          style="width: 100px; margin-right: 10px"
          v-model="customerInfo.sourceStatus"
          placeholder="线索状态"
          clearable
          size="small"
        >
          <el-option label="初步意向" value="1"></el-option>
          <el-option label="下次邀约" value="2"></el-option>
        </el-select> -->
        <el-button
          plain
          icon="el-icon-refresh-left"
          size="small"
          @click="handleAction('3')"
          v-btnPermi="['marketclue_change_contacts']"
          >转为客户</el-button
        >
        <el-button
          plain
          icon="el-icon-edit"
          size="small"
          @click="handleAction('2')"
          v-btnPermi="['marketclue_add_follow_up']"
          >写新跟进</el-button
        >
        <el-button
          plain
          icon="el-icon-document-add"
          size="small"
          @click="handleAction('5')"
          v-btnPermi="['marketclue_add_task']"
          >新建任务</el-button
        >
        <el-button
          plain
          icon="el-icon-edit-outline"
          size="small"
          @click="edit()"
          v-btnPermi="['marketclue_update']"
          >编辑线索</el-button
        >
        <el-button
          plain
          icon="el-icon-circle-close"
          size="small"
          @click="delcustomer('2')"
          v-btnPermi="['marketclue_detele']"
          >删除线索</el-button
        >
      </div>
    </div>
    <div class="pd">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsSelf">
        <el-tab-pane label="概况信息" name="1">
          <div>
            <div>
              <div class="titleSelf">
                <i class="el-icon-s-flag"></i> 基本信息
              </div>
              <div class="tableSelf">
                <div class="box">
                  <div class="each">
                    <div>客户名称：</div>
                    <div>{{ customerInfo.customerName }}</div>
                  </div>
                  <div class="each">
                    <div>尊称：</div>
                    <div>{{ customerInfo.sex }}</div>
                  </div>
                  <div class="each">
                    <div>部门职务：</div>
                    <div>{{ customerInfo.deptRole }}</div>
                  </div>
                  <div class="each">
                    <div>固定电话：</div>
                    <div>{{ customerInfo.tel }}</div>
                  </div>
                  <div class="each">
                    <div>电子邮箱：</div>
                    <div>{{ customerInfo.email }}</div>
                  </div>
                  <div class="each">
                    <div>QQ号码：</div>
                    <div>{{ customerInfo.qq }}</div>
                  </div>
                  <div class="each">
                    <div>线索状态：</div>
                    <div>{{ customerInfo.sourceStatus }}</div>
                  </div>
                  <div class="each">
                    <div>备注信息：</div>
                    <div>{{ customerInfo.remark }}</div>
                  </div>
                </div>
                <div class="box">
                  <div class="each">
                    <div>联系人姓名：</div>
                    <div>{{ customerInfo.contactName }}</div>
                  </div>
                  <div class="each">
                    <div>角色：</div>
                    <div>{{ customerInfo.role }}</div>
                  </div>
                  <div class="each">
                    <div>手机号码：</div>
                    <div>{{ customerInfo.phone }}</div>
                  </div>
                  <div class="each">
                    <div>传真号码：</div>
                    <div>{{ customerInfo.faxNo }}</div>
                  </div>
                  <div class="each">
                    <div>微信账号：</div>
                    <div>{{ customerInfo.vx }}</div>
                  </div>
                  <div class="each">
                    <div>线索来源：</div>
                    <div>{{ customerInfo.source }}</div>
                  </div>
                  <div class="each" style="border-bottom: 1px solid #cccccc">
                    <div>线索归属：</div>
                    <div>{{ customerInfo.affiliationStaff }}</div>
                  </div>
                </div>
              </div>
              <div class="titleSelf">
                <i class="el-icon-s-flag"></i>系统信息
              </div>
              <div class="tableSelf">
                <div class="box">
                  <div class="each">
                    <div>系统编号：</div>
                    <div>{{ customerInfo.clueSn }}</div>
                  </div>
                  <div class="each">
                    <div>创建人员：</div>
                    <div>{{ customerInfo.createBy }}</div>
                  </div>
                  <div class="each">
                    <div>前所属部门：</div>
                    <div>{{ customerInfo.beforeDeptId }}</div>
                  </div>
                  <div class="each">
                    <div>更新时间：</div>
                    <div>{{ customerInfo.updateTime }}</div>
                  </div>
                  <div class="each">
                    <div>下次跟进：</div>
                    <div>{{ customerInfo.nextMoreInto }}</div>
                  </div>
                </div>
                <div class="box">
                  <div class="each">
                    <div>所属部门：</div>
                    <div>{{ customerInfo.affiliationDept }}</div>
                  </div>
                  <div class="each">
                    <div>前归属人：</div>
                    <div>{{ customerInfo.beforeUserId }}</div>
                  </div>
                  <div class="each">
                    <div>创建时间：</div>
                    <div>{{ customerInfo.createTime }}</div>
                  </div>
                  <div class="each">
                    <div>最后跟进：</div>
                    <div>{{ customerInfo.followUpTime }}</div>
                  </div>
                  <div class="each">
                    <div></div>
                    <div></div>
                  </div>
                </div>
              </div>
            </div>
            <div class="titleSelf"><i class="el-icon-s-flag"></i>线索动态</div>
            <div class="timelineBox">
              <el-timeline style="padding-left: 5px">
                <el-timeline-item
                  v-for="(item, index) in dynamicList"
                  :key="index"
                  color="#0079fe"
                  :timestamp="item.date"
                  placement="top"
                >
                  <el-card
                    style="margin-top: 10px; background: #f7fbfe"
                    v-for="(items, indexs) in item.list"
                    :key="indexs"
                  >
                    <h4 class="dynamicUserInfoDiv">
                      <div>
                        <img
                          :src="
                            items.avatar == '' || items.avatar == null
                              ? $store.state.user.avatar
                              : items.avatar
                          "
                          alt=""
                        />
                      </div>
                      <span>{{ items.userName }}</span>
                      <span>{{ items.dynamicTitle }}</span>
                    </h4>
                    <p>{{ items.dynamicContent }}</p>
                    <p>客户来自：{{ customerInfo.customerName }}</p>
                    <div
                      class="commentList"
                      v-for="(common, commonindex) in items.list"
                      :key="commonindex"
                    >
                      <i
                        @click="delComment(common)"
                        class="delIcon el-icon-close"
                      ></i>
                      <h4 class="dynamicUserInfoDiv">
                        <div>
                          <img
                            :src="
                              common.avatar == '' || common.avatar == null
                                ? $store.state.user.avatar
                                : common.avatar
                            "
                            alt=""
                          />
                        </div>
                        <span
                          >{{ common.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                            common.createTime
                          }}</span
                        >
                      </h4>
                      <div>
                        <span>{{ common.commentContent }}</span>
                      </div>
                    </div>
                    <div v-if="items.type == 1">
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click="detail(items.id)"
                        >详情</el-button
                      >
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click="comment(items)"
                        >评论</el-button
                      >
                    </div>
                    <div class="commentDiv" v-if="items.id == currentCommentId">
                      <el-input placeholder="请输入内容" v-model="comments">
                      </el-input>
                      <el-button
                        plain
                        icon="el-icon-date"
                        size="small"
                        @click.native="SendComment(items)"
                        >评论</el-button
                      >
                    </div>
                  </el-card>
                </el-timeline-item>
              </el-timeline>
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="跟进记录" name="5">
          <div class="timelineBox">
            <el-timeline style="padding-left: 5px">
              <el-timeline-item
                v-for="(item, index) in followRecordData"
                :key="index"
                color="#0079fe"
                :timestamp="item.date"
                placement="top"
              >
                <el-card
                  style="margin-top: 10px; background: #f7fbfe"
                  v-for="(items, indexs) in item.list"
                  :key="indexs"
                >
                  <h4 class="dynamicUserInfoDiv">
                    <div>
                      <img
                        :src="
                          items.avatar == '' || items.avatar == null
                            ? $store.state.user.avatar
                            : items.avatar
                        "
                        alt=""
                      />
                    </div>
                    <span>{{ items.userName }}</span>
                    <span>{{ items.dynamicTitle }}</span>
                  </h4>
                  <p>{{ items.dynamicContent }}</p>
                  <p>客户来自：{{ customerInfo.customerName }}</p>
                  <div
                    class="commentList"
                    v-for="(common, commonindex) in items.list"
                    :key="commonindex"
                  >
                    <h4 class="dynamicUserInfoDiv">
                      <div>
                        <img
                          :src="
                            common.avatar == '' || common.avatar == null
                              ? $store.state.user.avatar
                              : common.avatar
                          "
                          alt=""
                        />
                      </div>
                      <span
                        >{{ common.userName }}&nbsp;&nbsp;&nbsp;&nbsp;{{
                          common.createTime
                        }}</span
                      >
                    </h4>
                    <div>
                      <span>{{ common.commentContent }}</span>
                    </div>
                  </div>
                  <div v-if="items.type == 1">
                    <el-button
                      plain
                      icon="el-icon-date"
                      size="small"
                      @click="detail(items.id)"
                      >详情</el-button
                    >
                    <el-button
                      plain
                      icon="el-icon-date"
                      size="small"
                      @click="comment(items)"
                      >评论</el-button
                    >
                  </div>
                  <div class="commentDiv" v-if="items.id == currentCommentId">
                    <el-input placeholder="请输入内容" v-model="comments">
                    </el-input>
                    <el-button
                      plain
                      icon="el-icon-date"
                      size="small"
                      @click.native="SendComment(items)"
                      >评论</el-button
                    >
                  </div>
                </el-card>
              </el-timeline-item>
            </el-timeline>
          </div>
        </el-tab-pane>
        <el-tab-pane label="任务记录" name="6">
          <div class="titleSelf"><i class="el-icon-s-flag"></i> 任务记录</div>
          <div
            class="TaskCard"
            v-for="(item, index) in workRecordData"
            :key="index"
          >
            <div>
              <span>开始时间</span>
              <span>{{ item.beginTime }}</span>
            </div>
            <div>
              <span>任务标题</span>
              <span>{{ item.headline }}</span>
            </div>
            <div>
              <span>负责人员</span>
              <span>{{ item.personId }}</span>
            </div>
            <div>
              <span>任务状态</span>
              <span>{{ item.taskType }}</span>
            </div>
            <div>
              <span>紧要程度</span>
              <span>{{ item.urgencydegree }}</span>
            </div>
            <div style="width: 100px">
              <el-button
                plain
                icon="el-icon-date"
                size="small"
                @click="jumpDetail(item.id)"
                >详情</el-button
              >
            </div>
          </div>
        </el-tab-pane>
        <el-tab-pane label="操作日志" name="9">
          <el-table
            ref="multipleTable"
            :data="operaLogData"
            tooltip-effect="dark"
            style="width: 100%"
            @selection-change="handleSelectionChange"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column prop="time" label="操作时间"> </el-table-column>
            <el-table-column prop="userId" label="操作人员"> </el-table-column>
            <el-table-column prop="type" label="操作类型"> </el-table-column>
            <el-table-column prop="fieldName" label="字段名"> </el-table-column>
            <el-table-column prop="fieldOld" label="旧字段值">
            </el-table-column>
            <el-table-column prop="field" label="新字段值"> </el-table-column>
            <el-table-column prop="remark" label="备注"> </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </div>
    <AddSaleLead v-if="open" :id="editId" ref="AddSaleLead" @reload="getAllData" />
    <TransferCustomer
      v-if="TransferCustomerOpen"
      ref="TransferCustomer"
      :id="$route.query.id"
      @reload="getData"
    />
    <FollowUp
      ref="FollowUp"
      :saleId="currentCustomerId"
      @reload="getAllData"
      :contactIds="customerInfo.contactId"
    />
    <Task
      ref="Task"
      :customerId="[currentCustomerId]"
      :type="4"
      @reload="getAllData"
    />
    <!-- 跟进详情 -->
    <FollowUpDetail ref="FollowUpDetail" @reload="getAllData" />
  </div>
</template>

<script>
import { SendComment, deleCommentById } from "@/api/common/index";
import FollowUp from "../../add/followup.vue";
import Task from "../../add/task.vue";
import AddSaleLead from "./add.vue";
import FollowUpDetail from "../../customerdetail/components/followupdetail.vue";
import { followrecorddetail } from "@/api/customer/index";
import {
  getMarketClueDetailById,
  getlogpage,
  getdynamicList,
  getworkRecordList,
  deleteByIds,
  updatesaleleadStatus,
} from "@/api/saleslead/index";
import TransferCustomer from "./transformcustomer.vue";
export default {
  components: {
    AddSaleLead,
    TransferCustomer,
    FollowUp,
    Task,
    FollowUpDetail,
  },
  data() {
    return {
      currentCommentId: "", //当前评论ID
      currentCustomerId: "", //当前客户ID
      open: false,
      TransferCustomerOpen: false, //转为客户
      activeName: "1",
      customerInfo: {}, //客户信息
      followRecordData: [], //跟进记录
      workRecordData: [], //任务记录
      operaLogData: [],
      dynamicList: [],
      editId: "",
      comments: "",
      sourceSatusList: [],
    };
  },
  beforeMount() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
  },
  mounted() {
    this.currentCustomerId = this.$route.query.id;
    this.getData();
    this.getdynamicList({ fkId: this.currentCustomerId });
  },
  methods: {
    changeSourceStatus(ob) {
      updatesaleleadStatus({
        commentContent: ob,
        fkId: this.$route.query.id,
      }).then((res) => {
        if (res.success) {
          this.getData();
          this.$message.success("更新成功");
        }
      });
      console.log(ob);
    },
    jumpDetail(id) {
      this.$router.push({
        path: "/officeManagement/taskDetail",
        query: { id: id },
      });
    },
    getAllData() {
      this.getData();
      this.getdynamicList({ fkId: this.currentCustomerId });
      this.getworkRecordList({ fkId: this.currentCustomerId });
      getlogpage({ objectId: this.$route.query.id }).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    // 获取动态
    getdynamicList(ob) {
      let data = {};
      if (this.activeName == 5) {
        data.type = 1;
        data.fkId = this.currentCustomerId;
      } else {
        data.fkId = this.currentCustomerId;
      }
      getdynamicList(data).then((res) => {
        if (res) {
          this.dynamicList = res.data.records;
          this.followRecordData = res.data.records;
        }
      });
    },
    getworkRecordList(ob) {
      getworkRecordList(ob).then((res) => {
        if (res) {
          this.workRecordData = res.data.records;
        }
      });
    },
    edit(id) {
      this.editId = this.$route.query.id;
      this.open = true;
      this.$nextTick(() => {
        this.$refs.AddSaleLead.open = true;
      });
    },
    detail(id) {
      followrecorddetail({ id: id }).then((res) => {
        this.followUpdetailData = res.data;
        this.$refs.FollowUpDetail.open = true;
        this.$refs.FollowUpDetail.companyData = res.data;
        this.followUpdetailDialog = true;
      });
    },
    comment(ob) {
      this.currentCommentId = ob.id;
    },
    SendComment(ob) {
      let data = {};
      data.commentContent = this.comments;
      // data.userId = ob.userId;
      if (this.comments == "") {
        this.$message.error("请输入评论内容");
        return false;
      }
      data.fkId = ob.id;
      SendComment(data).then((res) => {
        this.comments = "";
        this.getdynamicList({ fkId: this.currentCustomerId });
      });
    },
    // 删除评论
    delComment(ob) {
      this.$confirm("是否确定删除该条评论?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleCommentById({ id: ob.id }).then((res) => {
            this.getdynamicList({ fkId: this.currentCustomerId });
            this.$message({
              type: "success",
              message: "删除成功!",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleClick() {
      if(this.activeName == 1 ){
        this.getAllData()
      }
      if (this.activeName == 9) {
        getlogpage({ objectId: this.$route.query.id }).then((res) => {
          this.operaLogData = res.rows;
        });
      }
      if (this.activeName == 5) {
        getdynamicList({ fkId: this.currentCustomerId, type: 1 }).then(
          (res) => {
            this.followRecordData = res.data.records;
          }
        );
      }
      if (this.activeName == 6) {
        this.getworkRecordList({ fkId: this.currentCustomerId });
      }
    },
    delcustomer() {
      this.$confirm("是否确定删除该条线索?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteByIds({ ids: [this.currentCustomerId] }).then((res) => {
            this.$message.success("删除成功");
            this.$router.push({
              path: "/customerManager/saleslead",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    handleSelectionChange() {},
    getData() {
      getMarketClueDetailById({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data;
      });
    },
    handleAction(type) {
      if (type == 2) {
        this.$refs.FollowUp.open = true;
      }
      if (type == 3) {
        this.TransferCustomerOpen = true;
        this.$nextTick(() => {
          this.$refs.TransferCustomer.open = true;
        });
      }
      if (type == 5) {
        this.$refs.Task.open = true;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.customerInfoCard {
  padding: 0px 30px;
  padding-top: 30px;
  .customerName {
    font-size: 18px;
    font-weight: 600;
    padding: 0 0px;
    margin-right: 20px;
  }
  .concatInfo {
    margin-top: 20px;
    font-size: 13px;
    span {
      margin-right: 20px;
      color: #977e7f;
    }
  }
  .btnWarp {
    margin-top: 20px;
  }
  i {
    font-style: normal;
    color: #999999;
  }
}
.pd {
  padding: 30px 30px;
}
::v-deep .el-tabs__item {
  font-weight: 600;
}
.titleSelf {
  font-size: 14px;
  font-weight: 600;
  margin-top: 20px;
}
.tableSelf {
  .box {
    flex: 1;
  }
  display: flex;
  margin-top: 20px;
  font-size: 13px;
  border: 1px solid #ccc;
  border-left: none;
  .each {
    border-bottom: 1px solid #ccc;
    border-left: none;
  }
  .each:last-child {
    border-top: none;
    border-bottom: none;
  }
  .each {
    display: flex;
    align-items: center;
    height: 40px;
    div {
      height: 100%;
      line-height: 40px;
    }
    div:nth-child(1) {
      width: 150px;
      border-right: 1px solid #ccc;
      border-left: 1px solid #ccc;
      background: #f5f5f5;
      text-align: center;
      font-weight: 600;
    }
    div:nth-child(2) {
      padding-left: 20px;
    }
  }
}
.dataWarp {
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  div {
    box-shadow: 0 2px 12px 0 rgb(0 0 0 / 10%);
    border-radius: 4px;
    border: 1px solid #e9e9e9;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 140px;
    height: 110px;
    flex-direction: column;

    span {
      padding: 10px 0;
    }
    span:nth-child(2) {
      color: #0079fe;
    }
  }
}
.timelineBox {
  margin-top: 20px;
  ::v-deep .el-timeline-item__timestamp.is-top {
    width: 100px;
    color: #f5f5f5;
    text-align: center;
    background: #0079fe;
    padding: 5px 0;
    border-top-left-radius: 50px;
    border-bottom-left-radius: 50px;
  }
}
.commentDiv {
  display: flex;
  margin-top: 20px;
  ::v-deep .el-input__inner {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    border-right: none;
  }
  ::v-deep .el-button {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
}
.dynamicUserInfoDiv {
  display: flex;
  align-items: center;
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
  span:nth-child(2) {
    display: block;
    // border: 1px solid;
    margin-right: 10px;
    margin-left: 10px;
  }
}
.commentList {
  border: 1px solid #d7e8f4;
  width: 90%;
  padding: 0 10px 10px 20px;
  margin: 20px auto;
  color: #999999;
  background: #ffffff;
  position: relative;
  .delIcon {
    position: absolute;
    right: 20px;
    top: 20px;
    cursor: pointer;
  }
}
.TaskCard:nth-child(2n) {
  background: #f9f9f9;
}
.TaskCard {
  margin-top: 10px;
  padding: 5px 20px;
  display: flex;
  justify-content: space-between;
  border: 1px solid #e9e9e9;
  div {
    display: flex;
    flex-direction: column;
    width: 30%;
    font-size: 13px;
    padding-left: 20px;
    justify-content: center;
    span {
      padding: 10px 0;
      color: #9999b2;
    }
    span:nth-child(2) {
      padding: 10px 0;
      color: #666666;
    }
  }
}
</style>