<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''"
    >
      <!-- <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span> -->
      <span @click="jumpGo">取消</span>
      <span class="title-clue">{{ id ? "编辑公海客户" : "创建公海客户" }}</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div
      class="pd"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <div class="line"></div>
      <van-form ref="rulesForm" @submit="submit">
        <van-field
          v-model="submitParams.name"
          name="name"
          required
          label="客户名称"
          placeholder="请输入客户名称"
          :rules="[{ required: true, message: '请输入客户名称' }]"
        />
        <van-field
          v-model="submitParams.contactPhone"
          name="手机号码"
          label="手机号码"
          placeholder="请输入手机号码"
          maxlength="11"
          required
          :rules="[{ required: true, message: '请输入联系人手机号码' }]"
        />
      </van-form>
    </div>
  </div>
</template>

<script>
import { seasinsert, customerdetail } from "@/api/customer/index";

export default {
  data() {
    return {
      fieldNames: {
        text: "name",
        value: "id",
        children: "list",
      },
      showUserId: false,
      showArea: false,
      fieldValue: "",
      cascaderValue: "120101",
      show: false,
      checked: false,
      choosedUser: "",
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      userList: [],
      customerList: [],
      area: "",
      areaList: [],
      rules: {
        address: [
          { required: true, message: "请选择所在地区", trigger: "change" },
        ],
        name: [{ required: true, message: "请输入客户名称", trigger: "blur" }],
        industry: [
          { required: true, message: "请选择所属行业", trigger: "change" },
        ],
        type: [
          { required: true, message: "请选择客户类型", trigger: "change" },
        ],
        state: [
          { required: true, message: "请选择客户状态", trigger: "change" },
        ],
        star: [
          { required: true, message: "请选择客户星级", trigger: "change" },
        ],
        userId: [
          { required: true, message: "请选择归属人员", trigger: "change" },
        ],
        "contactEntity.phone": [
          { required: true, message: "请输入联系人手机", trigger: "blur" },
        ],
        "contactEntity.contactName": [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
      },
      submitParams: {
        pcdJson: "",
        scale: "1111",
        userId: "",
        contactEntity: {},
        taskEntity: {},
      },
    };
  },
  beforeMount() {
    this.id = this.$route.query.id;
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    onFinishUserId(value, index, o) {
      this.submitParams.userJson = value.selectedOptions[value.tabIndex].name;
      this.submitParams.userId = value.value;
      this.showUserId = false;
    },
    onFinish(value, index, o) {
      // this.show = false;
      this.submitParams.pcdJson = value.selectedOptions
        .map((option) => option.name)
        .join("/");
      this.submitParams.address = value.selectedOptions
        .map((option) => option.id)
        .join(",");
      console.log(this.submitParams);
      this.showArea = false;
    },
    getTreeNode(list, id) {
      function getNode() {
        console.log(list, id);
        list.forEach((item, index) => {
          if (item.id == id) {
            console.log("1111", item);
            return item;
          } else {
            if (item.list) {
              getNode(item.list, id);
            }
          }
        });
      }
      return getNode();
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        customerdetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          if (res.data.contactEntity == null) {
            this.submitParams.contactEntity = {};
          }
          if (res.data.taskEntity == null) {
            this.submitParams.taskEntity = {};
          }
          // if(this.submitParams.contactId){

          //   this.onFinishUserId(this.submitParams.contactId)
          // }
          console.log(this.userList);
          console.log(
            this.getTreeNode(this.userList, this.submitParams.userId)
          );
          //  所在地区回显
          if (this.submitParams.contactEntity.region) {
            this.submitParams.contactEntity.region =
              this.submitParams.contactEntity.region.split(",").map((item) => {
                return +item;
              });
          }
        });
      }
    },
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      console.log(this.submitParams);
      this.$refs.rulesForm
        .validate()
        .then((val) => {
          seasinsert(this.submitParams).then((res) => {
            this.seaopen = false;
            // this.$message.success("新增成功");
            if (this.submitParams.id) {
              this.$toast.success("编辑成功");
            } else {
              this.$toast.success("新增成功");
            }
            this.$router.push("/seacustomerh5");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height: 20px;
  background: RGB(249, 249, 249);
}
.container {
  height: 100%;
  color: #606266;
}
.header {
  font-size: 13px;
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
  i{
    font-size: 16px;
  }
}
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
}
.pd {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.titleh5 {
  background: RGB(249, 249, 249);
  font-weight: 600;
  font-size: 13px;
  padding: 15px;
}
.selfForm {
  ::v-deep input {
    border: none;
    text-align: right;
  }
  ::v-deep .el-select {
    width: 100%;
  }
  ::v-deep .el-form-item {
    background: #ffffff;
    padding: 6px 10px;
    // padding-bottom: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid #ebeff3;
  }
  ::v-deep .el-input__prefix {
    display: none;
  }
  ::v-deep .el-form-item__error {
    right: 15px;
    text-align: right;
  }
  ::v-deep .el-radio-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: 8px;
    padding-right: 10px;
  }
}
.customer_name {
  ::v-deep input {
    border: none;
    text-align: left;
  }
}
</style>
