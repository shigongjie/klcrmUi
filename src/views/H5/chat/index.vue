<template>
    <div class="h5-container">
        <div class="center">
            <div class="title_chat" :style="$store.state.user.isApp == 2 ? 'padding-top: 56px;' : ''">
                <span class="iconWarp" @click="jumpgo()">
                    <i class="el-icon-arrow-left"></i>
                </span>
                <span class="title_name"> 客服管理 </span>
                <span v-if="checkStatus" class="title_status"><img src="@/assets/images/online.png" alt=""> 在线 <img
                        @click="showStatus = true" src="@/assets/images/qiehuan.png" alt=""></span>
                <span v-else class="title_status"><img src="@/assets/images/notonline.png" alt=""> 离线 <img
                        @click="showStatus = true" src="@/assets/images/qiehuan.png" alt=""></span>
            </div>
            <van-popup v-model="showStatus" position="bottom" :style="{ height: '178px' }">
                <van-radio-group v-model="radio" @change="changeSatus">
                    <div class="radioWarp">
                        <div class="title_status"><img src="@/assets/images/online.png" alt=""> 在线 <i>开启接单状态</i></div>
                        <van-radio name="1">

                            <template #icon="props">
                                <img class="img-icon" :src="props.checked
                                ? $store.state.user.activeIcon
                                : $store.state.user.inactiveIcon" />
                            </template>

                        </van-radio>
                    </div>
                    <div class="radioWarp">
                        <div class="title_status"><img src="@/assets/images/notonline.png" alt=""> 离线 <i>关闭接单状态</i>
                        </div>
                        <van-radio name="2">

                            <template #icon="props">
                                <img class="img-icon" :src="props.checked
                                ? $store.state.user.activeIcon
                                : $store.state.user.inactiveIcon" />
                            </template>
                        </van-radio>
                    </div>

                </van-radio-group>
                <div class="btnWarp">
                    <van-button block type="info" @click="showStatus = false">取消</van-button>
                </div>

            </van-popup>
            <van-tabs color="#2A81FC" :line-width="'20px'" title-active-color="#212121" title-inactive-color="#666666"
                v-model="activeName">
                <div style="height:5px;background: #FFFFFF;"></div>
                <van-tab title="当前会话" name="a">
                    <div class="nodata" v-if="chatListOnline.length == 0">
                        <img src="@/assets/images/nodata.png" alt="" />
                    </div>
                    <div style="height:10px;background: #F3F3F3;"></div>
                    <div :class="item.serverId == sid ? 'activeChat' : ''" class="eachUser" @click="changeCommit(item)"
                        v-for="(item, index) in chatListOnline" :key="index">
                        <img :src="
                            item.clientUserAvatar == '' || item.clientUserAvatar == null
                                ? $store.state.user.defaultAvatar
                                : item.clientUserAvatar
                        " alt="" />
                        <div class="right-info">
                            <div class="info">
                                <div>
                                    <!-- <el-popconfirm title="是否结束当前会话" @confirm="removeChat(item)"> -->
                                    <span @click.stop="" slot="reference" class="userName">
                                        {{ item.clientUserName }}</span>

                                    <!-- </el-popconfirm> -->
                                    <span class="platform">{{ item.platformName ? item.platformName : '未知' }}</span>
                                </div>
                                <div v-if="item.unreadCount > 0" class="unreadCount">
                                    {{ item.unreadCount > 99 ? "99+" : item.unreadCount }}
                                </div>


                            </div>

                            <div class="countWarp" style="margin-top:8px">
                                <span class="lastContent">{{ item.lastContent }}</span>
                                <span class="lastTime">{{ item.lastTime }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="finish">没有更多了</div>
                </van-tab>
                <van-tab title="等待接入" name="b">
                    <div class="nodata" v-if="chatListWaiting.length == 0">
                        <img src="@/assets/images/nodata.png" alt="" />

                    </div>
                    <div style="height:10px;background: #F3F3F3;"></div>
                    <div :class="item.serverId == sid ? 'activeChat' : ''" class="eachUser" @click="changeCommit(item)"
                        v-for="(item, index) in chatListWaiting" :key="index">
                        <img :src="
                            item.clientUserAvatar == '' || item.clientUserAvatar == null
                                ? $store.state.user.defaultAvatar
                                : item.clientUserAvatar
                        " alt="" />
                        <div class="right-info">
                            <div class="info">
                                <div style="display:flex;align-items:center;">
                                    <!-- <el-popconfirm title="是否结束当前会话" @confirm="removeChat(item)"> -->
                                    <span slot="reference" class="userName">
                                        {{ item.clientUserName }}</span>

                                    <!-- </el-popconfirm> -->
                                    <span class="platform">{{ item.platformName ? item.platformName : '未知' }}</span>
                                </div>
                                <div class="access" @click="connectChat(item)">
                                    接入
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="finish">没有更多了</div>
                </van-tab>
                <van-tab title="历史记录" name="c">
                    <div class="nodata" v-if="historyList.length == 0">
                        <img src="@/assets/images/nodata.png" alt="" />

                    </div>
                    <div style="height:10px;background: #F3F3F3;"></div>
                    <div :class="item.serverId == sid ? 'activeChat' : ''" class="eachUser" @click="changeCommit(item,'history')"
                        v-for="(item, index) in historyList" :key="index">
                        <img :src="
                            item.clientUserAvatar == '' || item.clientUserAvatar == null
                                ? $store.state.user.defaultAvatar
                                : item.clientUserAvatar
                        " alt="" />
                        <div class="right-info">
                            <div class="info">
                                <div>
                                    <!-- <el-popconfirm title="是否结束当前会话" @confirm="removeChat(item)"> -->
                                    <span slot="reference" class="userName">
                                        {{ item.clientUserName }}</span>

                                    <!-- </el-popconfirm> -->
                                    <span class="platform">{{ item.platformName ? item.platformName : '未知' }}</span>
                                </div>
                                <div v-if="item.unreadCount > 0" class="unreadCount">
                                    {{ item.unreadCount > 99 ? "99+" : item.unreadCount }}
                                </div>
                            </div>
                            <div class="countWarp" style="margin-top:8px">
                                <span class="lastContent">{{ item.lastContent }}</span>
                                <span class="lastTime">{{ item.lastTime }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="finish">没有更多了</div>
                </van-tab>
            </van-tabs>

        </div>
    </div>
</template>

<script>

import axios from "axios";
import {
    chatlist,
    chatdetail,
    chatread,
    chatremove,
    chataccess,
    chatgetSid,
    updateStatus,
    getStatus,
    commonTermsList,
    removeSelect
} from "@/api/chat/index";
export default {
    data() {
        return {
            sid: '',
            radio: "",
            showStatus: false,
            activeName: 'a',
            nodata: "",
            chatlist: [],
            isApp: 1,
            checkStatus: false,
            chatListOnline: [],
            chatListWaiting: [],
            historyList: []
        };
    },
    beforeMount() {
        this.getServiceStatus()
    },
    mounted() {
        this.isApp = LukeappApi.getattribute().header;
        this.getchatlist(0)
        this.initListWebSocket()
    },
    watch: {
        activeName(val) {
            console.log(val)
            if (val == 'c') {
                this.getchatlist(1)
            } else {
                this.getchatlist(0)
            }
        },
    },
    beforeDestroy() {

    },
    methods: {
        // 点击会话人员
        changeCommit(item,type) {
            this.userInfo = item;
            console.log(item)
            this.$router.push({
                path: '/chatdetailh5',
                query: {
                    ob: JSON.stringify(item),
                    type:type
                }
            })
            // chatread({ id: item.id }).then((res) => {
            //     this.chatListOnline = res.data[1].list;
            //     this.chatListWaiting = res.data[0].list;
            // });
            // this.websocket = null;
            // this.sid = item.serverId;
            // chatdetail({ chatId: item.id }).then((res) => {
            //     this.onchatList = res.data.list;
            //     this.userInfo = res.data;
            //     this.initWebSocket(item.serverId);
            // });
        },
        // 接入用户
        connectChat(item) {
            chataccess({ id: item.id }).then((res) => {
                this.activeName = 'a';
                this.getchatlist(0);
            });
        },
        // 改变客服状态
        changeSatus() {
            updateStatus().then((res) => {
                if (res.success) {
                    this.getServiceStatus()
                }
            });
        },
        // 获取客服状态
        getServiceStatus() {
            getStatus().then((res) => {
                this.checkStatus = res.data;
                this.checkStatus ? this.radio = '1' : this.radio = '2'
            });
        },
        // 获取会话列表
        getchatlist(item) {
            chatlist({ type: item }).then((res) => {
                if (item == 0) {
                    this.chatListOnline = res.data[1].list;
                    this.chatListWaiting = res.data[0].list;
                    console.log(this.chatListOnline);
                } else {
                    this.historyList = res.data[0].list;
                }
            });
        },
        //进入页面创建websocket连接
        initListWebSocket() {
            let that = this;
            //判断当前浏览器是否支持WebSocket
            if ("WebSocket" in window) {
                that.websocketList = new WebSocket(
                    `${process.env.VUE_APP_BASE_WS}/api/websocket/` +
                    this.$store.state.user.userId
                );
            } else {
                alert("当前浏览器 Not support websocket");
            }
            //连接发生错误回调方法
            that.websocketList.onerror = () => {
                // that.setMessageInnerHTML("WebSocket连接发生错误");
            };

            //连接成功建立回调方法
            that.websocketList.onopen = () => {
                console.log("WebSocket连接会话列表成功");
            };
            //接收消息回调方法
            that.websocketList.onmessage = (event) => {
                if (JSON.parse(event.data).code == 0) {
                    this.chatListOnline = JSON.parse(event.data).data[1].list;
                    this.chatListWaiting = JSON.parse(event.data).data[0].list;
                }

                //setechart()
            };

            //连接关闭回调方法
            that.websocketList.onclose = () => {
                console.log("WebSocket连接关闭");
            };

            //监听窗口关闭事件
            window.onbeforeunload = () => {
                closeWebSocket();
            };
        },
        jumpgo() {
            console.log(111)
            //   LukeappApi.clt_close_browser("paysuccess");
            this.$router.push({
                path: '/crm'
            })
        },
        // 获取当前时间
        getNowTime() {
            const yy = new Date().getFullYear();
            const MM =
                new Date().getMonth() + 1 < 10
                    ? "0" + (new Date().getMonth() + 1)
                    : new Date().getMonth() + 1;
            const dd =
                new Date().getDate() < 10
                    ? "0" + new Date().getDate()
                    : new Date().getDate();
            const HH =
                new Date().getHours() < 10
                    ? "0" + new Date().getHours()
                    : new Date().getHours();
            const mm =
                new Date().getMinutes() < 10
                    ? "0" + new Date().getMinutes()
                    : new Date().getMinutes();
            const ss =
                new Date().getSeconds() < 10
                    ? "0" + new Date().getSeconds()
                    : new Date().getSeconds();
            return yy + "-" + MM + "-" + dd + " " + HH + ":" + mm + ":" + ss;
        },
    },
};
</script>

<style  lang="scss" scoped>
body,
html {
    height: 100%;
}

.container {
    height: 100%;
    display: flex;
    flex-direction: column;
}

.center {
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #e6ebf5;
}

.title_chat {
    padding: 20px 20px;
    font-size: 14px;
    text-align: center;
    border-bottom: 1px solid #e6ebf5;
    font-family: PingFang SC;
    font-weight: 500;
    color: #333333;
    position: relative;
    background: #FFFFFF;
    display: flex;
    justify-content: space-between;

    .title_name {
        font-size: 17px;
        width: 100px;
        font-family: PingFang SC;
        font-weight: bold;
        color: #212121;
        // position: absolute;
        // top: 0;
        // bottom: 0;
        // right: 0;
        // left: 0;
        // margin: auto;
        margin-left: 60px;
        display: flex;
        align-items: center;
        justify-content: center;
    }



    .title_status {
        // position: absolute;
        // right: 10px;
        // top: 0;
        // bottom: 0;
        // margin: auto;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 14px;
            height: 14px;
            margin: 0 10px;
        }
    }
    .el-icon-arrow-left{
        font-size:18px;
        font-weight: bold;
        color: #212121;
        vertical-align: middle;
    }


}

.chatBox {
    overflow-y: scroll;
    padding: 10px;
    flex: 1;
    background: #ffffff;
}

.chatBox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px;
    height: 3px;
}

