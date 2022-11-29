<template>
  <div class="h5-container">
    <div class="center">
      <!--  -->

      <div class="titlechat" v-if="sid != ''" :style="isApp == 2 ? 'padding-top: 56px;' : ''">
        <span class="iconWarp" @click="jumpgo()">
          <i class="el-icon-arrow-left"></i>
        </span>
        <div>
          <div class="userName"> {{  ob.clientUserName  }} <span class="platform">{{  ob.platformName  }}</span>
          </div>
          <div class="account">
            客户账号：{{  ob.clientAccount  }}
          </div>
        </div>
        <span></span>

      </div>
      <div class="nodata" v-if="nodata != ''">
        {{  nodata  }}
      </div>
      <div class="chatBox" id="chatBox" v-if="nodata == ''" :style="sid == '' ? 'height:600px' : ''">
        <div class="nodata" v-if="sid == ''">
          <i class="el-icon-chat-line-round"></i>
        </div>
        <div v-for="(item, index) in onchatList" :key="index"
          :class="item.type == 0 ? 'right' : item.type == 1 ? 'left' : ''">
          <div :class="item.type == 2 ? '' : 'eachContent'">
            <span class="time">{{  item.time  }}</span>
            <div class="userContent" v-if="item.type == 1">

              <img style="margin-right: 10px" :src="
                item.clientUserAvatar == '' || item.clientUserAvatar == null
                  ? defaultAvatar
                  : item.clientUserAvatar
              " alt="" />
              <div class="warp">

                <span class="name">{{  item.clientUserName  }}</span>

                <div class="content">
                  <div class="contentdetail" v-if="item.msgType == 1">
                    <img @click="showPic(item.content)" :src="item.content" alt="">
                    <van-image-preview :show-index="false" :closeable="true" v-model="show" :images="images">
                    </van-image-preview>
                  </div>

                  <div class="contentdetail" @click="clickDown(item)" v-else-if="item.msgType == 2">
                    <div class="fileWarp">
                      <img src="@/assets/images/file.png" alt="" />
                      <span style="margin-top:8px">{{  JSON.parse(decodeURIComponent(item.content)).name  }}</span>
                    </div>

                  </div>
                  <div class="contentdetail" v-else>
                    {{  item.content  }}
                  </div>
                </div>
              </div>
            </div>
            <div v-else-if="item.type == 0" class="userContent">
              <div class="warp">
                <div style="
                    display: flex;
                    justify-content: flex-end;
                    align-items: center;
                  ">
                  <!-- <span class="time">{{ item.time }}</span> -->
                  <span class="name">{{  item.serverUserName  }}</span>
                </div>

                <div class="content">
                  <div class="contentdetail" v-if="item.msgType == 1">
                    <img @click="showPic(item.content)" :src="item.content" alt="">
                    <van-image-preview :show-index="false" :closeable="true" v-model="show" :images="images">
                    </van-image-preview>
                  </div>
                  <div class="contentdetail" @click="clickDown(item)" v-else-if="item.msgType == 2">
                    <div class="fileWarp">
                      <img src="@/assets/images/file.png" alt="" />
                      <span style="margin-top:8px">{{  JSON.parse(decodeURIComponent(item.content)).name  }}</span>
                    </div>

                  </div>
                  <div class="contentdetail" v-else>
                    {{  item.content  }}
                  </div>

                </div>
              </div>
              <img style="margin-left: 10px" :src="
                item.serverUserAvatar == '' || item.serverUserAvatar == null
                  ? defaultAvatar
                  : item.serverUserAvatar
              " alt="" />
            </div>
            <div class="systemMsg" v-else>
              {{  item.content  }}
            </div>
          </div>
        </div>
        <div id="msg_end" style="height: 20px"></div>
      </div>
      <!--  v-if="$route.query.type!='history'" -->
      <div v-if="$route.query.type!='history'">
        <div class="sendMessage" v-if="sid != '' && nodata == ''">
          <div class="addMore" @click="moreListShow = !moreListShow"><img src="@/assets/images/addmore.png" alt="">
          </div>
          <!-- <div class="inputBtn"> -->
          <input v-model="queryParams.input1" type="textarea" :rows="7" placeholder="请输入回复内容" clearable
            @keyup.enter="send" />
          <button class="sendBtn" @click="send">发送</button>
          <!-- </div> -->
        </div>
        <div class="moreList" v-if="moreListShow">
          <van-uploader v-model="fileList" :after-read="afterRead" :preview-image="false" accept="image/*">
            <div class="imgWarp">
              <img src="@/assets/images/pic.png" alt="">
              <span>图片</span>
            </div>
          </van-uploader>
          <van-uploader v-model="fileListFile" :after-read="afterReadFile" :preview-image="false" accept="*">
            <div class="imgWarp">
              <img src="@/assets/images/file.png" alt="">
              <span>文件</span>
            </div>
          </van-uploader>
          <div class="imgWarp" @click="addWork">
            <img src="@/assets/images/work.png" alt="">
            <span>工单</span>
          </div>
        </div>
      </div>

    </div>
    <van-popup v-model="showWork" position="bottom">
      <div class="workTitle">添加工单 <i class="el-icon-close" @click="showWork = false"></i></div>
      <van-form class="selfForm" @submit="onSubmit" style="padding-top:10px" ref="rulesForm">
        <van-field v-model="submitParams.workTitle" name="工单标题" label="工单标题" placeholder="请输入工单标题" />
        <VantSelect label="工单类型" placeholder="请选择工单类型" v-model="submitParams.workType" :columns="workTypeList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" />
        <van-field v-model="submitParams.workDetails" rows="5" required autosize label="工单内容" type="textarea"
          placeholder="请输入工单内容" :rules="[{ required: true, message: '请输入工单内容' }]" />
        <VantSelect label="紧急状态" placeholder="请选择紧急状态" v-model="submitParams.urgencyIndex" :columns="urgencyIndexList"
          :option="{ label: 'dictLabel', value: 'dictValue' }" />
        <van-field readonly clickable name="area" :value="submitParams.OperationStaffJson" label="处理人员"
          placeholder="请选择" @click="showOperationStaff = true" required
          :rules="[{ required: true, message: '请选择处理人员' }]" />
        <van-popup v-model="showOperationStaff" position="bottom">
          <van-cascader v-model="submitParams.operationStaff" title="请选择" :options="userList" active-color="#2a81fc"
            @close="showUserId = false" :field-names="{ text: 'name', value: 'id', children: 'list' }"
            @finish="onFinishOperationStaff" />
        </van-popup>

        <van-field readonly clickable name="area" :value="submitParams.copyIdJson" label="通知人员" placeholder="点击选择通知人员"
          @click="showUserId = true" />
        <van-popup v-model="showUserId" position="bottom">
          <div class="btnWarp">
            <span @click="showUserId = false">取消</span>
            <span @click="onFinishUserId">确定</span>
          </div>
          <van-tree-select :items="copyUserList" :active-id.sync="activeIds" :main-active-index.sync="activeIndex" />
        </van-popup>
        <div style="margin: 16px;">
          <van-button round block type="info" native-type="submit">确认提交</van-button>
        </div>
      </van-form>

    </van-popup>
  </div>
