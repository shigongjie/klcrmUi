<template>
  <div class="h5-container">
    <Navbar :title="'AI外呼详情'" @jump="jumpgo" />
    <div class="container" :style="isApp == 2 ? 'padding-top: 56px;' : ''">
      <div class="headers" v-if="isApp != 2">
        <div class="topNav">
          <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
          <span>AI外呼详情</span>
          <span><i class=""></i></span>
        </div>
      </div>
      <div class="pd">
        <el-table :data="list.list" border style="width: 100%">
          <el-table-column fixed prop="customerId" label="客户姓名" width="100">
          </el-table-column>
          <el-table-column prop="phone" label="联系号码" width="120">
          </el-table-column>
          <el-table-column prop="intentLevel" label="意向级别" width="120">
          </el-table-column>
          <el-table-column prop="sex" label="性别" width="120">
          </el-table-column>
          <el-table-column prop="time" label="最后通话时间" width="300">
          </el-table-column>
        </el-table>
      </div>
    </div>
    <div class="clickCopy" :data-clipboard-text="list.url" @click="copy">
      <img src="@/assets/images/copy.png" alt="" />
      复制表格下载地址
    </div>
  </div>
</template>

<script>
import Clipboard from "clipboard";
import { detail, callsave } from "@/api/Ai/index";
export default {
  data() {
    return {
      isApp: 2,
      value1: "createTime",
      value2: "desc",
      option1: [
        { text: "客户名称", value: "name" },
        { text: "创建时间", value: "createTime" },
      ],
      option2: [
        { text: "正序排序", value: "asc" },
        { text: "倒序排序", value: "desc" },
      ],
      deldia: false,
      checked: false,
      list: {
        list: [],
      },
      result: [],
      loading: false,
      finished: false,
      queryParams: {
        // pageNum: 1,
        // pageSize: 10,
      },
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.commonCluelist();
  },
  filters: {
    test(val) {
      if (val != "" && val != undefined && val != null) {
        var resultPhone = val.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
        return resultPhone;
      } else {
        return val;
      }
    },
  },
  watch: {
    checked(val) {
      if (val) {
        this.$refs.checkboxGroup.toggleAll(true);
      } else {
        this.$refs.checkboxGroup.toggleAll();
      }
    },
  },
  methods: {
    jumpgoApp() {
      LukeappApi.clt_close_browser("paysuccess");
    },
    submit() {
      callsave({ customerIds: this.result })
        .then((res) => {
          console.log(res);
          if (res.success) {
            this.$message({
              type: "success",
              message: "创建成功!",
            });
            this.$router.push("/Ailisth5");
          } else {
            // console.log(1111);
          }
        })
        .catch((err) => {
          //    this.$notify('提示文案');
        });
    },
    commonCluelist() {
      let data = {};
      detail({ id: this.$route.query.id }).then((res) => {
        console.log(res);
        this.list = res.data;
      });
    },
    onLoad() {
      // 异步更新数据
      // setTimeout 仅做示例，真实场景中一般为 ajax 请求
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1);
        }

        // 加载状态结束
        this.loading = false;

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true;
        }
      }, 1000);
    },
    delconfirm() {
      customerremove({ ids: [this.$route.query.id] }).then((res) => {
        this.$router.push({
          path: "/customerh5",
        });
        this.$message({
          type: "success",
          message: "删除成功!",
        });
      });
    },
    handleAction(type) {
      if (type == 2) {
        this.$router.push({
          path: "/addcustomer",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 1) {
        this.$router.push({
          path: "/transformsea",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 0) {
        this.$router.push({
          path: "/transforwithperson",
          query: {
            id: this.$route.query.id,
          },
        });
        return;
      }
      if (type == 3) {
        this.deldia = true;
      }
    },
    copy() {
      var clipboard = new Clipboard(".clickCopy");
      if(this.list.url == null) {
        this.$toast("外呼结果未上传")
      }
      console.log(clipboard);
      clipboard.on("success", (e) => {
        this.$toast({
          message: "复制成功",
          type: "success",
          duration: 1000,
        });
        //  释放内存
        clipboard.destroy();
      });
      clipboard.on("error", (e) => {
        // 不支持复制
        console.log("该浏览器不支持复制");
        // 释放内存
        clipboard.destroy();
      });
    },
    changeorder(val) {
      console.log(val);
      getlist({ field: this.value1, order: this.value2 }).then((res) => {
        console.log(res);
        this.list = res.data;
      });
    },
    jumpgo() {
      this.$router.go(-1);
    },
    //   操作记录
    operaLogList() {
      operaLogList({ customerId: this.$route.query.id }).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    // 跟进记录
    followRecordList() {
      followRecordList({ customerId: this.$route.query.id }).then((res) => {
        this.followRecordData = res.rows;
      });
    },
    toast() {
      this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
    },
    handleClick() {},
    // 客户详情
    getcustomerdetail() {
      generalInfo({ id: this.$route.query.id }).then((res) => {
        this.customerInfo = res.data.customerEntity;
        if (res.data.customerEntity.contactEntity == null) {
          this.customerInfo.contactEntity = {};
        }
        this.dynamicList = res.data.list;
        this.dataVO = res.data.dataVO;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
::v-deep .el-message-box__wrapper {
  ::v-deep .zdylm {
    width: 300px !important;
  }
}

.container {
  height: 100%;
  color: #606266;
}
.headers {
  position: fixed;
  width: 100%;
  background: #ffffff;
  z-index: 99;
  .topNav {
    width: 100%;
    height: 56px;
    display: flex;
    padding: 20px 15px;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    background: #ffffff;
  }
}
.pd {
  height: 100%;
  padding-top: 56px;
  padding-bottom: 76px;
  background: RGB(249, 249, 249);
  overflow: auto;
  padding-left: 10px;
  padding-right: 10px;
}
.tab {
  margin-top: 15px;
  ::v-deep .el-tabs__nav-wrap {
    background-color: #ffffff;
  }
  ::v-deep .is-top:nth-child(2) {
    padding-left: 20px;
  }
  ::v-deep .el-tabs__nav-wrap::after {
    background-color: #ffffff !important;
  }
  ::v-deep .el-tabs__item {
    font-size: 12px;
  }
  ::v-deep .el-tabs__nav-scroll {
    display: flex;
    justify-content: space-between;
  }
}

.customer_info {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(3, 33.3%);
  background: #ffffff;
  div {
    text-align: center;
    font-size: 13px;
    padding: 6px 0;
  }
}
.work {
  padding: 0 20px;
  padding-bottom: 64px;
  // background: RGB(249, 249, 249);
}
.dynamic_card {
  margin-top: 10px;
  background: #ffffff;
  border-radius: 6px;
  padding: 10px 0;
  .card {
    .userInfo {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    font-size: 13px;
    padding: 0 10px;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 5px;
    }
    .dynamic_conent {
      padding-left: 40px;
      padding-top: 10px;
    }
    .dynamic_time {
      display: flex;
      justify-content: space-between;
      padding-left: 40px;
      padding-top: 20px;
      i {
        margin-right: 5px;
      }
    }
  }
}
.base_info_title {
  font-size: 13px;
  padding-left: 10px;
  font-weight: 600;
}
.base_info_card {
  background: #ffffff;
  font-size: 13px;
  padding: 8px 20px;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid #e9eaec;
}
.opera_card {
  background: #ffffff;
  width: 95%;
  margin: auto;
  margin-bottom: 20px;
  border-radius: 6px;
  .operaUser {
    border-bottom: 1px solid #e9eaec;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 13px;
    padding: 10px 20px;
    .person_info {
      display: flex;
      align-items: center;
    }
    img {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      margin-right: 5px;
    }
  }
  .opera_text_card {
    font-size: 13px;
    div {
      padding: 8px 20px;
    }
  }
}
.footer {
  padding: 0 20px;
  height: 56px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  align-items: center;
  font-size: 13px;
  border-top: 1px solid #e9eaec;
}
.nodata {
  padding: 50px 0;
  text-align: center;
}
.card {
  padding: 15px 10px;
  border-bottom: 1px solid #e9eaec;
  div {
    font-size: 13px;
    .name {
      color: #999999;
      font-weight: 600;
      font-size: 15px;
      margin-bottom: 8px;
    }
  }
}
.scroll {
  overflow-x: scroll;
}
.trdiv {
  display: flex;
  width: 900px;
  //   overflow-x: hidden;
}
.fixed {
  position: fixed;
}
.tddiv {
  width: 120px;
  padding: 10px;
}
.clickCopy {
  font-size: 13px;
  padding: 20px 0;
  color: #409eff;
  position: fixed;
  bottom: 0;
  z-index: 999;
  text-align: center;
  width: 100%;
  background: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  img {
    width: 14px;
    height: 14px;
    margin-right: 5px;
  }
}
</style>