.chatBox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块样式*/
    border-radius: 100px;
    background: rgba(0, 0, 0, 0.1);
}

.chatBox::-webkit-scrollbar-track {
    /*滚动条里面轨道样式*/
    border-radius: 100px;
}

.sendMessage {
    display: flex;
    width: 100%;
    font-size: 13px;
    height: 40px;
    justify-content: space-between;
    border-top: 1px solid #e6ebf5;

    input {
        flex: 1;
        border-radius: 0;
        outline: none;
        border: none;
        padding-left: 10px;
    }

    button {
        width: 80px;
        flex-shrink: 0;
        border-radius: 0;
        outline: none;
        border: none;
    }
}

.left {
    // border: 1px solid;
    display: flex;
    justify-content: flex-start;

    .content {

        // background: #bfcbda;
        .contentdetail {
            display: inline-block;
            height: 100%;
            background: #bfcbda;
            padding: 10px 8px;
            border-radius: 5px;
        }
    }
}

.right {
    // border: 1px solid;
    display: flex;
    justify-content: flex-end;

    .content {
        // max-width: 200px;
        // background: #c9e1ff;
        display: flex;
        justify-content: flex-end;
    }

    .time {
        margin-right: 10px;
    }
}

.eachContent {
    // border: 1px solid;
    margin-top: 10px;
    white-space: normal;
    max-width: 300px;

    .userContent {
        display: flex;
    }

    .content {
        font-size: 14px;
        overflow: hidden;
        margin-top: 10px;

        .contentdetail {
            word-break: break-all;
            display: inline-block;
            height: 100%;
            background: #c9e1ff;
            padding: 10px 8px;
            border-radius: 5px;
        }
    }

    .time {
        color: #999999;
        font-size: 12px;
        margin-left: 10px;
    }

    .name {
        font-size: 13px;
        color: #999999;
    }
}

