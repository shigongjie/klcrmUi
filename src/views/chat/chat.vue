<template>
  <div class="chat_box">
    <div class="rightDiv">
      <div class="top">
        <span :class="active == 0 ? 'activeTab' : ''" @click="changeChat(0)">当前会话</span>
        <span :class="active == 1 ? 'activeTab' : ''" @click="changeChat(1)">历史记录</span>
      </div>
      <div v-if="active == 0">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="当前会话" name="1">
            <div class="nochat" v-if="chatListOnline.length == 0">暂无会话</div>
            <div :class="item.serverId == sid ? 'activeChat' : ''" class="eachUser" @click="changeCommit(item)"
              v-for="(item, index) in chatListOnline" :key="index">
              <img :src="
                item.clientUserAvatar == '' || item.clientUserAvatar == null
                  ? $store.state.user.defaultAvatar
                  : item.clientUserAvatar
              " alt="" />
              <div class="right-info">
                <div class="info">
                  <el-popconfirm title="是否结束当前会话" @confirm="removeChat(item)">
                    <span @click.stop="" slot="reference" class="userName">
                      {{ item.clientUserName }}</span>
                  </el-popconfirm>
                  <span class="lastTime">{{ item.lastTime }}</span>
                </div>

                <div class="countWarp">
                  <span class="lastContent">{{ item.lastContent }}</span>
                  <span v-if="item.unreadCount > 0" class="unreadCount">{{
                      item.unreadCount
                  }}</span>
                </div>
              </div>
            </div>
          </el-collapse-item>
          <el-collapse-item title="等待接入" name="2">
            <div class="nochat" v-if="chatListWaiting.length == 0">
              暂无会话
            </div>
            <div class="eachUser" v-for="(item, index) in chatListWaiting" :key="index">
              <img :src="
                item.clientUserAvatar == '' || item.clientUserAvatar == null
                  ? $store.state.user.defaultAvatar
                  : item.clientUserAvatar
              " alt="" />
              <div class="right-info">
                <el-popover placement="top" width="160" v-model="item.visible">
                  <p>是否接入该用户</p>
                  <div slot="reference">
                    <span class="userName">{{
                        item.clientUserName == "" ||
                          item.clientUserName == null ||
                          item.clientUserName == undefined
                          ? "未知用户" + index
                          : item.clientUserName
                    }}</span>
                  </div>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="item.visible = false">取消</el-button>
                    <el-button type="primary" size="mini" @click="(item.visible = false), connectChat(item)">确定
                    </el-button>
                  </div>
                </el-popover>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
      <div v-if="active == 1">
        <el-collapse v-model="activeNames">
          <el-collapse-item title="历史会话" name="1">
            <div class="eachUser" @click="changeCommit(item)" v-for="(item, index) in historyList" :key="index">
              <img :src="
                item.clientUserAvatar == '' || item.clientUserAvatar == null
                  ? $store.state.user.defaultAvatar
                  : item.clientUserAvatar
              " alt="" />
              <div class="right-info">
                <div>
                  <span class="userName">{{ item.clientUserName }}</span>
                </div>

                <div>
                  <span class="lastContent">{{ item.lastContent }}</span>
                  <span class="unreadCount" v-if="item.unreadCount > 0">{{
                      item.unreadCount
                  }}</span>
                </div>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </div>
    <div class="center">
      <!--  -->
      <div class="title" v-if="sid != ''">当前会话</div>
      <div class="chatBox" id="chatBox" :style="sid == '' ? 'height:600px' : ''">
        <div class="nodata" v-if="sid == ''">
          <i class="el-icon-chat-line-round"></i>
        </div>

        <div v-for="(item, index) in onchatList" :key="index" :class="item.type == 1 ? 'left' : 'right'">
          <div class="eachContent">
            <div class="userContent" v-if="item.type == 1">
              <img style="margin-right: 10px" :src="
                item.clientUserAvatar == '' || item.clientUserAvatar == null
                  ? $store.state.user.defaultAvatar
                  : item.clientUserAvatar
              " alt="" />
              <div>
                <span class="name">{{ item.clientUserName }}</span>
                <span class="time">{{ item.time }}</span>
                <div class="content">
                  <div class="contentdetail" v-if="item.msgType == 1">
                    <img :src="item.content" alt="">
                  </div>
                  <div class="contentdetail" @click="clickDown(item)" v-else-if="item.msgType == 2">
                    <div class="fileWarp">
                      <img src="@/assets/images/file.png" alt="" />
                      <span style="margin-top:8px">{{ JSON.parse(decodeURIComponent(item.content)).name }}</span>
                    </div>

                  </div>
                  <div class="contentdetail" v-else>
                    {{ item.content }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="userContent">
              <div>
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                  ">
                  <span class="time">{{ item.time }}</span>
                  <span class="name">{{ item.serverUserName }}</span>
                </div>

                <div class="content">
                  <div class="contentdetail" v-if="item.msgType == 1">
                    <img :src="item.content" alt="">
                  </div>
                  <div class="contentdetail"  @click="clickDown(item)"  v-else-if="item.msgType == 2">
                    <div class="fileWarp">
                      <img src="@/assets/images/file.png" alt="" />
                      <span style="margin-top:8px">{{ JSON.parse(decodeURIComponent(item.content)).name }}</span>
                    </div>

                  </div>
                  <div class="contentdetail" v-else>
                    {{ item.content }}
                  </div>
                </div>
              </div>
              <img style="margin-left: 10px" :src="
                item.serverUserAvatar == '' || item.serverUserAvatar == null
                  ? $store.state.user.defaultAvatar
                  : item.serverUserAvatar
              " alt="" />
            </div>
          </div>
        </div>

        <div style="height: 20px"><a id="msg_end" name="1" href="#1"></a></div>
      </div>
      <div class="sendMessage" v-if="sid != ''&&active!=1">
        <el-form @submit.native.prevent style="width: 100%" :model="queryParams" ref="queryForm">

          <el-form-item style="margin-bottom: 0">
            <div class="upload_file">
              <el-upload class="upload-demo" :headers="headers" :action="uploadFileUrl" :on-success="handleSuccessImg"
                :limit="1" :show-file-list="false" accept="image/png, image/jpeg, image/gif" :file-list="fileList">
                <i class="el-icon-picture-outline"></i>
              </el-upload>
              <el-upload class="upload-demo" :headers="headers" :action="uploadFileUrl" :on-success="handleSuccessFile"
                :limit="1" :show-file-list="false" :file-list="fileList">
                <i class="el-icon-folder-opened"></i>
              </el-upload>
            </div>
            <div class="inputBtn">
              <el-input v-model="queryParams.input1" type="textarea" :rows="7" placeholder="请输入回复内容" clearable
                @keyup.enter.native="send"></el-input>
              <el-button class="sendBtn" @click="send">发送</el-button>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="leftDiv">
      <div class="statusChange">
        <span>是否接单<el-switch @change="changeStauts" v-model="checkStatus">
          </el-switch></span>
        <span>登入名：{{ $store.state.user.name }}</span>
      </div>
      <div>客户信息</div>
      <div>来源：{{ userInfo.platform }}</div>
      <div>客户名称：{{ userInfo.clientUserName }}</div>
      <div>客户账号：{{ userInfo.clientAccount }}</div>
      <div>
        <el-tabs v-model="activeName">
          <el-tab-pane label="常用语" name="0">
            <el-input placeholder="搜索" v-model="filterText"> </el-input>
            <el-tree :filter-node-method="filterNode" ref="tree" default-expand-all :data="usefulList" node-key="id"
              :props="defaultProps" icon-class="el-icon-arrow-right" @node-click="getNode" :check-strictly="true"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ data }">
                <span><i style="margin: 0 10px" :class="
                  data.type == 0
                    ? 'el-icon-folder-opened'
                    : 'el-icon-edit-outline'
                "></i>{{ data.name }}</span>
              </span>
            </el-tree>
          </el-tab-pane>
          <el-tab-pane label="知识库" name="1">
            <el-input placeholder="搜索" v-model="filterKnow"> </el-input>
            <el-tree :filter-node-method="filterNode" ref="tree2" default-expand-all :data="knowladgeList" node-key="id"
              :props="defaultProps" icon-class="el-icon-arrow-right" @node-click="getNode" :check-strictly="true"
              :expand-on-click-node="false">
              <span class="custom-tree-node" slot-scope="{ data }">
                <span><i style="margin: 0 10px" :class="
                  data.type == 0
                    ? 'el-icon-folder-opened'
                    : 'el-icon-edit-outline'
                "></i>{{ data.name }}</span>
              </span>
            </el-tree>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>
 
