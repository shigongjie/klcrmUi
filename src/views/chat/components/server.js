// 统计在线人数
var userNum = 0
// 记录聊天记录
var chatList = []

// 导入websocket模块，并引用server类
var WebSocketServer = require("ws").Server
// 实例化
socket = new WebSocketServer({
  port: 3000
})

// 实现数据互通和实时更新
socket.send = function (msg) {
  // socket.clients获取所有链接的客户端
  socket.clients.forEach(function each(client) {
    client.send(msg)
  })
}

socket.on("connection", function (ws) {
  // 建立连接成功在线人数 +1
  userNum++

  // 建立连接成功向客户端一次当前在线人数
  socket.send(JSON.stringify({
    funName: "userCount",
    users: userNum,
    chat: chatList
  }))
  console.log("clients:", userNum)

  // 接收前端发送过来的数据
  ws.on("message", function (e) {
    var resData = JSON.parse(e)

    // 每次发送信息，都会把信息存起来，然后通过send传递出去，这样此每次进来的用户就能看到之前的数据
    chatList.push({
      userId: resData.userId,
      content: resData.msg
    })
    socket.send(JSON.stringify({
      userId: resData.userId,
      msg: resData.msg
    }))
  })
  ws.on("close", function (e) {
    //建立连接关闭在线人数 -1在这里插入代码片
    userNum--;

    socket.send(JSON.stringify({
      funName: "userCount",
      users: userNum,
      chat: chatList
    })); //建立连接关闭广播一次当前在线人数
    console.log("clients:", userNum);
    console.log("长连接已关闭")
  })
})
console.log("服务器创建成功")
