<template>
  <div class="container">
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <!-- <span @click="jumpGo">取消</span> -->
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{ $route.query.id ? "编辑线索" : "新建线索" }}</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div class="pd" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <div class="line"></div>
      <van-form ref="rulesForm" @submit="submit">
        <van-field
          v-model="submitParams.customerName"
          name="客户名称"
          label="客户名称"
          placeholder="请输入客户名称"
          required
          :rules="[{ required: true, message: '请输入客户名称' }]"
        />

        <van-field
          v-model="submitParams.contactName"
          name="联系人姓名"
          label="联系人姓名"
          placeholder="请输入联系人姓名"
        />

        <van-field name="radio" label="尊称">
          <template #input>
            <van-radio-group v-model="submitParams.sex" direction="horizontal">
              <van-radio name="2">未知</van-radio>
              <van-radio name="1">女士</van-radio>
              <van-radio name="0">先生</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <VantSelect
          label="角色"
          placeholder="请选择角色"
          v-model="submitParams.role"
          :columns="customerRoleList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
        />

        <!-- <van-cell
          title="生日"
          :value="submitParams.birthday"
          @click="show = true"
        />
        <van-popup v-model="show" position="bottom">
          <van-datetime-picker
            type="date"
            title="选择年月日"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="onConfirm"
            v-model="currentDate"
          />
        </van-popup> -->

        <van-field
          v-model="submitParams.deptRole"
          name="职务部门"
          label="职务部门"
          placeholder="请输入职务部门"
        />

        <van-field
          v-model="submitParams.phone"
          name="手机号码"
          label="手机号码"
          placeholder="请输入手机号码"
          required
          :rules="[{ required: true, message: '请输入手机号码' }]"
        />
        <VantCascader
          label="所在地区"
          placeholder="请选择所在地区"
          v-model="submitParams.address"
          :columns="areaList"
          :option="{ text: 'name', value: 'id', children: 'list' }"
          :resultLabelprop="submitParams.pcdJson"
          @confirm="onFinish"
          required
          :rules="[{ required: true, message: '请选择所在地区' }]"
        />

        <van-field
          v-model="submitParams.tel"
          name="固定电话"
          label="固定电话"
          placeholder="请输入固定电话"
        />

        <van-field
          v-model="submitParams.faxNo"
          name="传真号码"
          label="传真号码"
          placeholder="请输入传真号码"
        />

        <van-field
          v-model="submitParams.email"
          name="电子邮箱"
          label="电子邮箱"
          placeholder="请输入电子邮箱"
        />

        <van-field
          v-model="submitParams.vx"
          name="微信账号"
          label="微信账号"
          placeholder="请输入微信账号"
        />

        <van-field
          v-model="submitParams.qq"
          name="QQ号码"
          label="QQ号码"
          placeholder="请输入QQ号码"
        />

        <VantSelect
          label="线索来源"
          placeholder="请选择线索来源"
          v-model="submitParams.source"
          :columns="customerSourceList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
        />

        <VantSelect
          label="线索状态"
          placeholder="请选择线索状态"
          v-model="submitParams.sourceStatus"
          :columns="sourceSatusList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
        />


      </van-form>
    </div>
  </div>
</template>

<script>
import {
  customersave,
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
      minDate: new Date(1922, 0, 1),
      maxDate: new Date(2025, 0, 31),
      currentDate: new Date(2022, 0, 17),
      date: "",
      show: false,
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
        phone: [
          { required: true, message: "请输入联系人手机", trigger: "blur" },
        ],
        contactName: [
          { required: true, message: "请输入联系人姓名", trigger: "blur" },
        ],
      },
      submitParams: {
        userId: "",
        contactEntity: {},
        taskEntity: {},
      },
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
    getcustomerList({ type: 1 }).then((res) => {
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
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(value) {
      this.show = false;
      console.log(value);
      this.submitParams.birthday = this.formatDate(value);
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
          // if (this.submitParams.address) {
          //   this.submitParams.address = this.submitParams.address
          //     .split(",")
          //     .map((item) => {
          //       return +item;
          //     });
          // }
        });
      }
    },
    changeUser() {},
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs.rulesForm
        .validate()
        .then(() => {
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
          saveMark(this.submitParams).then((res) => {
            if (this.id) {
              this.$router.push({
                path: "/saleleadh5",
              });
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$router.push({
                path: "/saleleadh5",
              });
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }
            this.open = false;
          });
        })
        .catch((err) => {});
      // this.$refs.rulesForm.validate((valid) => {
      //   if (valid) {

      //   } else {
      //     return false;
      //   }
      // });
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
  background: RGB(249, 249, 249);
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
</style>