<script>
import { getToken } from "@/utils/auth";
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
} from "@/api/chat/index";
export default {
  data() {
    return {
      headers: {
        Authorization: getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload",
      activeName: 0,
      filterText: "",
      fileList: [],
      filterKnow: "",
      defaultProps: {
        children: "list",
        label: "name",
        value: "id",
        checkStrictly: true,
        emitPath: false,
      },
      checkStatus: "",
      input1: "",
      queryParams: {
        input1: "",
      },
      activeNames: ["1", "2"],
      //会话列表
      chatListOnline: [],
      visible: false,
      chatListWaiting: [],
      onchatList: [],
      ws: null,

      websocket: null,
      websocketList: null,
      count: 0,

      //当前用户ID
      userId: 0,

      sid: "",

      //聊天记录的数组
      list: [],
      userInfo: {},
      //input输入的值
      contentText: "",
      historyList: [],
      usefulList: [],
      active: 0,
      knowladgeList: [],
    };
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val);
    },
    filterKnow(val) {
      this.$refs.tree2.filter(val);
    },
  },
  created() { },
  beforeMount() {
    commonTermsList().then((res) => {
      this.usefulList = res.data;
    });
    commonTermsList({ type: 1 }).then((res) => {
      this.knowladgeList = res.data;
    });
    getStatus().then((res) => {
      this.checkStatus = res.data;
    });
  },
  mounted() {
    this.getchatlist(0);
    this.setScroll();
    this.initListWebSocket();
  },
  methods: {
    clickDown(item) {
      // let a = document.createElement("a");
      window.open(JSON.parse(decodeURIComponent(item.content)).url)
      // a.href = JSON.parse(decodeURIComponent(item.content)).url
      // a.click();
    },
    handleSuccessImg(res, file) {
      console.log(res, file)
      this.sendImg(res.data)
      this.fileList = []
    },
    handleSuccessFile(res, file) {
      console.log(res, file)
      let data = {};
      data.name = file.name;
      data.url = res.data
      this.sendFile(encodeURIComponent(JSON.stringify(data)))
      this.fileList = []
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.name.indexOf(value) !== -1;
    },
    getNode(val) {
      if (this.sid != "" && this.sid != null && this.sid != undefined) {
        this.queryParams.input1 = val.content;
      }
    },
    changeStauts() {
      updateStatus().then((res) => {
        if (!res.success) {
          this.checkStatus = false;
        }
      });
    },
    // 获取客服信息
    chatgetSid() {
      chatgetSid().then((res) => {
        console.log(res);
      });
    },
    removeChat(item) {
      chatremove({ id: item.id }).then((res) => {
        this.getchatlist(0);
      });
    },
    // 切换会话人员
    changeCommit(item) {
      this.userInfo = item;
      chatread({ id: item.id }).then((res) => {
        this.chatListOnline = res.data[1].list;
        this.chatListWaiting = res.data[0].list;
      });
      this.websocket = null;
      this.sid = item.serverId;
      chatdetail({ chatId: item.id }).then((res) => {
        this.onchatList = res.data.list;
        this.userInfo = res.data;
        this.setScroll();
        this.initWebSocket(item.serverId);
      });
    },
    changeChat(a) {
      this.active = a;
      this.sid = "";
      this.onchatList = [];
      this.getchatlist(a);
    },
    // 接入用户
    connectChat(item) {
      chataccess({ id: item.id }).then((res) => {
        this.activeNames = ["1", "2"];
        this.getchatlist(0);
      });
    },
    getchatlist(item) {
      chatlist({ type: item }).then((res) => {
        if (item == 0) {
          this.chatListOnline = res.data[1].list;
          this.chatListWaiting = res.data[0].list;
          console.log(this.chatListWaiting);
        } else {
          this.historyList = res.data[0].list;
          console.log(this.historyList);
        }
      });
    },
    //进入页面创建websocket连接
    initWebSocket(item) {
      let that = this;
      var sid = item;
      //判断当前浏览器是否支持WebSocket
      if ("WebSocket" in window) {
        that.websocket = new WebSocket(
          `${process.env.VUE_APP_BASE_WS}/api/websocket/` + sid
        );
      } else {
        alert("当前浏览器 Not support websocket");
      }
      //连接发生错误回调方法
      that.websocket.onerror = () => {
        // that.setMessageInnerHTML("WebSocket连接发生错误");
      };

      //连接成功建立回调方法
      that.websocket.onopen = () => {
        console.log("WebSocket连接成功");
      };
      //接收消息回调方法
      that.websocket.onmessage = (event) => {
        console.log(event);
        if (JSON.parse(event.data).code == 0) {
          that.setMessageInnerHTML(JSON.parse(event.data).data);
        }

        //setechart()
      };

      //连接关闭回调方法
      that.websocket.onclose = () => {
        console.log("WebSocket连接关闭");
      };

      //监听窗口关闭事件
      window.onbeforeunload = () => {
        // closeWebSocket();
      };
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

    setMessageInnerHTML(innerHTML) {
      this.onchatList.push(innerHTML);
      this.setScroll();
      // document.getElementById("message").innerHTML += innerHTML + "<br/>";
    },
    //发送聊天信息
    setScroll() {
      var div = document.getElementById("msg_end");
      div.click();
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
    sendImg(file) {
      this.websocket.send(
        '{"content":"' +
        file +
        '", "sid":"' +
        this.sid +
        '", "type":"0","msgType":"1"}'
      );
      let data = {};
      data.serverUserAvatar = this.$store.state.user.avatar;
      data.serverUserName = this.$store.state.user.name;
      data.time = this.getNowTime();
      data.type = "0";
      data.msgType = 1;
      data.content = file;
      this.onchatList.push(data);
      this.queryParams.input1 = "";
      this.setScroll();
    },
    sendFile(file) {
      this.websocket.send(
        '{"content":"' +
        file +
        '", "sid":"' +
        this.sid +
        '", "type":"0","msgType":"2"}'
      );
      let data = {};
      data.serverUserAvatar = this.$store.state.user.avatar;
      data.serverUserName = this.$store.state.user.name;
      data.time = this.getNowTime();
      data.type = "0";
      data.msgType = 2;
      data.content = file;
      this.onchatList.push(data);
      this.queryParams.input1 = "";
      this.setScroll();
    },
    send() {
      if (
        this.queryParams.input1 == "" ||
        this.queryParams.input1 == null ||
        this.queryParams.input1 == undefined
      ) {
        return;
      } else {
        if (this.queryParams.input1.trim() == "") {
          return;
        } else {
          this.websocket.send(
            '{"content":"' +
            this.queryParams.input1 +
            '", "sid":"' +
            this.sid +
            '", "type":"0"}'
          );
          let data = {};
          data.serverUserAvatar = this.$store.state.user.avatar;
          data.serverUserName = this.$store.state.user.name;
          data.time = this.getNowTime();
          data.type = "0";
          data.content = this.queryParams.input1;
          this.onchatList.push(data);
          this.queryParams.input1 = "";
          this.setScroll();
        }
      }
    },
  },
};
</script>
 
<style lang="scss" scoped>
.chat_box {
  padding: 20px;
  height: 100%;
  // width: 100%;
  display: flex;
}

.center {
  flex: 1;
  display: flex;
  flex-direction: column;
  border: 1px solid #e6ebf5;

  .title {
    padding: 10px 20px;
  }

  .chatBox {
    height: 480px;
    // border: 1px solid #e6ebf5;
    overflow-y: scroll;
    padding: 10px;
  }

  .chatBox::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px;
    height: 3px;
  }

  .chatBox::-webkit-scrollbar-thumb {
    /*滚动条里面小方块样式*/
    border-radius: 100px;
    // -webkit-box-shadow: inset 0 0 5px rgba(151, 151, 151, 0.2);
    background: rgba(0, 0, 0, 0.1);
  }

  .chatBox::-webkit-scrollbar-track {
    /*滚动条里面轨道样式*/
    // -webkit-box-shadow: inset 0 0 5px rgba(223, 223, 223, 0.2);
    border-radius: 100px;
    // background: rgba(0, 0, 0, 0.1);
  }

  .sendMessage {
    display: flex;
    width: 100%;
  }
}