img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
}

.nodata {
    width: 320px;
    display: flex;
    flex-direction: column;
    // justify-content: center;
    align-items: center;
    margin: auto;
    height: 500px;
    color: #999999;

    img {
        width: 150px;
        height: 150px;
        margin-top: 100px;
        font-size: 80px;
        color: #c0c4cc;
    }
}

.systemMsg {
    width: 100%;
    font-size: 12px;
    width: 100%;
    text-align: center;
    color: #999999;
    margin: auto;
    padding: 10px;
}

.van-radio-group {
    height: 104px;

    .van-radio {
        height: 52px;

    }

    .radioWarp {
        padding: 0 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-size: 16px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #212121;
        border-bottom: 1px solid #E7E7E7;

        .title_status {
            display: flex;
            justify-content: space-between;
            align-items: center;

            i {
                font-size: 15px;
                font-family: PingFang SC;
                font-weight: 500;
                color: #999999;
                margin-left: 6px;
                font-style: normal;
            }
        }

        img {
            height: 16px;
            width: 16px;
            margin-right: 6px;
        }

        .img-icon {
            height: 22px;
            width: 22px;
            margin-right: 0px;
        }
    }
}

.btnWarp {
    width: 100%;
    display: flex;
    padding: 14px 20px;
    align-items: center;
}

