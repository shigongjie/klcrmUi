/**新建客户 */
<template></template>

<script>
import {
  getareaList,
} from "@/api/customer/index";
export default {
  data() {
    return {
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
      },
      deptList: [],
      industryList: [],
      customerStateList: [],
      customerStarList: [],
      customerSourceList: [],
      customerRoleList: [],
      remindTypeList: [],
      remindTimelist: [],
      customerScaleList: [],
      companyTypeList: [],
      worktaskmanagerList: [],
    };
  },
  beforeMount() {
    getareaList().then((res) => {
      this.areaList = res.data;
    });
    this.getDicts("company_type").then((res) => {
      this.companyTypeList = res.data;
    });
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
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
    /**企业规模 */
    this.getDicts("company_scale").then((res) => {
      this.customerScaleList = res.data;
    });
    /**联系人角色 */
    this.getDicts("contact_role").then((res) => {
      this.customerRoleList = res.data;
    });
    /**任务提醒方式 */
    this.getDicts("remind_time").then((res) => {
      this.remindTimelist = res.data;
    });
    /**提醒类型 */
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });
    /**提醒类型 */
    this.getDicts("work_task_manager_type").then((res) => {
      this.worktaskmanagerList = res.data;
    });
  },
  methods: {},
};
</script>

<style lang='scss' scoped>
.el-select {
  width: 100%;
}
.selfFrom {
  .el-form-item__label {
    font-weight: 400 !important;
  }
}
.formDiv {
  width: 50%;
  padding: 0 20px;
}
.titleself {
  font-weight: 600;
  padding: 10px;
  height: 5px;
  font-size: 16px;
  line-height: 3px;
  border-left: 4px solid #3394fe;
  margin-bottom: 20px;
  //   margin-left: -10px;
}
</style>
