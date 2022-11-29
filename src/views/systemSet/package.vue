<template>
  <div class="container">
    <div class="nodata" v-if="list.length == 0">
      <el-empty description="暂无套餐"></el-empty>
    </div>

    <el-card
      class="card"
      v-for="item in list"
      :key="item.id"
      :body-style="{ padding: '0px' }"
    >
      <img :src="item.imgUrl" class="image" />
      <div style="padding: 14px">
        <span>{{ item.name }}</span>
        <div class="bottom clearfix">
          <time class="time">价格：{{ item.price }}</time>
          <el-button type="text" class="button" @click="seeMore(item)"
            >查看详情</el-button
          >
        </div>
      </div>
    </el-card>
    <!-- <div class="each" v-for="item in list" :key="item.id">
      <img :src="item.imgUrl" alt="" />
      <div>
        <span>{{ item.name }}</span>
        <span>价格：{{ item.price }}</span>
        <span class="detail" @click="seeMore(item)">查看详情</span>
      </div>
    </div> -->
    <packageDetailVue ref="packageDetailVue" />
  </div>
</template>

<script>
import { getlist } from "@/api/sms/package";
import packageDetailVue from "./components/packageDetail.vue";
export default {
  components: {
    packageDetailVue,
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    // getlist().then((res) => {
    //   this.list = res.rows;
    // });
  },
  methods: {
    seeMore(item) {
      console.log(item);
      this.$refs.packageDetailVue.open = true;
      this.$refs.packageDetailVue.detail = item;
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  padding: 20px;
  .each {
    display: flex;
    margin-right: 20px;
    margin-top: 30px;
    width: 200px;
    img {
      width: 100px;
      height: 100px;
    }
    div {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      margin-left: 10px;
    }
  }
}
.detail {
  cursor: pointer;
}
.card {
  width: 200px;
  height: 300px;
  margin-right: 20px;
  img {
    width: 200px;
    height: 200px;
  }
}
.time {
  font-size: 13px;
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;
}

.button {
  padding: 0;
  float: right;
}

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both;
}
.nodata{
  width: 100%;
  display: flex;
  justify-content: center;
}
</style>