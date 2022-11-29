/**公司基本信息 */
<template>
  <div>
    <div class="titleSelf">基本信息</div>
    <div class="tableSelf">
      <div class="each">
        <div>企业电话：</div>
        <div>{{companyData.phone}}</div>
      </div>
      <div class="each">
        <div>所在地区：</div>
        <div>{{companyData.address}}</div>
      </div>
      <div class="each">
        <div>详细地址：</div>
        <div>{{companyData.detailAddress}}</div>
      </div>
      <div class="each">
        <div>邮政编码：</div>
        <div>{{companyData.zipCode}}</div>
      </div>
      <div class="each">
        <div>企业传真：</div>
        <div>{{companyData.fax}}</div>
      </div>
      <div class="each">
        <div>企业网址：</div>
        <div>{{companyData.url}}</div>
      </div>
      <div class="each">
        <div>成立时间：</div>
        <div>{{companyData.foundTime}}</div>
      </div>
      <div class="each">
        <div>创建人员：</div>
        <div>{{companyData.phone}}</div>
      </div>
      <div class="each">
        <div>更新时间：</div>
        <div>{{companyData.updateTime}}</div>
      </div>
    </div>
    <div class="titleSelf">联系人信息</div>
    <div class="tableSelf">
      <div class="each">
        <div>联系人姓名：</div>
        <div>{{companyData.contactName}}</div>
      </div>
      <div class="each">
        <div>尊称：</div>
        <div>{{companyData.contactSex}}</div>
      </div>
      <div class="each">
        <div>部门职务：</div>
        <div>{{companyData.contactJob}}</div>
      </div>
      <div class="each">
        <div>手机号码：</div>
        <div>{{companyData.contactPhone}}</div>
      </div>
      <div class="each">
        <div>电子邮箱：</div>
        <div>{{companyData.contactEmail}}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    companyData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {};
  },
  mounted(){},
};
</script>

<style lang='scss' scoped>
.titleSelf {
  font-weight: 600;
  margin-top: 10px;
}
.tableSelf {
  margin-top: 20px;
  font-size: 13px;
  border: 1px solid #ccc;
  .each {
    border-bottom: 1px solid #ccc;
  }
  .each:last-child {
    border-top: none;
    border-bottom: none;
  }
  .each {
    display: flex;
    align-items: center;
    height: 40px;
    div {
      height: 100%;
      line-height: 40px;
    }
    div:nth-child(1) {
      width: 130px;
      border-right: 1px solid #ccc;
      background: #f5f5f5;
      text-align: center;
    }
    div:nth-child(2) {
      padding-left: 20px;
    }
  }
}
</style>