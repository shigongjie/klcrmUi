/**客户列表 */
<template>
  <div>
    <div class="app-container">
      <el-form :model="queryParams" ref="queryForm" :inline="true">
        <el-form-item prop="headline">
          <el-input
            v-model="queryParams.headline"
            placeholder="公告标题"
            clearable
            size="small"
            @keyup.enter.native="handleQuery"
          />
        </el-form-item>
        <el-form-item label="" prop="participantId">
          <el-cascader
            style="width: 100%"
            size="small"
            placeholder="通知人员"
            v-model="queryParams.participantId"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="" prop="endLastLoginTime">
          <el-date-picker
            size="small"
            v-model="time"
            type="daterange"
            value-format="yyyy-MM-dd"
            range-separator="至"
            start-placeholder="开始发布时间"
            end-placeholder="结束发布时间"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item label="" prop="postStatus">
          <el-select
            v-model="queryParams.postStatus"
            placeholder="发布状态"
            clearable
            size="small"
          >
            <el-option label="开启" value="1"></el-option>
            <el-option label="关闭" value="0"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button
            type="primary"
            icon="el-icon-search"
            size="small"
            @click="handleQuery"
            >查询</el-button
          >
          <el-button icon="el-icon-refresh" size="small" @click="resetQuery"
            >重置</el-button
          >
        </el-form-item>
      </el-form>

      <div>
        <el-button
          style="margin-right: 10px"
          type="primary"
          icon="el-icon-plus"
          size="small"
          @click="handleAdd"
          v-btnPermi="['gg_add_notice']"
          >新增公告</el-button
        >
        <el-button
          plain
          icon="el-icon-switch-button"
          size="small"
          @click="handledel()"
          v-btnPermi="['gg_del_notice']"
          >删除公告</el-button
        >
      </div>
      <div style="width: 100%; margin-top: 20px">
        <el-table
          border
          ref="multipleTable"
          :data="concantTableData"
          tooltip-effect="dark"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55" align="center"> </el-table-column>
          <el-table-column prop="headline" label="公告标题" width="160" align="center">
          </el-table-column>
          <el-table-column prop="participantSize" label="通知人员" width="160" align="center">
            <template slot-scope="scope">
              <span
                @click="handleViewParticipant(scope.row)"
                style="color: #1890ff; cursor: pointer"
              >
                {{ scope.row.participantSize }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="description" label="公告详情" align="center">
            <template slot-scope="scope">
              <span class="vhtml" v-html="scope.row.description"> </span>
            </template>
          </el-table-column>
          <el-table-column prop="createTime" label="发布时间" width="180" align="center">
          </el-table-column>
          <el-table-column prop="accessory" label="附件" width="160" align="center">
            <template slot-scope="scope">
              <span>
                {{ scope.row.isUploading == "1" ? "已上传" : "未上传" }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="postStatus" label="发布状态" width="160" align="center">
            <template slot-scope="scope">
              <el-switch
                v-btnPermi="['gg_releace_or_not']"
                @change="changepostStatus(scope.row)"
                :value="scope.row.postStatus == 0 ? false : true"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column prop="discussSize" label="评论" width="160" align="center">
            <template slot-scope="scope">
              <span
                @click="handleViewCommont(scope.row)"
                style="color: #1890ff; cursor: pointer"
              >
                {{ scope.row.discussSize }}
              </span>
            </template>
          </el-table-column>

          <el-table-column prop="action" label="操作" width="160" fixed="right" align="center">
            <template slot-scope="scope">
              <el-button
                v-btnPermi="['marketclue_detele']"
                style="margin-right: 10px"
                @click.native.prevent="edit(scope.row)"
                size="mini"
                type="primary"
                plain
              >
                查看
              </el-button>
              <el-popconfirm
                title="确定删除吗？"
                @confirm="handledel(scope.row.id)"
              >
                <el-button
                  v-btnPermi="['gg_del_notice']"
                  slot="reference"
                  size="mini"
                  type="danger"
                  plain
                >
                  删除
                </el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          v-show="total > 0"
          :total="total"
          :page.sync="queryParams.pageNo"
          :limit.sync="queryParams.pageSize"
          @pagination="getList"
        />
      </div>
      <ConnectPerson
        v-if="open"
        ref="ConnectPerson"
        :id="editId"
        @reload="getList"
      />
      <el-dialog title="查看" :visible.sync="dialogVisible" width="50%">
        <Commont v-if="dialogVisible" :id="currentId" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="dialogVisible = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog :visible.sync="dialogVisibleViewParticipant" width="50%">
        <ViewParticpant v-if="dialogVisibleViewParticipant" :id="currentId" />
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisibleViewParticipant = false"
            >取 消</el-button
          >
          <el-button
            type="primary"
            @click="dialogVisibleViewParticipant = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
      <el-dialog
        :title="currentData.headline"
        :visible.sync="showDetailNotic"
        width="50%"
        center
      >
        <div class="description">
          <div v-html="currentData.description"></div>
        </div>

        <div class="fileWarp">
          <div
            v-for="(item, index) in fileList"
            :key="index"
            @click="downLoad(item)"
          >
            <i class="el-icon-paperclip"></i> {{ item.name }}
          </div>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button size="mini" @click="showDetailNotic = false"
            >取消</el-button
          >
          <el-button size="mini" type="primary" @click="showDetailNotic = false"
            >关闭</el-button
          >
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { getstaffList } from "@/api/customer/index";
import { getPages, afficheremove, updateStatues } from "@/api/notic/index";
import { getShowList } from "@/api/common/index";
import ConnectPerson from "./components/addnotice.vue";
import Commont from "./components/commentdetail.vue";
import ViewParticpant from "./components/viewlogs.vue";
export default {
  components: {
    ConnectPerson,
    ViewParticpant,
    Commont,
  },
  data() {
    return {
      activeName: "0",
      time: "",
      editId: "",
      open: false,
      queryParams: {
        pageNo: 1,
        pageSize: 10,
      },
      customerLifeCycle: [],
      followStatus: [],
      chooseStaffIds: [],
      concantTableData: [],
      customerRoleList: [],
      total: 0,
      userList: [],
      fileList: [],
      currentId: "",
      currentData: {},
      dialogVisible: false,
      showDetailNotic: false,
      dialogVisibleViewParticipant: false,
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  computed: {},
  mounted() {
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    this.getList(this.queryParams);
  },
  methods: {
    changepostStatus(val) {
      console.log(val);
      updateStatues({ id: val.id }).then((res) => {
        this.getList();
      });
    },
    handleViewParticipant(ob) {
      this.currentId = ob.id;
      this.dialogVisibleViewParticipant = true;
    },
    handleViewCommont(ob) {
      this.currentId = ob.id;
      this.dialogVisible = true;
    },
    handleClick() {},
    resetColumn() {
      getShowList({ type: 2 }).then((res) => {
        this.showList = res.data;
        sessionStorage.setItem("connectColumn", JSON.stringify(res.data));
        this.$refs.SetColumn.showList = res.data;
      });
    },
    // 获取到列表项
    getTableList(val) {
      this.showList = val;
    },
    jumpContact(id) {
      this.$router.push({
        path: "/customerManager/contactdetail",
        query: {
          id: id,
        },
      });
    },
    jump(id) {
      this.$router.push({
        path: "/customerManager/customerdetail",
        query: {
          id: id,
        },
      });
    },
    getList(query) {
      // if (query == null) {
      //   query = this.queryParams;
      // }
      getPages(this.queryParams).then((res) => {
        this.concantTableData = res.rows;
        this.total = res.total;
      });
    },
    handleSelectionChange(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseStaffIds = ids;
    },
    downLoad(item) {
      axios.get(item.url, { responseType: "blob" }).then((res) => {
        const blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = item.name;
        a.click();
        document.body.removeChild(a);
      });
    },
    // 从列表页获取ids
    getIds(val) {
      let ids = [];
      val.forEach((item, index) => {
        ids.push(item.id);
      });
      this.chooseStaffIds = ids;
    },
    handledel(ob) {
      console.log(ob);
      if (ob) {
        this.chooseStaffIds = [ob];
      }
      if (this.chooseStaffIds.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除的公告",
          type: "warning",
        });
        return;
      } else {
        this.$confirm("此操作将永久删除, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            afficheremove({ ids: this.chooseStaffIds }).then((res) => {
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
      }
    },
    handleStaff(data) {
      handleStaff(data).then((res) => {
        this.$message({
          type: "success",
          message: "操作成功!",
        });
      });
    },
    handleAdd() {
      this.editId = "";
      this.open = true;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
    edit(ob) {
      this.currentData = ob;
      if (ob.accessory) {
        this.fileList = JSON.parse(ob.accessory);
      }
      this.showDetailNotic = true;
    },
    closeAdd() {
      this.$refs.CustomerTable.getData();
    },
    handleQuery() {
      if (this.time != "" && this.time != null) {
        this.queryParams.createTime = this.time[0] + " " + "00:00:00";
        this.queryParams.endTime = this.time[1] + " " + "23:59:59";
      } else if (this.time == null) {
        this.queryParams.createTime = "";
        this.queryParams.endTime = "";
      }
      this.getList(this.queryParams);
    },
    resetQuery() {
      this.time = "";
      this.queryParams = {
        pageSize: 10,
        pageNo: 1,
      };
      this.getList();
    },
  },
};
</script>

<style lang='scss' scoped>
.link {
  color: #409eff;
  cursor: pointer;
}
.tabWarp {
  display: flex;
  align-items: center;
  background: rgb(249, 249, 249);
  padding: 15px 20px;
  div {
    padding-right: 50px;
    cursor: pointer;
    font-weight: 600;
    font-size: 14px;
    color: #303133;
  }
  div:hover {
    color: #409eff;
  }
  .color-active {
    color: #409eff !important;
  }
}
.fileWarp {
  div {
    margin-top: 10px;
    cursor: pointer;
  }
  div:hover {
    color: #409eff !important;
  }
}
.description {
  min-height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}
::v-deep .vhtml {
  max-height: 200px;
  overflow: hidden;
  p {
    max-height: 200px;
    // overflow: hidden;
    width: 100px!important;
    white-space: nowrap;
    text-overflow:ellipsis;
    img {
      width: 50px !important;
      height: 50px !important;
    }
  }
  img {
    width: 50px !important;
    height: 50px !important;
  }
}
</style>
