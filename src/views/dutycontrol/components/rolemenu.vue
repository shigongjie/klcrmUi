/**操作权限 */
<template>
  <div>
    <div class="warp" v-for="(item, index) in roleMenuList" :key="index">
      <div class="pid">
        <el-checkbox
          :indeterminate="item.isIndeterminate"
          v-model="item.checkAll"
          @change="handleCheckAllChange(item)"
          ></el-checkbox
        >
        <i class="el-icon-s-flag"></i> {{ item.name }}
      </div>
      <div>
        <el-checkbox
          class="checkboxself"
          v-for="(items, indexs) in item.list"
          :key="indexs"
          :label="items.menuName"
          :checked="items.isSelected"
          v-model="items.isSelected"
          @change="change(items)"
        ></el-checkbox>
      </div>
    </div>
    <div class="btnWarp">
      <el-button type="primary" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
import { getRoleMenu, saveRoleMenu } from "@/api/role/index";
export default {
  props: {
    id: {},
  },
  data() {
    return {
      roleMenuList: [],
    };
  },
  mounted() {
    this.getList();
  },
  methods: {
    handleCheckAllChange(ob) {
      ob.list.forEach((item, index) => {
        item.isSelected = ob.checkAll;
      });
    },
    save() {
      let ids = [];
      if (this.roleMenuList != null) {
        this.roleMenuList.forEach((i, t) => {
          if (i.list) {
            i.list.forEach((o, a) => {
              if (o.isSelected) {
                if (!ids.includes(o.menuId)) {
                  ids.push(o.menuId);
                }
                // ids.push(o.id);
              }
            });
          }
        });
      }

      let data = {};
      data.ids = ids;
      data.roleId = this.$route.query.id;
      saveRoleMenu(data).then((res) => {
        this.$message({
          message: "修改成功",
          type: "success",
        });
        this.getList();
      });
    },
    change() {},
    getList() {
      getRoleMenu({ roleId: this.$route.query.id }).then((res) => {
        this.roleMenuList = res.data;
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
</style>
