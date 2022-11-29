<template>
  <div class="app-container">
    <div>
      <el-row
        style="height: 110px; border: 1px solid #f6f6f6"
        type="flex"
        justify="space-between"
        align="middle"
      >
        <el-col>
          <div style="margin-left: 20px; line-height: 2">
            <span class="parSp"
              >{{ particularsObj.headline }}（{{
                particularsObj.founderId
              }}）</span
            >
            <span class="businessSpan" style="background-color: #4bd863" /><span
              style="font-size: 12px; color: #666666"
            >
              {{ particularsObj.auditStatus }}</span
            >
            <div>
              <span class="headlineSp">批阅人员：</span
              ><span class="contentSp"> {{ particularsObj.readId }} </span
              ><span class="headlineSp" style="margin-left: 20px">
                抄送人员：</span
              >
              <span class="contentSp"> {{ particularsObj.copyId }}</span>
            </div>
          </div>
        </el-col>
        <el-button
          v-if="particularsObj.isAlter == 1"
          icon="el-icon-edit"
          type="primary"
          plain
          @click="editTheReport(particularsObj)"
          >编辑报告</el-button
        >
        <el-button
          v-if="particularsObj.isAlter == 1"
          v-btnPermi="['ws_delete_report']"
          style="margin-right: 3%"
          icon="el-icon-delete-solid"
          type="primary"
          plain
          @click="detailRremove"
          >删除报告</el-button
        >
      </el-row>
    </div>
    <div style="margin-top: 30px">
      <div style="padding: 25px 0 37px 0">
        <div style="font-weight: 600; font-size: 15px">
          <i style="backgrount-color: black" class="el-icon-collection-tag" />
          数据统计
        </div>
        .

        <div class="particularsDiv">
          <div
            class="pBtn"
            v-for="(item, key, index) in workReportList"
            :key="index"
          >
            <div class="pitem">{{ key }}{{ item }}</div>
          </div>
          <!-- <div class="pBtn">
            <div class="pitem"> 新增线索 10</div>
          </div>
          <div class="pBtn">
            <div class="pitem"> 新增联系人 10</div>
          </div>
          <div class="pBtn">
            <div class="pitem"> 完成任务 10</div>
          </div>
          <div class="pBtn">
            <div class="pitem"> 更进次数 10</div>
          </div>
          <div class="pBtn">
            <div class="pitem"> 处理工单 10</div>
          </div> -->
        </div>
      </div>
      <div>
        <div>
          <div style="font-weight: 600; font-size: 15px">
            <i style="backgrount-color: black" class="el-icon-collection-tag" />
            工作总结
          </div>
          <div class="twoDiv">
            {{ particularsObj.summarize }}
          </div>
        </div>
      </div>
      <div>
        <div v-if="particularsObj.reportType !== '0'">
          <div style="font-weight: 600; font-size: 15px">
            <i style="backgrount-color: black" class="el-icon-collection-tag" />
            工作计划
          </div>
          <div class="twoDiv">
            {{ particularsObj.workPlan }}
          </div>
        </div>
      </div>
      <div>
        <div>
          <div style="font-weight: 600; font-size: 15px">
            <i style="backgrount-color: black" class="el-icon-collection-tag" />
            相关图片
          </div>
          <div class="mlrtb">
            <el-image
              v-for="(iobj, index) in particularsObj.image"
              :key="index"
              style="width: 100px; height: 100px; margin-right: 10px"
              :src="iobj"
              :preview-src-list="srcList"
            >
            </el-image>
          </div>
        </div>
      </div>
      <div v-if="particularsObj.examinesState == 1">
        <div>
          <div style="font-weight: 600; font-size: 15px">
            <i style="backgrount-color: black" class="el-icon-collection-tag" />
            批阅记录
          </div>
          <div v-for="obj in commentArr" :key="obj.id">
            <div
              class="mlrtb inlineDiv"
              style="min-height: 90px; border: 1px solid #e4e4e4"
            >
              <div>
                <i
                  v-if="obj.avatar === null"
                  style="margin-top: 3px"
                  class="el-icon-user-solid"
                />
                <el-avatar
                  v-else
                  :size="30"
                  style="margin-right: 5px; vertical-align: middle"
                  :src="obj.avatar"
                ></el-avatar>
                <span style="font-size: 15px; color: #666666">{{
                  obj.createBy
                }}</span>
                <span style="font-size: 12px; color: #999999">{{
                  obj.createTime
                }}</span>
              </div>
              <div
                style="
                  color: #999999;
                  font-size: 14px;
                  padding-right: 2%;
                  margin-top: 5px;
                "
              >
                {{ obj.commentContent }}
              </div>
              <div class="delDiv">
                <!-- <el-button icon="el-icon-close" circle></el-button> -->
                <div @click="deleCommentById(obj)">
                  <i class="el-icon-close"></i>
                </div>
              </div>
            </div>
          </div>
          <div class="mlrtb">
            <el-input placeholder="请输入批阅内容" v-model="inputVal">
              <template slot="append">
                <el-button type="primary" class="issueBtn" @click="addComment"
                  >发布</el-button
                >
              </template>
            </el-input>
          </div>
        </div>
      </div>
    </div>
    <report
      :reportVisible="reportVisible"
      :reportObj="reportObj"
      :typeId="typeId"
    ></report>
  </div>
