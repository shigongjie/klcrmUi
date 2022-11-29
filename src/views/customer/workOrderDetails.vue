<!--工单详情  -->
<template>
  <div class="app-container allPanel">
    <div class="topPanel">
      <div class="top_l">
        <el-tag type="success">创建</el-tag>
        <div class="title_img">
          <img
            :src="
              workDetail.createAvatar == '' || workDetail.createAvatar == null
                ? $store.state.user.avatar
                : workDetail.createAvatar
            "
          />
        </div>
        <div class="title_name">{{ workDetail.createId }}</div>
        <div class="title_time">{{ workDetail.createTime }}</div>
      </div>
      <div class="top_c">
        <div class="time_tip" v-if="workDetail.workStatus == '1'">
          已等待{{ workDetail.manageTime }}
        </div>
        <div class="time_tip" v-if="workDetail.workStatus == '2'">
          已耗时{{ workDetail.manageTime }}
        </div>
        <div class="time_tip" v-if="workDetail.workStatus == '3'">
          已耗时{{ workDetail.manageTime }}
        </div>

        <el-progress
          :percentage="perage"
          class="progress"
          :show-text="false"
          color="#4BCED0"
        ></el-progress>
      </div>
      <div class="top_l">
        <el-tag v-if="workDetail.workStatus == '1'" type="info">完结</el-tag>
        <el-tag v-else-if="workDetail.workStatus == '2'" type="success"
          >完结</el-tag
        >
        <el-tag v-else-if="workDetail.workStatus == '3'" type="danger"
          >退回</el-tag
        >
        <div class="title_img">
          <img
            :src="
              workDetail.operationStaffAvatar == '' ||
              workDetail.operationStaffAvatar == null
                ? $store.state.user.avatar
                : workDetail.operationStaffAvatar
            "
          />
        </div>
        <div class="title_name">{{ workDetail.operationStaff }}</div>
        <div class="title_time" v-if="workDetail.workStatus == '1'">处理中</div>
        <div class="title_time" v-else-if="workDetail.workStatus == '2'">
          已完结
        </div>
        <div class="title_time" v-else-if="workDetail.workStatus == '3'">
          已退回
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="content">
        <div class="c_title">
          <div class="title">
            <span :title="workDetail.workTitle">{{
              workDetail.workTitle
            }}</span>
          </div>
          <div class="w_type">
            <div v-if="workDetail.workStatus == '1'">
              <div class="light_stay"></div>
              处理中
            </div>
            <div v-else-if="workDetail.workStatus == '2'">
              <div class="light_over"></div>
              已完结
            </div>
            <div v-else-if="workDetail.workStatus == '3'">
              <div class="light_back"></div>
              已退回
            </div>
          </div>
        </div>
        <div class="btn_p">
          <div
            v-if="workDetail.workStatus == 1 && workDetail.disposeSelf == true"
          >
            <el-button
              type="primary"
              icon="el-icon-check"
              v-btnPermi="['workorder_end']"
              @click="overDia = true"
              >完结工单</el-button
            >
          </div>
          <div
            v-if="workDetail.workStatus == 1 && workDetail.disposeSelf == true"
          >
            <el-button
              icon="el-icon-refresh"
              v-btnPermi="['workorder_change_others']"
              @click="changeStaff"
              >转他人处理</el-button
            >
          </div>
          <!--  -->
          <div
            v-if="workDetail.workStatus == 1 && workDetail.disposeSelf == true"
          >
            <el-button
              v-btnPermi="['workorder_send_back']"
              icon="el-icon-close"
              @click="reOrder"
              >退回工单</el-button
            >
          </div>

          <div v-if="workDetail.workStatus == 3 && workDetail.createSelf">
            <el-button
              v-btnPermi="['workorder_update']"
              icon="el-icon-refresh-left"
              @click="editWork"
              >编辑工单</el-button
            >
          </div>
          <!-- 发起人查看待处理工单可以看到  -->
          <div
            v-if="workDetail.workStatus == 1 && workDetail.createSelf == true"
          >
            <el-button
              v-btnPermi="['workorder_revocation']"
              icon="el-icon-refresh-left"
              @click="reBackOrder"
              >撤销工单</el-button
            >
          </div>
          <div
            v-if="
              (workDetail.workStatus == 2 || workDetail.workStatus == 3) &&
              workDetail.createSelf
            "
          >
            <el-button
              v-btnPermi="['workorder_delete']"
              icon="el-icon-delete"
              @click="delOrder"
              >删除工单</el-button
            >
          </div>
          <!-- <el-button icon="el-icon-printer">打印工单</el-button> -->
        </div>
      </div>
      <div class="w_mes">
        <div class="w_title">
          <i class="el-icon-s-order"></i>
          <span>基本信息</span>
        </div>
        <div class="w_farm">
          <el-descriptions :column="2" size="medium" border>
            <el-descriptions-item
              label="工单编号"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.workId }}
            </el-descriptions-item>
            <el-descriptions-item
              label="紧急程度"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              <div v-if="workDetail.urgencyIndex == '1'">一般</div>
              <div v-else-if="workDetail.urgencyIndex == '2'">非常紧急</div>
              <div v-else-if="workDetail.urgencyIndex == '3'">紧急</div>
            </el-descriptions-item>
            <el-descriptions-item
              label="关联客户"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.connectId }}
            </el-descriptions-item>
            <el-descriptions-item
              label="联系人"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.contactName }}
            </el-descriptions-item>
            <el-descriptions-item
              label="发起人员"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.createId }}
            </el-descriptions-item>
            <el-descriptions-item
              label="发起部门"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.createDept }}
            </el-descriptions-item>
            <el-descriptions-item
              label="处理人员"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.operationStaff }}
            </el-descriptions-item>
            <el-descriptions-item
              label="处理部门"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.operationStaffDept }}
            </el-descriptions-item>
            <el-descriptions-item
              label="当前状态"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              <div v-if="workDetail.workStatus == '1'">
                处理中(已等待{{ workDetail.manageTime }})
              </div>
              <div v-else-if="workDetail.workStatus == '2'">
                已完结(共耗时{{ workDetail.manageTime }})
              </div>
              <div v-else-if="workDetail.workStatus == '3'">
                已退回(共耗时{{ workDetail.manageTime }})
              </div>
            </el-descriptions-item>
            <el-descriptions-item
              label="提交时间"
              :labelStyle="{
                'text-align': 'right',
                width: '100px',
                'font-weight': '600',
                color: '#666',
                'background-color': '#F5F5F5',
                padding: '12px',
              }"
            >
              {{ workDetail.createTime }}
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div class="w_title">
          <i class="el-icon-s-order"></i>
          <span>工单详情</span>
        </div>
        <div class="w_content">
          <div>{{ workDetail.workDetails }}</div>
        </div>
        <div class="w_title">
          <i class="el-icon-s-order"></i>
          <span>查看记录</span>
        </div>
        <div class="c_list">
          <div class="l_content">
            <div
              class="p_list"
              v-for="(item, index) in cheakList.slice(0, 10)"
              :key="index"
            >
              <!-- <div class="title_img"><i class="el-icon-user-solid"></i></div> -->
              <div class="title_img">
                <img
                  :src="
                    item.image == '' || item.image == null
                      ? $store.state.user.avatar
                      : item.image
                  "
                />
              </div>
              <div class="title_name">{{ item.staffName }}</div>
            </div>
          </div>

          <div class="list_more" @click="cheakDetail = true">
            <i class="el-icon-d-arrow-right"></i>
            <div>更多</div>
          </div>
        </div>
        <div class="w_title">
          <i class="el-icon-s-order"></i>
          <span> 评论记录</span>
        </div>
        <!-- 评论列表 -->
        <div class="comment_l">
          <div
            class="comment_box"
            v-for="(item, index) in commentArr"
            :key="index"
          >
            <div class="comment_title">
              <div class="comment_img">
                <img
                  :src="
                    item.avatar == '' || item.avatar == null
                      ? $store.state.user.avatar
                      : item.avatar
                  "
                />
              </div>
              <div class="comment_name">{{ item.createBy }}</div>
              <div class="comment_time">{{ item.createTime }}</div>
            </div>
            <div class="comment_content">
              {{ item.commentContent }}
            </div>
            <div class="comment_del">
              <el-button
                type="text"
                icon="el-icon-close"
                @click="delCommon(item.id)"
              ></el-button>
            </div>
          </div>
          <div class="comment_in">
            <div class="comment_text">
              <el-input
                v-model="comment_text"
                placeholder="请输入评论内容"
              ></el-input>
              <el-button
                v-btnPermi="['rm_add_comments']"
                type="primary"
                @click="addCommon"
                >评论</el-button
              >
            </div>
          </div>
        </div>
        <div class="w_title">
          <i class="el-icon-s-order"></i>
          <span>工单动态</span>
        </div>
        <div class="dynamic_l">
          <el-timeline>
            <el-timeline-item
              class="dynamic_card"
              v-for="(item, index) in activities"
              :key="index"
              :icon="actSet.icon"
              :type="actSet.type"
              :color="actSet.color"
              :size="actSet.size"
            >
              <el-card class="dynamic_content" shadow="hover">
                <div class="dynamic_title">
                  <div class="dynamic_img">
                    <img
                      :src="
                        item.avatar == '' || item.avatar == null
                          ? $store.state.user.avatar
                          : item.avatar
                      "
                      alt=""
                    />
                  </div>
                  <div class="dynamic_name">{{ item.userName }}</div>
                </div>
                <div class="dynamic_content">{{ item.dynamicContent }}</div>
                <div class="dynamic_from">
                  <span>来自工单：</span>
                  <el-button type="text">{{ workDetail.workTitle }}</el-button>
                </div>
                <div class="dynamic_time">
                  <i class="el-icon-alarm-clock"></i>
                  {{ item.createTime }}
                </div>
              </el-card>
            </el-timeline-item>
          </el-timeline>
        </div>
      </div>
    </div>
    <el-dialog width="40%" :visible.sync="changeOpen" :before-close="diaClose">
      <div solt="title">
        <div class="title_font" v-if="reType == '1'"><b>转他人处理</b></div>
        <div class="title_font" v-else><b>退回工单</b></div>
      </div>
      <div class="dia_content">
        <el-form
          ref="form"
          :rules="rules"
          :model="form_dia"
          label-width="150px"
        >
          <el-form-item
            :label="reType == '1' ? '选择人员' : '退回到人员'"
            prop="operationStaff"
          >
            <el-cascader
              :disabled="disabled"
              style="width: 100%"
              v-model="form_dia.operationStaff"
              :options="userList"
              :show-all-levels="false"
              :props="areaListprops"
              clearable
            ></el-cascader>
          </el-form-item>
          <el-form-item
            :label="reType == 1 ? '转交原因' : '退回原因'"
            prop="workDetails"
          >
            <el-input
              type="textarea"
              v-model="form_dia.workDetails"
              placeholder="请输入转交内容"
              show-word-limit
              maxlength="300"
              resize="none"
              :autosize="{ minRows: 6, maxRows: 6 }"
            ></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="changeOpen = false">取 消</el-button>
        <el-button type="primary" v-if="reType == '1'" @click="changeOrder"
          >确定</el-button
        >

        <el-button type="primary" v-else @click="reBackWorkOrder"
          >确定</el-button
        >
      </div>
    </el-dialog>
    <el-dialog :visible.sync="overDia" width="40%">
      <div solt="title">
        <div class="title_font"><b>完结工单</b></div>
      </div>
      <div class="dia_content">
        <el-form ref="overDia_from" :model="overDia_from" label-width="150px">
          <el-form-item label="备注信息:">
            <el-input
              type="textarea"
              v-model="overDia_from.content"
              placeholder="请输入备注信息"
              show-word-limit
              maxlength="300"
              resize="none"
              :autosize="{ minRows: 6, maxRows: 6 }"
            ></el-input>
          </el-form-item>
          <el-form-item label="上传图片:">
            <el-upload
              class="avatar-uploader"
              :action="uploadFileUrl"
              accept="image/png, image/jpeg, image/gif"
              :file-list="fileList"
              :on-success="handleUploadSuccess"
              :on-remove="handleRemove"
              :headers="headers"
              list-type="picture-card"
              :before-upload="beforeAvatarUpload"
              :limit="9"
              :on-exceed="handleExceed"
              ref="imgUpload"
            >
              <!-- <img v-if="imageUrl" :src="imageUrl" class="avatar" /> -->
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="overDia = false">取 消</el-button>
        <el-button type="primary" @click="overWorkOrder">确 定</el-button>
      </span>
    </el-dialog>
    <el-dialog :visible.sync="cheakDetail" width="40%">
      <div solt="title">
        <div class="title_font"><b>查看记录</b></div>
      </div>
      <div class="dia_content">
        <el-table :data="cheakList" stripe border style="width: 100%">
          <el-table-column prop="staffName" label="查看人员" width="180">
          </el-table-column>
          <el-table-column prop="visitTime" label="查看时间" width="180">
          </el-table-column>
          <el-table-column prop="visitCount" label="查看次数">
          </el-table-column>
          <el-table-column prop="deptName" label="所属部门"> </el-table-column>
        </el-table>
        <div class="page_pan">
          <el-pagination
            background
            @current-change="currentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout=" prev, pager, next"
            :total="listTotal"
          >
          </el-pagination>
        </div>
      </div>
    </el-dialog>
    <newWorkOrder ref="workOrder" @addOver="overClose"></newWorkOrder>
  </div>
