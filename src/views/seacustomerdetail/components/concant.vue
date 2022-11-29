<template>
</template>


<script>
import { deleteByIds, contactexport } from "@/api/customer/index";
export default {
  data() {
    return {
      concantOpen: false,
      editConcantId: "",
      chooseConcantIds: [], //选中的联系人
    };
  },
  methods: {
    exports(ob) {
      contactexport(ob).then((data) => {
        if (!data) {
          this.$message.warning("文件下载失败");
          return;
        }
        if (typeof window.navigator.msSaveBlob !== "undefined") {
          window.navigator.msSaveBlob(
            new Blob([data], {
              type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            }),
            "联系人列表" + ".xlsx"
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
          link.setAttribute("download", "联系人列表" + ".xlsx");
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link); // 下载完成移除元素
          window.URL.revokeObjectURL(url); // 释放掉blob对象
        }
      });
    },
    exportByChoose() {
      let datas = {};
      datas.ids = this.chooseConcantIds;
      if (this.chooseConcantIds.length < 1) {
        this.$message.error("请至少选择一条数据");
        return;
      }
      this.exports(datas);
    },
    exportByParams() {
      this.exports(this.queryParams);
    },
    handledelConcant(ob) {
      if (ob) {
        this.chooseConcantIds = [ob];
      }
      if (this.chooseConcantIds.length <= 0) {
        this.$message({
          showClose: true,
          message: "请选择要删除的联系人",
          type: "warning",
        });
        return;
      } else {
        this.$confirm("此操作将永久删除选中联系人, 是否继续?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            deleteByIds({ ids: this.chooseConcantIds }).then((res) => {
              this.getcontactList();
              this.$message({
                type: "success",
                message: "删除成功!",
              });
            });
          })
          .catch(() => {
            this.$message({
              type: "info",
              message: "已取消删除",
            });
          });
      }
    },
    handledelEdit(id) {
      this.editConcantId = id;
      this.concantOpen = true;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
    handleAddConcant() {
      this.editConcantId = "";
      this.concantOpen = true;
      this.$nextTick(() => {
        this.$refs.ConnectPerson.open = true;
      });
    },
  },
};
</script>

<style>
</style>