/**任务详情 */
<template>
  <div>
    <div class="top_div">
      <div class="">
        <div>
          <span class="title">{{ taskInfo.headline }}</span>
          <span
            class="businessSpan"
            :class="
              taskInfo.taskType == '0'
                ? 'color1'
                : taskInfo.taskType == '1'
                ? 'color2'
                : taskInfo.taskType == '2'
                ? 'color3'
                : taskInfo.taskType == '3'
                ? 'color4'
                : taskInfo.taskType == '4'
                ? 'color5'
                : 'color6'
            "
          /><span style="font-size: 12px; color: #666666">
            {{
              taskInfo.taskType == "0"
                ? "未开始"
                : taskInfo.taskType == "1"
                ? "进行中"
                : taskInfo.taskType == "2"
                ? "已超时"
                : taskInfo.taskType == "3"
                ? "已完成"
                : taskInfo.taskType == "4"
                ? "未完成"
                : "已取消"
            }}</span
          >
          <span
            v-if="taskInfo.taskType == 2"
            style="font-size: 12px; color: #666666"
            >({{ taskInfo.time }})</span
          >
        </div>
      </div>
      <div>
        <el-button
          type="primary"
          plain
          icon="el-icon-date"
          size="small"
          @click="handleTask"
          v-if="
            taskInfo.taskType != 5 &&
            taskInfo.taskType != 4 &&
            taskInfo.taskType != 0 &&
            taskInfo.taskType != 3
          "
          v-btnPermi="['rm_handle_task']"
          >处理任务</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-date"
          size="small"
          @click="handleNofinish"
          v-if="
            taskInfo.taskType != 5 &&
            taskInfo.taskType != 4 &&
            taskInfo.taskType != 0 &&
            taskInfo.taskType != 3
          "
          v-btnPermi="['rm_not_completed']"
          >未能完成</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-date"
          size="small"
          @click="handleCancel"
          v-if="
            taskInfo.taskType != 5 &&
            taskInfo.taskType != 4 &&
            taskInfo.taskType != 3
          "
          v-btnPermi="['rm_cancel_task']"
          >取消任务</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-date"
          size="small"
          @click="handleEdit"
          v-if="
            taskInfo.taskType != 5 &&
            taskInfo.taskType != 4 &&
            taskInfo.taskType != 3
          "
          v-btnPermi="['rm_editing_tasks']"
          >编辑任务</el-button
        >
        <el-button
          type="primary"
          plain
          icon="el-icon-date"
          size="small"
          @click="handleDel"
          v-btnPermi="['rm_delete_task']"
          >删除任务</el-button
        >
      </div>
    </div>
    <div class="line"></div>
    <div class="pd">
      <div class="titleSelf"><i class="el-icon-s-flag"></i> 基本信息</div>
      <div class="tableSelf">
        <div class="box">
          <div class="each">
            <div>任务类型：</div>
            <div>{{ taskInfo.taskGenre }}</div>
          </div>
          <div class="each">
            <div>开始时间：</div>
            <div>{{ taskInfo.beginTime }}</div>
          </div>
          <div class="each">
            <div>紧要程度：</div>
            <div>{{ taskInfo.urgencydegree }}</div>
          </div>
          <div class="each">
            <div>任务描述：</div>
            <div>{{ taskInfo.description }}</div>
          </div>
          <div class="each">
            <div>参与人员：</div>
            <div>{{ taskInfo.participantId }}</div>
          </div>
          <div class="each">
            <div>提醒方式：</div>
            <div>{{ taskInfo.war }}</div>
          </div>
        </div>
        <div class="box">
          <div class="each">
            <div>任务标题：</div>
            <div>{{ taskInfo.headline }}</div>
          </div>
          <div class="each">
            <div>结束时间：</div>
            <div>{{ taskInfo.endTime }}</div>
          </div>
          <div class="each">
            <div>关联业务：</div>
            <div>{{ taskInfo.businessId }}</div>
          </div>
          <div class="each">
            <div>负责人员：</div>
            <div>{{ taskInfo.person }}</div>
          </div>
          <div class="each">
            <div>任务提醒：</div>
            <div>{{ taskInfo.warn }}</div>
          </div>
          <div class="each">
            <div>创建时间：</div>
            <div>{{ taskInfo.createTime }}</div>
          </div>
        </div>
      </div>
      <div class="titleSelf"><i class="el-icon-s-flag"></i> 评论记录</div>
      <div
        class="commentList"
        v-for="(common, commonindex) in commentList"
        :key="commonindex"
      >
        <i @click="delComment(common)" class="delIcon el-icon-close"></i>
        <h4 class="dynamicUserInfoDiv">
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
      <div class="commentDiv">
        <el-input placeholder="请输入内容" v-model="comments"> </el-input>
        <el-button
          plain
          icon="el-icon-date"
          size="small"
          @click.native="SendComment()"
          >评论</el-button
        >
      </div>
      <div class="titleSelf"><i class="el-icon-s-flag"></i> 任务动态</div>
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
                        ? $store.state.user.defaultAvatar
                        : items.avatar
                    "
                    alt=""
                  />
                </div>
                <span
                  >{{ items.userName }}&nbsp;&nbsp;&nbsp;{{
                    items.createTime
                  }}</span
                >
                <span>{{ items.dynamicTitle }}</span>
              </h4>
              <p>{{ items.dynamicContent }}</p>
              <!-- <p>客户来自：{{ taskInfo.name }}</p> -->
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </div>
    </div>
    <Task ref="Task" :id="editId" @reload="getInfo" />
    <CancelTask ref="CancelTask" :id="editId" @reload="getInfo" />
    <HandleTask
      ref="HandleTask"
      v-if="handleTaskOpen"
      @reload="getInfo"
      :schedule="taskInfo.schedule"
    />
    <NoFinish ref="NoFinish" v-if="NoFinishOpen" @reload="getInfo" />
  </div>