// ::v-deep .el-collapse {
//   background: rgb(232, 231, 230);
// }
.rightDiv {
  width: 300px;
  border: 1px solid #e6ebf5;
  border-right: none;
  flex-shrink: 0;
  // background: rgb(232, 231, 230);

  .top {
    display: flex;
    justify-content: space-between;
    padding: 10px 20px;
    background: #ffffff;

    span {
      cursor: pointer;
    }
  }
}

.leftDiv {
  width: 300px;
  flex-shrink: 0;
  border: 1px solid #e6ebf5;
  border-left: none;
  padding: 10px 10px;
  font-size: 14px;

  .statusChange {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: flex;
      justify-content: space-between;
      align-items: center;

      ::v-deep .el-switch {
        margin-bottom: 0;
        margin-left: 5px;
      }
    }
  }

  div {
    margin-bottom: 10px;
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

      img {
        width: 115px;
        height: 101px;
        background: #FFFFFF;
        border-radius: 5px;
      }

      .fileWarp {
        display: flex;
        flex-direction: column;
        // align-items: center;
      }
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

  .contentdetail {
    background: #c9e1ff;

    img {
      width: 115px;
      height: 101px;
      background: #FFFFFF;
      border-radius: 5px;
    }

    .fileWarp {
      display: flex;
      flex-direction: column;
      // align-items: center;
    }
  }

  .time {
    margin-right: 10px;
  }
}

