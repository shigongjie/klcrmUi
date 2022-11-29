<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'跟进详情'"
      :visible.sync="open"
      width="450px"
    >
      <div>
        <div class="tableSelf">
          <div class="each">
            <div>跟进类型：</div>
            <div>{{ companyData.followType }}</div>
          </div>
          <div class="each">
            <div>跟进方式：</div>
            <div>{{ companyData.followWay }}</div>
          </div>
          <div class="each">
            <div>跟进时间：</div>
            <div>{{ companyData.time }}</div>
          </div>
          <div class="each">
            <div>跟进描述：</div>
            <div>{{ companyData.description }}</div>
          </div>
          <div class="each">
            <div>客户名称：</div>
            <div>{{ companyData.customerName }}</div>
          </div>
          <div class="each">
            <div>
              {{ companyData.followType == "线索跟进" ? "线索" : "客户" }}状态：
            </div>
            <div>{{ companyData.state }}</div>
          </div>
          <div class="each" v-if="companyData.followType != '线索跟进'">
            <div>联系人：</div>
            <div>{{ companyData.contactId }}</div>
          </div>
          <div class="each">
            <div>评论数量：</div>
            <div>{{ companyData.commentNum }}</div>
          </div>
          <div class="each">
            <div>跟进人员：</div>
            <div>{{ companyData.userId }}</div>
          </div>
          <div class="each">
            <div>提醒谁看：</div>
            <div>{{ companyData.remindUserIds }}</div>
          </div>
          <div class="each">
            <div>创建时间：</div>
            <div>{{ companyData.createTime }}</div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div class="footerSelf">
          <span @click="edit">编辑跟进</span>
          <span @click="del">删除跟进</span>
        </div>
        <!-- <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button> -->
      </span>
    </el-dialog>
    <!-- 跟进 -->
    <FollowUp
      :editId="companyData.id"
      v-if="companyData.followType != '线索跟进'"
      ref="FollowUp"
      :customerId="companyData.customerId"
      @reload="getData"
      :contactIds="companyData.contactId"
    />
    <FollowUp
      :editId="companyData.id"
      v-else
      ref="FollowUp"
      :saleId="companyData.customerId"
      @reload="getData"
    />
  </div>
</template>

<script>
import { followrecorddetail, followremove } from "@/api/customer/index";
import FollowUp from "../../add/followup.vue";
import { saveCoop } from "@/api/customer/index";

export default {
  components: {
    FollowUp,
  },
  props: {},
  data() {
    return {
      id: "",
      dataVO: {},
      companyData: {},
      open: false,
      submitParams: {
        collaborators: "",
      },
    };
  },
  watch: {
    open(val) {
      if (val) {
        // followrecorddetail({ id: this.id }).then((res) => {
        //   this.companyData = res.data;
        // });
      }
    },
  },
  beforeMount() {},
  methods: {
    del() {
      this.$confirm("是否确定删除该跟进?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          followremove({ id: this.companyData.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.open = false;
            this.$emit("reload");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消删除",
          });
        });
    },
    edit() {
      this.$refs.FollowUp.open = true;
    },
    getData(id) {
      if (id) {
        this.id = id;
      }
      followrecorddetail({ id: this.id }).then((res) => {
        this.companyData = res.data;
      });
    },
    changeUser(val) {
      this.submitParams.collaborators = val;
    },
    submit() {
      if (this.submitParams.collaborators) {
        this.submitParams.collaborators =
          this.submitParams.collaborators.toString();
      } else {
        this.submitParams.collaborators = "";
      }
      this.submitParams.id = this.ids.toString();
      saveCoop(this.submitParams).then((res) => {
        this.open = false;
        this.$emit("reload");
      });
    },
  },
};
</script>

<style lang='scss' scpoed>
.tableSelf {
  margin-top: 20px;
  font-size: 13px;
  border: 1px solid #ccc;
  .each {
    border-bottom: 1px solid #ccc;
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
      width: 130px;
      border-right: 1px solid #ccc;
      background: #f5f5f5;
      text-align: center;
    }
    div:nth-child(2) {
      padding-left: 20px;
    }
  }
}
.footerSelf {
  margin-top: -10px;
  text-align: left;
  span {
    margin-right: 10px;
    font-size: 13px;
    cursor: pointer;
    color: #409eff;
  }
}
::v-deep .el-dialog {
  background: red;
  ::v-deep .el-dialog__footer {
    text-align: left !important;
  }
}
</style>