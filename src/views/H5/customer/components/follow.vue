<template>
  <div class="container">
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <!-- <span @click="jumpGo">取消</span> -->
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">添加跟进</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div
      class="pd"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 90px;' : ''"
    >
      <div class="line"></div>
      <van-form ref="rulesForm" @submit="submit">
        <VantSelect
          label="到访："
          placeholder="请选择"
          v-model="submitParams.recordEntity.followWay"
          :columns="followWayList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择到访类型' }]"
        />

        <van-cell
          title="日期"
          :value="submitParams.recordEntity.time"
          @click="show = true"
        />
        <van-calendar
          placeholder="请选择日期"
          v-model="show"
          @confirm="onConfirm"
        />

        <van-field
          v-model="submitParams.recordEntity.description"
          rows="2"
          autosize
          maxlength="50"
          label=""
          type="textarea"
          show-word-limit
          placeholder="勤跟进，多签单"
        />

        <VantSelect
          label="客户名称"
          placeholder="请选择客户"
          v-model="submitParams.recordEntity.customerId"
          :columns="customerList"
          :option="{ label: 'name', value: 'id' }"
          required
          :rules="[{ required: true, message: '请选择客户' }]"
        />

        <VantSelect
          v-if="$route.query.type == 1"
          label="客户状态"
          placeholder="请选择客户状态"
          v-model="submitParams.recordEntity.state"
          :columns="customerStateList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择客户状态' }]"
        />

        <VantSelect
          v-if="$route.query.type == 2"
          label="线索状态"
          placeholder="请选择线索状态"
          v-model="submitParams.recordEntity.state"
          :columns="sourceSatusList"
          :option="{ label: 'dictLabel', value: 'dictValue' }"
          required
          :rules="[{ required: true, message: '请选择线索状态' }]"
        />

        <VantSelect
          label="联系人"
          placeholder="点击选择联系人"
          v-model="submitParams.recordEntity.contactId"
          :columns="contantList"
          :option="{ label: 'contactName', value: 'id' }"
          required
          :rules="[{ required: true, message: '请选择联系人' }]"
        />

        <!-- <van-field
          readonly
          clickable
          name="area"
          :value="submitParams.recordEntity.contactIdJson"
          label="联系人"
          placeholder="点击选择联系人"
          @click="showUserId = true"
          required
          :rules="[{ required: true, message: '请选择客户来源' }]"
        />
        <van-popup v-model="showUserId" position="bottom">
          <van-cascader
            v-model="submitParams.recordEntity.contactId"
            title="请选择联系人"
            :options="userList"
            active-color="#2a81fc"
            @close="showUserId = false"
            :field-names="{ text: 'name', value: 'id', children: 'list' }"
            @finish="onFinishUserId"
          />
        </van-popup> -->

        <van-field
          readonly
          clickable
          name="area"
          :value="submitParams.recordEntity.remindUserJson"
          label="提醒谁看"
          placeholder="点击选择人员"
          @click="showMindUserId = true"
          required
          :rules="[{ required: true, message: '请选择客户来源' }]"
        />
        <van-popup v-model="showMindUserId" position="bottom">
          <van-cascader
            v-model="submitParams.recordEntity.remindUserIds"
            title="请选择人员"
            :options="userList"
            active-color="#2a81fc"
            @close="showMindUserId = false"
            :field-names="{ text: 'name', value: 'id', children: 'list' }"
            @finish="onFinishMindUserId"
          />
        </van-popup>
        <div style="margin: 10px; font-size: 15px">
          <van-checkbox v-model="checked" shape="square"
            >是否创建下次跟进</van-checkbox
          >
        </div>
        <div v-if="checked">
          <van-cell
            title="跟进时间"
            :value="submitParams.taskEntity.time"
            @click="show2 = true"
          />
          <van-calendar v-model="show2" @confirm="onConfirm2" />

          <van-field
            v-model="submitParams.taskEntity.content"
            :rows="5"
            autosize
            label="跟进内容"
            type="textarea"
            placeholder="勤跟进，多签单"
          />

          <van-field
            readonly
            clickable
            name="area"
            :value="submitParams.taskEntity.userIdJson"
            label="跟进人员"
            placeholder="点击选择联系人"
            @click="showNextFollowUserId = true"
            required
            :rules="[{ required: true, message: '请选择客户来源' }]"
          />
          <van-popup v-model="showNextFollowUserId" position="bottom">
            <van-cascader
              v-model="submitParams.taskEntity.userId"
              title="请选择归属人员"
              :options="userList"
              active-color="#2a81fc"
              @close="showNextFollowUserId = false"
              :field-names="{ text: 'name', value: 'id', children: 'list' }"
              @finish="onFinishNextFollowUserId"
            />
          </van-popup>

          <VantSelect
            label="跟进提醒"
            placeholder="请选择跟进提醒"
            v-model="submitParams.taskEntity.remindTime"
            :columns="worktaskmanagerList"
            :option="{ label: 'dictLabel', value: 'dictValue' }"
            required
            :rules="[{ required: true, message: '请选择跟进提醒' }]"
          />

          <van-field
            name="radio"
            label="提醒方式"
            required
            :rules="[{ required: true, message: '请选择客户类型' }]"
          >
            <template #input>
              <van-radio-group
                v-model="submitParams.taskEntity.remindType"
                direction="horizontal"
              >
                <van-radio
                  v-for="(item, index) in remindTypeList"
                  :name="item.dictValue"
                  :key="index"
                  style="margin-bottom: 15px"
                  >{{ item.dictLabel }}</van-radio
                >
              </van-radio-group>
            </template>
          </van-field>
        </div>
      </van-form>
    </div>
  </div>
