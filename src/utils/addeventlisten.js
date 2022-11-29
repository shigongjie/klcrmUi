import store from '@/store'
import Vue from 'vue';

export function connectLink() {

  let source = new EventSource(process.env.VUE_APP_BASE_API + '/sse/connect?userId=' + store.state.user.userId);

  source.addEventListener('message', (e) => {
    // setMessageInnerHTML(e.data);
    console.log('e.data: ', e.data);

    // type 类型 0系统 1员工 2客户 3公海 4线索
    if (JSON.parse(e.data).type == 1) {
      window.getStaffData()
      this.$notify({
        title: '提示',
        message: JSON.parse(e.data).msg,
        duration: 0
      });
    }
    if (JSON.parse(e.data).type == 2) {
      window.getCustomerData()
      this.$notify({
        title: '提示',
        message: JSON.parse(e.data).msg,
        duration: 0
      });
    }
    if (JSON.parse(e.data).type == 3) {
      window.getseaCurtomerData()
      this.$notify({
        title: '提示',
        message: JSON.parse(e.data).msg,
        duration: 0
      });
    }
    if (JSON.parse(e.data).type == 4) {
      window.getsaleleadData()
      this.$notify({
        title: '提示',
        message: JSON.parse(e.data).msg,
        duration: 0
      });
    }
    if (JSON.parse(e.data).type == 0) {

    }
    if (JSON.parse(e.data).type == 5) {
      window.rechargeSuccess()
    }

  });
  source.addEventListener('error', (e) => {
    // // setMessageInnerHTML(e.data);  
    // console.log('e.data: ', e.data);
    // this.$notify({
    //   title: '提示',
    //   message: JSON.parse(e.data).msg,
    //   duration: 0
    // });

  });
}
