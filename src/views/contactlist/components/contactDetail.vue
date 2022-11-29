/**线索详情 */
<template>
  <div>
    <div class="customerInfoCard">
      <div>
        <span class="customerName">{{ customerInfo.contactName }}</span>
        <!-- <span>客户网络资讯</span> -->
      </div>
      <div class="concatInfo">
        <span
          ><i>关联客户：</i>
          <i style="color: #409eff; cursor: pointer">{{
            customerInfo.relevancyClient
          }}</i></span
        >
        <span><i>手机号码：</i>{{ customerInfo.phone }}</span>
        <span
          ><i>下次跟进：</i
          >{{
            customerInfo.followUpTime == "" || customerInfo.followUpTime == null
              ? "无"
              : customerInfo.followUpTime
          }}</span
        >
      </div>
      <div class="btnWarp">
        <el-button
          plain
          icon="el-icon-document-add"
          size="small"
          @click="handleAction('5')"
          >新建任务</el-button
        >
        <el-button
          plain
          icon="el-icon-edit"
          size="small"
          @click="handleAction('2')"
          >写新跟进</el-button
        >
        <el-button
          plain
          icon="el-icon-edit-outline"
          size="small"
          @click="edit()"
          >编辑联系人</el-button
        >
        <el-button
          plain
          icon="el-icon-circle-close"
          size="small"
          @click="handleDel()"
          >删除联系人</el-button
        >
      </div>
    </div>
    <div class="pd">
      <div>
        <div>
          <div class="titleSelf"><i class="el-icon-s-flag"></i> 基本信息</div>
          <div class="tableSelf">
            <div class="box">
              <div class="each">
                <div>联系人姓名：</div>
                <div>{{ customerInfo.contactName }}</div>
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
                <div>详细地址：</div>
                <div>{{ customerInfo.address }}</div>
              </div>
            </div>
            <div class="box">
              <div class="each">
                <div>关联客户：</div>
                <div style="color: #409eff; cursor: pointer">
                  {{ customerInfo.relevancyClient }}
                </div>
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
                <div>所在地区：</div>
                <div>{{ customerInfo.region }}</div>
              </div>
              <div class="each" style="border-bottom: 1px solid #cccccc">
                <div>备注信息：</div>
                <div>{{ customerInfo.remark }}</div>
              </div>
            </div>
          </div>
          <div class="titleSelf"><i class="el-icon-s-flag"></i>系统信息</div>
          <div class="tableSelf">
            <div class="box">
              <div class="each">
                <div>系统编号：</div>
                <div>{{ customerInfo.contactSn }}</div>
              </div>
              <div class="each">
                <div>创建时间：</div>
                <div>{{ customerInfo.createTime }}</div>
              </div>
              <div class="each">
                <div>最后跟进：</div>
                <div>{{ customerInfo.followTime }}</div>
              </div>
            </div>
            <div class="box">
              <div class="each">
                <div>创建人员：</div>
                <div>{{ customerInfo.createBy }}</div>
              </div>
              <div class="each">
                <div>更新时间：</div>
                <div>{{ customerInfo.updateTime }}</div>
              </div>
              <div class="each">
                <div>下次跟进：</div>
                <div>{{ customerInfo.nextFollowTime }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FollowUp
      ref="FollowUp"
      @reload="getData"
      :contactIds="customerInfo.id"
      :customerId="customerInfo.relevancyClientId"
    />
    <Task
      ref="Task"
      :customerId="[currentCustomerId]"
      :type="1"
      @reload="getData"
    />
    <ConnectPerson
      v-if="open"
      ref="ConnectPerson"
      :id="editId"
      @reload="getData"
    />
  </div>
</template>

<script>
import FollowUp from "../../add/followup.vue";
import Task from "../../add/task.vue";
import ConnectPerson from "../../add/connectperson.vue";
import { getContactDetailById, deleteByIds } from "@/api/customer/index";
import { getlogpage, getdynamicList } from "@/api/saleslead/index";
export default {
  components: {
    FollowUp,
    Task,
    ConnectPerson,
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
    };
  },
  mounted() {
    this.currentCustomerId = this.$route.query.id;
    this.getData();
  },
  methods: {
    handleDel() {
      this.$confirm("此操作将永久删除选中联系人, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          deleteByIds({ ids: [this.$route.query.id] }).then((res) => {
            this.$router.push({
              path: "/customerManager/contactlist",
            });
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
    edit(id) {
      this.open = true;
      this.editId = this.$route.query.id;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
    handleSelectionChange() {},
    getData() {
      getContactDetailById({ id: this.$route.query.id }).then((res) => {
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