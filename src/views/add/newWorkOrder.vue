<!-- 添加工单弹窗-->
<template>
  <el-dialog :close-on-click-modal='false' v-if="open" width="40%" :visible.sync="open" :before-close="diaClose">
    <div solt="title">
      <div class="title_font"><b>发起工单</b></div>
    </div>
    <div class="content">
      <el-form
        :model="ruleForm"
        :rules="rules"
        ref="ruleForm"
        label-width="100px"
        class="demo-ruleForm"
      >
        <el-form-item label="关联客户" prop="connectId" required>
          <el-select
            v-model="ruleForm.connectId"
            placeholder="选择客户"
            filterable
            style="width: 100%"
          >
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单类型" prop="workType" required>
          <el-select
            v-model="ruleForm.workType"
            placeholder="选择类型"
            filterable
            style="width: 100%"
          >
            <el-option label="普通工单" value="0"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="工单标题" prop="workTitle">
          <el-input v-model="ruleForm.workTitle" placeholder="填写标题">
          </el-input>
        </el-form-item>
        <el-form-item label="工单内容" prop="workDetails">
          <el-input
            type="textarea"
            v-model="ruleForm.workDetails"
            placeholder="请输入工单内容"
            show-word-limit
            maxlength="300"
            resize="none"
            :autosize="{ minRows: 6, maxRows: 6 }"
          ></el-input>
        </el-form-item>
        <el-form-item
          label="紧急状态"
          prop="urgencyIndex"
          required
          style="margin-top: 30px"
        >
          <el-select
            v-model="ruleForm.urgencyIndex"
            placeholder="选择状态"
            filterable
            style="width: 100%"
          >
            <el-option label="非常紧急" :value="2"></el-option>
            <el-option label="紧急" :value="3"></el-option>
            <el-option label="一般" :value="1"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="operationStaff" label="处理人员" required>
          <el-cascader
            style="width: 100%"
            v-model="ruleForm.operationStaff"
            @change="changeUser"
            :options="userList"
            :show-all-levels="false"
            :props="props"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item prop="informStaff" label="通知人员" required>
          <el-cascader
            style="width: 100%"
            v-model="ruleForm.informStaff"
            :options="userList"
            :props="areaListprops"
            :show-all-levels="false"
            clearable
          ></el-cascader>
        </el-form-item>
        <el-form-item>
          <div class="farm_tip">注:处理完成后，将自动通知到所选人员。</div>
        </el-form-item>
      </el-form>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button @click="open = false">取 消</el-button>
      <el-button type="primary" v-if="!isEdit" @click="addWorkOrder"
        >保 存</el-button
      >
      <el-button type="primary" v-else @click="saveOrder">保 存</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getstaffList } from "@/api/customer/index";
import { getCustomerList, addWorkOrder } from "@/api/workOrder/index";

