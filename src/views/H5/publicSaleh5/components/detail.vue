<template>
    <div class="h5-container">

        <Navbar :title="item.company_name" @jump="jumpgo" />
        <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 36px;' : ''">
            <div class="header" v-if="$store.state.user.isApp != 2">
                <span><i @click="jumpgo()" class="el-icon-arrow-left"></i></span>
                <span>{{ item.companyName }}</span>
                <span><i class=""></i></span>
            </div>
            <div class="pd">
                <div class="card">
                    <div>
                        <div>
                            <div class="name">
                                {{ item.companyName }}
                            </div>
                            <div class="info">
                                法定代表人：{{ item.legalPerson }}
                            </div>
                            <div class="info">
                                注册资金：{{ item.registerMoney }}
                            </div>
                            <div class="info">
                                成立日期：{{ item.onTime }}
                            </div>
                            <div class="info">
                                地区：{{ item.cityCode }}
                            </div>
                            <div class="info">
                                类型：{{ item.manageType }}
                            </div>
                            <div class="info">
                                统一社会信用代码：{{ item.socialCode }}
                            </div>
                            <div class="info">
                                地址：{{ item.registerAddr }}
                            </div>
                            <div class="info">
                                邮箱：{{ item.email }}
                            </div>
                            <div class="info">
                                联系电话：{{ item.companyPhone == "" ? "暂无联系方式" : item.companyPhone }}
                            </div>
                            <div class="info">
                                固话：{{ item.companyTel }}
                            </div>
                            <div class="info">
                                经营范围：{{ item.manegeRange }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
import { xsdetail } from "@/api/publicSaleds/index";
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
                pageNum: 1,
            },
            item: {},
            loading: false,
            finished: false,
        };
    },
    mounted() {
        xsdetail({ id: this.$route.query.id }).then(res => {
            this.item = res.data
        })
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
    },
    methods: {
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
            font-size: 14px;
            font-family: "PingFang SC";
            font-weight: 500;
            color: #212121;
            margin-bottom: 18px;
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

.info {
    padding: 8px 0;
}
</style>
