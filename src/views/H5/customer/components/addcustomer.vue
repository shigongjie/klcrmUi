<template>
  <div class="container">
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <!-- <span @click="jumpGo">取消</span> -->
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{  id ? "编辑客户" : "创建客户"  }}</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div class="pd" :style="$store.state.user.isApp == 2 ? 'padding-top: 90px;' : ''">
      <div class="line"></div>
      <van-form ref="rulesForm" @submit="submit">
        <van-field v-model="submitParams.name" name="name" required label="客户名称" placeholder="请输入客户名称"
          :rules="[{ required: true, message: '请输入客户名称' }]" />
        <div class="titleh5">基础信息</div>
        <van-field v-model="submitParams.shortName" name="助记名称" label="助记名称" placeholder="请输入助记名称" />
        <VantSelect label="所属行业" placeholder="请选择" v-model="submitParams.industry" :columns="industryList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" required
          :rules="[{ required: true, message: '请选择所属行业' }]" />

        <van-field name="radio" label="客户类型" required :rules="[{ required: true, message: '请选择客户类型' }]">
          <template #input>
            <van-radio-group v-model="submitParams.type" direction="horizontal">
              <van-radio name="0">企业客户</van-radio>
              <van-radio name="1">个人客户</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <VantSelect label="客户状态" placeholder="请选择客户状态" v-model="submitParams.state" :columns="customerStateList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" required
          :rules="[{ required: true, message: '请选择客户状态' }]" />

        <VantSelect label="客户星级" placeholder="请选择客户星级" v-model="submitParams.star" :columns="customerStarList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" required
          :rules="[{ required: true, message: '请选择客户星级' }]" />

        <VantSelect label="客户来源" placeholder="请选择客户来源" v-model="submitParams.source" :columns="customerSourceList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" required
          :rules="[{ required: true, message: '请选择客户来源' }]" />

        <!-- <VantCascader
          label="归属人员"
          placeholder="请选择归属人员"
          :resultLabelprop="submitParams.userIdJson"
          v-model="submitParams.userId"
          :columns="userList"
          @confirm="onFinishUserId"
        /> -->
        <van-field readonly clickable name="area" :value="submitParams.userJson" label="归属人员" placeholder="点击选择归属人员"
          @click="showUserId = true" required :rules="[{ required: true, message: '请选择客户来源' }]" />
        <van-popup v-model="showUserId" position="bottom">
          <van-cascader v-model="submitParams.userId" title="请选择归属人员" :options="userList" active-color="#2a81fc"
            @close="showUserId = false" :field-names="{ text: 'name', value: 'id', children: 'list' }"
            @finish="onFinishUserId" />
        </van-popup>

        <div class="titleh5">附加信息</div>

        <VantCascader label="所在地区" placeholder="请选择所在地区" v-model="submitParams.address" required :columns="areaList"
          :option="{ text: 'name', value: 'id', children: 'list' }" :resultLabelprop="submitParams.pcdJson"
          @confirm="onFinish" />
        <!-- <van-field
          readonly
          clickable
          name="area"
          :value="submitParams.pcdJson"
          label="地区选择"
          placeholder="点击选择省市区"
          @click="showArea = true"
        />
        <van-popup v-model="showArea" position="bottom">
          <van-cascader
            v-model="submitParams.address"
            title="请选择所在地区"
            :options="areaList"
            :field-names="fieldNames"
            @finish="onFinish"
          />
        </van-popup> -->

        <van-field v-model="submitParams.detailAddress" name="详细地址" label="详细地址" placeholder="请输入详细地址" />

        <VantSelect label="企业规模" placeholder="请选择企业规模" v-model="submitParams.scale" :columns="customerScaleList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" />

        <VantSelect label="上级客户" placeholder="请选择上级客户" v-model="submitParams.parentCustomerId" :columns="customerList"
          :option="{ label: 'name', value: 'id' }" />

        <van-field v-model="submitParams.remark" name="备注信息" label="备注信息" placeholder="请输入备注信息" />

        <div class="titleh5">首要联系人</div>

        <van-field v-model="submitParams.contactEntity.contactName" name="联系人姓名" label="联系人姓名" placeholder="请输入联系人姓名"
          required :rules="[{ required: true, message: '请输入联系人姓名' }]" />

        <van-field name="radio" label="尊称">
          <template #input>
            <van-radio-group v-model="submitParams.contactEntity.sex" direction="horizontal">
              <van-radio name="2">未知</van-radio>
              <van-radio name="1">女士</van-radio>
              <van-radio name="0">先生</van-radio>
            </van-radio-group>
          </template>
        </van-field>

        <VantSelect label="角色" placeholder="请选择角色" v-model="submitParams.contactEntity.role" :columns="customerRoleList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" />

        <van-field v-model="submitParams.contactEntity.deptRole" name="职务部门" label="职务部门" placeholder="请输入职务部门" />

        <van-field v-model="submitParams.contactEntity.phone" name="手机号码" label="手机号码" placeholder="请输入手机号码" type="tel"
          maxlength="11" required :rules="[{ required: true, message: '请输入联系人手机号码' }]" />
        <VantCascader label="所在地区" placeholder="请选择所在地区" v-model="submitParams.contactEntity.pcdJson"
          :columns="areaList" :option="{ text: 'name', value: 'id', children: 'list' }"
          :resultLabelprop="submitParams.contactEntity.region" required @confirm="onFinish2" />
        <van-field v-model="submitParams.contactEntity.tel" name="固定电话" label="固定电话" placeholder="请输入固定电话" />

        <van-field v-model="submitParams.contactEntity.faxNo" name="传真号码" label="传真号码" placeholder="请输入传真号码" />

        <van-field v-model="submitParams.contactEntity.email" name="电子邮箱" label="电子邮箱" placeholder="请输入电子邮箱" />

        <van-field v-model="submitParams.contactEntity.vx" name="微信账号" label="微信账号" placeholder="请输入微信账号" />

        <van-field v-model="submitParams.contactEntity.qq" name="QQ号码" label="QQ号码" placeholder="请输入QQ号码" />

        <van-field v-model="submitParams.contactEntity.address" name="详细地址" label="详细地址" placeholder="请输入详细地址" />

        <van-field v-model="submitParams.contactEntity.remark" name="备注信息" label="备注信息" placeholder="请输入备注信息" />
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
import Dict from "@/components/dict/dict.vue";

