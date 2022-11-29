/**浏览记录 */
<template>
  <div>
    <el-tabs v-model="activeName">
      <el-tab-pane :label="'已查看' + ' (' + readed + ')'" name="0">
        <div class="maxheight">
          <div class="each" v-for="(item, index) in list" :key="index">
          <div>
            <!-- <span>部门名称</span> -->
            <span>{{ item.browseId }}</span>
          </div>
          <div>
            <span><i class="el-icon-time"></i> 开始时间</span>
            <span>{{ item.createTime }}</span>
          </div>
          <div>
            <span><i class="el-icon-time"></i>退出时间</span>
            <span>{{ item.endTime }}</span>
          </div>
          <div>
            <span>附件</span>
            <span>{{ item.isUploading == 1 ? "有附件" : "无附件" }}</span>
          </div>
          <div>
            <span>{{ item.isLook == 1 ? "已查看" : "未查看" }}</span>
          </div>
        </div>
        </div>
      </el-tab-pane>
      <el-tab-pane :label="'未查看' + ' (' + unread + ')'" name="1">
        <div class="maxheight">
          <div class="each" v-for="(item, index) in list" :key="index">
          <div>
            <!-- <span>部门名称</span> -->
            <span>{{ item.browseId }}</span>
          </div>
          <!-- <div>
            <span><i class="el-icon-time"></i> 开始时间</span>
            <span>{{
              item.createTime == null ? "未查看" : item.createTime
            }}</span>
          </div>
          <div>
            <span><i class="el-icon-time"></i>退出时间</span>
            <span>{{ item.endTime == null ? "未查看" : item.createTime }}</span>
          </div>
          <div>
            <span>附件</span>
            <span>{{ item.isUploading == 1 ? "有附件" : "无附件" }}</span>
          </div> -->
          <div>
            <span>{{ item.isLook == 1 ? "已查看" : "未查看" }}</span>
          </div>
        </div>
        </div>
        
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import { afficheinform, informpage } from "@/api/notic/index";
export default {
  props: {
    id: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      activeName: '0',
      list: [],
      readed: 0,
      unread: 0,
    };
  },
  watch: {
    activeName(val) {
      if (val == 0) {
        afficheinform({ lookType: 0, id: this.id }).then((ress) => {
          this.list = ress.rows;
        });
      } else {
        afficheinform({ lookType: 1, id: this.id }).then((ress) => {
          this.list = ress.rows;
        });
      }
    },
  },
  mounted() {
    if (this.id) {
      informpage({ id: this.id }).then((res) => {
        this.readed = res.data.readed;
        this.unread = res.data.unread;
        afficheinform({ lookType: 0, id: this.id }).then((ress) => {
          console.log(ress);
          this.list = ress.rows;
        });
      });
    }
  },
};
</script>

<style lang='scss' scoped>
.each {
  display: flex;
  justify-content: space-between;
  padding: 20px 15px;
  border: 1px solid #cccccc;
  margin: auto;
  margin-top: 15px;
  div {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    span {
      margin-bottom: 10px;
    }
  }
}
.maxheight{
  max-height: 500px;
  overflow-y: auto;
}
</style>