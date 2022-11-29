<template>
  <el-dialog :close-on-click-modal='false' :title="'跟进详情'" :visible.sync="open" width="450px">
    
    <div>
        <div class="tableSelf">
      <div class="each">
        <div>跟进类型：</div>
        <div>{{companyData.followType}}</div>
      </div>
      <div class="each">
        <div>跟进方式：</div>
        <div>{{companyData.followWay}}</div>
      </div>
      <div class="each">
        <div>跟进时间：</div>
        <div>{{companyData.time}}</div>
      </div>
      <div class="each">
        <div>客户名称：</div>
        <div>{{companyData.customerName}}</div>
      </div>
      <div class="each">
        <div>客户状态：</div>
        <div>{{companyData.state}}</div>
      </div>
      <div class="each">
        <div>联系人：</div>
        <div>{{companyData.contactId}}</div>
      </div>
      <div class="each">
        <div>评论数量：</div>
        <div>{{companyData.commentNum}}</div>
      </div>
      <div class="each">
        <div>跟进人员：</div>
        <div>{{companyData.userId}}</div>
      </div>
      <div class="each">
        <div>提醒谁看：</div>
        <div>{{companyData.remindUserIds}}</div>
      </div>
      <div class="each">
        <div>创建时间：</div>
        <div>{{companyData.createTime}}</div>
      </div>
    </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" @click="submit">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveCoop, subordinateList } from "@/api/customer/index";

export default {
  props: {

  },
  data() {
    return {
      dataVO: {},
      companyData:{},
      open: false,
      userList: [],
      submitParams: {
        collaborators: "",
      },
    };
  },
  watch: {
    open(val) {
    },
  },
  beforeMount() {
    subordinateList().then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
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
</style>