</template>

<script>
import { getCommentByFkId } from "@/api/task";
import { deleCommentById } from "@/api/common";
import {
  particularsData,
  addComment,
  workreportAlter,
  detailRremove,
} from "@/api/officeManagement";
import { getIntradayWork } from "@/api/customer/index";
import Report from "../WorkStatement/comportRecords/report.vue";
export default {
  components: {
    Report,
  },
  data() {
    return {
      commentArr: [],
      typeId: 0,
      reportObj: {},
      reportVisible: false,
      particularsID: "",
      particularsObj: {
        image: [],
      },
      inputVal: "",
      srcList: [],
      workReportList: [],
    };
  },
  created() {
    this.particularsID = this.$route.query.id;
    this.getParticularsData();
    //this.getIntradayWork();
  },

  methods: {
    getIntradayWork() {
      console.log("startTime:", this.particularsObj.startTime);
      return;
      getIntradayWork({
        startTime: this.particularsObj.startTime,
        endTime: this.particularsObj.endTime,
      }).then((Res) => {
        this.workReportList = Res.data;
      });
    },
    async getParticularsData() {
      if (this.particularsID) {
        const result = await particularsData({ id: this.particularsID });
        const { data } = await getCommentByFkId({ fkId: this.particularsID });
        data.sort((n1, n2) => {
          n1.createTime.replace(/-/g, "/");
        });
        this.commentArr = data;
        this.particularsObj = result.data;
        if (result.data.image !== "") {
          this.particularsObj.image = result.data.image.split(",");
        }
      } else {
        this.$router.push({ path: "/officeManagement/WorkStatement" });
      }
      getIntradayWork({
        startTime: this.particularsObj.startTime,
        endTime: this.particularsObj.endTime,
      }).then((Res) => {
        this.workReportList = Res.data;
      });
    },
    async addComment() {
      const result = await addComment({
        commentContent: this.inputVal,
        fkId: this.particularsObj.id,
      });
      this.inputVal = "";
      this.getParticularsData();
    },
    async deleCommentById(obj) {
      const result = await deleCommentById({ id: obj.id });
      this.getParticularsData();
    },
    editTheReport(obj) {
      this.reportObj = obj;
      this.typeId = 2;
      this.reportVisible = true;
    },
    async detailRremove() {
      const result = await detailRremove({ ids: [this.particularsObj.id] });
      if (result.code === 0) {
        this.$router.push({ path: "/officeManagement/WorkStatement" });
      }
    },
  },
};
</script>

<style lang='scss' scoped>
.businessSpan {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 100%;
}
.contentSp {
  font-size: 14px;
}
.headlineSp {
  font-size: 12px;
  color: #666666;
}
.parSp {
  display: inline-block;
  font-weight: 600;
  font-size: 20px;
}

.twoDiv {
  padding: 20px 36px;
  border: 1px solid #e4e4e4e4;
  margin: 25px;
  background-color: #fcfcfc;
  line-height: 2;
}
.mlrtb {
  margin: 25px 0 25px 20px;
}
.issueBtn {
  width: 120px;
  font-weight: 600;
  color: #ffffff !important;
  background: #3394fe !important;
}
.inlineDiv {
  position: relative;
  display: flex;
  flex-flow: column;
  justify-content: center;
  padding-left: 25px;
  line-height: 2;
  .delDiv {
    position: absolute;
    top: 10px;
    right: 20px;
    font-size: 20px;
  }
}
.delDiv:hover {
  color: red;
}
::v-deep .el-icon-user-solid {
  font-size: 25px;
  color: #cccccc;
}
.particularsDiv {
  margin-top: 15px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin: 0 5%;
  .pBtn {
    position: relative;
    width: 200px;
    height: 40px;
    border-radius: 25px;
    border: 1px solid #999999;
    margin-bottom: 10px;
    .pitem {
      position: absolute;
      transform: translate(-50%, -50%);
      left: 50%;
      top: 50%;
      font-size: 15px;
      color: #999999;
    }
  }
}
</style>
