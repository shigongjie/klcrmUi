<template>
  <div class="container">
    <div
      class="header"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 86px;' : ''"
    >
      <span @click="jumpGo">取消</span>
      <span class="title-clue">短信单发</span>
      <span @click="send()" style="color:#2B82FC">发送</span>
    </div>
    <div
      class="pd"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 90px;' : ''"
    >
      <div class="line"></div>
      <!-- <div class="phone">
        <span> 收件人： </span
        ><span class="number">{{ submitParams.phone }}</span>
      </div> -->
      <van-field
        v-model="submitParams.taskName"
        rows="4"
        maxlength="50"
        label="任务名称"
        type="textarea"
        required
        placeholder="请输入短信名称"
      />
      <van-field
        v-model="submitParams.message"
        rows="4"
        label="短信内容"
        type="textarea"
        required
        placeholder="请输入短信内容"
      />
      <!-- <div class="chatWarp">
        <div class="chat" v-for="(item, index) in chatList" :key="index">
          <div class="content">{{ item }}</div>
        </div>
      </div> -->
      <!-- <div class="footer">
        <div class="inputWarp">
          <input type="text" v-model="message" /><span class="number"
            ><span
              ><img
                @click="send()"
                src="@/assets/images/iconfont-fasong.png"
                alt="" /></span
          ></span>
        </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { sendNoteMessageSingle } from "@/api/sms/index";
export default {
  data() {
    return {
      rules: {},
      message: "",
      chatList: [],
      submitParams: {
        phone: "",
      },
    };
  },
  beforeMount() {},
  mounted() {
    this.submitParams.phone = this.$route.query.phone;
  },
  methods: {
    send() {
      if (
        this.submitParams.message == "" ||
        this.submitParams.message == null ||
        this.submitParams.message == undefined
      ) {
        this.$toast("请输入短信内容");
        return;
      }
      if (
        this.submitParams.taskName == "" ||
        this.submitParams.taskName == null ||
        this.submitParams.taskName == undefined
      ) {
        this.$toast("请输入任务名称");
        return;
      }
      let data = {};
      data.customerId = this.$route.query.id;
      data.type = this.$route.query.type;
      data.message = this.submitParams.message;
      data.taskName = this.submitParams.taskName;
      // let mesg = this.message;
      sendNoteMessageSingle(data).then((res) => {
        if (res.success) {
          // this.chatList.push(mesg);
          this.message = "";
          this.$router.go(-1)
          this.$toast("发送成功");
        }
      });
    },
    jumpGo() {
      this.$router.go(-1);
    },
    submit() {
      this.$refs.rulesForm
        .validate()
        .then((val) => {})
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height: 20px;
  // background: RGB(249, 249, 249);
}
.container {
  height: 100%;
  color: #606266;
}
.header {
  font-size: 13px;
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
}
.title-clue {
    font-size: 18px;
    font-weight: bold;
    color: #323232;
}
.pd {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
}
.phone {
  padding: 10px 10px;
  border-bottom: 1px solid #e7e7e7;
  .number {
    color: #67c23a;
  }
}
.footer {
  padding: 0 20px;
  height: 56px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  background: #ffffff;
  align-items: center;
  font-size: 13px;
  //   border-top: 1px solid #e9eaec;
  .inputWarp {
    display: flex;
    justify-content: space-between;
    background: #ffffff;
    align-items: center;
    width: 100%;
    border: 1px solid #e7e7e7;
    border-radius: 16px;
  }
  input {
    border: none;
    width: 90%;
    margin-left: 10px;
    height: 30px;
  }
  img {
    width: 20px;
    height: 20px;
    margin-right: 10px;
  }
}
.chatWarp {
  display: flex;
  flex-direction: column;
}
.chat {
  display: flex;
  justify-content: flex-end;
  padding: 10px;
  .content {
    display: inline-block;
    background: rgb(137, 217, 97);
    padding: 10px;
    border-radius: 5px;
  }
}
</style>