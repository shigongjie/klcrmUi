//封装VanFieldSelectPicker组件
<template>
  <div class="dh-field">
    <div class="van-hairline--bottom">
      <!-- <van-field
        v-model="resultLabel"
        v-bind="$attrs"
        readonly
        :is-link="$attrs.disabled === undefined"
        @click="showPopu($attrs.disabled)"
        class="dh-cell"
      />
      <van-popup v-model="show" position="bottom">
        <van-field
          v-model="searchVal"
          placeholder="搜索"
          @input="search"
          v-if="isSearch"
        />
        <van-picker
          v-bind="$attrs"
          :columns="columnsData"
          show-toolbar
          @cancel="cancel"
          @confirm="onConfirm"
          @change="change"
          :value-key="this.option.label"
        />
      </van-popup> -->
      <van-field
        readonly
        v-model="resultLabel"
        v-bind="$attrs"
        :is-link="$attrs.disabled === undefined"
        @click="showPopu($attrs.disabled)"
      />
      <van-popup v-model="show" position="bottom">
        <van-cascader
          v-bind="$attrs"
          show-toolbar
          v-model="searchVal"
          :options="columnsData"
          @close="show = false"
          @change="change"
          :field-names="option"
          @finish="onConfirm"
        />
      </van-popup>
    </div>
  </div>
</template>

<script>
export default {
  name: "VanFieldSelectPicker",
  model: {
    prop: "selectValue",
  },
  props: {
    columns: {
      type: Array,
      default: function () {
        return [];
      },
    },
    selectValue: {
      type: [String, Number],
      default: "",
    },
    option: {
      type: Object,
      default: function () {
        return { label: "dictLabel", value: "dictValue" };
      },
    },
    isSearch: {
      type: Boolean,
      default: false,
    },
    offOption: {
      // 关闭option配置key-value;当数据是非集合的数组的时候，开启
      type: Boolean,
      default: false,
    },
  },
  computed: {
    resultLabel: {
      get() {
        let label = "";
        // const res = this.columns.filter((item) => {
        //   const data = this.offOption ? item : item[this.option.value];
        //   return data === this.resultValue;
        // });
        let res = {};
        let res2 = {};
        let res3 = {};
        if (this.resultValue) {
            console.log(this.resultValue)
          this.resultValue.split(",").forEach((item) => {
            this.columns.forEach((i) => {
              if (i.id == item) {
                res = i;
              }
            });
          });
          if (res.list) {
            res.list.forEach((i) => {
              if (i.id == this.resultValue.split(",")[1]) {
                res2 = i;
              }
            });
          }
          if (res2.list) {
            res2.list.forEach((i) => {
              if (i.id == this.resultValue.split(",")[2]) {
                res3 = i;
              }
            });
          }
          if (res.name) {
            label = res.name + "/" + res2.name;
          } else {
            label = "";
          }
        }

        // if (res.length) {
        //   label = this.offOption ? res[0] : res[0][this.option.label];
        // }

        return label;
      },
      set() {},
    },
  },
  data() {
    return {
      show: false,
      searchVal: "",
      resultValue: this.selectValue,
      columnsData: [],
    };
  },
  methods: {
    getTree(list, pid, data) {
      //获取所有一级
      for (let item of list) {
        if (item.id == pid) {
          data.push(item);
        }
      }
      //获取子级
      for (let i of data) {
        i.list = [];
        getTree(list, i.id, i.children); //递归调用
        if (i.list.length == 0) {
          delete i.list;
        }
      }

      return data;
    },
    search(val) {
      if (val) {
        this.columnsData = this.columnsData.filter((item) => {
          const data = this.offOption ? item : item[this.option.label];

          return data.indexOf(val) > -1;
        });
      } else {
        this.columnsData = JSON.parse(JSON.stringify(this.columns));
      }
    },
    onConfirm(value, index) {
      console.log(value, 999);
      //   this.submitParams.pcdJson = value.selectedOptions
      //     .map((option) => option.name)
      //     .join("/");
      let data = value.selectedOptions.map((option) => option.id).join(",");
      this.resultValue = data;
      this.show = !this.show;
      //   this.$emit('confirm', value, index, this.resultValue)
    },
    change(val, index) {
      this.$emit("change", val, index, this.resultValue);
    },
    cancel(val, index) {
      this.show = !this.show;
      this.$emit("cancel", val, index, this.resultValue);
    },
    showPopu(disabled) {
      this.columnsData = JSON.parse(JSON.stringify(this.columns));
      this.resultValue = this.selectValue;
      if (disabled !== undefined && disabled !== false) {
        return false;
      } else {
        this.show = !this.show;
      }
    },
  },
  watch: {
    selectValue: function (newVal) {
      console.log(newVal,9999)
      this.resultValue = newVal;
    },
    resultValue(val) {
      this.searchVal = "";
      this.columnsData = JSON.parse(JSON.stringify(this.columns));
      this.$emit("input", val);
    },
  },
};
</script>

<style lang="scss" scoped>
.dh-field {
  //   padding: 0 16px;
  background: #fff;
  .dh-cell.van-cell {
    padding: 10px 0;
  }
  .dh-cell.van-cell--required::before {
    left: -8px;
  }
  .van-popup {
    border-radius: 20px 20px 0 0;
  }
}
</style>