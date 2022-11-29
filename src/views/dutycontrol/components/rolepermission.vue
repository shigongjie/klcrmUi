/**设置职务权限 */
<template>
  <div>
    <div class="warp">
      <div class="userInfoDiv">
        <div><img src="@/assets/images/usericon.png" alt="" /></div>
        <div class="textDiv">
          <p>{{ roleData.name }}</p>
          <p>
            {{
              roleData.description == "" ? "暂无相关描述" : roleData.description
            }}
          </p>
        </div>
      </div>
      <div class="btnWarp">
        <el-button
          size="medium"
          icon="el-icon-plus"
          @click.native.prevent="addPerson()"
        >
          添加人员
        </el-button>
        <el-button
          size="medium"
          icon="el-icon-edit"
          @click.native.prevent="editRole()"
        >
          编辑职务
        </el-button>
        <el-button
          v-if="roleData.status == 0"
          size="medium"
          icon="el-icon-remove"
          @click.native.prevent="updateRoleStatus()"
        >
          停用职务
        </el-button>
        <el-button v-else @click.native.prevent="updateRoleStatus()">
          启用职务
        </el-button>
        <el-button size="medium" icon="el-icon-document-copy" @click="copyduty">
          复制职务
        </el-button>
        <el-button
          size="medium"
          icon="el-icon-delete"
          @click.native.prevent="confirmDel()"
        >
          删除职务
        </el-button>
      </div>
    </div>
    <div class="pd">
      <el-tabs v-model="activeName" @tab-click="handleClick" class="tabsSelf">
        <el-tab-pane label="操作权限" name="1"
          ><RoleMenu v-if="activeName == 1"
        /></el-tab-pane>
        <el-tab-pane label="数据权限" name="2"
          ><DataMenu v-if="activeName == 2"
        /></el-tab-pane>
        <el-tab-pane label="字段权限" name="3"
          ><FieldPermission v-if="activeName == 3" :type="roleData.fieldType"
        /></el-tab-pane>
        <el-tab-pane label="成员列表" name="4"
          ><PersonList v-if="activeName == 4"
        /></el-tab-pane>
        <el-tab-pane label="操作记录" name="5">
          <Actionlogs v-if="activeName == 5" />
        </el-tab-pane>
      </el-tabs>
    </div>
    <ChangeRoleStatus ref="ChangeRoleStatus" @reroad="getdata" />
    <EditRole ref="EditRole" @reroad="getdata" />
    <AddPerson ref="AddPerson" @reroad="getdata" />
  </div>
</template>

<script>
import RoleMenu from "./rolemenu.vue";
import DataMenu from "./datapermission.vue";
import PersonList from "./personlist.vue";
import EditRole from "./editrole.vue";
import AddPerson from "./addperson.vue";
import ChangeRoleStatus from "./changerolestatus.vue";
import Actionlogs from "../../logsmanage/staffactionlogs.vue";
import FieldPermission from "./fieldpermission.vue";
import { roleremove, getroledetail } from "@/api/role/index";

export default {
  components: {
    RoleMenu,
    DataMenu,
    PersonList,
    ChangeRoleStatus,
    EditRole,
    AddPerson,
    FieldPermission,
    Actionlogs,
  },
  data() {
    return {
      open: false,
      activeName: "1",
      roleData: {
        name: "",
      },
    };
  },
  mounted() {
    this.roleData = JSON.parse(this.$route.query.data);
    if(this.$route.query.type){
      this.activeName = '4'
    }
  },
  methods: {
    confirmDel() {
      this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          roleremove({ id: this.$route.query.id }).then((res) => {
            this.$message({
              type: "success",
              message: "删除成功!",
            });
            this.$router.push({
              path: "dutycontrol",
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
    getList() {},
    copyduty() {
      this.$message.error("该功能暂不可用");
    },
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
              path: "/staffManager/staffmanager",
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
      getroledetail(data).then((res) => {
        this.roleData = res.data;
      });
    },
    handleClick() {},
    handleEdit() {
      this.open = true;
      this.$nextTick(() => {
        this.$refs.AddStaff.open = true;
      });
    },
    // 编辑职务
    editRole(ob) {
      this.$refs.EditRole.id = this.$route.query.id;
      this.$refs.EditRole.submitParams.name = this.roleData.name;
      this.$refs.EditRole.submitParams.description = this.roleData.description;
      this.$refs.EditRole.dialogVisible = true;
    },
    // 新增人员
    addPerson(ob) {
      this.$refs.AddPerson.id = this.$route.query.id;
      this.$refs.AddPerson.submitParams.name = this.roleData.name;
      this.$refs.AddPerson.dialogVisible = true;
    },
    // 停用启用职务
    updateRoleStatus(ob) {
      this.$refs.ChangeRoleStatus.dialogVisible = true;
      this.$refs.ChangeRoleStatus.id = this.$route.query.id;
      this.$refs.ChangeRoleStatus.submitParams.name = this.roleData.name;
      this.$refs.ChangeRoleStatus.statusType = this.roleData.status;
    },
    handleAdd() {
      this.$refs.EditRole.id = "";
      this.$refs.EditRole.submitParams.name = "";
      this.$refs.EditRole.dialogVisible = true;
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
    flex-direction: column;
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
  padding: 20px 30px;
}
::v-deep {
  .el-tabs__nav-wrap::after {
    background-color: #fff !important;
  }
}
</style>