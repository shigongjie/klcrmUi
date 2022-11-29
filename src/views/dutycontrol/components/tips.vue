<template>
  <div>
    <el-dialog title="帮助提示" :visible.sync="tipsdialogVisible" width="30%">
      <div style="margin-top:-20px">
        <p>
          1、职务代表操作权限和数据权限，操作权限是指具有该职务的用户是否能查看、新增、编辑、删除某些数据，数据权限是指具有该角色的用户能操作的数据的范围。
        </p>
        <p>2、超级管理员的权限是系统默认的最大权限的角色，不能修改。</p>
        <p>3、需要删除职务时必须先清除该职务下的所有成员。</p>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tipsdialogVisible: false,
    };
  },
};
</script>

<style lang='scss' scoped>
::v-deep.el-dialog__body {
  padding-top: 0 !important;
}
</style>