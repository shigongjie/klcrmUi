<template>
  <div class="container">
    <div class="title">在线充值</div>
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="220px"
      size="small"
      :rules="rules"
    >
      <!-- <el-form-item label="企业名称">
        <el-cascader
          :options="deptTree"
          :show-all-levels="false"
          filterable
          v-model="submitParams.pids"
          :props="{
            checkStrictly: true,
            children: 'list',
            label: 'name',
            value: 'id',
          }"
          clearable
          style="width: 100%"
        ></el-cascader>
      </el-form-item> -->

      <el-form-item label="充值金额">
        <div class="moneyWarp">
          <div
            class="money"
            :class="{ activeMoney: activeMoney == item }"
            @click="activeMoney = item"
            v-for="item in list"
            :key="item"
          >
            {{ item }}元
          </div>
          <div class="">
            <el-input
              @focus="focus"
              v-model="submitParams.rechargeAmount"
              placeholder="请输入10-2000整数"
            ></el-input>
          </div>
        </div>
      </el-form-item>

      <el-form-item label="实际支付金额">
        {{
          activeMoney == "" ? submitParams.rechargeAmount : activeMoney
        }}</el-form-item
      >

      <el-form-item prop="name" label="支付渠道">
        <div>
          <el-radio-group v-model="submitParams.radio">
            <el-radio label="1" border>
              <img class="" src="@/assets/images/zfb.png" alt="" />
              <span class="name">支付宝</span>
            </el-radio>
            <el-radio label="2" border>
              <img class="" src="@/assets/images/vx.png" alt="" />
              <span class="name">微信</span>
            </el-radio>
            <el-radio label="3" border>
              <img class="" src="@/assets/images/usage.png" alt="" />
              <span class="name">诚聊通</span>
            </el-radio>
          </el-radio-group>
        </div>
      </el-form-item>
      <el-form-item label="">
        <el-button style="width: 100%" type="primary" @click="recharge"
          >充值</el-button
        >
      </el-form-item>
    </el-form>
    <el-dialog
      style="margin-top: 200px"
      :visible.sync="dialogVisible"
      width="240px"
    >
      <el-image style="width: 200px" :src="src"></el-image>
    </el-dialog>
  </div>
</template>

<script>
import { addCharges } from "@/api/sms/package";
export default {
  data() {
    return {
      rules: {},
      src: "https://api.lkkjjt.com/qrcode/pcode?url=https://payh5.lkkjjt.com/index/cashier/KL202208041107000265/FF6C00?token=eedac487d2bc9cbb1ce263ee9956d521",
      dialogVisible: false,
      activeMoney: "",
      input: "",
      submitParams: {},
      deptTree: [],
      list: ["10", "30", "50", "100", "200", "300", "400", "500"],
    };
  },
  methods: {
    focus() {
      this.activeMoney = "";
    },
    recharge() {
      this.submitParams.rechargeAmount =
        this.activeMoney == ""
          ? this.submitParams.rechargeAmount
          : this.activeMoney;
      this.submitParams.payAmount = this.submitParams.rechargeAmount;
      this.submitParams.payWay = "1";
      addCharges(this.submitParams).then((res) => {
        // this.dialogVisible = true;
        if (res.success) {
          this.src = res.data;
          this.dialogVisible = true;
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  .selfForm {
    width: 900px;
  }
  .title {
    padding-bottom: 20px;
  }
  padding: 20px;
  img {
    width: 16px;
    height: 16px;
    position: absolute;
  }
  .name {
    padding-left: 20px;
  }
}
.moneyWarp {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .money {
    border: 1px solid #dcdfe6;
    border-radius: 4px;
    padding: 0 18px;
    margin-bottom: 18px;
    cursor: pointer;
  }
  .activeMoney {
    border-color: #1890ff;
    color: #1890ff;
  }
}
</style>