.eachContent {
  // border: 1px solid;
  margin-top: 10px;
  max-width: 50%;
  white-space: normal;

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

.upload_file {
  display: flex;
  border-top: 1px solid #e6ebf5;
  padding-left: 15px;

  i {
    margin-right: 10px;
    font-size: 17px;
  }
}

.inputBtn {
  height: 180px;
  width: 100%;
  display: flex;
  position: relative;


  .sendBtn {
    position: absolute;
    right: 10px;
    bottom: 10px;
  }
}

.eachUser {
  cursor: pointer;
  border-bottom: 1px solid #ffffff;
  // background: rgb(232, 231, 230);
  padding: 10px 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .right-info {
    flex: 1;
    margin-left: 10px;
  }

  .info {
    display: flex;
    justify-content: space-between;
  }

  .lastContent {
    width: 200px;
    color: #666666;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }

  .unreadCount {
    color: #212121;
    background: #f56c6c;
    width: 18px;
    height: 18px;
    font-size: 12px;
    color: #ffffff;
    text-align: center;
    line-height: 18px;
    border-radius: 50%;
  }

  .close {
    margin-top: -20px;
    color: #212121;
  }
}

.eachUser:first-child {
  cursor: pointer;
  border-top: 1px solid #ffffff;
  padding: 10px 15px;
}

.eachUser:last-child {
  cursor: pointer;
  // border-bottom: none;
  padding: 10px 15px;
}

::v-deep .el-collapse-item__content {
  padding-bottom: 0;
}

::v-deep .el-collapse-item__header {
  // background: rgb(232, 231, 230);
  padding-left: 10px;
  height: auto;
}

.activeChat {
  background: RGB(195, 195, 195);
}

::v-deep .el-textarea__inner {
  border: none;
  width: 98%;
}

img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.countWarp {
  display: flex;
  justify-content: space-between;
}

.nodata {
  width: 100%;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;

  i {
    font-size: 180px;
    color: #999999;
  }
}

.activeTab {
  color: #2a81fc;
}

.userName {
  color: #212121;
}

.lastTime {
  color: #666666;
}

.nochat {
  color: #999999;
  text-align: center;
  border-top: 1px solid #e6ebf5;
  padding: 15px 0;
}
</style>