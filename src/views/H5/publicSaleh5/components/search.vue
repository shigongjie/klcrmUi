<template>
  <div class="h5-container">
    <Navbar :title="'搜索公共线索'" @jump="jumpgo" />
    <div class="container" :style="$store.state.user.isApp == 2 ? 'padding-top: 16px;' : ''">
      <div class="headers" v-if="$store.state.user.isApp != 2">
        <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
        <span class="title-clue">搜索公共线索</span>
        <span></span>
      </div>
      <div class="work pd20-24">
        <van-form ref="rulesForm" @submit="submit">
          <div style="height: 10px"></div>

          <VantSelect center input-align="right" label="省" placeholder="请选择省" v-model="submitParams.province_code"
            :columns="provinceList" :option="{ label: 'name', value: 'id' }"
            :rules="[{ required: false, message: '请选择省' }]" />
          <VantSelect center input-align="right" label="市" placeholder="请选择市" v-model="submitParams.city_code"
            :columns="cityList" :option="{ label: 'name', value: 'id' }"
            :rules="[{ required: false, message: '请选择市' }]" />
          <VantSelect center input-align="right" label="区" placeholder="请选择区" v-model="submitParams.region_code"
            :columns="regionList" :option="{ label: 'name', value: 'id' }"
            :rules="[{ required: false, message: '请选择区' }]" />
          <!-- <VantSelect center input-align="right" label="客户行业" placeholder="请选择客户行业" v-model="submitParams.industry"
            :columns="industryList" required :option="{ label: 'name', value: 'id' }"
            :rules="[{ required: true, message: '请选择客户行业' }]" /> -->
          <van-field required v-model="submitParams.industryJson" is-link center readonly label="客户行业" placeholder="请选择客户行业"
            input-align="right" @click="showArea = true" />
          <van-popup v-model="showArea" round position="bottom">
            <van-cascader required v-model="submitParams.industry" title="请选择客户行业" :options="industryList"
              :field-names="{ text: 'name', value: 'id', children: 'list' }" @close="showArea = false"
              @finish="onFinish" />
          </van-popup>
          <div style="height: 10px"></div>
          <VantSelect center input-align="right" label="经营状况" placeholder="请选择经营状况" v-model="submitParams.manage_type"
            :columns="dict.type.company_manage_status" :option="{ label: 'label', value: 'value' }" />
          <VantSelect center input-align="right" label="企业电话" placeholder="请选择企业电话" v-model="submitParams.phone"
            :columns="phoneList" :option="{ label: 'name', value: 'id' }" />
          <VantSelect center input-align="right" label="企业固话" placeholder="请选择企业固话" v-model="submitParams.tel"
            :columns="telList" :option="{ label: 'name', value: 'id' }" />
          <!-- <van-cell title="生日" placeholder="请选择联系人生日" :value="submitParams.birthday" @click="show = true" /> -->
          <van-field v-model="submitParams.on_start_time" is-link center readonly label="成立开始日期" placeholder="请选择成立开始日期"
            input-align="right" @click="showStartTime = true" />
          <van-popup v-model="showStartTime" round position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
              @confirm="onConfirmDateStart" />
          </van-popup>
          <div style="height: 10px"></div>
          <van-field v-model="submitParams.on_end_time" is-link center readonly label="成立结束日期" placeholder="请选择成立结束日期"
            input-align="right" @click="show = true" />
          <van-popup v-model="show" round position="bottom">
            <van-datetime-picker v-model="currentDate" type="date" title="选择年月日" :min-date="minDate" :max-date="maxDate"
              @confirm="onConfirmDateEnd" />
          </van-popup>
          <div style="height: 10px"></div>
          <VantSelect center input-align="right" label="注册资金" placeholder="请选择注册资金"
            v-model="submitParams.register_money" :columns="dict.type.company_cash"
            :option="{ label: 'label', value: 'value' }" />
          <!-- <VantSelect center input-align="right" label="企业规模" placeholder="请选择企业规模" v-model="submitParams.industry"
            :columns="industryList" :option="{ label: 'name', value: 'id' }" /> -->
          <VantSelect center input-align="right" label="企业类型" placeholder="请选择企业类型" v-model="submitParams.company_type"
            :columns="dict.type.saled_company_type" :option="{ label: 'label', value: 'value' }" />
        </van-form>
        <div class="btnwarp">
          <div @click="search">搜索</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getlist } from "@/api/customer/index";
