/**跟进列表 */
<template>
  <div class="warp">
    <el-form :model="queryParams" ref="queryForm" :inline="true">
      <el-form-item prop="realName">
        <el-input
          v-model="queryParams.keyword"
          placeholder="搜索关键词"
          clearable
          size="small"
          @keyup.enter.native="handleQuery"
        />
      </el-form-item>
      <el-form-item label="" prop="endLastLoginTime">
        <el-date-picker
          v-model="time"
          size="small"
          type="daterange"
          value-format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始跟进时间"
          end-placeholder="结束跟进时间"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item prop="" label="跟进人员：">
        <el-cascader
          size="small"
          style="width: 100%"
          v-model="queryParams.userIds"
          :options="userList"
          :show-all-levels="false"
          :props="props"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="" prop="type">
        <el-select
          v-model="queryParams.type"
          placeholder="所属模块"
          clearable
          size="small"
        >
          <el-option label="客户" value="0" />
          <el-option label="线索" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="" prop="dept">
        <el-select
          v-model="queryParams.followWay"
          placeholder="跟进类型"
          clearable
          size="small"
        >
          <el-option
            v-for="dict in followWayList"
            :key="dict.dictValue"
            :label="dict.dictLabel"
            :value="dict.dictValue"
          />
        </el-select>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary"
          icon="el-icon-search"
          size="mini"
          @click="handleQuery"
          >查询</el-button
        >
        <el-button icon="el-icon-refresh" size="mini" @click="resetQuery"
          >重置</el-button
        >
      </el-form-item>
    </el-form>
    <div
      style="text-align: center; padding-top: 30px; color: #999999"
      v-if="followRecordData.length == 0"
    >
      暂无数据
    </div>
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
              <div class="timeAndDel">
                <i
                  class="el-icon-close delIcon"
                  @click="delDynamic(items.id)"
                ></i>
                <i class="el-icon-date" style="margin-right: 5px"></i
                >{{ items.createTime }}
              </div>
              <div>
                <img
                  :src="
                    items.avatar == '' || items.avatar == null
                      ? $store.state.user.defaultAvatar
                      : items.avatar
                  "
                  alt=""
                />
              </div>
              <span>{{ items.userName }}</span>
              <span>{{ items.dynamicTitle }}</span>
            </h4>
            <div style="padding-left: 20px">
              <p>{{ items.dynamicContent }}</p>
              <p>客户来自：{{ items.customerName }}</p>
            </div>

            <div
              class="commentList"
              v-for="(common, commonindex) in items.list"
              :key="commonindex"
            >
              <h4 class="dynamicUserInfoDiv">
                <i
                  class="el-icon-close delIcon"
                  @click="delComment(common)"
                  style="margin-top: -20px"
                ></i>
                <div>
                  <img
                    :src="
                      common.avatar == '' || common.avatar == null
                        ? $store.state.user.defaultAvatar
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
                v-btnPermi="['gjjl_follow_up_details']"
                >详情</el-button
              >
              <el-button
                plain
                icon="el-icon-date"
                size="small"
                @click="comment(items)"
                v-btnPermi="['gjjl_add_comment']"
                >评论</el-button
              >
            </div>
            <div class="commentDiv" v-if="items.id == currentCommentId">
              <el-input placeholder="请输入内容" v-model="comments"> </el-input>
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
    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="queryParams.pageNo"
      :limit.sync="queryParams.pageSize"
      @pagination="getList"
    />
    <!-- 跟进详情 -->
    <FollowUpDetail @reload='getList' ref="FollowUpDetail" />
  </div>
</template>

<script>
import FollowUpDetail from "../customerdetail/components/followupdetail.vue";
import {
  followrecordpage,
  followrecorddetail,
  getstaffList,
  followremove,
} from "@/api/customer/index";
import { SendComment, deleCommentById } from "@/api/common/index";
export default {
  components: {
    FollowUpDetail,
  },
  data() {
    return {
      time: "",
      followRecordData: [],
      followWayList: [],
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      currentCommentId: "",
      comments: "",
      total: 0,
      userList: [],
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
    };
  },
  filters: {},
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    this.getDicts("follow_way").then((res) => {
      this.followWayList = res.data;
    });
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    delDynamic(ob) {
      this.$confirm("是否确定删除该条记录?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          followremove({ id: ob }).then((res) => {
            this.getList(this.queryParams);
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
    handleQuery() {
      if (this.time != "") {
        this.queryParams.startTime = this.time[0];
        this.queryParams.endTime = this.time[1];
      }
      this.getList(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.queryParams = {};
      this.getList();
    },
    getList(query) {
      followrecordpage(this.queryParams).then((res) => {
        if (res.data.records == null) {
          this.followRecordData = [];
        } else {
          this.followRecordData = res.data.records;
        }

        this.total = res.data.total;
      });
    },
    detail(id) {
      this.$refs.FollowUpDetail.open = true;
      this.$refs.FollowUpDetail.id = id;
      followrecorddetail({ id: id }).then((res) => {
        this.$refs.FollowUpDetail.open = true;
        this.$refs.FollowUpDetail.companyData = res.data;
      });
    },
    comment(ob) {
      this.currentCommentId = ob.id;
    },
    SendComment(ob) {
      let data = {};
      data.commentContent = this.comments;
      //   data.userId = ob.userId;
      data.fkId = ob.id;
      if (this.comments == "") {
        this.$message.error("请输入评论内容");
        return false;
      }
      SendComment(data).then((res) => {
        this.$message.success("评论成功");
        this.comments = "";
        this.getList();
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
            this.getList();
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
  },
};
</script>

<style lang='scss' scoped>
.warp {
  padding: 20px 40px;
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
  position: relative;
  display: flex;
  align-items: center;
  .timeAndDel {
    position: absolute;
    color: #999999;
    top: -20px;
    right: 0;
  }
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 10px;
  }
  span {
    margin-right: 10px;
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
.delIcon {
  margin-right: 10px;
  cursor: pointer;
}
</style>