<template>
  <div class="containers">
    <el-tabs v-model="activeName">
      <el-tab-pane label="常用语" name="0"><Useful /></el-tab-pane>
      <el-tab-pane label="知识库" name="1"><knowladge /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
import Useful from "./components/useful.vue";
import knowladge from "./components/knowladge.vue";
export default {
  components: { Useful, knowladge },
  data() {
    return {
      activeName: "0",
    };
  },
};
</script>

<style lang="scss">
.containers {
  min-height: calc(100vh - 84px);
  padding: 20px;
}
</style>