export default {
  data() {
    return {
      open: false, //表单开关
      user: {}, //用户开关
      //表单信息
      ruleForm: {
        connectId: "", //关联的客户
        workType: "", //工单类型
        workTitle: "", //工单标题
        workDetails: "", //工单内容
        urgencyIndex: "", //紧急状态
        operationStaff: "", //处理人员
        informStaff: [], // 通知人员
      },
      rules: {
        connectId: [
          { required: true, message: "请选择关联的客户", trigger: "change" },
        ],
        workType: [
          { required: true, message: "请选择工单类型", trigger: "change" },
        ],
        workTitle: [
          { required: true, message: "请输入工单标题", trigger: "blur" },
        ],
        workDetails: [
          { required: true, message: "请输入工单内容", trigger: "blur" },
        ],
        urgencyIndex: [
          { required: true, message: "请选择紧急状态", trigger: "change" },
        ],
        operationStaff: [
          { required: true, message: "请选择处理人员", trigger: "change" },
        ],
        informStaff: [
          { required: true, message: "请选择通知人员", trigger: "change" },
        ],
      },
      userList: [], //员工列表
      companyList: [], //企业列表
      props: {
        value: "id",
        label: "name",
        children: "list",
        emitPath: false,
      },
      areaListprops: {
        value: "id",
        label: "name",
        children: "list",
        multiple: true,
      },
      editMsg: {}, //工单编辑
      isEdit: false, //是否编辑
    };
  },
  //生命周期 - 创建完成（访问当前this实例）
  created() {},
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
    });
    getCustomerList().then((res) => {
      this.companyList = res.data;
    });
  },
  watch: {
    open(val) {
      if (val) {
        if (!this.isEdit) {
          this.ruleForm = this.$options.data().ruleForm;
        }
      }
    },
  },
  methods: {
    changeUser() {
    },
    //弹窗关闭后触发
    diaClose() {
      this.open = false;
      this.$emit("diaClose", false);
    },
    //添加表单
    addWorkOrder() {
      this.$refs.ruleForm.validate((res) => {
        //验证成功
        if (res) {
          const arry = [];
          let datas = this.ruleForm;
          datas.informStaff.forEach((res) => {
            arry.push(res[1]);
          });
          datas.informStaff = arry;
          addWorkOrder(datas).then((res) => {
            this.$refs.ruleForm.resetFields();
            this.$notify.success({
              title: "工单添加成功",
              message: "工单添加成功",
              position: "bottom-right",
            });
            this.diaClose();
            this.$emit("addOver", false);
          });
        }
      });
    },
    //进入编辑状态
    getdatas(data) {
      this.isEdit = true;
      this.editMsg = data;
      this.ruleForm.workType = "0";
      this.ruleForm.workTitle = data.workTitle;
      this.ruleForm.workDetails = data.workDetails;
      this.ruleForm.urgencyIndex = data.urgencyIndex;
      this.ruleForm.connectId = data.connectId;
      this.ruleForm.operationStaff = this.getOffStaff();
      this.ruleForm.informStaff = this.getInfStaff();
    },
    //多级回显
    changeDetSelect(key, treeData) {
      let arr = []; // 在递归时操作的数组
      let returnArr = []; // 存放结果的数组
      let depth = 0; // 定义全局层级
      // 定义递归函数
      function childrenEach(childrenData, depthN) {
        for (var j = 0; j < childrenData.length; j++) {
          depth = depthN; // 将执行的层级赋值 到 全局层级
          arr[depthN] = childrenData[j].id;
          if (childrenData[j].id == key) {
            returnArr = arr.slice(0, depthN + 1); //将目前匹配的数组，截断并保存到结果数组，
            break;
          } else {
            if (childrenData[j].list) {
              depth++;
              childrenEach(childrenData[j].list, depth);
            }
          }
        }
        return returnArr;
      }

      return childrenEach(treeData, depth);
    },
    //获取处理人员回显
    getOffStaff() {
      let a = this.changeDetSelect(this.editMsg.operationStaff, this.userList);
      this.modalKey++;
      return a;
    },
    //获取通知人员回显
    getInfStaff() {
      let li = [];
      for (let i = 0; i < this.editMsg.staffs.length; i++) {
        let d = this.editMsg.staffs[i];
        let a = this.changeDetSelect(d.id, this.userList);
        li.push(a);
      }
      return li;
    },
    //保存工单编辑
    saveOrder() {
      this.$refs.ruleForm.validate((res) => {
        //验证成功
        if (res) {
          let arr1 = [];
          let datas = this.ruleForm;
          if (datas.informStaff.length > 0) {
            datas.informStaff.forEach((res) => {
              if (res.length > 1) {
                arr1.push(res[1]);
              }
            });
            datas.informStaff = arr1;
          }
          if (typeof datas.operationStaff == "object") {
            datas.operationStaff = datas.operationStaff[1];
          }
          datas.id = this.editMsg.id;
          addWorkOrder(datas).then((res) => {
            this.$refs.ruleForm.resetFields();
            this.$notify.success({
              title: "工单编辑成功",
              message: "工单编辑成功",
              position: "bottom-right",
            });
            this.isEdit = false;
            this.diaClose();
            this.$emit("addOver", false);
          });
        }
      });
    },
  },
};
</script>
<style lang='scss' scoped>
::v-deep .el-dialog__header {
  background-color: #f2f2f2;
  padding-bottom: 0;
}
::v-deep .el-dialog__body {
  padding: 0;
}
.title_font {
  width: 100%;
  height: 40px;
  margin-top: -5px;
  padding-left: 20px;
  font-size: 16px;
  background-color: #f2f2f2;
}
.farm_tip {
  color: #999999;
  font-size: 13px;
}
.content {
  max-height: 500px;
  overflow: auto;
  padding: 20px;
  border-bottom: 1px solid rgba($color: #606266, $alpha: 0.5);
}
.content::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
  background-color: #f2f2f2;
}
.content::-webkit-scrollbar-thumb {
  background-color: #b4bbc5;
  border-radius: 3px;
}

::v-deep .el-dialog {
  min-width: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -60%) !important;
}
::v-deep .el-input__count {
  margin-bottom: -42px;
}
// 滚动条的宽度
::v-deep .el-textarea__inner::-webkit-scrollbar {
  width: 6px; // 横向滚动条
  height: 6px; // 纵向滚动条 必写
}
// 滚动条的滑块

::v-deep .el-textarea__inner::-webkit-scrollbar-thumb {
  background-color: #ddd;
  border-radius: 3px;
}
</style>