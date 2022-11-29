/**企业限制 */
<template>
  <div v-loading="loading">
    <div class="titleSelf">员工数量限制</div>
    <div class="pd1010">
      <div class="pd50">限制该企业拥有的最大员工数</div>
      <div class="colorFFEAC4 pd50">
        • 当企业拥有员工数超过规定上限时，新增员工无法成功。
      </div>
      <div class="colorFFEAC4 pd50">
        •
        如果在设置最大员工数前，企业所拥有员工数已超过上限，则原有员工不会影响，但是该企业无法再继续添加新员工。
      </div>
      <div class="pd1010">
        <el-radio v-model="submitForm.staffStatus" :label="1">不启用</el-radio>
        <el-radio v-model="submitForm.staffStatus" :label="0">启用</el-radio>
      </div>
      <div class="pd1010">
        <div>
          <el-radio v-model="submitForm.staffType" :label="0" class="margin10"
            >按企业设置总员工数上限</el-radio
          >
        </div>

        <div class="limitDiv" v-if="submitForm.staffType == 0">
          <div class="width400">
            该企业最大拥有的员工数为<el-input
              v-if="submitForm.staffType == 0"
              v-model="submitForm.staffLimitNumber"
              size="mini"
              placeholder=""
            ></el-input
            >个
          </div>
          <div class="pd020">此规则针对：所有部门（总人数上限）</div>
        </div>

        <div>
          <el-radio v-model="submitForm.staffType" :label="1" class="margin10"
            >根据不同部门分别设置员工数上限</el-radio
          >
        </div>

        <div class="limitDiv" v-if="submitForm.staffType == 1">
          <div class="width400">
            每个部门最多可拥有 员工数为<el-input
              v-model="submitForm.staffLimitNumber"
              size="mini"
              placeholder=""
            ></el-input
            >个
          </div>
          <div class="pd020">此规则针对：所有部门（部门员工总人数上限）</div>
        </div>
        <div>
          <el-radio v-model="submitForm.staffType" :label="2" class="margin10"
            >根据不同岗位分别设置员工数上限</el-radio
          >
        </div>

        <div class="limitDiv" v-if="submitForm.staffType == 2">
          <div class="width400">
            每个岗位最多可拥有 员工数为<el-input
              v-model="submitForm.staffLimitNumber"
              size="mini"
              placeholder=""
            ></el-input
            >个
          </div>
          <div class="pd020">此规则针对：所有岗位（岗位员工总人数上限）</div>
        </div>
      </div>
    </div>

    <!-- /**客户数量限制 */ -->
    <div class="titleSelf">客户数量限制</div>
    <div class="pd1010">
      <div class="pd50">限制每个员工拥有的最大客户数</div>
      <div class="colorFFEAC4 pd50">
        • 当员工拥有客户数超过规定上限时，新增客户无法成功。
      </div>
      <div class="colorFFEAC4 pd50">
        •
        如果在设置最大客户数前，员工所拥有客户数已超过上限，则原有客户不会影响，但是该员工无法再继续添加新客户。
      </div>
      <div class="pd1010">
        <el-radio v-model="submitForm.customStatus" :label="1">不启用</el-radio>
        <el-radio v-model="submitForm.customStatus" :label="0">启用</el-radio>
      </div>

      <div class="pd1010">
        <div>
          <el-radio v-model="submitForm.customType" :label="0" class="margin10"
            >按员工设置不同的客户数上限</el-radio
          >
        </div>

        <div v-if="submitForm.customType == 0">
          <div class="limitDiv borderBottomNone">
            <div class="width400">
              每个员工拥有的最大客户数为<el-input
                v-model="submitForm.customLimitRule[0].customLimitNumber"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有员工（特殊员工除外）</div>
          </div>

          <div v-for="(item, index) in submitForm.customLimitRule" :key="index">
            <div
              class="limitDiv"
              v-if="index != 0"
              :class="
                index == submitForm.customLimitRule.length - 1
                  ? ''
                  : 'borderBottomNone'
              "
            >
              <div class="width400">
                每个员工拥有的最大客户数为<el-input
                  v-model="item.customLimitNumber"
                  size="mini"
                  placeholder=""
                ></el-input
                >个
              </div>
              <div class="staffChooseWarp pd020">
                此规则针对：
                <div class="staffChooseWarpDiv">
                  <el-cascader
                    collapse-tags
                    v-model="item.rule"
                    :show-all-levels="false"
                    class="staffChoose"
                    placeholder="搜索"
                    :options="options"
                    :props="{ multiple: true }"
                    filterable
                  ></el-cascader>
                  <div class="close" @click="handleDel(item, index)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="padding: 10px 0">
            <el-button @click="AddcustomNewRule">新增特殊员工</el-button>
          </div>
        </div>

        <div>
          <el-radio v-model="submitForm.customType" :label="1" class="margin10"
            >根据客户类型分别设置客户数上限</el-radio
          >
        </div>
        <div v-if="submitForm.customType == 1">
          <div class="limitDiv borderBottomNone">
            <div class="width400">
              每个员工最多可拥有 个人客户<el-input
                v-model="input"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有员工</div>
          </div>
          <div class="limitDiv">
            <div class="width400">
              每个员工最多可拥有 企业客户<el-input
                v-model="input"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有员工</div>
          </div>
        </div>
      </div>
    </div>

    <div class="titleSelf">联系人数量限制</div>
    <div class="pd1010">
      <div class="pd50">限制每个客户拥有的最大联系人数</div>
      <div class="colorFFEAC4 pd50">
        • 当客户拥有联系人数超过规定上限时，新增联系人无法成功。
      </div>
      <div class="colorFFEAC4 pd50">
        •
        如果在设置最大联系人数前，客户所拥有联系人数已超过上限，则原有联系人不会影响，但是该客户无法再继续添加新联系人。
      </div>
      <div class="pd1010">
        <el-radio v-model="submitForm.contactStatus" :label="1"
          >不启用</el-radio
        >
        <el-radio v-model="submitForm.contactStatus" :label="0">启用</el-radio>
      </div>

      <div class="pd1010">
        <div>
          <el-radio v-model="submitForm.contactType" :label="0" class="margin10"
            >按客户设置不同的联系人数上限</el-radio
          >
        </div>

        <div v-if="submitForm.contactType == 0">
          <div class="limitDiv borderBottomNone">
            <div class="width400">
              每个客户拥有的最大联系人数为
              <el-input
                v-model="submitForm.contactLimitRule[0].contactLimitNumber"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有客户（特殊客户除外）</div>
          </div>
          <!-- <div class="limitDiv">
          <div class="width400">
            每个客户拥有的最大联系人数为<el-input
              v-model="input"
              size="mini"
              placeholder=""
            ></el-input
            >个
          </div>
          <div class="pd020">此规则针对：</div>
        </div> -->

          <div
            v-for="(item, index) in submitForm.contactLimitRule"
            :key="index"
          >
            <div
              class="limitDiv"
              v-if="index != 0"
              :class="
                index == submitForm.contactLimitRule.length - 1
                  ? ''
                  : 'borderBottomNone'
              "
            >
              <div class="width400">
                每个员工拥有的最大客户数为<el-input
                  v-model="item.contactLimitNumber"
                  size="mini"
                  placeholder=""
                ></el-input
                >个
              </div>
              <div class="staffChooseWarp pd020">
                此规则针对：
                <div class="staffChooseWarpDiv">
                  <el-cascader
                    collapse-tags
                    :show-all-levels="false"
                    class="staffChoose"
                    placeholder="搜索"
                    :options="options"
                    :props="{ multiple: true }"
                    v-model="item.rule"
                    filterable
                  ></el-cascader>
                  <div class="close" @click="handleDelcontant(item, index)">
                    <i class="el-icon-circle-close"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div style="padding: 10px 0">
            <el-button @click="AddcontantNewRule">新增特殊客户</el-button>
          </div>
        </div>
        <el-radio v-model="submitForm.contactType" :label="1" class="margin10"
          >根据客户类型分别设置联系人数上限</el-radio
        >
        <div v-if="submitForm.contactType == 1">
          <div class="limitDiv borderBottomNone">
            <div class="width400">
              个人客户拥有的最大联系人数为<el-input
                v-model="input"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有个人客户</div>
          </div>
          <div class="limitDiv">
            <div class="width400">
              企业客户拥有的最大联系人数为<el-input
                v-model="input"
                size="mini"
                placeholder=""
              ></el-input
              >个
            </div>
            <div class="pd020">此规则针对：所有企业客户</div>
          </div>
        </div>
      </div>
      <div>
        <el-button type="primary" @click="submit">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getCompanyLimit, saveCompanyLimit } from "@/api/bussiness/index";