export default {
  mixins: [Dict],
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
    onFinishUserId(value, index, o) {
      this.submitParams.userJson = value.selectedOptions[value.tabIndex].name;
      this.submitParams.userId = value.value;
      this.showUserId = false;
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
    onFinish(value, index, o) {
      // this.show = false;
      this.submitParams.pcdJson = value.selectedOptions
        .map((option) => option.name)
        .join("/");
      this.submitParams.address = value.selectedOptions
        .map((option) => option.id)
        .join(",");
      this.showArea = false;
    },
    getTreeNode(list, id) {
      let label = "";
      function getName(a, b) {
        a.forEach((item, index) => {
          if (item.id == b) {
            label = item.name;
          } else {
            if (item.list) {
              getName(item.list, b);
            }
          }
        });
        return label;
      }

      return getName(list, id);
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
          getstaffList().then((res) => {
            this.userList = res.data;
            this.submitParams.userJson = this.getTreeNode(
              this.userList,
              this.submitParams.userId
            );
          });
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
            this.submitParams.contactEntity.region != undefined &&
            this.submitParams.contactEntity.region != ""
          ) {
            this.submitParams.contactEntity.region =
              this.submitParams.contactEntity.region.toString();
          }
          if (
            this.submitParams.address != undefined &&
            this.submitParams.address != ""
          ) {
            this.submitParams.address = this.submitParams.address.toString();
          }
          if (this.id != "") {
            this.submitParams.id = this.id;
          }
          if (!this.checked) {
            this.submitParams.taskEntity = null;
          }
          customersave(this.submitParams).then((res) => {
            if (this.id) {
              this.$router.push({
                path: "/customerh5",
              });
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$router.push({
                path: "/customerh5",
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

      // } else {
      //   return false;
      // }
      // });
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
    font-weight: bold;
    color: #323232;
}

.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: top;
}

.pd {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
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