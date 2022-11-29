<template>
    <div class="h5-container">
        <Navbar :title="'搜索公共线索'" @jump="jumpgo" />
        <div class="header" v-if="$store.state.user.isApp != 2">
            <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
            <span class="title-clue">搜索公共线索</span>
            <span><i class=""></i></span>
        </div>

        <div class="nodata" v-if="allData.length == 0">
            <van-loading type="spinner" v-if="loadingAthor" />
            <div v-else>
                <img src="@/assets/images/nodata.png" alt="" />
                暂时什么都没有
            </div>

        </div>
        <van-list v-if="allData.length != 0" v-model="loading" :finished="finished" finished-text="" @load="onLoad">
            <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 36px;' : ''">
                <div class="pd">
                    <div class="location" v-if="$route.query.type == 'map'">
                        <div class="imgWarp">
                            <img src="@/assets/images/searchHigh.png" alt="" />
                        </div>当前查询地址：{{ JSON.parse($route.query.ob).name }}
                    </div>
                    <van-checkbox-group v-model="result" ref="checkboxGroup">
                        <div class="card" v-for="(item, index) in list" :key="index">
                            <div @click="jumpdetail(item)">
                                <div>
                                    <div class="name" v-if="$route.query.type == 'map'">
                                        <span>{{ item.companyName }}</span>
                                        <span>距离您{{ item.distance }}km</span>
                                    </div>
                                    <div class="">
                                        法定代表人：{{ item.legalPerson }}
                                    </div>
                                    <div class="">
                                        注册资金：{{ item.registerMoney }}
                                    </div>
                                    <div class="">
                                        成立日期：{{ item.onTime }}
                                    </div>
                                    <div>
                                        联系电话：{{ item.companyPhone == "" ? "暂无联系方式" : item.companyPhone }}
                                    </div>
                                </div>
                            </div>
                            <van-checkbox :name="item.id">
                                <template #icon="props">
                                    <img class="img-icon" :src="
                                        props.checked
                                            ? $store.state.user.activeIcon
                                            : $store.state.user.inactiveIcon
                                    " /> </template>
                            </van-checkbox>
                        </div>
                    </van-checkbox-group>


                </div>

                <el-dialog title="删除确认" :visible.sync="deldia" width="300px" top="30%">
                    <span>确定要删除该条记录吗？</span>
                    <span slot="footer" class="dialog-footer">
                        <el-button @click.native="deldia = false">取 消</el-button>
                        <el-button type="primary" @click.native="delconfirm">确 定</el-button>
                    </span>
                </el-dialog>
            </div>
        </van-list>

        <div class="footer">
            <van-checkbox style="flex-shrink: 0; margin-right: 20px" v-model="checked">全选({{ result.length }})
                <template #icon="props">
                    <img class="img-icon" :src="
                        props.checked
                            ? $store.state.user.activeIcon
                            : $store.state.user.inactiveIcon
                    " /> </template>
            </van-checkbox>
            <van-button :loading="btnLoading" @click="submit" round type="info" class="btnself"
                :disabled="result.length == 0" style="width: 100%" loading-text="数据移入中...">移入公海</van-button>
        </div>
    </div>
</template>

