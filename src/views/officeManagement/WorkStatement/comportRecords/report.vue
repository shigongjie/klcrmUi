<template>
  <div v-if="reportVisible">
    <el-dialog :visible="reportVisible" width="50%" @close="btnCancel">
      <div slot="title" class="header-title">
        <div style="font-weight: 600; font-size: 15px">
          {{ reportTitle }}工作报告
        </div>
      </div>

      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="120px">
        <el-form-item label="报告类型：" prop="reportType" required>
          <el-row type="flex" justify="space-between">
            <el-select :style="`width: ${realWidth}`" v-model="ruleForm.reportType" placeholder="请选择" @change="changeState">
              <el-option v-for="item in reportTypeArr" :key="item.dictSort" :label="item.dictLabel" :value="item.dictSort">
              </el-option>
            </el-select>
            <el-form-item :style="`width:${dateWidth}`" prop="startTime" key="month">
              <el-date-picker v-if="timer" ref="dateObj" @input="inputTime" :format="dateFormat" value-format="yyyy-MM-dd" style="width: 100%" v-model="ruleForm.startTime" :type="dateType" placeholder="选择日期" :range-separator="dateSymbol" :start-placeholder="dateStart" :end-placeholder="dateEnd" :picker-options="datePicker">
              </el-date-picker>
            </el-form-item>
          </el-row>
        </el-form-item>
        <el-form-item label="工作总结：" prop="summarize">
          <el-input type="textarea" :rows="6" placeholder="请输入工作总结" maxlength="1000" show-word-limit v-model="ruleForm.summarize" />
        </el-form-item>
        <div>
          <el-form-item v-if="ruleForm.reportType !== 0" label="工作计划：" prop="workPlan">
            <el-input type="textarea" :rows="6" placeholder="请输入工作计划" maxlength="1000" show-word-limit v-model="ruleForm.workPlan" />
          </el-form-item>
        </div>
        <el-form-item v-if="typeId === 1" label="上传图片：">
          <el-upload ref="uploadImg" :action="uploadUrl" :on-exceed="handleExceed" :headers="headers" list-type="picture-card" :limit="3" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item v-else label="图片：">
          <el-upload :action="uploadUrl" :class="{ disabled: fileComputed }" :file-list="ruleForm.image" :headers="headers" list-type="picture-card" :limit="3" :on-success="handleAvatarSuccess" :on-remove="handleRemove">
            <i class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="批阅人员：" prop="readId">
          <el-cascader style="width: 100%" v-model="ruleForm.readId" :options="userList" :show-all-levels="false" :props="propsCascader" clearable></el-cascader>
        </el-form-item>
        <el-form-item label="抄送人员：">
          <el-cascader style="width: 100%" v-model="ruleForm.copyId" :options="userList" :show-all-levels="false" :props="propsmult" clearable></el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="btnCancel" size="small">取 消</el-button>
        <el-button type="primary" @click="btnOK" size="small">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { getstaffList } from "@/api/customer/index";
