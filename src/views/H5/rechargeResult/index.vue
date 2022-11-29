/**充值结果 */
<template>
  <div>
    <div class="imgWarp">
      <img src="@/assets/images/success.png" alt="" />
      <div class="success">支付成功</div>
      <div class="btns" @click="handlejump()">返回首页</div>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    handlejump() {
      this.$router.push({
        path: `/mine`,
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.imgWarp {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  margin-top: 115px;
  img {
    width: 64px;
    height: 64px;
  }
  .btns {
    width: 168px;
    height: 40px;
    background: #ffffff;
    border: 1px solid #ff6711;
    border-radius: 20px;
    text-align: center;
    line-height: 40px;
    color: #ff6711;
    margin-top: 120px;
  }
  .success {
    margin-top: 20px;
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #32bb71;
  }
}
</style>