<script>
import { commonCluelist, copyMarketClue } from "@/api/publicSaleds/index";
import { searchByMap } from "@/api/saleslead/index";
export default {
    data() {
        return {
            deldia: false,
            checked: false,
            btnLoading: false,
            list: [],
            result: [],
            isApp: 2,
            paramas: {
                pageSize: 50,
                pageNum: 0,
            },
            loading: false,
            finished: false,
            allData: [],
            pageBySelf: false,
            loadingAthor: false,
        };
    },
    beforeCreate() {


    },
    mounted() {
        this.isApp = LukeappApi.getattribute().header;
        // this.commonCluelist();
        this.loadingAthor = true;
        if (this.$route.query.type == 'map') {
            this.pageBySelf = true;
            this.loadingAthor = true;
            searchByMap(JSON.parse(this.$route.query.ob)).then(res => {
                console.log(this.loadingAthor)
                // return
                this.allData = res.data
                this.loadingAthor = false
            })
        }
        else {
            this.pageBySelf = false
        }
    },
    filters: {
        test(val) {
            if (val != "") {
                var resultPhone = val.replace(/^(\d{3})\d{4}(\d+)/, "$1****$2");
                return resultPhone;
            } else {
                return val;
            }
        },
    },
    watch: {
        result(val) {
            console.log(val.length, this.list.length);
            if (val.length == this.list.length) {
                this.checked = true;
            } else {
                this.checked = false;
            }
        },
        allData(val) {
            console.log(val)
            if (val.length > 0) {
                this.pageBySelf = true
            }
        },
        checked(val) {
            if (val) {
                this.$refs.checkboxGroup.toggleAll(true);
            } else {
                if (!val && this.result.length == this.list.length) {
                    this.$refs.checkboxGroup.toggleAll();
                }
            }
        },
    },
    methods: {
        jumpdetail(item) {
            this.$router.push({
                path: '/resultDetailh5',
                query: {
                    id: item.id
                }
            })
        },
        submit() {
            if (this.result.length > 200) {
                this.$message.error("单次不能移入超过200条线索");
                return;
            }
            this.btnLoading = true;
            copyMarketClue({ ids: this.result }).then((res) => {
                console.log(res);
                if (res.success) {
                    this.btnLoading = false;
                    this.$message({
                        type: "success",
                        message: "移入公海成功!",
                    });
                } else {
                    this.$message({
                        type: "error",
                        message: res.message,
                    });
                }
            });
        },
        onLoad() {
            if (this.$route.query.type == 'map') {
                this.loading = true;
                if (this.list.length >= this.allData.length) {
                    this.finished = true;
                } else {
                    this.paramas.pageNum += 1
                    let begin = (this.paramas.pageNum - 1) * 50;
                    let end = this.paramas.pageNum * 50;
                    this.list = this.list.concat(this.allData.slice(
                        begin,
                        end
                    ))
                    this.checked = true;
                    this.loading = false;
                    setTimeout(() => {
                        // this.$refs.checkboxGroup.toggleAll(true);
                        this.allData.slice(
                            begin,
                            end
                        ).forEach((item) => {
                            this.result.push(item.id);
                        });
                    }, 100);
                }
                // })
            }


        },
        commonCluelist(query) {
            let data = {};
            data.region = this.$route.query.region;
            // data.region = "漳州市";
            data.industry = this.$route.query.industry;
            if (query) {
                this.data = Object.assign(query, data);
            }
            // data.industry = "小卖部";
            commonCluelist(data)
                .then((res) => {
                    console.log(res);
                    this.list = res.data.records;
                    this.checked = true;
                    setTimeout(() => {
                        this.$refs.checkboxGroup.toggleAll(true);
                    }, 100);
                })
                .catch((err) => { });
        },

        delconfirm() {
            customerremove({ ids: [this.$route.query.id] }).then((res) => {
                this.$router.push({
                    path: "/customerh5",
                });
                this.$message({
                    type: "success",
                    message: "删除成功!",
                });
            });
        },
        handleAction(type) {
            if (type == 2) {
                this.$router.push({
                    path: "/addcustomer",
                    query: {
                        id: this.$route.query.id,
                    },
                });
                return;
            }
            if (type == 1) {
                this.$router.push({
                    path: "/transformsea",
                    query: {
                        id: this.$route.query.id,
                    },
                });
                return;
            }
            if (type == 0) {
                this.$router.push({
                    path: "/transforwithperson",
                    query: {
                        id: this.$route.query.id,
                    },
                });
                return;
            }
            if (type == 3) {
                this.deldia = true;
            }
        },
        jumpgo() {
            this.$router.go(-1);
        },
        //   操作记录
        operaLogList() {
            operaLogList({ customerId: this.$route.query.id }).then((res) => {
                this.operaLogData = res.rows;
            });
        },
        // 跟进记录
        followRecordList() {
            followRecordList({ customerId: this.$route.query.id }).then((res) => {
                this.followRecordData = res.rows;
            });
        },
        toast() {
            this.$message.error("请使用PC端访问“crm.lkkjjt.com”操作该功能!");
        },
        handleClick() { },
        // 客户详情
        getcustomerdetail() {
            generalInfo({ id: this.$route.query.id }).then((res) => {
                this.customerInfo = res.data.customerEntity;
                if (res.data.customerEntity.contactEntity == null) {
                    this.customerInfo.contactEntity = {};
                }
                this.dynamicList = res.data.list;
                this.dataVO = res.data.dataVO;
            });
        },
    },
};
</script>

<style lang='scss' scoped>
html,
body {
    height: 100%;
}