import { staffList, savereport, workreportAlter } from "@/api/officeManagement";
import { getToken } from "@/utils/auth";
export default {
  props: {
    reportVisible: {
      type: Boolean,
      default: false,
    },
    reportObj: {
      type: Object,
      require: true,
    },
    typeId: {
      type: Number,
      default: 1,
      require: true,
    },
  },
  computed: {
    realWidth() {
      return this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2
        ? "49%"
        : "40%";
    },
    dateFormat() {
      if (this.ruleForm.reportType == 0 || this.ruleForm.reportType == 1) {
        return "yyyy 年 MM 月 dd 日";
      } else if (this.ruleForm.reportType >= 2) {
        return "yyyy 年 MM 月";
      }
    },
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
    reportVisible: {
      immediate: true,
      handler(obj) {
        if (obj) {
          this.flagReportType(this.reportObj);
        } else {
          this.ruleForm = {
            reportType: 0,
            workPlan: "",
            startTime: "",
            image: [],
          };
        }
      },
    },
  },

  data() {
    let _minTime = null;
    let _maxTime = null;
    return {
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
      imageArr: [],
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
    this.getDicts("report_type").then((res) => {
      this.reportTypeArr = res.data;
    });
    getstaffList().then((res) => {
      this.userList = res.data;
    });
  },
  methods: {
    btnCancel() {
      // this.ruleForm = {
      //   reportType: 0,
      //   workPlan: "",
      //   startTime: "",
      //   image: [],
      // };
      if (this.typeId === 1) {
        this.$refs.uploadImg.clearFiles();
      } else {
        this.imageArr = [];
      }
      this.$refs.ruleForm.resetFields();
      this.$parent.reportVisible = false;
    },
    changeMonth(value) {
      let date = new Date(value);
      let month = (date.getMonth() + 1).toString().padStart(2, "0");
      let year = date.getFullYear();
      let day = new Date(year, month, 0);
      let endTime = year + "-" + month + "-" + day.getDate();
      return endTime;
    },
    btnOK() {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          let copyId;
          if (this.ruleForm.copyId && this.ruleForm.copyId.length > 0) {
            copyId = this.ruleForm.copyId.toString();
          } else {
            copyId = null;
          }
          var data = {
            copyId: copyId,
            id: this.ruleForm.id,
            summarize: this.ruleForm.summarize,
            founderId: this.ruleForm.founderId,
            readId: this.ruleForm.readId,
            workPlan: this.ruleForm.workPlan,
          };
          if (this.ruleForm.reportType == 0) {
            data.startTime = this.ruleForm.startTime;
            data.endTime = this.ruleForm.startTime;
          } else if (this.ruleForm.reportType == 1) {
            data.startTime = this.ruleForm.startTime[0];
            data.endTime = this.ruleForm.startTime[1];
          } else if (this.ruleForm.reportType == 2) {
            data.startTime = this.ruleForm.startTime;
            data.endTime = this.changeMonth(this.ruleForm.startTime);
          } else {
            data.startTime = this.ruleForm.startTime[0];
            data.endTime = this.changeMonth(this.ruleForm.startTime[1]);
          }
          // return;
          if (this.typeId === 1) {
            data.reportType = this.reportObj.dictSort;
            var str = "";
            this.ruleForm.image.forEach((item) => {
              str += item.response.data + ",";
            });
            data.image = str.slice(0, str.length - 1);
          }
          // return;
          if (this.typeId === 2) {
            data.reportType = this.ruleForm.reportType + "";
            var str = "";
            this.ruleForm.image.forEach((item) => {
              if (item.response) {
                str += item.response.data + ",";
              } else {
                str += item.url + ",";
              }
            });
            data.image = str.slice(0, str.length - 1);
            if (this.ruleForm.reportType === 0) {
              data.workPlan = "";
            }
          }
          console.log("data :>> ", data);
          const result = await savereport(data);
          if (this.typeId === 1) {
            this.$parent.getworkreportPage();
          } else {
            this.$parent.getParticularsData();
          }
          this.$parent.reportVisible = false;
        } else {
          this.$message.error("信息未填完整、请检查！");
        }
      });
    },
    handleAvatarSuccess(res, file, fileList) {
      this.ruleForm.image.push(file);
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
    updateTime(obj) {
      if (this.ruleForm.reportType == 0 || this.ruleForm.reportType == 2) {
        this.ruleForm.startTime = obj.data.startTime;
      } else {
        this.ruleForm.startTime = obj.data.startTime.split(",");
        this.ruleForm.startTime.push(obj.data.endTime);
      }
    },
    changeState() {
      this.timer = false;
      this.ruleForm.startTime = "";
      this.$nextTick(() => {
        this.timer = true;
      });
    },
    inputTime(val) {
      this.$forceUpdate();
    },
    async getRuleFormData(RuleFormData) {
      this.imageArr = [];
      const result = await workreportAlter({ id: RuleFormData.id });
      this.ruleForm = result.data;
      if (this.ruleForm.copyId) {
        this.ruleForm.copyId = result.data.copyId.split(",");
      }

      if (result.data.image !== "") {
        var arr = result.data.image.split(",");
        arr.forEach((element) => {
          this.imageArr.push({
            name: Math.ceil(Math.random() * 100),
            url: element,
          });
        });
      }
      this.updateTime(result);
      this.ruleForm.image = this.imageArr;
      this.ruleForm.reportType = Number(result.data.reportType);
    },
    flagReportType(obj) {
      if (this.typeId === 1 && obj) {
        this.ruleForm.reportType = obj.dictSort;
      } else if (this.typeId === 2) {
        this.getRuleFormData(obj);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
}
::v-deep .el-select {
  width: 117px;
}
::v-deep .el-textarea__inner {
  resize: none;
}
::v-deep .el-upload {
  border: 1px solid #e4e4e4;
  background-color: #f9f9f9;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 115px;
  height: 115px;
  line-height: 115px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #e4e4e4;
}
::v-deep .el-dialog__body {
  padding-bottom: 0;
}
.disabled ::v-deep .el-upload--picture-card {
  display: none;
}

// ::v-deep .el-picker-panel, .el-date-picker, .el-popper{
//     position: fixed !important;
//     top : 120px !important;
//     left : 50% !important;
//     z-index: 9999;
// }
</style>
