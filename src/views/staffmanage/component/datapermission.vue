/* *数据权限 */
<template>
  <div>
    <div class="tip">
      <i>数据权限</i>（设置该角色的用户可以操作的数据的范围）
    </div>
    <div class="warp" v-for="(item, index) in dataPermissionList" :key="index">
      <el-radio v-model="radio" :label="item.dictValue">
        {{ item.dictLabel }}</el-radio
      >
    </div>
    <div class="btnWarp">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { saveDataType, getDataType } from "@/api/staff/index";
export default {
  props: {
    id: {},
  },
  data() {
    return {
      roleMenuList: [],
      dataPermissionList: [],
      radio: "0",
    };
  },
  beforeMount() {
    this.getDicts("datapermission").then((res) => {
      this.dataPermissionList = res.data;
    });
  },
  mounted() {
    this.getList();
  },
  methods: {
    save() {
      let data = {};
      data.dataType = this.radio;
      data.staffId = this.$route.query.id;
      saveDataType(data).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.getList();
      });
    },
    change() {},
    getList() {
      getDataType({ staffId: this.$route.query.id }).then((res) => {
        this.radio = res.data + "";
      });
    },
  },
};
</script>

<style  lang='scss' scoped>
.warp {
  padding: 6px 12px;
  .pid {
    padding: 15px 0;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid #ccc;
  }
  .checkboxself {
    margin-top: 15px;
  }
}
.btnWarp {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.tip {
  font-size: 13px;
  padding-bottom: 10px;
  padding-left: 10px;
  i {
    font-style: normal;
    font-weight: 600;
  }
}
</style>