::v-deep .el-message-box__wrapper {
    ::v-deep .zdylm {
        width: 300px !important;
    }
}

::v-deep .van-list__finished-text {
    padding-bottom: 56px;
}

.container {
    height: 100%;
    color: #606266;
}

.header {
    position: fixed;
    width: 100%;
    height: 56px;
    display: flex;
    padding: 20px 15px;
    justify-content: space-between;
    align-items: center;
    z-index: 999;
    font-size: 14px;
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
    padding-bottom: 76px;
    background: #F3F3F3;
    overflow: auto;
}

.tab {
    margin-top: 15px;

    ::v-deep .el-tabs__nav-wrap {
        background-color: #ffffff;
    }

    ::v-deep .is-top:nth-child(2) {
        padding-left: 20px;
    }

    ::v-deep .el-tabs__nav-wrap::after {
        background-color: #ffffff !important;
    }

    ::v-deep .el-tabs__item {
        font-size: 12px;
    }

    ::v-deep .el-tabs__nav-scroll {
        display: flex;
        justify-content: space-between;
    }
}

.customer_info {
    display: grid;
    align-items: center;
    justify-content: center;
    grid-template-columns: repeat(3, 33.3%);
    background: #ffffff;

    div {
        text-align: center;
        font-size: 13px;
        padding: 6px 0;
    }
}

.work {
    padding: 0 20px;
    padding-bottom: 64px;
    // background: RGB(249, 249, 249);
}

.dynamic_card {
    margin-top: 10px;
    background: #ffffff;
    border-radius: 6px;
    padding: 10px 0;

    .card {
        .userInfo {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        font-size: 13px;
        padding: 0 10px;

        .person_info {
            display: flex;
            align-items: center;
        }

        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 5px;
        }

        .dynamic_conent {
            padding-left: 40px;
            padding-top: 10px;
        }

        .dynamic_time {
            display: flex;
            justify-content: space-between;
            padding-left: 40px;
            padding-top: 20px;

            i {
                margin-right: 5px;
            }
        }
    }
}

.base_info_title {
    font-size: 13px;
    padding-left: 10px;
    font-weight: 600;
}

.base_info_card {
    background: #ffffff;
    font-size: 13px;
    padding: 8px 20px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #e9eaec;
}

.opera_card {
    background: #ffffff;
    width: 95%;
    margin: auto;
    margin-bottom: 20px;
    border-radius: 6px;

    .operaUser {
        border-bottom: 1px solid #e9eaec;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 13px;
        padding: 10px 20px;

        .person_info {
            display: flex;
            align-items: center;
        }

        img {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 5px;
        }
    }

    .opera_text_card {
        font-size: 13px;

        div {
            padding: 8px 20px;
        }
    }
}

.footer {
    padding: 0 20px;
    height: 56px;
    width: 100%;
    position: fixed;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    background: #ffffff;
    align-items: center;
    font-size: 13px;
    border-top: 1px solid #e9eaec;
}

.card {
    padding: 15px 20px;
    background: #ffffff;
    width: 95%;
    margin: auto;
    margin-top: 9px;
    border-radius: 10px;
    border-bottom: 1px solid #e9eaec;
    display: flex;
    justify-content: space-between;
    align-items: center;

    div {
        font-size: 12px;
        font-family: "PingFang SC";
        font-weight: 500;
        color: #666666;

        .name {
            display: flex;
            justify-content: space-between;

            span:nth-child(1) {
                font-size: 14px;
                font-family: "PingFang SC";
                font-weight: 500;
                color: #212121;
                margin-bottom: 18px;
                width: 250px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            span:nth-child(2) {
                position: absolute;
                width: 100px;
                right: 20px;
                text-align: right;
            }
        }
    }
}

.nodata {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin: auto;
    height: 500px;
    color: #c0c4cc;
    background: #F3F3F3;

    i {
        margin-bottom: 30px;
        font-size: 80px;
        color: #c0c4cc;
    }
}

.location {
    color: #666666;
    font-size: 14px;
    display: flex;
    align-items: center;
    padding-top: 10px;
    padding-left: 20px;

    .imgWarp {
        width: 15px;
        height: 15px;
        margin-right: 3px;

        img {
            width: 100%;
            height: 100%;
            background: cover;
            image-rendering: -moz-crisp-edges;
            image-rendering: -o-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor;
        }
    }
}
</style>
