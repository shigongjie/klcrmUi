<template>
  <div class="h5-container">
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''">
      <span @click="jumpGo">取消</span>
      <span class="editReport">{{ id ? "编辑" : "新建" }}工作报告</span>
      <span @click="submit" style="color:#2B82FC">保存</span>
    </div>
    <div class="pd" :style="$store.state.user.isApp == 2 ? 'padding-top: 96px;' : ''">
      <div class="line"></div>
      <van-form @submit="submit">
        <VantSelect label="报告类型：" placeholder="请选择报告类型：" v-model="ruleForm.reportType" :columns="reportTypeArr"
          @confirm="changeReportType" :option="{ label: 'dictLabel', value: 'dictValue' }" />
        <!-- 工作日报 -->
        <div v-if="ruleForm.reportType == 0">
          <van-cell title="报告日期" :value="timeRange" @click="show = true" />
          <van-calendar v-model="show" :min-date="minDate" :max-date="maxDate" @confirm="onConfirm"
            :default-date="currentDate" />
        </div>
        <!-- 工作周报 -->
        <div v-else-if="ruleForm.reportType == 1">
          <van-cell title="报告日期" :value="timeRange" @click="show = true" />
          <van-calendar :min-date="minDate" :max-date="maxDate" v-model="show" type="range" :default-date="currentDate"
            @confirm="onConfirmDataRange" :max-range="7" />
        </div>
        <!-- 工作月报 -->
        <div v-if="ruleForm.reportType == 2">
          <van-cell title="报告日期" :value="mounthTime" @click="show = true" />
          <van-popup v-model="show" position="bottom">
            <van-datetime-picker v-model="ruleForm.startTime" type="year-month" title="选择年月" :min-date="minDate"
              :max-date="maxDate" :formatter="formatter" @confirm="onConfirmMounth" />
          </van-popup>
        </div>

        <!-- 工作季报 -->
        <div v-else-if="
          ruleForm.reportType == 3 ||
          ruleForm.reportType == 4 ||
          ruleForm.reportType == 5
        ">
          <van-cell title="报告日期" :value="timeRange" @click="show = true" />
          <van-calendar :min-date="minDate" :max-date="maxDate" v-model="show" type="range"
            @confirm="onConfirmDataRange" />
        </div>

        <van-field v-model="ruleForm.summarize" rows="6" autosize label="工作总结" type="textarea" maxlength="1000"
          placeholder="请输入工作总结" show-word-limit />

        <van-field v-if="ruleForm.reportType != 0" v-model="ruleForm.workPlan" rows="6" autosize label="工作计划"
          type="textarea" maxlength="1000" placeholder="请输入工作计划" show-word-limit />
        <div class="imageWarp">
          <van-cell title="上传图片" />
          <van-uploader v-model="fileList" multiple :max-count="3" :after-read="afterRead" @delete="removePic" />
        </div>

        <van-field readonly clickable name="area" :value="ruleForm.userJson" label="批阅人员" placeholder="点击选择批阅人员"
          @click="showUserId = true" />
        <van-popup v-model="showUserId" position="bottom">
          <van-cascader v-model="ruleForm.readId" title="请选择批阅人员" :options="userList" @close="showUserId = false"
            :field-names="{ text: 'name', value: 'id', children: 'list' }" @finish="onFinishUserId" />
        </van-popup>
        <!-- 抄送人员 -->
        <van-field readonly clickable name="area" :value="copyIdJson" label="抄送人员" placeholder="点击选择抄送人员"
          @click="showcopyId = true" />
        <van-popup v-model="showcopyId" position="bottom">
          <div class="btnWarp">
            <span @click="showcopyId = false">取消</span>
            <span @click="sureCopyId">确定</span>
          </div>
          <van-tree-select :items="copyUserList" :active-id.sync="activeIds" :main-active-index.sync="activeIndex" />
        </van-popup>
      </van-form>
    </div>
  </div>
</template>

