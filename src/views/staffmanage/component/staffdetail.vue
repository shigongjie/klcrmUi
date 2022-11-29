/**企业详情 */
<template>
  <div>
    <div class="warp">
      <div class="userInfoDiv">
        <div>
          <img v-if="StaffData.avatar" :src="StaffData.avatar" alt="" />
          <img v-else src="@/assets/images/defaultAvatar.png" alt="" />
        </div>
        <div class="textDiv">
          <div>
            <p>{{ StaffData.name }}</p>
            <p>{{ StaffData.deptName }}</p>
          </div>

          <div>
            <span
              class="businessSpan"
              :class="StaffData.onlineStatus == '0' ? 'color1' : 'color2'"
            />
            {{ StaffData.onlineStatus == 0 ? "在线" : "离线" }}
          </div>
        </div>
      </div>
      <div class="btnWarp">
        <el-button size="medium" icon="el-icon-edit" @click="handleEdit">
          编辑资料
        </el-button>
        <el-button size="medium" icon="el-icon-delete" @click="handleDel">
          删除员工
        </el-button>
      </div>
    </div>
    <div class="pd">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsSelf">
        <el-tab-pane label="登录日志" name="1"><LoginLogs /></el-tab-pane>
        <el-tab-pane label="操作日志" name="2"><ActionLogs /></el-tab-pane>
        <el-tab-pane label="操作权限" name="3"
          ><ActionPermission v-if="activeName == 3"
        /></el-tab-pane>
        <el-tab-pane label="数据权限" name="4"
          ><DataPermission v-if="activeName == 4"
        /></el-tab-pane>
        <el-tab-pane label="字段权限" name="5"
          ><FieldPermission
            v-if="activeName == 5"
            :fileType="StaffData.fieldType"
        /></el-tab-pane>
        <!-- <el-tab-pane label="系统日志" name="firth"><SystemLogs /></el-tab-pane> -->
      </el-tabs>
    </div>
    <AddStaff
      v-if="open"
      ref="AddStaff"
      :action="1"
      :id="StaffData.id"
      @closeEdit="closeEdit"
    />
  </div>
</template>

<script>
import { getInfo, handleStaff } from "@/api/staff/index";
import AddStaff from "./addstaff.vue";
import ActionLogs from "../../logsmanage/actionlogs.vue";
import SystemLogs from "../../logsmanage/systemlogs.vue";
import LoginLogs from "../../logsmanage/loginlogs.vue";
import ActionPermission from "./actionpermission.vue";
import DataPermission from "./datapermission.vue";
import FieldPermission from "./fieldpermission.vue";
export default {
  components: {
    ActionLogs,
    SystemLogs,
    LoginLogs,
    AddStaff,
    ActionPermission,
    DataPermission,
    FieldPermission,
  },
  data() {
    return {
      open: false,
      activeName: "1",
      StaffData: {
        name: "",
      },
    };
  },
  mounted() {
    this.getdata();
  },
  methods: {
    handleDel() {
      this.$confirm("是否确定删除员工", "确定", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          let data = {};
          data.status = 7;
          data.ids = [this.$route.query.id];
          handleStaff(data).then((res) => {
            this.$message({
              type: "success",
              message: "操作成功！",
            });
            this.$router.push({
              path: "/staffmanage",
            });
          });
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消",
          });
        });
    },
    closeEdit() {},
    getdata() {
      let data = {};
      data.id = this.$route.query.id;
      getInfo(data).then((res) => {
        this.StaffData = res.data;
      });
    },
    handleClick() {},
    handleEdit() {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.AddStaff.open = true;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.warp {
  padding: 10px 30px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #ccc;
  .btnWarp {
    display: flex;
    align-items: center;
  }
}
.userInfoDiv {
  display: flex;
  align-items: center;
  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    margin-right: 30px;
  }
  .textDiv {
    display: flex;
    // flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    p {
      padding: 0;
      margin: 0;
    }
    p:nth-child(2) {
      margin-top: 15px;
      color: #999999;
      font-size: 13px;
    }
  }
}
.pd {
  padding: 10px 30px;
}
::v-deep {
  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
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
.color1 {
  background: #67c23a;
}
.color2 {
  background: #909399;
}
</style>