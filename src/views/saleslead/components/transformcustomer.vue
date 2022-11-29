<template>
  <div v-if="open">
    <el-dialog :title="'转为客户'" :visible.sync="open" width="60%">
      <el-form class="selfForm" ref="rulesForm" :model="submitParams" label-width="130px" size="small" :rules="rules">
        <el-form-item label="客户名称" prop="name">
          <el-input v-model="submitParams.name" placeholder="请输入客户名称"></el-input>
        </el-form-item>
        <el-form-item label="统一社会信用代码" prop="social_code">
          <el-input v-model="submitParams.regNo" placeholder="请输入手机号码"></el-input>
        </el-form-item>

        <el-form-item label="客户类型" prop="company_type">
          <el-select v-model="submitParams.companyType" placeholder="客户类型">
            <el-option v-for="dict in dict.type.customer_type" :key="dict.dictCode" :label="dict.label"
              :value="dict.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属行业" prop="industry">
          <el-select v-model="submitParams.industry" placeholder="所属行业">
            <el-option v-for="(item, index) in industryList" :key="index" :label="item.dictLabel"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="经营状态" prop="openStatus">
          <el-select v-model="submitParams.openStatus" placeholder="经营状态">
            <el-option v-for="dict in dict.type.company_manage_status" :key="dict.dictCode" :label="dict.label"
              :value="dict.label"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法定代表人" prop="legalPerson">
          <el-input v-model="submitParams.legalPerson" placeholder="请输入法定代表人"></el-input>
        </el-form-item>
        <el-form-item label="企业电话" prop="phone">
          <el-input v-model="submitParams.phone" placeholder="请输入企业电话"></el-input>
        </el-form-item>
        <el-form-item label="客户星级" prop="star">
          <el-select v-model="submitParams.star" placeholder="客户星级">
            <el-option v-for="(item, index) in customerStarList" :key="index" :label="item.dictLabel"
              :value="item.dictValue"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="userId" label="归属人员">
          <el-cascader style="width: 100%" v-model="submitParams.userId" :options="userList" :show-all-levels="false"
            :props="props" clearable></el-cascader>
        </el-form-item>

        <el-form-item prop="contactName" label="联系人">
          <el-input v-model="submitParams.contactName" placeholder="请输入联系人"></el-input>
          <!-- <el-select v-model="submitParams.contactId" placeholder="联系人">
          <el-option
            v-for="(item, index) in contantList"
            :key="index"
            :label="item.contactName"
            :value="item.id"
          ></el-option>
        </el-select> -->
        </el-form-item>
        <el-form-item label="手机号码" prop="contactPhone">
          <el-input v-model="submitParams.contactPhone" placeholder="请输入手机号码"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="open = false">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>
  </div>

</template>

<script>
import { getMarketClueDetailById, changeClients } from "@/api/saleslead/index";
import { getstaffList } from "@/api/customer/index";
export default {
  dicts: ["company_manage_status", "company_cash", "customer_type"],
  props: {
    id: {},
  },
  data() {
    return {
      open: false,
      industryList: [], //行业
      customerStateList: [], //客户状态
      customerStarList: [], //客户星级
      contantList: [], //联系人列表
      submitParams: {
        userId: "",
      },
      userList: [],
      rules: {
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
        contactName: [
          { required: true, message: "请选择联系人", trigger: "change" },
        ],
        contactPhone: [
          { required: true, message: "请输入手机号", trigger: "blur" },
        ],
      },
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
  watch: {
    open(val) {
      if (val) {
        getMarketClueDetailById({ id: this.id.toString() }).then((res) => {
          if (res.data.contactName) {
            this.$set(this.submitParams, "contactName", res.data.contactName);
          }
          if (res.data.customerName) {
            this.$set(this.submitParams, "name", res.data.customerName);
          }
          this.$set(this.submitParams, "contactPhone", res.data.phone);
          if (this.$store.state.user.userId) {
            this.$set(
              this.submitParams,
              "userId",
              this.$store.state.user.userId
            );
            // this.submitParams.userId = this.$store.state.user.userId;
          }
        });
      } else {
        this.submitParams = this.$options.data().submitParams;
      }
    },
  },
  mounted() {
    // getMarketClueDetailById({ id: this.id }).then((res) => {
    // });
  },
  methods: {
    submit() {
      this.$refs.rulesForm.validate((valid) => {
        if (valid) {
          this.submitParams.id = this.id.toString();
          changeClients(this.submitParams).then((res) => {
            this.open = false;
            this.$message({
              type: "success",
              message: "转移成功!",
            });
            this.$emit("reload");
          });
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.el-select {
  width: 100%;
}
</style>