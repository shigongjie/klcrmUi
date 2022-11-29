<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <!-- <span @click="jumpGo">取消</span> -->
       <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{ $route.query.id ? "编辑联系人" : "新建联系人" }}</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div class="pd">
      <div class="line"></div>
      <van-form ref="rulesForm" @submit="submit">
        <van-field v-model="submitParams.contactName" name="name" required label="" placeholder="请输入联系人姓名"
          :rules="[{ required: true, message: '请输入联系人姓名' }]" />
        <div class="titleh5">基础信息</div>

        <VantSelect label="关联客户" placeholder="关联客户" v-model="submitParams.relevancyClient" :columns="customerList"
          :option="{ label: 'name', value: 'id' }" required :rules="[{ required: true, message: '请选择所属行业' }]" />

        <van-field name="radio" label="尊称：" required :rules="[{ required: true, message: '请选择尊称' }]">
          <template #input>
            <van-radio-group v-model="submitParams.sex" direction="horizontal">
              <van-radio name="0">保密</van-radio>
              <van-radio name="2">女士</van-radio>
              <van-radio name="1">先生</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <VantSelect label="角色" placeholder="请选择客户角色" v-model="submitParams.role" :columns="customerRoleList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" required
          :rules="[{ required: true, message: '请选择客户角色' }]" />

        <van-field v-model="submitParams.deptRole" name="部门职务" label="部门职务" placeholder="请输入部门职务" />

        <van-field v-model="submitParams.phone" name="手机号码" label="手机号码" maxlength="11" placeholder="请输入手机号码" />

        <van-cell title="生日" :value="submitParams.birthday" @click="show = true" />
        <van-calendar placeholder="请选择联系人生日" v-model="show" @confirm="onConfirm" />

        <van-field v-model="submitParams.tel" name="固定电话" label="固定电话" placeholder="请输入固定电话" />

        <van-field v-model="submitParams.faxNo" name="传真号码" label="传真号码" placeholder="请输入传真号码" />

        <van-field v-model="submitParams.email" name="电子邮箱" label="电子邮箱" placeholder="请输入电子邮箱" />

        <van-field v-model="submitParams.vx" name="微信账号" label="微信账号" placeholder="请输入微信账号" />

        <van-field v-model="submitParams.qq" name="QQ号码" label="QQ号码" placeholder="请输入QQ号码" />
        <VantCascader label="所在地区" placeholder="请选择所在地区" v-model="submitParams.pcdJson" :columns="areaList"
          :option="{ text: 'name', value: 'id', children: 'list' }" :resultLabelprop="submitParams.region" required
          @confirm="onFinish2" />
        <van-field v-model="submitParams.address" name="详细地址" label="详细地址" placeholder="请输入详细地址" />

        <van-field v-model="submitParams.remark" name="备注信息" label="备注信息" placeholder="请输入备注信息" />
      </van-form>
    </div>
  </div>
</template>

<script>
import {
  saveContact,
  customerdetail,
  getstaffList,
  getareaList,
  getcustomerList,
} from "@/api/customer/index";
import {
  saveMark,
  getMarketClueDetailById,
  getsaleLeaddetail,
} from "@/api/saleslead/index";
import Dict from "@/components/dict/dict.vue";
export default {
  mixins: [Dict],
  data() {
    return {
      customerSourceList: [],
      sourceSatusList: [],
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
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      rules: {
        contactName: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        relevancyClient: [
          { required: true, message: "请输入必填项", trigger: "blur" },
        ],
        phone: [{ required: true, message: "请输入必填项", trigger: "blur" }],
      },
      submitParams: {
        birthday: "",
        userId: "",
        contactEntity: {},
        taskEntity: {},
      },
      show: false,
    };
  },
  beforeMount() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
    /**客户来源 */
    this.getDicts("customer_source").then((res) => {
      this.customerSourceList = res.data;
    });
    this.id = this.$route.query.id;
    getcustomerList().then((res) => {
      this.customerList = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(date) {
      this.show = false;
      this.submitParams.birthday = this.formatDate(date);
    },
    onFinish2(value, index, o) {
      this.submitParams.contactEntity.pcdJson = value.selectedOptions
        .map((option) => option.name)
        .join("/");
      this.submitParams.contactEntity.region = value.selectedOptions
        .map((option) => option.id)
        .join(",");
      console.log(this.submitParams);
      this.showArea = false;
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getsaleLeaddetail({ id: this.id }).then((res) => {
          this.submitParams = res.data;
          // this.submitParams.affiliationStaff = res.data.affiliationStaff;
          if (res.data.taskEntity == null) {
            this.submitParams.taskEntity = {};
          }
          if (this.submitParams.address) {
            this.submitParams.address = this.submitParams.address
              .split(",")
              .map((item) => {
                return +item;
              });
          }
          if (this.submitParams.region) {
            this.submitParams.region = this.submitParams.region
              .split(",")
              .map((item) => {
                return +item;
              });
          }
        });
      }
    },
    changeUser() { },
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs.rulesForm
        .validate()
        .then((val) => {
          if (!this.checked) {
            this.submitParams.taskEntity = null;
          } else {
            this.submitParams.taskEntity.remindType =
              this.remindType.toString();
          }
          if (
            this.submitParams.address != undefined &&
            this.submitParams.address != ""
          ) {
            this.submitParams.address = this.submitParams.address.toString();
          }
          if (
            this.submitParams.region != undefined &&
            this.submitParams.region != ""
          ) {
            this.submitParams.region = this.submitParams.region.toString();
          }
          saveContact(this.submitParams).then((res) => {
            if (this.id) {
              this.$router.push({
                path: "/connectperson",
              });
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$router.push({
                path: "/connectperson",
              });
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }
            this.open = false;
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
  // background: RGB(249, 249, 249);
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
}
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
}
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}

.pd {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
}

.title {
  font-weight: 600;
  font-size: 13px;
  padding: 10px;
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

.titleh5 {
  background: RGB(249, 249, 249);
  font-weight: 600;
  font-size: 13px;
  padding: 15px;
}
</style>