</template>

<script>
import {
  getcustomerList,
  savefollowUp,
  getxsList,
  getcontactList,
  subordinateList,
  detailForEdit,
} from "@/api/customer/index";
export default {
  dicts: ["follow_way", "sys_job_status"],
  data() {
    return {
      showNextFollowUserId: false,
      date: "",
      fieldNames: {
        text: "name",
        value: "id",
        children: "list",
      },
      showUserId: false,
      showMindUserId: false,
      fieldValue: "",
      cascaderValue: "120101",
      show: false,
      show2: false,
      checked: false,
      choosedUser: "",
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      userList: [],
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
        userId: "",
        recordEntity: {},
        taskEntity: {},
      },
      customerList: [],
      followWayList: [],
      customerStateList: [],
      remindTypeList: [],
      worktaskmanagerList: [],
      deptList: [],
      sourceSatusList: [],
      contantList: [],
    };
  },
  beforeMount() {
    // 线索状态
    this.getDicts("market_source_status").then((res) => {
      this.sourceSatusList = res.data;
    });
    this.getDicts("follow_way").then((res) => {
      this.followWayList = res.data;
    });
    /**提醒类型 */
    this.getDicts("remind_type").then((res) => {
      this.remindTypeList = res.data;
    });

    this.getDicts("work_task_manager_type").then((res) => {
      this.worktaskmanagerList = res.data;
    });

    this.getDicts("customer_state").then((res) => {
      this.customerStateList = res.data;
    });
    /**部门*/
    this.getDicts("dept_type").then((res) => {
      this.deptList = res.data;
    });
    this.getDicts("education_type").then((res) => {
      this.educationList = res.data;
    });
    this.getcustomerList();
    getcontactList({ customerId: this.$route.query.id }).then((res) => {
      this.contantList = res.rows;
    });
    subordinateList().then((res) => {
      this.userList = res.data;
    });
  },
  mounted() {
    this.submitParams.recordEntity.customerId = this.$route.query.id;
    this.submitParams.recordEntity.contactId = this.$route.query.contantId;
    console.log(this.submitParams)
  },
  methods: {
    getcustomerList() {
      getcustomerList({ type: 1 }).then((res) => {
        this.customerList = res.data;
      });
    },
    formatDate(date) {
      console.log(date);
      return (
        `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}` +
        " 00:00:00"
      );
    },
    onConfirm(date) {
      this.show = false;
      this.submitParams.recordEntity.time = this.formatDate(date);
    },
    onConfirm2(date) {
      this.show2 = false;
      this.submitParams.taskEntity.time = this.formatDate(date);
    },

    onFinishUserId(value, index, o) {
      this.submitParams.recordEntity.contactIdJson =
        value.selectedOptions[value.tabIndex].name;
      this.submitParams.userId = value.value;
      this.showUserId = false;
    },

    onFinishMindUserId(value, index, o) {
      this.submitParams.recordEntity.remindUserJson =
        value.selectedOptions[value.tabIndex].name;
      this.submitParams.remindUserIds = value.value;
      this.showMindUserId = false;
    },
    onFinishNextFollowUserId(value, index, o) {
      this.submitParams.taskEntity.userIdJson =
        value.selectedOptions[value.tabIndex].name;
      this.submitParams.taskEntity.userId = value.value;
      this.showNextFollowUserId = false;
    },

    getTreeNode(list, id) {
      console.log(list, id);
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

    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      console.log(this.submitParams);
      this.$refs.rulesForm
        .validate()
        .then((val) => {
          if (!this.checked) {
            this.submitParams.taskEntity = null;
          }
          savefollowUp(this.submitParams).then((res) => {
            this.$toast("添加成功");
            this.$router.go(-1)
            // this.$router.push({
            //   path: "/customerDetailh5",
            //   query: {
            //     id: this.$route.query.id,
            //   },
            // });
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