<script>
import { getstaffList } from "@/api/customer/index";
import { commonselectList } from "@/api/customer/index";
import { uploadFile } from "@/api/common/index";
import {
  saveSchedule,
  scheduleSchedule,
  savereport,
} from "@/api/officeManagement";
import {
  particularsData,
  addComment,
  workreportAlter,
  detailRremove,
} from "@/api/officeManagement";
import { getToken } from "@/utils/auth";
export default {
  data() {
    let _minTime = null;
    let _maxTime = null;
    return {
      imageArr: [],
      fileList: [],
      activeIds: [],
      copyIdJson: "",
      activeIndex: 0,
      timeRange: "", //周报日期
      mounthTime: "", //月报日期
      show: false,
      showcopyId: false,
      showUserId: false,
      minDate: new Date(2022, 0, 1),
      maxDate: new Date(2025, 0, 31),
      // maxDates: new Date(new Date().valueOf() + 24 * 60 * 60 * 1000),
      currentDate: new Date(),
      weeklyForbidden: {
        onPick(time) {
          // 如果选择了只选择了一个时间
          if (!time.maxDate) {
            let timeRange = 6 * 24 * 60 * 60 * 1000; // 7天
            _minTime = time.minDate.getTime(); // 最小时间
            _maxTime = time.minDate.getTime() + timeRange; // 最大时间
            // 如果选了两个时间，那就清空本次范围判断数据，以备重选
          } else {
            _minTime = _maxTime = null;
          }
        },
        disabledDate(time) {
          // onPick后触发
          // 返回false表示该日期禁选
          if (_minTime && _maxTime) {
            return time.getTime() < _minTime || time.getTime() > _maxTime;
          }
        },
      },
      workForbidden: {
        disabledDate(time) {
          let timeRange = 24 * 60 * 60 * 1000;
          return (
            time.getTime() < Date.now() - timeRange ||
            time.getTime() > Date.now()
          );
        },
      },
      typeId: "",
      timer: true,
      propsmult: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
        multiple: true,
      },
      propsCascader: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      userList: [],
      flag: false,
      uploadUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload",
      headers: {
        Authorization: getToken(),
      },
      options: [],
      reportTypeArr: [],
      ruleForm: {
        reportType: 0,
        workPlan: "",
        image: [],
        startTime: "",
      },
      reportObj: {},
      imageArr: [],
      copyUserList: [],
      rules: {
        reportType: [
          { required: true, message: "请选择报告类型", trigger: "change" },
        ],
        summarize: [
          { required: true, message: "请输入工作总结", trigger: "blur" },
        ],
        workPlan: [
          { required: true, message: "请输入工作计划", trigger: "blur" },
        ],
        readId: [
          { required: true, message: "请选择批阅人", trigger: "change" },
        ],
        startTime: [
          { required: true, message: "请选择时间", trigger: "change" },
        ],
      },
    };
  },
  beforeMount() {
    this.id = this.$route.query.id;
    this.typeId = this.$route.query.typeId;
    this.ruleForm.reportType = this.$route.query.reportObj;
    this.getDicts("report_type").then((res) => {
      // console.log('111111110',res.data);
      this.reportTypeArr = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
      console.log('this.userList', this.userList);
      this.copyUserList = this.a2b(res.data);
      console.log('this.copyUserList',this.copyUserList);
    });
  },
  computed: {
    dateType() {
      if (this.ruleForm.reportType == 0) {
        return "date";
      } else if (this.ruleForm.reportType == 1) {
        return "daterange";
      } else if (this.ruleForm.reportType == 2) {
        return "month";
      } else if (this.ruleForm.reportType >= 3) {
        return "monthrange";
      }
    },
    dateWidth() {
      return this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2
        ? "49%"
        : "59%";
    },
    dateSymbol() {
      return this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2
        ? ""
        : "~";
    },
    dateStart() {
      return this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2
        ? ""
        : "开始日期";
    },
    dateEnd() {
      return this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2
        ? ""
        : "结束日期";
    },
    datePicker() {
      if (this.ruleForm.reportType == 1) {
        return this.weeklyForbidden;
      } else if (this.ruleForm.reportType == 2) {
        return this.workForbidden;
      } else {
        return "";
      }
    },
    fileComputed() {
      return this.ruleForm.image.length >= 3;
    },
    reportTitle() {
      return this.typeId === 1 ? "写" : "编辑";
    },
  },
  watch: {
    reportObj: {
      immediate: true,
      handler(obj) {
        this.flagReportType(obj);
      },
    },
  },
  mounted() {
    this.isEdit();
  },
  methods: {
    changeReportType(val, ob) {
      console.log(val, ob);
      this.timeRange = "";
      this.mounthTime = "";
    },
    getCopyIdJson(a) {
      // a选中的id数组，b tree数据
      let label = [];
      a.forEach((item) => {
        if (this.deepQuery(this.copyUserList, item)) {
          label.push(this.deepQuery(this.copyUserList, item).text);
        }
      });
      this.copyIdJson = label.toString();
    },
    sureCopyId() {
      this.getCopyIdJson(this.activeIds);
      this.showcopyId = false;
    },
    deepQuery(tree, id) {
      var isGet = false;
      var retNode = null;
      function deepSearch(tree, id) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].children && tree[i].children.length > 0) {
            deepSearch(tree[i].children, id);
          }
          if (id === tree[i].id || isGet) {
            isGet || (retNode = tree[i]);
            isGet = true;
            break;
          }
        }
      }
      deepSearch(tree, id);
      return retNode;
    },
    // userlist转换key
    a2b(ls) {
      return ls.map((obj) => {
        let result = { id: "", text: "" };
        if (obj.list && obj.list.length > 0) {
          result.id = obj.id;
          result.text = obj.name;
          result.className = "my-class";
          result.children = this.a2b(obj.list);
          return result;
        } else {
          result.id = obj.id;
          result.text = obj.name;
          result.className = "my-class";
          return result;
        }
      });
    },
    onFinishUserId(value) {
      this.ruleForm.userJson = value.selectedOptions[value.tabIndex].name;
      this.ruleForm.readId = value.value;
      this.showUserId = false;
    },
    removePic(file) {
      this.imageArr = this.imageArr.filter((item) => {
        if (item.file) {
          return item.file != file;
        } else {
          return item.url != file.url;
        }
      });
    },
    afterRead(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      uploadFile(formData).then((res) => {
        this.imageArr.push({ url: res.data, file: file });
        this.ruleForm.image.push({ name: "tupian", url: res.data });
      });
    },
    formatter(type, val) {
      if (type === "year") {
        return `${val}年`;
      } else if (type === "month") {
        return `${val}月`;
      }
      return val;
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },

    onConfirmDataRange(val) {
      this.ruleForm.startTime = this.formatDate(val[0]);
      this.ruleForm.endTime = this.formatDate(val[1]);
      this.timeRange =
        this.formatDate(val[0]) + " ~ " + this.formatDate(val[1]);
      this.show = false;
    },
    onConfirm(value) {
      this.show = false;
      this.ruleForm.startTime = this.formatDate(value);
      this.timeRange = this.formatDate(value);
    },
    onConfirmMounth(val) {
      this.show = false;
      console.log(this.formatDate(val));
      this.ruleForm.startTime = this.formatDate(val);
      this.mounthTime = this.formatDate(val);
    },
    inputTime(val) {
      this.$forceUpdate();
    },
    flagReportType(obj) {
      if (this.typeId === 1 && obj.dictValue) {
        this.ruleForm.reportType = obj.dictValue;
      } else if (this.typeId === 2) {
        this.getRuleFormData(obj);
      }
    },
    handleAvatarSuccess(res, file, fileList) {
      this.imageArr.push(res.data);
      this.ruleForm.image.push({ name: "tupian", url: res.data });
    },
    handleExceed(files, fileList) {
      this.$message.warning(
        `上传图片限制选择 3 个文件，本次一共选择了 ${fileList.length} 个文件`
      );
    },
    handleRemove(file, fileList) {
      this.ruleForm.image = this.ruleForm.image.filter((item) => {
        return item.uid !== file.uid;
      });
    },
    changeState() {
      this.timer = false;
      this.ruleForm.startTime = "";
      this.$nextTick(() => {
        this.timer = true;
      });
    },
    chooseRemind(ob) {
      this.chooseRemindValue = ob;
    },
    changeBussiness(val) {
      commonselectList({ type: val }).then((res) => {
        this.bussinessTypeList = res.data;
      });
    },
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        workreportAlter({ id: this.id }).then((res) => {
          console.log(6666, res);
          this.ruleForm = res.data;
          this.activeIds = res.data.copyId.split(",");
          if (this.ruleForm.reportType == 0 || this.ruleForm.reportType == 1) {
            this.timeRange = this.ruleForm.startTime;
          } else {
            this.mounthTime = this.ruleForm.startTime;
          }
          res.data.image.split(",").forEach((item) => {
            this.fileList.push({ name: "tupian", url: item });
            this.imageArr.push({ name: "tupian", url: item });
          });
        });
        particularsData({ id: this.id }).then((res) => {
          this.copyIdJson = res.data.copyId;
          this.ruleForm.userJson = res.data.readId;
          console.log(this.ruleForm);
        });
      }
    },
    changeUser() { },
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      console.log(this.ruleForm);
      let copyId;
      if (this.activeIds.length > 0) {
        copyId = this.activeIds.toString();
      }
      var data = {
        copyId: copyId,
        id: this.ruleForm.id,
        summarize: this.ruleForm.summarize,
        readId: this.ruleForm.readId,
        workPlan: this.ruleForm.workPlan,
        reportType: this.ruleForm.reportType,
      };
      if (this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2) {
        data.startTime = this.ruleForm.startTime;
        data.endTime = this.ruleForm.startTime;
      } else {
        data.startTime = this.ruleForm.startTime;
        data.endTime = this.ruleForm.endTime;
      }
      if (this.imageArr) {
        data.image = [];
        this.imageArr.forEach((item) => {
          data.image.push(item.url);
        });
        data.image = data.image.toString();
      }
      savereport(data).then((res) => {
        if (this.ruleForm.id) {
          this.$message.success("编辑成功");
        } else {
          this.$message.success("新增成功");
        }
        console.log(res);
        this.$router.push({
          path: "/workreporth5",
        });
      });
      console.log(data);
      return;
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let copyId;
          if (this.ruleForm.copyId && this.ruleForm.copyId.length > 0) {
            copyId = this.ruleForm.copyId.toString();
          } else {
            copyId = null;
          }
          var data = {
            // copyId:
            //   this.ruleForm.copyId == "" || this.ruleForm.copyId == null
            //     ? this.ruleForm.copyId
            //     : this.ruleForm.copyId.length == 0
            //     ? ""
            //     : this.ruleForm.copyId.toString(),
            copyId: copyId,
            id: this.ruleForm.id,
            summarize: this.ruleForm.summarize,
            founderId: this.ruleForm.founderId,
            readId: this.ruleForm.readId,
            workPlan: this.ruleForm.workPlan,
          };
          if (this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2) {
            data.startTime = this.ruleForm.startTime;
          } else {
            data.startTime = this.ruleForm.startTime[0];
            // console.log(data.startTime)
            // data.endTime = this.ruleForm.startTime[1];
            data.endTime = this.changeMonth(this.ruleForm.startTime[1]);
          }
          // return;
          console.log(this.typeId);
          if (this.typeId == 1) {
            console.log(111111);
            data.reportType = this.reportObj.dictSort;
            data.image = this.imageArr.toString();
          }
          if (this.typeId == 2) {
            data.reportType = this.ruleForm.reportType + "";
            var str = "";
            this.ruleForm.image.forEach((item) => {
              str += item.url + ",";
            });
            data.image = str.slice(0, str.length - 1);
            if (this.ruleForm.reportType == 0) {
              data.workPlan = "";
            }
          }
          const result = await savereport(data);
          if (result) {
            this.$message.success("新增成功");
          }
          if (this.typeId == 1) {
            // this.$parent.getworkreportPage();
          } else {
            // this.$parent.getParticularsData();
          }
          //   this.$parent.reportVisible = false;
        } else {
          this.$message.error("信息未填完整、请检查！");
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.imageWarp {
  padding: 10px 16px;
  display: flex;
  justify-content: flex-start;
  background: #FFFFFF;

  ::v-deep .van-cell {
    width: 86.6px;
    padding: 0;
  }
}

.btnWarp {
  display: flex;
  padding: 12px 14px;
  font-size: 13px;
  justify-content: space-between;
}

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
.editReport{
  font-size: 17px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #212121;
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

  .dataClass {
    ::v-deep .el-picker-panel__body-wrapper {
      .el-picker-panel__body {
        display: flex !important;
        flex-direction: column !important;
      }
    }
  }

  ::v-deep .el-radio-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    flex-wrap: wrap;
    width: 100%;
    margin-top: 8px;
    padding-right: 10px;

    .el-radio {
      margin-right: 10px !important;
    }
  }
}

.customer_name {
  ::v-deep input {
    border: none;
    text-align: left;
  }
}

.circleWarp {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin-top: 7px;
  padding-right: 7px;

  .circle {
    text-align: center;
    color: #ffffff;
    line-height: 20px;
    cursor: pointer;
    margin-right: 10px;
    width: 20px;
    height: 20px;
    border-radius: 50%;
  }
}

.van-ellipsis {
  display: flex;
  justify-content: space-between;
}


</style>
