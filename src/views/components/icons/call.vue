<template>
    <el-dialog :close-on-click-modal="false" :title="ids.length > 1 ? '单点外呼' : '单点外呼'" :visible.sync="open" width="60%">
        <el-form class="selfForm" ref="rulesForm" :model="submitParams" label-width="100px" size="small" :rules="rules">
            <el-form-item prop="taskType" label="任务类型">
                <el-select style="width:100%" v-model="submitParams.taskType" placeholder="任务类型" clearable size="small">
                    <el-option v-for="(item, index) in taskTypeList" :key="index" :label="item.dictLabel"
                        :value="item.dictValue"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="taskName" label="任务名称">
                <el-input v-model="submitParams.taskName" placeholder="请输入任务名称"></el-input>
            </el-form-item>

            <el-form-item prop="userId" label="选择人员">
                <el-cascader style="width: 100%" size="small" placeholder="选择员工"
                    :disabled="$store.state.user.isDeptHead != 1" v-model="submitParams.userId" :options="userList"
                    :show-all-levels="false" :props="props" clearable></el-cascader>
            </el-form-item>
            <el-form-item label="自动过滤">
                <div style="display: flex">
                    <el-input style="width: 100px; margin-right: 10px" v-model="submitParams.days" placeholder="">
                    </el-input>天已呼叫过的用户
                </div>
            </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="open = false">取 消</el-button>
            <el-button type="primary" @click="submit">确 定</el-button>
        </span>
    </el-dialog>
</template>

<script>
import {
    getstaffList
} from "@/api/customer/index";
import { saveNote } from "@/api/messageSend/index";
import { tasksave, aitasksave } from "@/api/Ai/task";
export default {
    props: {
        ids: {},
        type: {
            type: Number,
            default: 0,
        },
    },
    data() {
        return {
            userList: [],
            taskTypeList: [{
                dictValue: '0', dictLabel: '单点外呼'
            }, /*{
                dictValue: '1', dictLabel: 'AI外呼'
            }*/],
            open: false,
            submitParams: {
                taskName: "",
                noteTemplateId: "",
                days: "",
                taskType: "0"
            },
            templateList: [],
            props: {
                value: "id",
                label: "name",
                children: "list",
                emitPath: false,
            },
            rules: {
                taskName: [
                    { required: true, message: "请输入任务名称", trigger: "blur" },
                ],
                userId: [
                    { required: true, message: "请选择人员", trigger: "blur" },
                ],
                message: [
                    { required: true, message: "请输入任务内容", trigger: "blur" },
                ],
            },
        };
    },
    watch: {
        open(val) {
            if (val) {
                this.submitParams = this.$options.data().submitParams;
                // 如果不是管理员，默认选中自己且不能改变
                if (this.$store.state.user.isDeptHead != 1) {
                    this.submitParams.userId = this.$store.state.user.userId
                }
            }
        },
    },
    beforeMount() {
        getstaffList().then((res) => {
            this.userList = res.data;
        });
    },
    methods: {
        submit() {
            this.$refs.rulesForm.validate((valid) => {
                if (valid) {
                        let data = {};
                        data.taskName = this.submitParams.taskName;
                        data.ids = this.ids;
                        data.message = this.submitParams.message;
                        data.type = this.type;
                        data.userId = this.submitParams.userId;
                        console.log(data);
                        if (this.submitParams.taskType == 0) {
                            tasksave(data).then((res) => {
                                this.open = false;
                                this.$toast("成功创建电话任务");
                            });
                        } else {
                            aitasksave(data).then((res) => {
                                this.open = false;
                                this.$toast("成功创建电话任务");
                            });
                        }

                } else {
                }
            });
        },
    },
};
</script>

<style>

</style>
