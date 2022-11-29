<template></template>

<script>
import {
  nextCustomerExport,
  followrecordexport,
  workRecordList,
  workrecordexport,
  customerworkorderrecordexport,
  attributionexport,
  logexport,
  customerAttributionRecordList,
  operaLogList,
  customerdetailexport,
} from "@/api/customer/index";

export default {
  data() {
    return {
      taskqueryParams: {},
      time2: "",
      belongqueryParams: {},
      time3: "",
      time4: "",
      operaqueryparams: {},
    };
  },
  methods: {
    customerDetailExport() {
      customerdetailexport({ customerId: this.$route.query.id }).then(
        (data) => {
          if (!data) {
            this.$message.warning("文件下载失败");
            return;
          }
          if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(
              new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }),
              "客户资料详情" + ".xlsx"
            );
          } else {
            let url = window.URL.createObjectURL(
              new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            );
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "客户资料详情" + ".xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(url); // 释放掉blob对象
          }
        }
      );
    },
    operaSearch() {
      let data = {};
      data.customerId = this.$route.query.id;
      if (this.time4 != "" && this.time4 != null) {
        data.startTime = this.time4[0];
        data.endTime = this.time4[1];
      }
      operaLogList(data).then((res) => {
        this.operaLogData = res.rows;
      });
    },
    belongRecordSearch() {
      let data = {};
      data.customerId = this.$route.query.id;
      if (this.time3 != "" && this.time3 != null) {
        data.startTime = this.time3[0];
        data.endTime = this.time3[1];
      }
      customerAttributionRecordList(data).then((res) => {
        this.customerAttributionRecordData = res.rows;
      });
    },
    belongRecordExport() {
      attributionexport({ customerId: this.$route.query.id }).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "归属记录" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "归属记录" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    operaExport() {
      logexport({ customerId: this.$route.query.id }).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "操作日志" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "操作日志" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    customerworkorderrecordexport() {
      customerworkorderrecordexport({ customerId: this.$route.query.id }).then(
        (data) => {
          if (!data) {
            this.$message.warning("文件下载失败");
            return;
          }
          if (typeof window.navigator.msSaveBlob !== "undefined") {
            window.navigator.msSaveBlob(
              new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              }),
              "工单记录" + ".xlsx"
            );
          } else {
            let url = window.URL.createObjectURL(
              new Blob([data], {
                type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
              })
            );
            let link = document.createElement("a");
            link.style.display = "none";
            link.href = url;
            link.setAttribute("download", "工单记录" + ".xlsx");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link); // 下载完成移除元素
            window.URL.revokeObjectURL(url); // 释放掉blob对象
          }
        }
      );
    },
    //   跟进记录导出
    followRecordDownload() {
      followrecordexport({ customerId: this.$route.query.id }).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "跟进记录" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "跟进记录" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    workrecordexport() {
      workrecordexport({ customerId: this.$route.query.id }).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "任务记录" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "任务记录" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    // 下级客户导出
    nextcustomerExport() {
      nextCustomerExport({ customerId: this.$route.query.id }).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "下级客户列表" + ".xlsx"
          );
        } else {
          let url = window.URL.createObjectURL(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            })
          );
          let link = document.createElement("a");
          link.style.display = "none";
          link.href = url;
          link.setAttribute("download", "下级客户列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    searchtaskList() {
      let data = {};
      data.customerId = this.$route.query.id;
      data.keyword = this.taskqueryParams.keyword;
      data.remindTask = this.taskqueryParams.type;
      if (this.time2 != "" && this.time2 != null) {
        data.startTime = this.time2[0];
        data.endTime = this.time2[1];
      }
      workRecordList(data).then((res) => {
        this.workRecordData = res.rows;
      });
    },
  },
};
</script>

<style>
</style>