<template>
    <div>
        <van-dialog :beforeClose="beforeClose" v-model="smsDialog" title="电话任务" :show-cancel-button="false"
            :show-confirm-button="false">
            <div style="padding: 20px 10px">
                <van-form ref="rulesForm" @submit="submit">
                    <VantSelect label="请选择类型" placeholder="请选择类型" v-model="submitParams.taskType"
                        :columns="taskTypeList" :option="{ label: 'dictLabel', value: 'dictValue' }" required
                        :rules="[{ required: true, message: '请选择类型' }]" />
                    <van-field v-model="submitParams.taskName" name="name" required label="任务名称" placeholder="请输入任务名称"
                        :rules="[{ required: true, message: '' }]" />
                    <van-field v-if="submitParams.taskType === '0'" readonly
                        :disabled="$store.state.user.isDeptHead != 1" clickable name="area" required :value="userJson"
                        label="选择人员" placeholder="点击选择员工" @click="clickChooseUserId" />
                    <van-popup v-model="showUserId" position="bottom">
                        <van-cascader v-model="submitParams.userId" title="请选择归属人员" :options="userList"
                            active-color="#2a81fc" @close="showUserId = false"
                            :field-names="{ text: 'name', value: 'id', children: 'list' }" @finish="onFinishUserId" />
                    </van-popup>
                    <div>
                        <van-field v-model="submitParams.days" name="name" label="自动过滤" placeholder="过滤N天已呼叫过的用户" />
                    </div>
                </van-form>
                <div class="btnWarp">
                    <van-button size="small" type="default" @click="smsDialog = false" style="margin-right: 10px">取消
                    </van-button>
                    <van-button size="small" type="info" @click="submit">确认</van-button>
                </div>
            </div>
        </van-dialog>
    </div>
</template>

  <script>
import { tasksave, aitasksave } from "@/api/Ai/task";
import { subordinateList } from "@/api/customer/index";
export default {
    props: {
        ids: {
            type: Array,
            default: () => {
                return [];
            },
        },
        type: {},
    },
    data() {
        return {
            taskTypeList: [{
                dictValue: '0', dictLabel: '单点外呼'
            }, {
                dictValue: '1', dictLabel: 'AI外呼'
            }],
            userJson: "",
            showUserId: false,
            smsDialog: false,
            userList: [],
            activeIds: [],
            activeIndex: 0,
            submitParams: {
              taskType: '0'
            },
            templateList: [],
        };
    },
    watch: {
        smsDialog(val) {
            if (!val) {
                this.submitParams = {};
            }
        },
    },
    beforeMount() {
        subordinateList().then((res) => {
            this.userList = res.data;
            // console.log(this.userList);
            if (this.$store.state.user.isDeptHead != 1) {
                this.submitParams.userId = this.$store.state.user.userId;
                this.userJson = this.getTreeNode(this.userList, this.$store.state.user.userId)
            }

        });
    },
    methods: {
        clickChooseUserId() {
            if (this.$store.state.user.isDeptHead == 1) {
                this.showUserId = true
            } else {
                return
            }

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
        beforeClose(action, done) {
            if (action === "confirm") {
                this.submit();
            } else {
                done();
            }
        },
        onFinishUserId(value, index, o) {
            this.userJson = value.selectedOptions[value.tabIndex].name;
            this.submitParams.userId = value.value;
            this.showUserId = false;
        },
        submit() {
            this.$refs.rulesForm
                .validate()
                .then((val) => {
                    let data = {};
                    data.ids = this.ids;
                    data.type = this.type;
                    // data.taskType = this.submitParams.taskType;
                    data.days = this.submitParams.days;
                    data.taskName = this.submitParams.taskName;
                    data.userId = this.submitParams.userId;
                    console.log(data);
                    if (this.submitParams.taskType == 0) {
                        tasksave(data).then((res) => {
                            this.smsDialog = false;
                            this.$toast("成功创建电话任务");
                        });
                    } else {
                        aitasksave(data).then((res) => {
                            this.smsDialog = false;
                            this.$toast("成功创建电话任务");
                        });
                    }

                })
                .catch((err) => { });
        },
    },
};
</script>

  <style lang="scss" scoped>
  .btnWarp {
      margin-top: 30px;
      display: flex;
      justify-content: flex-end;
  }

  .btnWarp2 {
      display: flex;
      padding: 12px 14px;
      font-size: 13px;
      justify-content: space-between;
  }

  .van-ellipsis {
      display: flex;
      justify-content: space-between;
  }
  </style>
