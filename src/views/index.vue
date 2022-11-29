<template>
  <div class="app-container home">
    <div class="warp">
      <div class="userInfoDiv">
        <div><img src="~@/assets/images/profile.jpg" alt="" /></div>
        <div class="textDiv">
          <p>{{ this.$store.state.user.name }},欢迎进入后台管理中心</p>
          <p>上次登录：2022年3月30日 星期三 10:00:00</p>
        </div>
      </div>
      <div>
        <ul>
          <li>
            <span>员工数量</span>
            <span class="num">100</span>
          </li>
          <li>
            <span>员工数量</span>
            <span class="num">100</span>
          </li>
          <li>
            <span>员工数量</span>
            <span class="num">100</span>
          </li>
        </ul>
      </div>
    </div>

    <div class="menu">
      <div v-for="(item, index) in menu" :key="index" @click="handleJump(item)">
        <span><i :class="item.icon"></i></span>
        <span>{{ item.name }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "Index",
  data() {
    return {
      username: "", //用户名
      menu: [
        {
          name: "企业管理",
          url: "",
          icon: 'el-icon-office-building',
          url:"/bussinessManage/bussinessManager"
        },
        {
          name: "员工管理",
          url: "",
          icon: 'el-icon-user',
          url:"/staffManager/staffmanager"
        },
        {
          name: "日志管理",
          url: "",
          icon: 'el-icon-s-order',
          url:"/logs/actionlogs"
        },
        {
          name: "企业日志",
          url: "",
          icon: 'el-icon-s-order',
          url:"/logs/actionlogs"
        },
        {
          name: "功能限制",
          url: "",
          icon: 'el-icon-menu',
          url:"/bussinessManage/bussinessManager"
        },
      ],
    };
  },
  mounted() {},
  methods: {
    handleJump(item){
      this.$router.push({
        path:item.url
      })
    },
    goTarget(href) {
      window.open(href, "_blank");
    },
  },
};
</script>

<style scoped lang="scss">
.warp {
  padding: 80px;
  display: flex;
  justify-content: space-between;
  ul {
    display: flex;
    height: 100%;
    justify-content: space-between;
    li {
      display: flex;
      flex-direction: column;
      width: 100px;
      align-items: center;
      justify-content: space-around;
      .num {
        font-size: 24px;
        font-weight: 600;
      }
    }
  }
  .userInfoDiv {
    display: flex;
    img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
      margin-right: 30px;
    }
    .textDiv {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      align-items: flex-start;
    }
  }
}
.menu {
  display: flex;
  justify-content: space-around;
  div {
    background: #F9F9F9;
    border: 1px solid #ccc;
    width: 200px;
    height: 150px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    i{
      font-size: 40px;
    }
  }
  div:hover{
    border-color: black;
     color: black;
    i{
      color: black;
    }
  }
}

.home {
  blockquote {
    padding: 10px 20px;
    margin: 0 0 20px;
    font-size: 17.5px;
    border-left: 5px solid #eee;
  }
  hr {
    margin-top: 20px;
    margin-bottom: 20px;
    border: 0;
    border-top: 1px solid #eee;
  }
  .col-item {
    margin-bottom: 20px;
  }

  ul {
    padding: 0;
    margin: 0;
  }

  font-family: "open sans", "Helvetica Neue", Helvetica, Arial, sans-serif;
  // font-size: 13px;
  color: #676a6c;
  overflow-x: hidden;

  ul {
    list-style-type: none;
  }

  h4 {
    margin-top: 0px;
  }

  h2 {
    margin-top: 10px;
    font-size: 26px;
    font-weight: 100;
  }

  p {
    margin-top: 10px;

    b {
      font-weight: 700;
    }
  }

  .update-log {
    ol {
      display: block;
      list-style-type: decimal;
      margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0;
      margin-inline-end: 0;
      padding-inline-start: 40px;
    }
  }
}
</style>

