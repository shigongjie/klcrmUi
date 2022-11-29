<template>
    <div>
        <div class="box">
            <div class="rightDiv">
                <el-collapse v-model="activeName" @change="changeCllapse">
                    <el-collapse-item v-for="(item,index) in callList" :key="index" :title="item.taskName"
                        :name="item.id">
                        <div class="detail" v-if="item.list==0">
                            暂无任务
                        </div>
                        <div class="detail" v-for="(items,indexs) in item.list" :key="indexs"
                            @click="handleChoose(items)">
                            <div>
                                {{items.clientName}}
                            </div>
                            <div>
                                {{items.clientPhone}}
                            </div>
                            <img @click.stop="call(items)" :src="phoneImg" alt="" />
                        </div>
                    </el-collapse-item>
                </el-collapse>
            </div>
            <div class="center">

                <div v-if="!inCalll">
                    <div class="phoneNumber">
                        <input class="phoneInput" v-model="currentPhone" type="text">
                    </div>
                    <div class="keyBoard">
                        <div class="allNumber">
                            <div class="NumberWarp" v-for="item in 9" :key="item">
                                <span @click="intoNumber(item)">{{item}}</span>
                            </div>
                            <div class="NumberWarp">
                                <span @click="intoNumber(0)">0</span>
                            </div>
                            <div class="NumberWarp">
                                <span> <img @click.stop="callByPhone()" :src="phoneImg" alt="" /></span>
                            </div>
                            <div class="NumberWarp">
                                <span @click="clear()"><i class="el-icon-close"></i></span>
                            </div>
                        </div>

                    </div>
                </div>
                <PhoneOnline v-else @phoneHandleUp="handleUp" :ob='currentOb' />
            </div>
            <div class="leftDiv">
                <div class="top">呼叫记录</div>
                <div class="eachlog" v-for="(item,index) in logsList" :key="index">
                    <div>{{item.createTime}}</div>
                    <div>通话状态：{{item.callStatus == 1 ? '已呼叫' : '未呼叫'}}</div>
                    <div>任务名称：{{item.taskName}}</div>
                </div>
            </div>
        </div>

    </div>
</template>

<script>
import { recordslist, getCallNum } from "@/api/chat/index";
import { getPcAiList, getAiList, aistartTask, getlistByid } from "@/api/Ai/task";
import PhoneOnline from "./phoneOnline"
export default {
    components: {
        PhoneOnline
    },
    data() {
        return {
            currentPhone: "",
            currentOb: {},
            type: "",
            inCalll: false,
            activeName: [],
            callList: [],
            detailList: [],
            loading: false,
            queryParams: {},
            logsList: [],
            phoneImg: require("@/assets/images/AIphone.png"),
        }
    },
    mounted() {
        this.getCallData()
    },
    methods: {
        handleUp() {
            this.inCalll = false
            this.getCallData()
        },
        clear() {
            this.currentPhone = this.currentPhone.substr(0, this.currentPhone.length - 1)
        },
        intoNumber(item) {
            this.currentPhone = this.currentPhone + item
        },
        changeCllapse(ob) {
        },
        handleChoose(ob) {
            let data = {}
            data.taskDetailId = ob.id
            this.getlogsData(data)
            this.currentPhone = ob.clientPhone
            this.currentOb = ob
        },
        /**获取数据 */
        getlogsData(query) {
            query = Object.assign(query, this.queryParams)
            this.loading = true;
            recordslist(query).then((res) => {
                this.logsList = res.rows;
                this.loading = false;
            });

        },
        callByPhone() {
          getCallNum().then(res=> {
            if (res.success) {
              var data = res.data;
              if (data.callNum >= data.callNumMax) {
                this.$toast({
                  message: '企业已达同时外呼数量限制，请稍后重试!',
                  duration: 2000,
                })
              } else {
                if(this.currentPhone != this.currentOb.clientPhone) {
                  this.currentOb = {}
                }
                this.currentOb.clientPhone = this.currentPhone
                this.inCalll = true
              }
            }
          });
        },
        call(ob) {
          getCallNum().then(res=> {
            if (res.success) {
              var data = res.data;
              if (data.callNum >= data.callNumMax) {
                this.$toast({
                  message: '企业已达同时外呼数量限制，请稍后重试!',
                  duration: 2000,
                })
              } else {
                this.$confirm(`${ob.clientName}${ob.clientPhone}`, '是否确定联系', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
                  this.currentOb = ob
                  this.inCalll = true
                }).catch(() => {
                  this.$message({
                    type: 'info',
                    message: '已取消'
                  });
                });
              }
            }
          });
        },
        getCallData(query) {
            this.loading = true;
            getPcAiList(query).then((res) => {
                this.callList = res.rows;
                this.loading = false;
            });
        },
    }
}
</script>

<style lang="scss" scoped>
.box {
    padding: 20px;
    height: 100%;
    // width: 100%;
    display: flex;
}

.rightDiv {
    width: 25%;
    height: 800px;
    overflow-y: auto;
    border: 1px solid #e6ebf5;
    border-right: none;
    flex-shrink: 0;

    .detail {
        border-top: 1px solid #e6ebf5;
        padding: 10px 20px;
        position: relative;

        img {
            width: 20px;
            height: 20px;
            position: absolute;
            right: 20px;
            top: 0;
            bottom: 0;
            margin: auto;

        }
    }
}

.leftDiv {
    flex: 1;
    flex-shrink: 0;
    border: 1px solid #e6ebf5;
    border-left: none;
    padding: 10px 0px;
    font-size: 14px;
    height: 800px;
    overflow-y: auto;

    .top {
        border-bottom: 1px solid #e6ebf5;
        padding: 0 10px;
        padding-bottom: 10px;
    }

    .eachlog {
        border-bottom: 1px solid #e6ebf5;
        padding: 0 10px;
    }

    div {
        margin-bottom: 10px;
    }
}

.center {
    width: 35%;
    min-height: 800px;
    display: flex;
    flex-direction: column;
    border: 1px solid #e6ebf5;

    .phoneNumber {
        padding: 20px;
        height: 300px;
        display: flex;
        justify-content: center;
        align-items: center;

        .phoneInput {
            border: none;
            text-align: center;
        }

    }

    .keyBoard {
        .allNumber {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;

            .NumberWarp {
                width: 33%;
                text-align: center;
                padding: 10px 0;

                span {
                    display: inline-block;
                    background: #e6ebf5;
                    width: 50px;
                    height: 50px;
                    border-radius: 50%;
                    line-height: 50px;
                    text-align: center;

                    img {
                        width: 25px;
                        height: 25px;
                        margin-top: 15px;
                    }
                }
            }
        }

    }
}

::v-deep .el-collapse-item__content {
    padding-bottom: 0;
}

::v-deep .el-collapse-item__header {
    // background: rgb(232, 231, 230);
    padding-left: 10px;
    height: auto;
}
</style>
