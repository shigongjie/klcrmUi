/**日程详情 */
<template>
  <div>
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
      <span class="scheduleName">{{ detailData.scheduleTitle }}</span>
      <span><i class=""></i></span>
    </div>
    <div class="pd">
      <div style="margin-top: 10px" class="base_info_card">
        <span>日程标题：</span>
        <span>{{ detailData.scheduleTitle }}</span>
      </div>
      <div class="base_info_card">
        <span>开始时间：</span>
        <span>{{ detailData.beginTime }}</span>
      </div>
      <div class="base_info_card">
        <span>结束时间：</span>
        <span>{{ detailData.endTime }}</span>
      </div>
      <div class="base_info_card">
        <span>紧要程度：</span>
        <span>{{ detailData.urgencydegree }}</span>
      </div>
      <div class="base_info_card">
        <span>关联业务：</span>
        <span>{{ detailData.businessName }}</span>
      </div>
      <div class="base_info_card">
        <span>日程描述：</span>
        <el-input
            type="textarea"
            :rows="6"
            disabled
            placeholder="请输入工作总结"
            maxlength="300"
            v-model="detailData.description"
          />
        <!-- <span>{{ detailData.description }}</span> -->
      </div>
      <div class="base_info_card">
        <span>日程状态：</span>
        <span>{{ detailData.scheduleStatus }}</span>
      </div>
      <div class="base_info_card">
        <span>负责人员：</span>
        <span>{{ detailData.founderId }}</span>
      </div>
      <div class="base_info_card">
        <span>任务提醒：</span>
        <span>{{ detailData.warn }}</span>
      </div>
      <div class="base_info_card">
        <span>提醒方式：</span>
        <span>{{ detailData.war }}</span>
      </div>
      <div class="base_info_card">
        <span>创建时间：</span>
        <span>{{ detailData.createTime }}</span>
      </div>
    </div>
    <div class="footer">
      <div @click="handleEdit">
        <span><i class="el-icon-edit"></i></span>
        <span>编辑日程</span>
      </div>
      <div @click="delSchedule">
        <span><i class="el-icon-delete"></i></span>
        <span>删除日程</span>
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
import { delSchedule } from "@/api/officeManagement";
export default {
  data() {
    return {
      detailData: {},
      deldia: false,
    };
  },
  mounted() {
    console.log();
    this.detailData = JSON.parse(this.$route.query.data);
  },
  methods: {
    jumpgo() {
      this.$router.go(-1);
    },
    delconfirm() {
      delSchedule({ ids: [this.$route.query.id] }).then((res) => {
        this.$router.push({
          path: "/scheduleh5",
        });
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    delSchedule() {
      this.deldia = true;
    },
    handleEdit() {
      this.$router.push({
        path: "/addreporth5",
        query: {
          id: this.detailData.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.footer {
  border-top: 1px solid #e9eaec;
  position: fixed;
  bottom: 0;
  width: 100%;
  padding: 20px 0;
  display: flex;
  justify-content: space-around;
  font-size: 13px;
  background: #ffffff;
  div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
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
.scheduleName{
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
}
.pd {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 100px;
  background: RGB(249, 249, 249);
}
.base_info_card {
  background: #ffffff;
  font-size: 13px;
  padding: 14px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9eaec;
  span{
    flex-shrink: 0;
  }
}
</style>
