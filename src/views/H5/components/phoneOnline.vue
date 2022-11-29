<template>
    <div class="container">
        <div class="phone">
            {{ phone }}
        </div>
        <div class="text">
            {{ isConnect ? "通话中..." : "电话接通中..." }}
        </div>
        <ul class="seconds">
            <li>通话时间：{{ one }}:{{ two }}:{{ three }}</li>
        </ul>

        <!-- <el-button type="primary" @click="getSid">拨号</el-button> -->
        <div class="changeMedia">
            <div class="img_div" @click="changeMute">
                <div class="imageWarp" :style="isMute ? 'background:#ffffff' : ''">
                    <img v-if="isMute" :src="image5" alt="">
                    <img v-else :src="image2" alt="">
                </div>
                静音
            </div>
            <div class="img_div" @click="changeSpeakerphone">
                <div class="imageWarp" :style="isSpeakerphone ? 'background:#ffffff' : ''">
                    <img v-if="isSpeakerphone" :src="image4" alt="">
                    <img v-else :src="image3" alt="">

                </div>
                免提
            </div>
        </div>
        <div class="handleUp" @click="handup">
            <div class="imageWarp">
                <img :src="image1" alt="">
            </div>
        </div>

    </div>
</template>

<script>
import { getSIPAccount, recordssave, hangupCall, addCallNum, reduceCallNum } from "@/api/chat/index"
export default {
    data() {
        return {
            image1: require("@/assets/images/dianhua-white.png"),
            image2: require("@/assets/images/huatong-white.png"),
            image3: require("@/assets/images/laba-white.png"),
            image4: require("@/assets/images/laba-black.png"),
            image5: require("@/assets/images/huatong-black.png"),
            name: '',
            phone: '',
            isMute: false,
            isSpeakerphone: false,
            user: '',// OPEN API放回
            ha1: '', // OPEN API放回
            realm: '',// OPEN API放回
            server: '', // OPEN的IP地址和端口
            flag: null,
            one: '00', // 时
            two: '00', // 分
            three: '00', // 秒
            abc: 0, // 秒的计数
            cde: 0, // 分的计数
            efg: 0, // 时的计数
            isConnect: false,
            outputIndex: 0, // 通话标识
            userAgent: null,
            Session: null,
            isHandUp: false
        }
    },
    mounted() {
        this.name = this.$route.query.name;
        this.phone = this.$route.query.phone;
        this.getSid();
    },
    methods: {
        changeSpeakerphone() {
            this.isSpeakerphone = !this.isSpeakerphone
        },
        changeMute() {
            this.isMute = !this.isMute
            if(this.isMute) {
              this.mute();
            } else {
              this.unMute();
            }
        },
        startHandler() {
            this.flag = setInterval(() => {
                if (this.three === 60 || this.three === '60') {
                    this.three = '00';
                    this.abc = 0;
                    if (this.two === 60 || this.two === '60') {
                        this.two = '00';
                        this.cde = 0;
                        if (this.efg + 1 <= 9) {
                            this.efg++;
                            this.one = '0' + this.efg;
                        } else {
                            this.efg++;
                            this.one = this.efg;
                        }
                    } else {
                        if (this.cde + 1 <= 9) {
                            this.cde++;
                            this.two = '0' + this.cde;
                        } else {
                            this.cde++;
                            this.two = this.cde;
                        }
                    }
                } else {
                    if (this.abc + 1 <= 9) {
                        this.abc++;
                        this.three = '0' + this.abc;
                    } else {
                        this.abc++;
                        this.three = this.abc;
                    }
                }
            }, 1000)
        },
        getSid() {
            getSIPAccount().then(res => {
                this.user = res.data.user
                this.realm = res.data.realm
                this.server = res.data.realm
                this.ha1 = res.data.ha1
                this.jssipInit();
                setTimeout(() => {
                  let data = {};
                  data.taskDetailId = this.$route.query.id
                  data.type = this.$route.query.type
                  data.staffNo = this.user
                  data.callee = this.phone
                  data.calleeName = this.$route.query.calleeName
                  recordssave(data).then(res => {
                    if (res.success) {
                      this.callPhone(this.phone);
                    }
                  })
                }, 500)
            })
        },
        // 呼叫失败
        jssipInit() {
          var that = this;
          var user = this.user;
          let outgoingSession = null; //用于分辨呼出
          let incomingSession = null; //用于分辨呼入
          let localStream = new MediaStream(); //媒体流
          let audioView = new Audio; //audio标签
          let sipUri = 'sip:' + user + '@hidcc.cn';
          let wsUri = 'wss://hidcc.cn/webrtc/';
          let socket = new JsSIP.WebSocketInterface(wsUri)
          let password = "lksw2022@";
          let configuration = {
            sockets: [socket],
            uri: sipUri,
            password: password,
            display_name: "'" + user + "'",
            contact_uri: 'sip:' + user + '@hidcc.cn;transport=wss',
            register_expires: 86400, //多长时间重连一次，这个数字为最大值
            trace_sip: true
          };
          this.userAgent = new JsSIP.UA(configuration);
          this.userAgent.start();
          this.userAgent.register();

          this.userAgent.on('registered', () => {
            console.log('注册成功')
          })

          //注册即将失效
          this.userAgent.on('registrationExpiring', () => {
            console.log('注册即将失效')
          })

          //注册失败
          this.userAgent.on('registrationFailed', () => {
            console.log('注册失败')
          })

          //重新注册
          this.userAgent.on('registrationExpiring', () => {
            console.log('重新注册')
          })

          //注销回调
          this.userAgent.on('unregistered', () => {
            console.log('解除注册')
          })

          //呼入与呼出
          this.userAgent.on('newRTCSession', function (data) {
            that.Session = data.session
            if (data.originator == "local") {
              //外呼
              outgoingSession = data.session
              outgoingSession.connection.addEventListener('track', (event) => {
                audioView.srcObject = event.streams[0];
                audioView.play();
                audioView.volume = 1;
              });
            } else {
              //呼入
              incomingSession = data.session
              let receivers = incomingSession.connection.getReceivers();
              incomingSession.on('accepted', function (data) {
                if (receivers) {
                  receivers.forEach(item => {
                    localStream.addTrack(item.track);
                  })
                  audioView.srcObject = localStream;
                  audioView.play();
                  audioView.volume = 1;
                }
              })
              incomingSession.on("progress", function (data) {
                console.log('来电振铃')
              })
              incomingSession.on('failed', function (e) {
                console.log('来电通话失败')
              })
              incomingSession.on('ended', function (e) {
                console.log('来电挂断')
              });
            }
            // 静音时触发
            that.Session.on('muted', function (data) {
              console.log('通话静音中')
            })
            //取消静音时触发
            that.Session.on('unmuted', function (data) {
              console.log('恢复通话')
            })
            //发送DTMF讯号的回调
            that.Session.on('newDTMF', function (data) {
              let dtmfSession = data.dtmf
              dtmfSession.on('succeeded', function (data) {
                console.log('发送成功')
              })
              dtmfSession.on('failed', function (data) {
                console.log('发送失败')
              })
            })
          });
        },
        callPhone(phone) {
          var that = this;
          addCallNum();
          var eventHandlers = {
            //振铃中
            progress: function() {
              console.log('振铃中')
            },
            //呼叫失败
            failed: function(e) {
              console.log('呼叫失败', e)
              if(!that.isHandUp) {
                that.unreg();
                setTimeout(() => {
                  reduceCallNum();
                  that.$router.go(-1);
                }, 500)
              }
            },
            //通话结束
            ended: function() {
              console.log('通话结束')
              if(!that.isHandUp) {
                that.unreg();
                setTimeout(() => {
                  reduceCallNum();
                  that.$router.go(-1);
                }, 500)
              }
            },
            //通话中
            confirmed: function() {
              console.log('通话中');
              that.startHandler();
              that.isConnect = true;
            }
          };
          var options = {
            'eventHandlers': eventHandlers,
            'extraHeaders': ['X-Foo: foo', 'X-Bar: bar'],
            'mediaConstraints': {
              'audio': true,
              'video': false,
              mandatory: {
                maxWidth: 640,
                maxHeight: 360
              },
            },
          };
          this.userAgent.call('sip:' + phone + '@hidcc.cn', options)
        },
        handup() {
          this.userAgent.terminateSessions();
          this.unreg();
          this.isHandUp = true;
          setTimeout(() => {
            reduceCallNum();
            this.$router.go(-1);
          }, 500)
        },
        unreg() {
          let options = {
            all: true
          }
          this.userAgent.unregister(options);
          this.userAgent = null;
        },
        mute() {
          let options = {
            audio: true,
            video: true,
          }
          this.Session.mute(options)
        },
        unMute() {
          let options = {
            audio: true,
            video: true
          }
          this.Session.unmute(options)
        }
    }
}
</script>

<style lang="scss" scoped>
.container {
    color: #FFFFFF;
    background: rgba(0, 0, 0, 0.8);
    height: 100%;
    padding-top: 92.5px;
}

.phone {
    padding-top: 30%;
    text-align: center;
    font-size: 32px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #FFFFFF;
}

.text {
    text-align: center;
    margin-top: 30px;
}

.seconds {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 30px;
}

.changeMedia {
    margin-top: 50px;
    display: flex;
    justify-content: space-evenly;

    .img_div {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }

    .imageWarp {
        width: 82.5px;
        height: 82.5px;
        background: rgba(255, 255, 255, 0.05);
        // opacity: 0.05;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

        img {
            width: 39px;
            height: 39px;
        }
    }
}

.handleUp {
    display: flex;
    justify-content: center;
    margin-top: 30px;

    .imageWarp {
        width: 82.5px;
        height: 82.5px;
        background: #FF3A2F;
        // opacity: 0.05;
        border-radius: 50%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-bottom: 10px;

        img {
            width: 39px;
            height: 39px;
        }
    }
}
</style>