</template>

<script>
import { getdynamicList } from "@/api/saleslead/index";
import { detaildetail, getCommentByFkId, detailremove } from "@/api/task/index";
import { SendComment, deleCommentById } from "@/api/common/index";
import Task from "../../add/task.vue";
import CancelTask from "./canceltask.vue";
import HandleTask from "./handleTask.vue";
import NoFinish from "./nofinish.vue";
export default {
  components: {
    Task,
    CancelTask,
    HandleTask,
    NoFinish,
  },
  data() {
    return {
      taskInfo: {},
      editId: "",
      comments: "",
      handleTaskOpen: false, //处理任务弹窗
      NoFinishOpen: false, //未能完成弹窗
      commentList: [],
      dynamicList: [],
    };
  },
  mounted() {
    this.getInfo();
  },
  methods: {
    getdynamicList() {
      getdynamicList({ fkId: this.$route.query.id }).then((res) => {
        console.log(res);
        this.dynamicList = res.data.records;
      });
    },
    handleEdit() {
      this.editId = this.$route.query.id;
      this.$refs.Task.open = true;
    },
    SendComment() {
      let data = {};
      data.commentContent = this.comments;
      // data.userId = ob.userId;
      if (this.comments == "") {
        this.$message.error("请输入评论内容");
        return false;
      }
      data.fkId = this.$route.query.id;
      SendComment(data).then((res) => {
        this.comments = "";
        this.getCommentList();
      });
    },
    handleDel() {
      this.$confirm("是否确定删除对应的记录", "是否确定删除对应的记录", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          detailremove({ ids: [this.$route.query.id] }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$router.push({
              path: "/officeManagement/taskmanager",
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
    getInfo() {
      detaildetail({ id: this.$route.query.id }).then((res) => {
        this.taskInfo = res.data;
      });
      this.getCommentList();
      this.getdynamicList();
    },
    getCommentList() {
      getCommentByFkId({ fkId: this.$route.query.id }).then((res) => {
        this.commentList = res.data;
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
            this.getCommentList();
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
    handleCancel() {
      this.editId = this.$route.query.id;
      this.$refs.CancelTask.open = true;
    },
    handleNofinish() {
      this.NoFinishOpen = true;
      this.$nextTick(() => {
        this.$refs.NoFinish.open = true;
      });
    },
    handleTask() {
      this.handleTaskOpen = true;
      this.$nextTick(() => {
        this.$refs.HandleTask.open = true;
      });
    },
    handleAction() {},
  },
};
</script>

<style lang='scss' scoped>
.top_div {
  padding: 30px;
  display: flex;
  justify-content: space-between;
  .cricle {
    margin-left: 10px;
  }
  .title {
    font-size: 18px;
    font-weight: 600;
  }
  .status {
    font-size: 13px;
  }
}
.line {
  background: #f5f5f5;
  height: 30px;
}
.pd {
  padding: 10px 30px;
}
::v-deep .el-tabs__item {
  font-weight: 600;
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
.commentList {
  font-size: 14px;
  border: 1px solid #d7e8f4;
  width: 100%;
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
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
  background: red;
  margin-left: 20px;
}
.cricle {
  margin-right: 5px;
}
.color1 {
  background: #409eff;
}
.color2 {
  background: #67c23a;
}
.color3 {
  background: #f56c6c;
}
.color4 {
  background: #cccccc;
}
.color5 {
  background: #909399;
}
.color6 {
  background: skyblue;
}
</style>