import {
  getareaList,
  getIndustryList,
  checkSearching,
} from "@/api/publicSaleds/index";
import { getprovinceList, getcityList, getregionList } from "@/api/city/index"
export default {
  dicts: ["company_manage_status", "company_cash", "saled_company_type"],
  data() {
    return {
      value: "",
      loading: true,
      total: 0,
      isApp: 2,
      submitParams: {
        pageNum: 1,
        pageSize: 10,
        region_code: "",
        city_code: '',
        province_code: ''
      },
      phoneList: [
        { name: '全部', id: null },
        { name: '有', id: 1 },
        { name: '无', id: 0 }
      ],
      telList: [
        { name: '全部', id: null },
        { name: '有', id: 1 },
        { name: '无', id: 0 }
      ],
      provinceList: [],
      regionList: [],
      cityList: [],
      customerList: [],
      queryParams: {},
      showArea: false,
      show: false,
      areaList: [],
      industryList: [],
      minDate: new Date(1990, 0, 1),
      maxDate: new Date(2025, 10, 1),
      currentDate: new Date(2022, 0, 17),
      showStartTime: false,
    };
  },
  watch: {
    'submitParams.province_code'(val) {
      this.changeProvince(val)
    },
    'submitParams.city_code'(val) {
      this.changeCity(val)
    }
  },
  beforeMount() {
    getprovinceList().then(res => {
      this.provinceList = res.data
    })
    /**所属行业*/
    getIndustryList().then((res) => {
      this.industryList = res.data;
    });
    getareaList().then((res) => {
      this.areaList = res.data;
    });
  },
  mounted() {
    this.isApp = LukeappApi.getattribute().header;
    this.getData(this.queryParams);
  },
  methods: {
    changeProvince(val) {
      console.log(val)
      this.submitParams.city_code = "";
      this.submitParams.region_code = "";
      getcityList({ provinceCode: val }).then(res => {
        this.cityList = res.data
      })
    },
    changeRegion() { },
    changeCity(val) {
      console.log(val)
      this.submitParams.region_code = "";
      getregionList({ cityCode: val }).then(res => {
        this.regionList = res.data
      })
    },
    onConfirmDateStart(val) {
      console.log(val, 1111)
      this.submitParams.on_start_time = this.formatDate(val)
      this.showStartTime = false
    },
    onConfirmDateEnd(val) {
      console.log(val)
      this.submitParams.on_end_time = this.formatDate(val)
      this.show = false
    },
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    onConfirm(values) {
      this.value = values
        .filter((item) => !!item)
        .map((item) => item.name)
        .join("/");
      this.showArea = false;
    },
    search() {
      if (
        this.submitParams.industry == "" ||
        this.submitParams.industry == null ||
        this.submitParams.industry == undefined
      ) {
        this.$message({
          message: "请选择所属行业",
          type: "error",
          duration: 1000,
        });
        return;
      }
      // checkSearching({
      //   region: this.submitParams.address,
      //   industry: this.submitParams.industry,
      // }).then((res) => {
      // if (res.success) {
      this.$router.push({
        path: "/searchpublicSaleresulth5",
        query: {
          ob: JSON.stringify(this.submitParams),
          type:'highSearch'
        },
        // });
        // }
      });
    },
    onFinish(value, index, o) {
      console.log(value);
      this.submitParams.industryJson = value.selectedOptions
        .map((option) => option.name)
        .join("/");
      // this.value.pcdJson = value.selectedOptions
      // .map((option) => option.name)
      // .join("/");
      // this.submitParams.address = value.selectedOptions
      //   .map((option) => option.id)
      //   .join(",");
      console.log(this.submitParams);
      this.showArea = false;
    },
    submit() {
      this.$router.push({
        path: "/addcustomer",
      });
    },
    jumpgo() {
      this.$router.go(-1);
    },
    jumpGo() {
      // this.$router.push("/crm");
       this.$router.go(-1);
    },
    /**获取数据 */
    getData(query) {
      this.loading = true;
      getlist(query).then((res) => {
        this.customerList = res.rows;
        this.total = res.total;
        this.loading = false;
      });
    },
    // 跳转详情
    jumpDetail(ob) {
      this.$router.push({
        path: "/customerDetailh5",
        query: {
          id: ob.id,
        },
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  height: 100%;
  color: #606266;
}

.headers {
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
}
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
}

.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}

.work {
  // height: 100%;
  padding-top: 66px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background: RGB(249, 249, 249);
}

.contant {
  box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 10%);
  width: 95%;
  margin: auto;
  margin-top: 15px;
  display: flex;
  justify-content: space-between;
  padding: 20px 10px;
  background: #ffffff;
  border-radius: 6px;

  .customer_info {
    display: flex;
    flex-direction: column;

    .customer_name {
      font-size: 15px;
      font-weight: 600;
    }
  }

  .customer_status {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    img {
      width: 30px;
      height: 30px;
      margin-bottom: 10px;
    }

    div {
      display: flex;
      flex-direction: column;
      align-items: center;
    }
  }
}

.customer_right {
  display: flex;

  .right_icon {
    display: flex;
    align-items: center;
    padding-left: 20px;
  }
}

.font13 {
  font-size: 13px;
}

.nodata {
  width: 320px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  height: 500px;
  color: #c0c4cc;

  i {
    margin-bottom: 30px;
    font-size: 80px;
    color: #c0c4cc;
  }
}

.clickSearch {
  color: #409eff;
  margin-top: 15px;
  border-radius: 20px;
  border: 1px solid #409eff;
  padding: 8px 12px;
  font-size: 14px;
}

.btnwarp {
  // margin-top: 50px;
  display: flex;
  justify-content: center;

  div {
    width: 100%;
    color: white;
    background: #267efa;
    margin-top: 15px;
    border-radius: 20px;
    border: 1px solid #267efa;
    padding: 10px 12px;
    font-size: 14px;
    text-align: center;
    border-radius: 6px;
  }
}

.dh-field {
  margin-bottom: 10px
}
</style>
