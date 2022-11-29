<template>
  <div>
    <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div>
    <div class="header">
      <span @click="jumpGo">取消</span>
      <span>转为客户</span>
      <span @click="submit">保存</span>
    </div>
    <div class="pd">
      <van-form ref="rulesForm" @submit="submit">
        <van-field
          v-model="submitParams.name"
          name="客户名称"
          label="客户名称"
          placeholder="请输入客户名称"
          required
          :rules="[{ required: true, message: '请输入客户名称' }]"
        />
        <VantSelect
          label="所属行业"
          placeholder="请选择"
          v-model="submitParams.industry"
          :columns="industryList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择所属行业' }]"
        />
        <van-field
          name="radio"
          label="客户类型"
          required
          :rules="[{ required: true, message: '请选择客户类型' }]"
        >
          <template #input>
            <van-radio-group v-model="submitParams.type" direction="horizontal">
              <van-radio name="0">企业客户</van-radio>
              <van-radio name="1">个人客户</van-radio>
            </van-radio-group>
          </template>
        </van-field>
        <VantSelect
          label="客户状态"
          placeholder="请选择客户状态"
          v-model="submitParams.state"
          :columns="customerStateList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择客户状态' }]"
        />
        <van-field
          readonly
          clickable
          name="area"
          :value="userJson"
          label="归属人员"
          placeholder="点击选择归属人员"
          @click="showUserId = true"
          required
          :rules="[{ required: true, message: '请选择归属人员' }]"
        />
        <van-popup v-model="showUserId" position="bottom">
          <van-cascader
            v-model="submitParams.userId"
            title="请选择归属人员"
            :options="userList"
            @close="showUserId = false"
            :field-names="{ text: 'name', value: 'id', children: 'list' }"
            @finish="onFinishUserId"
          />
        </van-popup>

        <VantSelect
          label="客户星级"
          placeholder="请选择客户星级"
          v-model="submitParams.star"
          :columns="customerStarList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择客户星级' }]"
        />
        <van-field
          v-model="submitParams.contactName"
          name="联系人姓名"
          label="联系人姓名"
          placeholder="请输入联系人姓名"
          required
          :rules="[{ required: true, message: '请输入联系人姓名' }]"
        />

        <van-field
          v-model="submitParams.contactPhone"
          name="手机号码"
          label="手机号码"
          placeholder="请输入手机号码"
          required
          :rules="[{ required: true, message: '请输入联系人手机号码' }]"
        />
      </van-form>
      <!-- <el-form
        class="selfForm"
        ref="rulesForm"
        :model="submitParams"
        label-width="100px"
        label-position="left"
        size="small"
        :rules="rules"
      >
        <div class="line"></div>
        <el-form-item
          class="customer_name"
          label-width="0px"
          label=""
          prop="name"
        >
          <el-input
            v-model="submitParams.name"
            placeholder="请输入客户名称"
          ></el-input>
        </el-form-item>
        <div class="line"></div>
        <el-form-item label="所属行业：" prop="industry">
          <el-select v-model="submitParams.industry" placeholder="所属行业：">
            <el-option
              v-for="(item, index) in industryList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="客户类型：" prop="type">
          <el-radio-group v-model="submitParams.type">
            <el-radio label="0">企业客户</el-radio>
            <el-radio label="1">个人客户</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="客户状态：" prop="state">
          <el-select v-model="submitParams.state" placeholder="客户状态">
            <el-option
              v-for="(item, index) in customerStateList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userId" label="归属人员：">
          <el-cascader
            style="width: 100%"
            v-model="submitParams.userId"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item label="客户星级：" prop="star">
          <el-select v-model="submitParams.star" placeholder="客户星级">
            <el-option
              v-for="(item, index) in customerStarList"
              :key="index"
              :label="item.dictLabel"
              :value="item.dictValue"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="contactName" label="联系人：">
          <el-input
            v-model="submitParams.contactName"
            placeholder="请输入联系人"
          ></el-input>
        </el-form-item>
        <el-form-item label="手机号码" prop="contactPhone">
          <el-input
            v-model="submitParams.contactPhone"
            placeholder="请输入手机号码"
            maxlength="11"
          ></el-input>
        </el-form-item>
      </el-form> -->
    </div>
  </div>
</template>

<script>
import { getstaffList, transfercustomer } from "@/api/customer/index";
import { getMarketClueDetailById, changeClients } from "@/api/saleslead/index";
export default {
  data() {
    return {
      showUserId: false,
      userJson:"",
      remark: "",
      submitParams: {
        name: "",
        contactPhone: "",
      },
      industryList: [], //行业
      customerStateList: [], //客户状态
      customerStarList: [], //客户星级
      contantList: [], //联系人列表
      userList: [],
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
    /**所属行业*/
    this.getDicts("industry").then((res) => {
      this.industryList = res.data;
    });
    /**客户状态 */
    this.getDicts("customer_state").then((res) => {
      this.customerStateList = res.data;
    });
    /**客户星级 */
    this.getDicts("customer_star").then((res) => {
      this.customerStarList = res.data;
    });
    /**客户来源 */
    this.getDicts("customer_source").then((res) => {
      this.customerSourceList = res.data;
    });
  },
  mounted() {
    getMarketClueDetailById({ id: this.$route.query.id }).then((res) => {
      console.log(res);
      this.submitParams.name = res.data.customerName;
      this.submitParams.contactPhone = res.data.phone;
      console.log(this.submitParams);
    });
  },
  methods: {
    onFinishUserId(value, index, o) {
      this.userJson = value.selectedOptions[value.tabIndex].name;
      this.submitParams.userId = value.value;
      this.showUserId = false;
    },
    // onFinish(value, index, o) {
    //   console.log(value, index, o);
    //   // this.show = false;
    //   this.submitParams.pcdJson = value.selectedOptions
    //     .map((option) => option.name)
    //     .join("/");
    //   this.submitParams.address = value.selectedOptions
    //     .map((option) => option.id)
    //     .join(",");
    //   console.log(this.submitParams);
    //   this.showArea = false;
    // },
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs.rulesForm
        .validate()
        .then((res) => {
           this.submitParams.id = this.$route.query.id;
          changeClients(this.submitParams).then((res) => {
            this.$router.push({
              path: "/saleleadh5",
            });
            this.$message({
              type: "success",
              message: "转移成功!",
            });
          });
        })
        .catch((err) => {});
      // this.$refs.rulesForm.validate((valid) => {
      //   if (valid) {
      //     this.submitParams.id = this.$route.query.id;
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
.pd {
  height: 100%;
  padding-top: 56px;
  background: RGB(249, 249, 249);
}
.title {
  background: #ffffff;
  font-size: 14px;
  padding: 10px 10px;
  color: #606266;
}
::v-deep .el-textarea__inner {
  border-left: none;
  border-right: none;
  border-radius: 0;
  border-top: none;
}
.tip {
  color: #909399;
  font-size: 12px;
  background: #ffffff;
  padding: 20px 10px;
}
// ::v-deep input {
//   border: none;
//   text-align: right;
// }
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
// .customer_name {
//   ::v-deep input {
//     border: none;
//     text-align: left;
//   }
// }
::v-deep .el-radio-group {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  width: 100%;
  margin-top: 8px;
  padding-right: 10px;
}
::v-deep .el-form-item__error {
  right: 15px;
  // text-align: right;
}
</style>