.eachUser {
    border-bottom: 1px solid #F3F3F3;
    // background: rgb(232, 231, 230);
    background: #FFFFFF;
    padding: 15px 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    // height: 70px;
    width: 100%;

    img {
        width: 38px;
        height: 38px;
    }

    .right-info {
        flex: 1;
        margin-left: 10px;

        .userName {
            font-size: 15px;
            font-family: PingFang SC;
            font-weight: bold;
            color: #212121;

        }
    }

    .info {
        display: flex;
        justify-content: space-between;

        .platform {
            margin-left: 10px;
            border: 1px solid #2B82FC;
            border-radius: 5px;
            font-size: 12px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #2B82FC;
            padding: 0 5px;
        }
    }

    .countWarp {
        display: flex;
        justify-content: space-between;

        .lastContent {
            display: block;
            max-width: 170px;
            overflow: hidden;
            color: #999999;
            // color: red;
            white-space: nowrap;
            text-overflow: ellipsis;
            font-size: 14px;
            font-family: PingFang SC;
            font-weight: 500;
            color: #999999;

        }

        .lastTime {
            display: flex;
            align-items: flex-end;
            font-size: 13px;
            color: #999999;
        }
    }

    .access {
        width: 56px;
        height: 28px;
        background: #2A81FC;
        border-radius: 6px;
        font-size: 13px;
        font-family: PingFang SC;
        font-weight: 500;
        color: #FFFFFF;
        text-align: center;
        line-height: 26px;
    }

    .unreadCount {
        color: #212121;
        background: #E80000;
        // width: 18px;
        height: 18px;
        font-size: 12px;
        color: #ffffff;
        text-align: center;
        line-height: 18px;
        padding: 0 5px;
        border-radius: 9px;
    }
}

.finish {
    padding: 20px 0;
    text-align: center;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #999999;
}



// .iconWarp {
//     z-index: 999999999999;
// }
</style>