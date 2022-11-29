/**企业导入 */
<template>
  <div>
    <el-dialog
      :close-on-click-modal="false"
      :title="'导入企业'"
      :visible.sync="open"
      width="80%"
    >
      <el-steps :active="active" align-center>
        <el-step title="上传文件"> </el-step>
        <el-step title="执行导入"> </el-step>
        <el-step title="导入完成">
          <div>333</div>
        </el-step>
      </el-steps>
      <!-- 上传文件  -->
      <div v-show="active == 1">
        <div class="askCard">
          <div class="iconDiv">
            <i class="el-icon-download"></i>
          </div>
          <div class="textDiv">
            <p>填写导入企业的信息</p>
            <p>
              请按照数据模板的格式准备导入数据，模板中的表头名称不可更改，表头行不能删除，单次导入的数据不超过1000条。
            </p>
            <p class="downloadtemp" @click="getTemplates">下载模板</p>
          </div>
        </div>
        <div class="askCard">
          <div class="iconDiv">
            <i class="el-icon-download"></i>
          </div>
          <div class="textDiv">
            <p>上传填好的企业信息表</p>
            <p>文件后缀名必须为xls或xlsx（即excel格式），文件大小不得大于10M</p>
            <el-upload
              class="upload-demo"
              ref="upload"
              :action="uploadFileUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              :file-list="fileList"
              :headers="headers"
              :auto-upload="false"
              :limit="1"
              :data="fileType"
              :on-success="handleUploadSuccess"
            >
              <p class="downloadtemp" style="margin-top: -20px">上传文件</p>
            </el-upload>
          </div>
        </div>
        <!-- <div class="askCard">
          <div class="iconDiv">
            <i class="el-icon-download"></i>
          </div>
          <div class="textDiv">
            <p>选择数据重复时的处理方式</p>
            <p>
              <el-select v-model="fileType.type" placeholder="请选择企业类型">
                <el-option
                  v-for="item in typeList"
                  :key="item.dictValue"
                  :label="item.dictLabel"
                  :value="item.dictValue"
                ></el-option>
              </el-select>
              查重规则：企业名称
            </p>
          </div>
        </div> -->
        <el-button type="primary" style="margin-top: 20px" @click="next"
          >下一步</el-button
        >
      </div>
      <!-- 执行导入 -->
      <div v-show="active == 2">
        <div class="askCard">
          <div class="iconDiv">
            <i style="color: #4bd863" class="el-icon-success"></i>
          </div>
          <div class="textDiv">
            <p>正常数量条数</p>
            <p>{{ uploadAfterData.success }}</p>
          </div>
        </div>
        <div class="askCard">
          <div class="iconDiv">
            <i style="color: #ff6a00" class="el-icon-warning"></i>
          </div>
          <div class="textDiv">
            <p>异常数量条数</p>
            <p>{{ uploadAfterData.failure }}</p>
          </div>
        </div>
        <div class="textDiv">
          <p v-for="(item, index) in uploadAfterData.message" :key="index">
            {{ item }}
          </p>
        </div>
        <el-button style="margin-top: 20px" @click="step2">下一步</el-button>
        <el-button style="margin-top: 20px" @click="uploadreload"
          >重新上传</el-button
        >
      </div>
      <!-- 导入完成 -->
      <div v-show="active == 3">
        <div class="importSuccess">
          <i style="color: #4bd863" class="el-icon-success"></i>
          <p>批量导入完成</p>
          <p>成功导入企业{{ uploadAfterData.success }}条</p>
        </div>
        <div></div>
        <el-button style="margin-top: 20px" @click="uploadSuccess"
          >完成</el-button
        >
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getTemplate, performImport, importAll } from "@/api/customer/index";
import { getToken } from "@/utils/auth";
export default {
  data() {
    return {
      active: 1,
      open: true,
      type: "0",
      fileType: {
        type: "0",
      },
      typeList: [
        { dictValue: "0", dictLabel: "跳过数据" },
        { dictValue: "1", dictLabel: "覆盖导入" },
        { dictValue: "2", dictLabel: "依然导入" },
      ],
      fileList: [],
      uploadAfterData: {
        success: "0",
        failure: "0",
      },
      headers: {
        Authorization: "Bearer " + getToken(),
      },
      uploadFileUrl: process.env.VUE_APP_BASE_API + "/crm/company/import", // 上传的图片服务器地址
    };
  },
  methods: {
    handlePreview() {},
    handleRemove() {},
    handleUploadSuccess(files) {
      console.log(files);
    },
    getTemplates() {
      getTemplate().then((res) => {
        // console.log(res);
        // window.open(res.data);
        let a = document.createElement("a");
        a.href = res.data
        a.click();
        // const blob = new Blob([res]);
        // console.log('blob: ', blob);
        // const link = document.createElement("a");
        // const body = document.querySelector("body");
        // link.href = window.URL.createObjectURL(blob);
        // link.download = '客户信息' + ".xls";
        // // fix Firefox
        // link.style.display = "none";
        // body.appendChild(link);
        // link.click();
        // body.removeChild(link);
        // window.URL.revokeObjectURL(link.href);
      });
    },
    getBlob(url) {
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = "blob";
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve(xhr.response);
          }
        };
        xhr.send();
      });
    },
    saveAs(blob, filename) {
      console.log("blob: ", blob);
      //   const _blob = new Blob([blob], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      //   console.log('_blob: ', _blob);
      if (window.navigator.msSaveOrOpenBlob) {
        navigator.msSaveBlob(blob, filename);
      } else {
        const link = document.createElement("a");
        const body = document.querySelector("body");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename + ".xls";
        // fix Firefox
        link.style.display = "none";
        body.appendChild(link);
        link.click();
        body.removeChild(link);
        window.URL.revokeObjectURL(link.href);
      }
    },
    uploadreload() {
      this.active = 1;
      this.fileList = [];
    },
    step2() {
      //   this.$refs.upload.submit();
      let formData = new FormData();
      formData.append("file", this.$refs.upload.uploadFiles[0].raw);
      formData.append("type", this.fileType.type);
      //  formData.append("type", 2);
      this.$notify({
        title: "提示",
        message: "执行导入中，导入成功将会通知",
        duration: 0,
      });
      importAll(formData).then((res) => {
        // this.active = 3;
      });
      this.open = false
    },
    uploadSuccess() {
      this.open = false;
      this.$emit("reroad");
    },
    next() {
      if (this.$refs.upload.uploadFiles.length == 0) {
        this.$message.error("请上传导入企业信息表");
        return;
      }
      let formData = new FormData();
      formData.append("file", this.$refs.upload.uploadFiles[0].raw);
      performImport(formData).then((res) => {
        this.uploadAfterData = res.data;
        console.log(this.uploadAfterData);
        if (this.active++ > 2) this.active = 1;
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.askCard {
  border: 1px solid #999999;
  display: flex;
  align-items: center;
  margin-top: 40px;
  //   height: 115px;
  .iconDiv {
    width: 100px;
    font-size: 30px;
    text-align: center;
    // background: #ccc;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .textDiv {
    border-left: 1px solid #999999;
    padding-left: 20px;
    height: 100%;
  }
  .downloadtemp {
    color: #1890ff;
    cursor: pointer;
  }
}
.importSuccess {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  i {
    font-size: 50px;
  }
  p:nth-child(2) {
    font-size: 20px;
    font-weight: 600;
  }
}
</style>