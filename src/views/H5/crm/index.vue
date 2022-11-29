<template>
  <div class="h5-container">
    <Navbar :title="'CRM工作台'" @jump="jumpgo" />
    <div
      class="container"
      :style="$store.state.user.isApp == 2 ? 'padding-top: 96px;' : ''"
    >
      <div style="background: #f3f3f3; height: 10px"></div>
      <div class="titleh5" v-if="$store.state.user.isApp != 2">CRM工作台</div>
      <div class="crm_div">
        <div
          class="crm_card"
          v-for="(item, index) in menuList"
          :key="index"
          @click="jump(item.path)"
        >
          <div class="icon_div" v-if="item.isShow">
            <span class="icon_warp"><img :src="item.icon" alt="" /></span>
            <span>{{ item.name }}</span>
          </div>
        </div>
      </div>
      <div class="data_div">
        <div style="background: #f3f3f3; height: 10px"></div>
        <div class="titleh5">数据简报</div>
        <div class="reportDiv">
          <div
            class="reportEachDiv"
            v-for="(item, key, index) in reportDataList"
            :key="index"
          >
            <span>{{ item }}</span>
            <span>{{ key }}</span>
          </div>
        </div>
      </div>
    </div>

    <div>
      <Footer />
    </div>
  </div>
</template>

<script>
import { getHome } from "@/api/customer/index";
import { checkStaff } from '@/api/staff/index'
import Footer from "../components/footer.vue";
import Navbar from "../components/navbar.vue";
// import { mapState } from 'vuex'
export default {
  components: {
    Footer,
    Navbar,
  },
  data() {
    return {
      isApp: 1,
      menuList: [
        {
          name: "客户管理",
          icon: require("@/assets/images/customer.png"),
          path: "/customerh5",
          isShow: true
        },
        {
          name: "销售线索",
          icon: require("@/assets/images/salelead.png"),
          path: "/saleleadh5",
          isShow: true
        },
        {
          name: "联系人",
          icon: require("@/assets/images/connect.png"),
          path: "/connectperson",
          isShow: true
        },
        {
          name: "跟进记录",
          icon: require("@/assets/images/follow.png"),
          path: "/followuph5",
          isShow: true
        },
        {
          name: "公海客户",
          icon: require("@/assets/images/sea.png"),
          path: "/seacustomerh5",
          isShow: true
        },
        {
          name: "公共线索",
          icon: require("@/assets/images/publicsale.png"),
          path: "/maph5",
          isShow: true
        },
        {
          name: "客服",
          icon: require("@/assets/images/kefu.png"),
          path: "/chath5",
          isShow: true
        },
        // {
        //   name: "AI外呼",
        //   icon: require("@/assets/images/ai.png"),
        //   path: "/AIlisth5",
        // },
        {
          name:'员工管理',
          icon: require("@/assets/images/staff.png"),
          path: "/staffh5",
          isShow: false
        }
        // {
        //   name:'员工管理',
        //   icon: require("@/assets/images/staff.png"),
        //   path: "/staffh5",
        // }
      ],
      reportDataList: [],
    };
  },
  // created(){
  //   console.log(this.$store.state.user.isDeptHead);
  // },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getHome();
    this.getStaff();
  },
  methods: {
    jumpgo() {
      this.$router.push("/home");
    },
    jump(path) {
      this.$router.push({
        path: path,
      });
    },
    // 数据简报
    getHome(data) {
      getHome(data).then((res) => {
        this.reportDataList = res.data;
        console.log('this.reportDataList',res);
      });
    },
    // 获取当前用户是否为管理员
    getStaff(data){
      checkStaff(data).then((res) =>{
          // console.log('checkStaff',res)
          this.menuList.forEach(item =>{
            if(item.name === '员工管理'){
              item.isShow = res.data
            }
          })
      })
    }
  },
};
</script>

<style lang="scss" scoped>
.crm_div {
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  // box-shadow: 0px 1px 5px 1px rgb(0 0 0 / 10%);
  background: #ffffff;
  .crm_card {
    width: 25%;
  }
  .icon_div {
    color: #323232;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px 0;
    font-size: 13px;
    .icon_warp {
      height: 46px;
      width: 46px;
      // background: #cccccc;
      border-radius: 50%;
      text-align: center;
      line-height: 46px;
      font-size: 20px;
      margin-bottom: 10px;
      color: white;
      img {
        width: 46px;
        height: 46px;
      }
    }
  }
}
.titleh5 {
  padding-top: 20px;
  font-size: 17px;
  padding-left: 20px;
  font-weight: 600;
  background: #ffffff;
  padding-bottom: 10px;
}
.reportDiv {
  display: grid;
  align-items: center;
  justify-content: center;
  grid-template-columns: repeat(4, 25%);
  background: #ffffff;
  .reportEachDiv {
    font-size: 14px;
    width: 100%;
    height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    span:nth-child(1) {
      font-size: 24px;
      color: #212121;
    }
  }
}
</style>