</template>

<script>
import {
  getWorkDetail,
  getWorkLook,
  getWorkComment,
  changeTaskOrder,
  removeWorkOrder,
  getDynamic,
  workSendBack,
  getWorkDetailById,
} from "@/api/workOrder/index";
import { SendComment, deleCommentById } from "@/api/common/index";
import newWorkOrder from "../add/newWorkOrder.vue";
import { getstaffList } from "@/api/customer/index";
import { getInfo } from "@/api/login";
import { getToken } from "@/utils/auth";
export default {
  components: { newWorkOrder },
  data() {
    return {
      disabled: false,
      workDetail: {}, //工单详情信息
      w_id: "", //工单详情编号
      u_id: "", //用户id
      comment_text: "", //评论内容
      commentArr: [], //评论列表
      userList: [], //处理人列表
      cheakList: [], //查看记录列表
      activities: [], //工单动态
      imageUrlList: [], //上传图片列表
      imgUid: [], //上传文件uid
      editMsg: {}, //工单编辑信息
      fileList: [], //上传文件列
      overDia_from: {}, //完结工单表单
      perage: 0, //进度显示
      reType: "0", //退回工单 0,转他人 1
      changeOpen: false, //转换他人开关
      overDia: false, //完结工单弹窗开关
      cheakDetail: false, //查看记录弹窗
      actSet: {
        //动态显示样式
        size: "large",
        type: "primary",
        icon: "el-icon-s-help",
        color: "#0079FE",
      },
      form_dia: {
        //切换处理人表单
        operationStaff: "",
        workDetails: "",
      },
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      rules: {
        workDetails: [
          { required: true, message: "请输入转交原因", trigger: "change" },
        ],
        operationStaff: [
          { required: true, message: "请选择处理人员", trigger: "change" },
        ],
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload", // 上传的图片服务器地址
      headers: {
        Authorization: getToken(),
      },
      listTotal: 0, //查看记录--总条数
      pageSize: 10, //查看记录--显示条数
      currentPage: 1, //当前页
    };
  },
  beforeMount() {
    this.w_id = this.$route.query.id;
    this.getUser(); //获取用户id
    this.getWorkMessage(); //获取工单详情
    this.getDynamic(); //获取工单动态
    this.getWorkSee(); //获取工单查看记录
    this.getWorkComment(); //获取工单评论
    this.openChangeOrder(); //获取处理人列表
    this.getWorkedit(); //获取工单编辑回显
  },

  methods: {
    //获取工单详情
    getWorkMessage() {
      const datas = {
        workId: this.w_id,
      };
      getWorkDetail(datas).then((res) => {
        this.workDetail = res.data;
        if (this.workDetail.workStatus == 1) {
          this.perage = 50;
        } else if (this.workDetail.workStatus == 2) {
          this.perage = 100;
        } else {
          this.perage = 0;
        }
      });
    },
    // 获取工单编辑信息
    getWorkedit() {
      const data = {
        workId: this.w_id,
      };
      getWorkDetailById(data).then((res) => {
        this.editMsg = res.data;
      });
    },
    //获取用户id
    getUser() {
      getInfo().then((res) => {
        this.u_id = res.user.id;
      });
    },
    //获取访问名单
    getWorkSee() {
      const datas = {
        workId: this.w_id,
      };
      getWorkLook(datas).then((res) => {
        this.cheakList = res.data;
      });
    },
    //获取工单留言
    getWorkComment() {
      const datas = {
        fkId: this.w_id,
      };
      getWorkComment(datas).then((res) => {
        this.commentArr = res.data;
      });
    },
    //获取工单动态
    getDynamic() {
      const datas = {
        fkId: this.w_id,
      };
      getDynamic(datas).then((res) => {
        this.activities = res.data;
      });
    },
    //添加工单评论
    addCommon() {
      if (this.comment_text == null || this.comment_text == "") {
        return;
      }
      const datas = {
        fkId: this.w_id,
        commentContent: this.comment_text,
      };
      SendComment(datas).then((res) => {
        this.getWorkComment();
        this.comment_text = "";
      });
    },
    //删除工单评论
    delCommon(id) {
      this.$confirm("此操作将删除该评论, 是否继续?", "删除评论", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          const datas = {
            id: id,
          };

          deleCommentById(datas).then((res) => {
            this.getWorkComment();
            this.$notify.success({
              title: "删除成功",
              message: "评论删除成功",
              position: "bottom-right",
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
    //删除工单
    delWorkOrder(msg) {
      this.$confirm("此操作将" + msg + "删除该工单, 是否继续?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let datas = {
            ids: [this.w_id],
          };
          removeWorkOrder(datas).then((res) => {
            this.$notify.success({
              title: "工单" + msg + "成功",
              message: "工单" + msg + "成功",
              position: "bottom-right",
            });
            this.$store.dispatch("tagsView/delView", this.$route);
            this.$router.push("/workorderlist");
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消工单" + msg,
          });
        });
    },
    // 撤销,退回,完成
    sendBackOrder(id, msg) {
      if (id != 2 && id != 0) {
        if (
          this.form_dia.workDetails == "" ||
          this.form_dia.workDetails == null ||
          this.form_dia.workDetails == undefined
        ) {
          this.$message.error("请填写原因");
          return;
        }
      }

      this.$confirm("此操作将" + msg + "该工单, 是否继续?", "确认提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let datas;
          let res;
          if (id == 0) {
            datas = {
              workId: this.w_id,
              status: id,
            };
            res = this.workDetail.createId + "将工单撤回";
          } else if (id == 2) {
            datas = {
              workId: this.w_id,
              status: id,
              remark: this.overDia_from.content,
              images: this.imageUrlList,
            };
            if (this.overDia_from.content == "") {
              this.overDia_from.content = "无";
            }
            res =
              "完结工单,共耗时:" +
              this.workDetail.manageTime +
              ". 备注原因: " +
              this.overDia_from.content;
          } else {
            datas = {
              workId: this.w_id,
              status: id,
              remark: this.form_dia.workDetails,
            };
            res =
              this.workDetail.operationStaff +
              "将工单退回给发起人:" +
              this.workDetail.createId +
              " 备注原因: " +
              this.form_dia.workDetails;
          }
          workSendBack(datas).then((res) => {
            this.$notify.success({
              title: "工单" + msg + "成功",
              message: "工单" + msg + "成功",
              position: "bottom-right",
            });
            this.getWorkMessage(); //获取工单详情
            // this.getDynamic();//获取工单动态
            // this.$router.push('/workorderlist')
            if (this.overDia) {
              this.overDia = false;
            } else if (this.changeOpen) {
              this.changeOpen = false;
            }
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消工单" + msg,
          });
        });
    },
    //编辑工单
    editWork() {
      this.$refs.workOrder.open = true;
      this.$refs.workOrder.getdatas(this.editMsg);
    },
    //工单编辑完毕
    overClose() {
      this.getWorkMessage(); //获取工单详情
      this.getWorkedit(); //获取工单编辑回显
    },

    //打开更换处理人弹窗
    openChangeOrder() {
      getstaffList().then((res) => {
        this.userList = res.data;
      });
    },
    //弹窗关闭后触发
    diaClose() {
      this.changeOpen = false;
      this.$emit("diaClose", false);
    },
    //确认更换
    changeOrder() {
      this.$refs.form.validate((res) => {
        //验证成功
        if (res) {
          let li = [this.w_id];
          let datas = {
            ids: li,
            remark: this.form_dia.workDetails,
            staffId: this.form_dia.operationStaff,
          };
          let n = this.getOffName(this.form_dia.operationStaff);
          let msg =
            "工单转交给 " + n + " 处理 转交原因:" + this.form_dia.workDetails;
          changeTaskOrder(datas).then((res) => {
            this.$refs.form.resetFields();
            this.diaClose();
            this.getWorkMessage(); //获取工单详情
            // this.getDynamic();//获取工单动态
            this.$emit("addOver", false);
            this.$notify.success({
              title: "切换成功",
              message: "切换成功",
              position: "bottom-right",
            });
            // this.$router.go(0);
          });
        }
      });
    },
    //获取处理人名称
    getOffName(id) {
      let offNa = "";
      for (let k = 0; k < this.userList.length; k++) {
        if (this.userList[k].list.length != 0) {
          for (let i = 0; i < this.userList[k].list.length; i++) {
            if (this.userList[k].list[i].id == id) {
              offNa = this.userList[k].list[i].name;
              break;
            }
          }
        }
      }
      return offNa;
    },
    //撤销工单操作
    reBackOrder() {
      this.sendBackOrder(0, "撤销");
    },
    //退回工单操作
    reBackWorkOrder() {
      this.sendBackOrder(1, "退回");
    },
    //删除工单操作
    delOrder() {
      const msg = "删除";
      this.delWorkOrder(msg);
    },
    //退回工单类型
    reOrder() {
      this.reType = "0";
      // 退回人员不可选择
      console.log(this.editMsg);
      this.form_dia.operationStaff = this.editMsg.createId;
      this.disabled = true;
      this.changeOpen = true;
    },
    //转他人类型
    changeStaff() {
      this.reType = "1";
      this.disabled = false;
      this.changeOpen = true;
    },
    //上传前准备
    beforeAvatarUpload(file) {
      const isJPG = file.type === "image/jpeg" || "image/png" || "image/gif";
      if (!isJPG) {
        this.$message.error("上传头像图片只能是 .jpg .png .gif格式!");
      } else {
        this.imgUid.push(file.uid);
      }
      return isJPG;
    },
    //上传完成后
    handleUploadSuccess(data) {
      this.imageUrlList.push(data.data);
    },
    //超出数量
    handleExceed() {
      this.$message.error("你最多能发布9张照片");
    },
    //选好的图片删除
    handleRemove(file, fileList) {
      let i = this.imgUid.findIndex((item) => {
        return item == file.uid;
      });
      if (i != -1) {
        this.imageUrlList.splice(i, 1);
        this.imgUid.splice(i, 1);
      }
    },
    //确定完成工单
    overWorkOrder() {
      this.sendBackOrder(2, "完结");
    },
    //页码切换
    currentChange(val) {
      this.currentPage = val;
      this.getWorkSee();
    },
  },
};
</script>
<style lang='scss' scoped>
.allPanel {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5;
}
.topPanel {
  width: 80%;
  height: 150px;
  margin: 10px auto;
  background-color: white;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  .top_l {
    width: 15%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: space-around;
    .title_img {
      width: 50px;
      height: 50px;
      > img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
      }
    }

    .title_name {
      font-size: 13px;
      color: #666;
    }
    .title_time {
      font-size: 12px;
      color: #999999;
    }
  }
  .top_c {
    width: 75%;
    height: 100%;
    display: flex;
    flex-direction: column;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: center;
    .progress {
      width: 100%;
      margin: 10px -10px 0px -10px;
    }
    .time_tip {
      font-size: 13px;
      color: #999999;
    }
  }
}
.panel {
  width: 80%;
  margin: 20px auto;
  padding-bottom: 20px;
  background-color: white;
}
.content {
  width: 100%;
  margin: 20px auto;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #cccccc;
  .c_title {
    padding: 20px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;

    .title {
      font-size: 18px;
      font-weight: bold;
      max-width: 300px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      -o-text-overflow: ellipsis;
    }
    .w_type {
      margin-left: 50px;
      > div {
        font-size: 13px;
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
      }

      .light_over {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #4bd863;
        margin: auto 3px;
      }
      .light_stay {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #0079fe;
        margin: auto 3px;
      }
      .light_back {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: #ff3b31;
        margin: auto 3px;
      }
    }
  }
  .btn_p {
    max-width: 70%;
    overflow: auto;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-end;
    padding-right: 5px;
    > div {
      margin: 0 5px;
    }
  }
}
.w_mes {
  width: 100%;
  padding: 0px 20px;
  .w_title {
    font-size: 14px;
    font-weight: 600;
    margin: 15px 0;
  }
  .w_content {
    width: 100%;
    padding: 20px;
    font-size: 14px;
    color: #333;
    border: 1px solid #bdbdbda6;
    background-color: #fcfcfc;
  }
  .c_list {
    width: 100%;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: flex-start;

    .l_content {
      max-width: 90%;
      overflow: hidden;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
    }
    .p_list {
      width: 10%;
      min-width: 60px;
      height: 60px;
      margin: 0 10px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
      .title_img {
        width: 60%;
        min-width: 40px;
        height: 40px;
        // border-radius: 50%;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .title_name {
        font-size: 12px;
        color: #666666;
      }
    }
    .list_more {
      width: 60px;
      height: 60px;
      display: flex;
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-end;
      color: #0079fe;
      font-size: 12px;
      i {
        font-size: 20px;
        margin-bottom: 7px;
      }
    }
  }
}
.comment_l {
  width: 100%;
  .comment_box {
    padding: 20px;
    background-color: #fcfcfc;
    position: relative;
    margin-bottom: 20px;
    border: 1px solid #e9e9e9;
    .comment_title {
      margin-bottom: 5px;
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
      .comment_img {
        width: 40px;
        height: 40px;
        font-size: 20px;
        margin-right: 5px;
        > img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
        }
      }
      .comment_name {
        margin-right: 5px;
        font-size: 14px;
      }
      .comment_time {
        font-size: 12px;
        color: #99a5c3;
        padding: 3px;
      }
    }
    .comment_content {
      font-size: 14px;
      color: #666666;
    }
    .comment_del {
      position: absolute;
      right: 0;
      top: 0;
      width: 30px;
      height: 30px;
      > el-button {
        width: 100%;
        height: 100%;
      }
    }
  }
  .comment_in {
    width: 100%;
    margin-top: 20px;
    .comment_text {
      display: flex;
      flex-direction: row;
      flex-wrap: nowrap;
      align-items: center;
      justify-content: flex-start;
    }
  }
}
.dynamic_l {
  .dynamic_card {
    width: 100%;
    .dynamic_content {
      position: relative;
      background-color: #f7fbfe;
      .dynamic_time {
        position: absolute;
        right: 10px;
        top: 10px;
        color: #9999b3;
      }
      .dynamic_title {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        align-items: center;
        justify-content: flex-start;
        .dynamic_img {
          width: 40px;
          height: 40px;
          margin-right: 6px;
          > img {
            width: 100%;
            height: 100%;
            border-radius: 50%;
          }
        }
      }
      .dynamic_content {
        color: #c0a5a6;
        padding: 10px;
      }
      .dynamic_from {
        font-size: 12px;
        ::v-deep .el-button--medium {
          font-size: 12px;
          color: #333333;
          :hover {
            color: #0079fe;
          }
        }
      }
    }
  }
  ::v-deep .el-timeline {
    padding-left: 0;
  }
}
.title_font {
  width: 100%;
  height: 40px;
  margin-top: -5px;
  padding-left: 20px;
  font-size: 16px;
  background-color: #f2f2f2;
}
::v-deep .el-dialog {
  min-width: 300px;
  position: absolute;
  top: 45%;
  left: 50%;
  transform: translate(-50%, -60%) !important;
}
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
  padding-bottom: 0;
}
::v-deep .el-dialog__body {
  padding: 0;
}
.dia_content {
  padding: 20px;
  max-height: 380px;
  overflow: auto;
}
::v-deep .el-input__count {
  margin-bottom: -42px;
}
//文件上传链接
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 100px;
  height: 100px;
  line-height: 100px;
  text-align: center;
}
.avatar {
  width: 100px;
  height: 100px;
  display: block;
}
.page_pan {
  margin-top: 20px;
  width: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  align-items: center;
  justify-content: flex-end;
}
</style>
