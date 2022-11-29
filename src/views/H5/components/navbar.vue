<template>
  <div style="background: #ffffff;z-index:99">
    <!-- <div class="h44" style="width: 100%" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="headerApp" v-if="$store.state.user.isApp == 2">
      <span @click="jumpgo()" class="font"
        ><i class="el-icon-arrow-left"></i>返回</span
      >
      <span class="title">{{ title }}</span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      isApp: 2,
    };
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    console.log(this.$props);
  },
  methods: {
    jumpgo() {
      this.$emit("jump");
    },
  },
};
</script>

<style lang="scss">
.headerApp {
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  padding-top: 64px;
  background: #ffffff;
  .font {
    position: fixed;
    font-size: 16px;
  }
  .title {
    display: block;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    text-align: center;
  }
}
.h44 {
  height: 44px;
  z-index: 99;
  background: #ffffff;
}
</style>
