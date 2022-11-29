<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: "App",
  mounted() {
    LukeappApi.setHeader("#ff6611", "w", "back", "返回", "close", "close");
  },
  metaInfo() {
    return {
      title:
        this.$store.state.settings.dynamicTitle &&
        this.$store.state.settings.title,
      titleTemplate: (title) => {
        return title
          ? `${title} - ${process.env.VUE_APP_TITLE}`
          : process.env.VUE_APP_TITLE;
      },
    };
  },
  watch: {
    "$store.state.user.userId"(val) {
      if (val) {
        this.connectLink();
      }
    },
  },
  mounted() {},
};
</script>