export default {
  props: {
    companyData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      loading: false,
      options: [
        {
          value: "zhinan",
          label: "指南",
          children: [
            {
              value: "shejiyuanze",
              label: "设计原则",
              children: [
                {
                  value: "yizhi",
                  label: "一致",
                },
                {
                  value: "fankui",
                  label: "反馈",
                },
                {
                  value: "xiaolv",
                  label: "效率",
                },
                {
                  value: "kekong",
                  label: "可控",
                },
              ],
            },
            {
              value: "daohang",
              label: "导航",
              children: [
                {
                  value: "cexiangdaohang",
                  label: "侧向导航",
                },
                {
                  value: "dingbudaohang",
                  label: "顶部导航",
                },
              ],
            },
          ],
        },
        {
          value: "zujian",
          label: "组件",
          children: [
            {
              value: "basic",
              label: "Basic",
              children: [
                {
                  value: "layout",
                  label: "Layout 布局",
                },
                {
                  value: "color",
                  label: "Color 色彩",
                },
                {
                  value: "typography",
                  label: "Typography 字体",
                },
                {
                  value: "icon",
                  label: "Icon 图标",
                },
                {
                  value: "button",
                  label: "Button 按钮",
                },
              ],
            },
            {
              value: "form",
              label: "Form",
              children: [
                {
                  value: "radio",
                  label: "Radio 单选框",
                },
                {
                  value: "checkbox",
                  label: "Checkbox 多选框",
                },
                {
                  value: "input",
                  label: "Input 输入框",
                },
                {
                  value: "input-number",
                  label: "InputNumber 计数器",
                },
                {
                  value: "select",
                  label: "Select 选择器",
                },
                {
                  value: "cascader",
                  label: "Cascader 级联选择器",
                },
                {
                  value: "switch",
                  label: "Switch 开关",
                },
                {
                  value: "slider",
                  label: "Slider 滑块",
                },
                {
                  value: "time-picker",
                  label: "TimePicker 时间选择器",
                },
                {
                  value: "date-picker",
                  label: "DatePicker 日期选择器",
                },
                {
                  value: "datetime-picker",
                  label: "DateTimePicker 日期时间选择器",
                },
                {
                  value: "upload",
                  label: "Upload 上传",
                },
                {
                  value: "rate",
                  label: "Rate 评分",
                },
                {
                  value: "form",
                  label: "Form 表单",
                },
              ],
            },
            {
              value: "data",
              label: "Data",
              children: [
                {
                  value: "table",
                  label: "Table 表格",
                },
                {
                  value: "tag",
                  label: "Tag 标签",
                },
                {
                  value: "progress",
                  label: "Progress 进度条",
                },
                {
                  value: "tree",
                  label: "Tree 树形控件",
                },
                {
                  value: "pagination",
                  label: "Pagination 分页",
                },
                {
                  value: "badge",
                  label: "Badge 标记",
                },
              ],
            },
            {
              value: "notice",
              label: "Notice",
              children: [
                {
                  value: "alert",
                  label: "Alert 警告",
                },
                {
                  value: "loading",
                  label: "Loading 加载",
                },
                {
                  value: "message",
                  label: "Message 消息提示",
                },
                {
                  value: "message-box",
                  label: "MessageBox 弹框",
                },
                {
                  value: "notification",
                  label: "Notification 通知",
                },
              ],
            },
            {
              value: "navigation",
              label: "Navigation",
              children: [
                {
                  value: "menu",
                  label: "NavMenu 导航菜单",
                },
                {
                  value: "tabs",
                  label: "Tabs 标签页",
                },
                {
                  value: "breadcrumb",
                  label: "Breadcrumb 面包屑",
                },
                {
                  value: "dropdown",
                  label: "Dropdown 下拉菜单",
                },
                {
                  value: "steps",
                  label: "Steps 步骤条",
                },
              ],
            },
            {
              value: "others",
              label: "Others",
              children: [
                {
                  value: "dialog",
                  label: "Dialog 对话框",
                },
                {
                  value: "tooltip",
                  label: "Tooltip 文字提示",
                },
                {
                  value: "popover",
                  label: "Popover 弹出框",
                },
                {
                  value: "card",
                  label: "Card 卡片",
                },
                {
                  value: "carousel",
                  label: "Carousel 走马灯",
                },
                {
                  value: "collapse",
                  label: "Collapse 折叠面板",
                },
              ],
            },
          ],
        },
        {
          value: "ziyuan",
          label: "资源",
          children: [
            {
              value: "axure",
              label: "Axure Components",
            },
            {
              value: "sketch",
              label: "Sketch Templates",
            },
            {
              value: "jiaohu",
              label: "组件交互文档",
            },
          ],
        },
      ],
      input: "",
      submitForm: {
        companyId: "",
        contactId: null,
        contactLimitRule: [
          {
            contactLimitNumber: "",
            rule: null,
          },
          {
            contactLimitNumber: "",
            rule: ["1"],
          },
        ],
        contactStatus: null,
        contactType: null,
        customId: null,
        customLimitRule: [
          {
            customLimitNumber: "",
            rule: null,
          },
          {
            customLimitNumber: "",
            rule: ["1"],
          },
        ],
        customStatus: null,
        customType: null,
        staffId: null,
        staffLimitNumber: null,
        staffStatus: null,
        staffType: null,
      },
      isStaffLimit: "",
      Staffwhich: "",
      isCustomerLimit: "",
      isConnectLimit: "",
    };
  },
  mounted() {
    this.submitForm.companyId = this.$route.query.id;
    let data = {};
    data.companyId = this.$route.query.id;
    getCompanyLimit(data).then((res) => {
      res.data.customLimitRule = JSON.parse(res.data.customLimitRule);
      res.data.contactLimitRule = JSON.parse(res.data.contactLimitRule);
      this.submitForm = res.data;
    });
  },
  methods: {
    submit() {
      this.loading = true;
      let data = JSON.stringify(this.submitForm);
      let _data = JSON.parse(data);
      _data.customLimitRule = JSON.stringify(_data.customLimitRule);
      _data.contactLimitRule = JSON.stringify(_data.contactLimitRule);
      saveCompanyLimit(_data).then((res) => {
        this.$message({
          type: "success",
          message: "保存成功!",
        });
        this.loading = false;
      });
    },
    handleDel(d, i) {
      this.submitForm.customLimitRule.splice(i, 1);
    },
    handleDelcontant(d, i) {
      this.submitForm.contactLimitRule.splice(i, 1);
    },
    AddcontantNewRule() {
      this.submitForm.contactLimitRule.push({
        contactLimitNumber: "",
        rule: [],
      });
    },
    AddcustomNewRule() {
      this.submitForm.customLimitRule.push({
        customLimitNumber: "",
        rule: [],
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.titleSelf {
  padding: 0px 10px;
  border-left: 3px solid #0079fe;
  font-weight: 600;
}
.pd1010 {
  padding: 10px 10px;
  font-size: 14px;
}
.pd50 {
  padding: 5px 0;
}
.colorFFEAC4 {
  color: #9999a6;
}
::v-deep {
  .limitDiv {
    border: 1px solid #ccc;
    display: flex;
    line-height: 50px;
    align-items: center;
    height: 50px;
    .width400 {
      width: 400px;
      padding: 0 20px;
      .el-input {
        width: 100px;
        margin: 0 5px;
      }
    }
    .pd020 {
      padding: 0 20px;
      border-left: 1px solid #ccc;
    }

    // div:nth-child(2) {
    //   border-left: 1px solid #ccc;
    // }
  }
}
.margin10 {
  margin: 10px 0;
}
.borderBottomNone {
  border-bottom: none;
}
::v-deep.staffChooseWarp {
  flex: 1;
  display: flex;
  .staffChooseWarpDiv {
    display: flex;
    align-items: center;
    flex: 1;
    justify-content: space-between;
    // border: 1px solid;
    .close {
      padding: 0 10px;
    }
  }
  .staffChoose {
    width: 100%;
    border: none !important;
  }
  .el-input {
    width: 100% !important;
  }
}
</style>