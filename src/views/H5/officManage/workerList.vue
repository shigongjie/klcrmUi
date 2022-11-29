<template>
  <div class="h5-container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <Navbar :title="'工单管理'" @jump="jumpGo" />
    <div class="header" v-if="$store.state.user.isApp != 2">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span style="color:#212121;font-weight:600;">工单管理</span>
      <span></span>
    </div>
    <div
      class="work"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <div class="nodata" v-if="customerList.length == 0">
        <img src="@/assets/images/nodata.png" alt="" />
          暂时什么都没有
      </div>
      <div
        @click="toast"
        class="contant"
        v-for="(item, index) in customerList"
        :key="index"
      >
        <div class="customer_info">
          <span class="customer_name">{{ item.workTitle }}</span>
          <span style="margin: 15px 0" class="font13"
            >发起时间：{{
              item.createTime == null ? "无" : item.createTime
            }}</span
          >
          <span class="font13"
            >处理人员：{{
              item.operationStaff == null ? "无" : item.operationStaff
            }}</span
          >
        </div>
        <div class="customer_right">
          <div class="customer_status">
            <span class="font13">{{
              item.workStatus == "1"
                ? "处理中"
                : item.workStatus == "2"
                ? "已完结"
                : "已退回"
            }}</span>
            <div>
              <img
                v-if="item.avatar == null"
                src="@/assets/images/defaultAvatar.png"
                alt=""
              />
              <img v-else :src="item.avatar" alt="" />
              <span class="font13">{{ item.createBy }}</span>
            </div>
          </div>
          <div class="right_icon">
            <!-- <i class="el-icon-arrow-right"></i> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {
  getWorkOrderList,
  removeWorkOrder,
  workOrderExport,
  changeTaskOrder,
} from "@/api/workOrder/index";
import { getsalesleadlist, deleteByIds } from "@/api/saleslead/index";
export default {
  data() {
    return {
      total: 0,
      customerList: [],
      queryParams: {
        pageNum: 1,
        pageSize: 10,
      },
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    //获取工单列表
    getList(res) {
      let datas = {};
      if (res != undefined) {
        //等待时间暂无--res.waitTime
        datas = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          // pageNum: this.queryParamsSelf.pageNum,
          // pageSize: this.queryParamsSelf.pageSize,

          status: this.showStatus,
          name: res.name,
          workType: res.workType,
          workStatus: res.workStatus,
          urgencyType: res.urgencyType,
          createBy: res.createBy,
          operationStaff: res.operationStaff,
          createDept: res.createDept,
          operationStaffDept: res.operationStaffDept,
          createTime: res.createTime,
          updateTime: res.updateTime,
          field: this.orUP,
          waitTime: res.waitTime,
        };
        if (res.status != "") {
          datas.status = res.status;
        }
      } else {
        datas = {
          pageSize: this.pageSize,
          pageNum: this.currentPage,
          status: this.showStatus,
          field: this.orUP,
        };
      }
      if (datas.status == "") {
        datas.status = "  ";
      }
      getWorkOrderList(datas).then((res) => {
        this.customerList = res.data.records;
      });
    },
    handleAdd() {
      this.$router.push({
        path: "/addsalelead",
      });
    },
    jumpGo() {
      this.$router.push("/offich5");
    },
    /**获取数据 */
    getData(query) {
      getsalesleadlist(query).then((res) => {
        this.customerList = res.data.records;
        // this.total = res.total;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/saleleaddetailh5",
        query: {
          id: ob.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  color: #606266;
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
.work {
  min-height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.contant {
  // box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;
  .customer_info {
    display: flex;
    flex-direction: column;
    .customer_name {
      font-size: 15px;
      font-weight: 600;
      color: #212121;
    }
  }
  .customer_status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    img {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
      border-radius: 50%;
    }
    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}
.customer_right {
  display: flex;
  .right_icon {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
}
.font13 {
  font-size: 13px;
}
.nodata {
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 300px;
  color: #c0c4cc;
  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}
</style>
