<template>
  <div>
    <el-form
      class="selfForm"
      ref="rulesForm"
      :model="submitParams"
      label-width="100px"
      label-position="right"
      size="small"
      :rules="rules"
    >
      <el-form-item
        class="customer_name"
        label-width="0px"
        label=""
        prop="customerName"
      >
        <el-input
          type=""
          v-model="submitParams.contactName"
          placeholder="请输入联系人姓名"
        ></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item prop="relevancyClient" label="关联客户">
        <el-select
          style="width: 100%"
          v-model="submitParams.relevancyClient"
          placeholder="关联客户"
        >
          <el-option
            v-for="(item, index) in customerList"
            :key="index"
            :label="item.name"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="尊称：" prop="contactSex">
        <el-radio-group v-model="submitParams.sex">
          <el-radio label="0">保密</el-radio>
          <el-radio label="2">女士</el-radio>
          <el-radio label="1">先生</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label=" 角色：">
        <el-select
          style="width: 100%"
          v-model="submitParams.role"
          placeholder="请输入联系人角色"
        >
          <el-option
            v-for="(item, index) in customerRoleList"
            :key="index"
            :label="item.dictLabel"
            :value="item.dictValue"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="生日：">
        <!-- <el-date-picker
            style="width: 100%"
            v-model="submitParams.birthday"
            type="date"
            value-format="yyyy-MM-DD"
            placeholder="选择联系人生日"
          >
          </el-date-picker> -->
        <el-date-picker
          style="width: 100%"
          v-model="submitParams.birthday"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="选择联系人生日"
        >
        </el-date-picker>
      </el-form-item>
      <el-form-item label="部门职务">
        <el-input
          v-model="submitParams.deptRole"
          placeholder="请输入部门职务"
        ></el-input>
      </el-form-item>
      <div class="line"></div>
      <el-form-item prop="phone" label="手机号码">
        <el-input
          v-model="submitParams.phone"
          maxlength="11"
          placeholder="请输入手机号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="固定电话">
        <el-input
          v-model="submitParams.tel"
          placeholder="请输入固定电话"
        ></el-input>
      </el-form-item>
      <el-form-item label="传真号码">
        <el-input
          v-model="submitParams.faxNo"
          placeholder="请输入传真号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="电子邮箱">
        <el-input
          v-model="submitParams.email"
          placeholder="请输入电子邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item label="微信账号">
        <el-input
          v-model="submitParams.vx"
          placeholder="请输入微信账号"
        ></el-input>
      </el-form-item>
      <el-form-item label="QQ号码">
        <el-input
          v-model="submitParams.qq"
          placeholder="请输入QQ号码"
        ></el-input>
      </el-form-item>
      <el-form-item label="所在地区">
        <el-cascader
          style="width: 100%"
          v-model="submitParams.region"
          :options="areaList"
          :props="areaListprops"
          clearable
        ></el-cascader>
      </el-form-item>
      <el-form-item label="详细地址">
        <el-input
          v-model="submitParams.address"
          placeholder="请输入详细地址"
        ></el-input>
      </el-form-item>
      <el-form-item label="备注信息">
        <el-input
          v-model="submitParams.remark"
          placeholder="请输入备注信息"
        ></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {};
</script>

<style>
</style>