<template>
  <div class="h5-container">
    <Navbar :title="'任务管理'" @jump="jumpGo" />
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" v-if="$store.state.user.isApp != 2">
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span style="color:#212121;font-weight:600;">任务管理</span>
      <span></span>
    </div>
    <div class="work" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <div class="tab_warp">
        <div @click="handleChangeTab(item)" v-for="(item, index) in tabList" :key="index"
          :class="item.id == activetab ? 'activeColor' : ''">
          {{ item.name }}
        </div>
      </div>
      <!-- <div class="nodata" v-if="todayList.length == 0">
        <i class="el-icon-hot-water"></i>
        暂无数据
      </div> -->
      <div class="nodata" v-if="todayList.length == 0">
        <img src="@/assets/images/nodata.png" alt="" />
        暂时什么都没有
      </div>
      <div :style="{ 'border-left': '3px solid' + item.sign }" class="contant" v-for="(item, index) in todayList"
        :key="index">
        <div class="top_title">
          <span class="customer_name">{{ item.headline }}</span>
          <span class="font13">{{ item.taskType }}</span>
        </div>
        <div class="customer_info">
          <div class="progress">
            <span style="margin: 15px 0" class="font13">{{ item.createTime == null ? "无" : item.createTime }}
              <span style="display: inline-block; width: 15px"></span>
              {{ item.urgencydegree }}</span>
            <span class="font13">
              <el-progress style="display: block; width: 250px" :percentage="item.schedule"></el-progress>
            </span>
          </div>

          <div class="customer_right">
            <div class="customer_status">
              <div>
                <img v-if="item.avatar == null" src="@/assets/images/defaultAvatar.png" alt="" />
                <img v-else :src="item.avatar" alt="" />
                <span class="font13">{{ item.createBy }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { taskpage } from "@/api/task/index";
export default {
  data() {
    return {
      total: 0,
      todayList: [],
      activetab: null,
      tabList: [
        { name: "全部", id: null },
        { name: "进行中", id: "1" },
        { name: "未开始", id: "0" },
        { name: "已完成", id: "3" },
        { name: "未完成", id: "4" },
      ],
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
      },
    };
  },
  mounted() {
    this.getList(this.queryParams);
  },
  methods: {
    handleChangeTab(ob) {
      this.activetab = ob.id; 
      let data = {};
      data.type = ob.id;
      this.getList(data);
    },
    //获取工单列表
    getList(query) {
      if (query == null) {
        query = this.queryParams;
      }
      taskpage(query).then((res) => {
        this.todayList = res.rows;
        this.loading = false;
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
  padding-bottom: 20px;
}

.contant {
  width: 95%;
  margin: auto;
  margin-top: 15px;
  // display: flex;
  // justify-content: space-between;
  background: #ffffff;

  .top_title {
    display: flex;
    justify-content: space-between;
    // height: 40px;
    // line-height: 40px;
    border-bottom: 1px solid #f1f1f1;
    // margin-bottom: 15px;
    padding: 15px 15px;

    .customer_name {
      font-size: 14px;
      font-family: PingFang SC;
      font-weight: bold;
      color: #212121;
    }
  }

  //   border-radius: 6px;
  .customer_info {
    padding: 15px 15px;
    display: flex;
    // flex-direction: column;
    justify-content: space-between;

    .progress {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
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

.tab_warp {
  background: #ffffff;
  display: flex;
  font-size: 13px;
  justify-content: space-between;

  div {
    padding: 8px 10px;
  }
}

.activeColor {
  color: #409eff;
}
</style>
