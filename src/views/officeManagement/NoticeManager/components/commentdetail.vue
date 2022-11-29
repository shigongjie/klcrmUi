/**评论详情 */
<template>
  <div>
    <div v-if="list.length <= 0">暂无评论</div>
    <div v-else>
      <div v-for="(item, index) in list" :key="index">
        <div class="date">
          {{ item.date }}
        </div>
        <div>
          <div class="card" v-for="(items, indexs) in item.list" :key="indexs">
            <div class="pd10 headlineAndUser">
              <span>{{ items.headline }}</span>
              <div class="userInfo">
                <img
                style="width:30px;height:30px"
                  :src="
                    items.avatar == '' || items.avatar == null
                      ? $store.state.user.defaultAvatar
                      : items.avatar
                  "
                  alt=""
                />
              </div>
              <span>{{ items.staffName }}</span>
            </div>
            <div class="pd10">
              <span>{{ items.commentContent }}</span>
            </div>
            <div class="pd10">
              评论时间 <i class="el-icon-time"></i>{{ items.createTime }}
            </div>
            <!-- <div class="pd10">
              退出时间 <i class="el-icon-time"></i>{{ items.endTime }}
            </div>
            <div class="pd10">
              附件下载时间 <i class="el-icon-time"></i>{{ items.downloadTime }}
            </div> -->
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { discusspage } from "@/api/notic/index";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    if (this.id) {
      discusspage({ id: this.id }).then((res) => {
        this.list = res.rows;
      });
    }
  },
};
</script>

<style lang="scss" scoped>
.pd10 {
  padding: 10px;
}
.date {
  padding: 10px;
  width: 100px;
  background: #409eff;
  color: white;
  border-top-right-radius: 20px;
  border-bottom-right-radius: 20px;
}
.card {
  background: #f9f9f9;
  margin-top: 15px;
}
.headlineAndUser{
  display: flex;
  align-items: center;
}
.userInfo{
  display: flex;
  padding-left: 20px;
  align-items: flex-end;
}
</style>