</template>

<script>
import {
  chatdetail,
  chatread,
  chatremove,
  removeSelect
} from "@/api/chat/index";
import { uploadFile } from "@/api/common/index"
import { getstaffList } from "@/api/customer/index";
import { addWorkOrder } from "@/api/workOrder/index";
export default {
  data() {
    return {
      show: false,
      images: [],
      activeIds: [],
      activeIndex: 0,
      showUserId: false,
      showOperationStaff: false,
      userList: [],
      copyUserList: [],
      submitParams: {},
      workTypeList: [{ dictLabel: '普通工单', dictValue: '0' }],
      urgencyIndexList: [{ dictLabel: '非常紧急', dictValue: '2' }, { dictLabel: '紧急', dictValue: '3' }, { dictLabel: '一般', dictValue: '1' }],
      showWork: false,
      fileList: [],
      fileListFile: [],
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/file/upload",
      currentImgUrl: "",
      moreListShow: false,
      defaultAvatar: require("@/assets/images/defaultAvatar.png"),
      onchatList: [],
      queryParams: {},
      dataInfo: {},
      sid: "c8b9fc3a31d83035df1dc44aabe3bc8d",
      websocket: null,
      nodata: "",
      isApp: 1,
      serverName: localStorage.getItem("serverUserName")
        ? localStorage.getItem("serverUserName")
        : "当前会话",
      ob: {}
    };
  },
  beforeMount() {
    getstaffList().then((res) => {
      this.userList = res.data;
      this.copyUserList = this.a2b(res.data);
    });
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.ob = JSON.parse(this.$route.query.ob)
    console.log(this.ob)
    this.initChat(this.ob);
  },
  beforeDestroy() {
    removeSelect().then((res => { }))
  },
  methods: {
    addWork() {
      this.showWork = true;
      console.log(this.ob)
      this.submitParams = {}
      this.submitParams.workTitle = this.ob.clientUserName + "-" + this.ob.clientAccount
    },
    a2b(ls) {
      return ls.map((obj) => {
        let result = { id: "", text: "" };
        if (obj.list && obj.list.length > 0) {
          result.id = obj.id;
          result.text = obj.name;
          result.className = "my-class";
          result.children = this.a2b(obj.list);
          return result;
        } else {
          result.id = obj.id;
          result.text = obj.name;
          result.className = "my-class";
          return result;
        }
      });
    },
    showPic(ob) {
      this.show = true;
      this.images = [ob]
    },
    deepQuery(tree, id) {
      var isGet = false;
      var retNode = null;
      function deepSearch(tree, id) {
        for (var i = 0; i < tree.length; i++) {
          if (tree[i].children && tree[i].children.length > 0) {
            deepSearch(tree[i].children, id);
          }
          if (id === tree[i].id || isGet) {
            isGet || (retNode = tree[i]);
            isGet = true;
            break;
          }
        }
      }
      deepSearch(tree, id);
      return retNode;
    },
    getCopyIdJson(a) {
      // a选中的id数组，b tree数据
      let label = [];
      let ids = [];
      a.forEach((item) => {
        if (this.deepQuery(this.copyUserList, item)) {
          label.push(this.deepQuery(this.copyUserList, item).text);
          ids.push(this.deepQuery(this.copyUserList, item).id);
        }
      });
      this.submitParams.copyIdJson = label.toString();
      this.submitParams.informStaff = ids;
    },
    onFinishUserId() {
      this.getCopyIdJson(this.activeIds);
      this.showUserId = false;
    },
    onFinishOperationStaff(value) {
      this.submitParams.OperationStaffJson = value.selectedOptions[value.tabIndex].name;
      this.submitParams.operationStaff = value.value;
      this.showOperationStaff = false;
    },
    onSubmit() {
      this.$refs.rulesForm
        .validate()
        .then((val) => {
          console.log(this.submitParams)
          addWorkOrder(this.submitParams).then(res => {
            if (res.success) {
              this.$toast("工单创建成功")
              this.showWork = false
            }

          })

        }).catch((err) => { })
    },
    afterRead(file) {
      console.log(file)
      const formData = new FormData();
      formData.append("file", file.file);
      uploadFile(formData)
        .then((res) => {
          file.status = "success";
          file.message = "上传成功";
          console.log(res)
          this.currentImgUrl = res.data
          this.sendImg(res.data)
        })
        .catch((err) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    afterReadFile(file) {
      const formData = new FormData();
      formData.append("file", file.file);
      uploadFile(formData)
        .then((res) => {
          file.status = "success";
          file.message = "上传成功";
          let data = {};
          data.name = file.file.name;
          data.url = res.data
          this.sendFile(encodeURIComponent(JSON.stringify(data)))
        })
        .catch((err) => {
          file.status = "failed";
          file.message = "上传失败";
        });
    },
    initChat(item) {
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
    jumpgo() {
      this.$router.push({
        path: '/chath5'
      })
    },
    setScroll() {
      this.$nextTick(() => {
        document.querySelector("#msg_end").scrollIntoView(true);
      });
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
      console.log(file)
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
      this.websocket.onerror = () => {
        console.log("WebSocket连接发生错误");
      };

      //连接成功建立回调方法
      this.websocket.onopen = () => {
        console.log("WebSocket连接成功");
      };
      //接收消息回调方法
      this.websocket.onmessage = (event) => {
        // console.log(JSON.parse(event.data));
        console.log(JSON.parse(event.data));
        if (JSON.parse(event.data).code == 0) {
          this.nodata = "";
          this.onchatList.push(JSON.parse(event.data).data);
          if (JSON.parse(event.data).data.type == 2) {
            this.serverName = JSON.parse(event.data).data.serverUserName;
            localStorage.setItem(
              "serverUserName",
              JSON.parse(event.data).data.serverUserName
            );
          }

          this.setScroll();
        } else {
          this.nodata = JSON.parse(event.data).message;
        }

        //setechart()
      };

      //连接关闭回调方法
      this.websocket.onclose = () => {
        console.log("WebSocket连接关闭");
        // this.removeChat({ id: this.sid });
        localStorage.setItem("serverUserName", "当前会话");
      };

      //监听窗口关闭事件
      window.onbeforeunload = () => {
        // closeWebSocket();
      };
    },
    removeChat(item) {
      chatremove({ id: item.id }).then((res) => {
        this.getchatlist(0);
      });
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
    getUrlParameter(field) {
      //获取Url 参数
      var GET = {};
      var canshu =
        window.location.href.split("?")[1] == undefined
          ? ""
          : window.location.href.split("?")[1];
      if (canshu != "") {
        var strarr = canshu.split("&");
        for (let i = 0; i < strarr.length; i++) {
          var xx = strarr[i];
          var mykey = xx.split("=")[0];
          var myvalue = xx.split("=")[1];
          GET[mykey] = myvalue;
        }
      }
      return GET[field];
    },
    clickDown(item) {
      console.log(item)
      let a = document.createElement("a");
      a.href = JSON.parse(decodeURIComponent(item.content)).url
      a.click();
    }
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

.titlechat {
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
}

.chatBox {
  overflow-y: scroll;
  padding: 10px;
  flex: 1;
  background: #F3F3F3;
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

.moreList {
  display: flex;
  width: 100%;
  font-size: 12px;
  align-items: center;
  // height: 40px;
  background: #F0EDED;
  // justify-content: space-between;
  border-top: 1px solid #e6ebf5;
  padding: 30px 30px;

  .imgWarp {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-right: 50px;

    img {
      width: 44px;
      height: 44px;
      margin-bottom: 5px;
    }
  }
}

.sendMessage {
  display: flex;
  width: 100%;
  font-size: 13px;
  align-items: center;
  // height: 40px;
  background: #F0EDED;
  justify-content: space-between;
  border-top: 1px solid #e6ebf5;
  padding: 10px 12px;

  .addMore {
    img {
      width: 26px;
      height: 26px;
    }
  }

  input {
    flex: 1;
    border-radius: 0;
    outline: none;
    border: none;
    padding-left: 10px;
    border-radius: 5px;
    margin: 0 12px;
    height: 40px;
  }

  button {
    width: 80px;
    flex-shrink: 0;
    border-radius: 0;
    outline: none;
    border: none;
    height: 40px;
    background: #267EFA;
    opacity: 0.97;
    border-radius: 5px;
    font-size: 13px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #FFFFFF;
  }
}

.left {
  // border: 1px solid;
  // display: flex;
  // justify-content: flex-start;
  width: 100%;

  .eachContent {
    // border: 1px solid;
    width: 100%;
    margin-top: 10px;
    white-space: normal;
    // max-width: 300px;

    .userContent {
      display: flex;
      justify-content: flex-start;
    }

    .content {
      font-size: 14px;
      overflow: hidden;
      margin-top: 10px;
      max-width: 300px;

      .contentdetail {
        word-break: break-all;
        display: inline-block;
        height: 100%;
        background: #ffffff;
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

    .time {
      color: #999999;
      font-size: 12px;
      margin-left: 10px;
      display: block;
      width: 100%;
      text-align: center;
      padding: 14px 0;
    }

    .name {
      font-size: 13px;
      color: #999999;
    }
  }

  .content {

    // background: #bfcbda;
    .contentdetail {
      display: inline-block;
      height: 100%;
      background: #bfcbda;
      padding: 10px 8px;
      border-radius: 5px;

      img {
        width: 225px;
        height: 202px;
        background: #FFFFFF;
        border-radius: 10px;
      }
    }
  }
}

.right {
  // border: 1px solid;
  display: flex;
  width: 100%;
  justify-content: flex-end;

  .eachContent {
    // border: 1px solid;
    width: 100%;
    margin-top: 10px;
    white-space: normal;

    // max-width: 300px;
    .userContent {
      display: flex;
      justify-content: flex-end;
    }

    .content {
      font-size: 14px;
      overflow: hidden;
      margin-top: 10px;
      max-width: 300px;

      .contentdetail {
        word-break: break-all;
        display: inline-block;
        height: 100%;
        background: #ffffff;
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

    .time {
      color: #999999;
      font-size: 12px;
      margin-left: 10px;
      display: block;
      width: 100%;
      text-align: center;
      padding: 14px 0;
    }

    .name {
      font-size: 13px;
      color: #999999;
    }
  }

  .content {
    // max-width: 200px;
    // background: #c9e1ff;
    display: flex;
    justify-content: flex-end;
  }
}



img {
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.nodata {
  text-align: center;
  padding-top: 200px;
  color: #999999;
  font-size: 14px;
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

.userName {
  font-size: 15px;
  font-family: PingFang SC;
  font-weight: bold;
  color: #323232;
}

.account {
  font-size: 12px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #212121;
  margin-top: 9px;
}

.van-cell,
.dh-field {
  color: #212121;
  height: 100%;
  border-radius: 5px;
}

.btnWarp {
  display: flex;
  padding: 12px 14px;
  font-size: 13px;
  justify-content: space-between;
}

.van-ellipsis {
  display: flex;
  justify-content: space-between;
}

.van-tree-select__item--active {
  color: rgb(42, 129, 252);
}

.van-sidebar-item--select::before {
  background: rgb(42, 129, 252);
}

.workTitle {
  padding-top: 20px;
  text-align: center;
  padding-bottom: 10px;
  font-size: 16px;
  font-family: PingFang SC;
  font-weight: 500;
  color: #666666;

  i {
    position: absolute;
    right: 20px;
  }
}

.selfForm {
  ::v-deep .van-field__control {
    background-color: #F7F7F7;
    border-radius: 5px;
    padding: 8px 10px;
  }

  ::v-deep .van-field__label {
    display: flex;
    justify-content: center;
    // align-items: center;
    width: 80px;
    font-size: 14px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #212121;
  }

  ::v-deep .van-cell__right-icon {
    position: absolute;
    margin-left: 0;
    background-color: #F7F7F7;
    padding: 8px 0px;
    right: 10px;
    top: 18px;
    // height: 100%;
  }
}
</style>