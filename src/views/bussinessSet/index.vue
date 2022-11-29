<template>
  <div class="container">
    <div class="title"><i class="el-icon-edit"></i> 查重设置</div>
    <div class="tips">
      提示：查重设置用于在新增或编辑相关字段时对数据做唯一性检测，有任意字段重复均算重复，
      所有数据均在全公司范围内查重。
    </div>
    <div v-for="(item, index) in list" :key="index">
      <div class="title_second">{{ item.name }}</div>
      <div class="fileName">字段名称</div>
      <div class="divWarp" v-for="(items, indexs) in item.list" :key="indexs">
        <div class="field_name">{{ items.fieldName }}</div>
        <el-checkbox
          class="checkboxself"
          :label="''"
          :checked="items.isChecked ? true : false"
          v-model="items.isChecked"
          @change="change(items)"
        ></el-checkbox>
      </div>
    </div>
    <div class="btnWarp">
      <el-button type="primary" @click="submit()">保存</el-button>
    </div>
  </div>
</template>

<script>
import { checkduplicates, update } from "@/api/bussinessSet/index";
export default {
  data() {
    return {
      list: [],
    };
  },
  mounted() {
    this.getLsit();
  },
  methods: {
    getLsit() {
      checkduplicates().then((res) => {
        this.list = res.data;
      });
    },
    change(item) {
      console.log(item);
    },
    submit() {
      let ids = [];
      this.list.forEach((i, t) => {
        if (i.list) {
          i.list.forEach((o, a) => {
            if (o.isChecked) {
              if (!ids.includes(o.id)) {
                ids.push(o.id);
              }
            }
          });
        }
      });
      let data = {};
      data.ids = ids;
      console.log(data);
      update(data).then((res) => {
        if (res.success) {
          this.getLsit();
          this.$message.success("修改成功");
        }
      });
    },
  },
};
</script>

<style lang='scss' scoped>
.container {
  width: 80%;
  margin: auto;
}
.title {
  padding: 20px 0;
  border-bottom: 1px solid #cccccc;
}
.tips {
  padding: 15px 0;
  font-size: 13px;
}
.divWarp {
  display: flex;
  justify-content: space-between;
  border: 1px solid #cccccc;
  padding: 6px 10px;
  font-size: 14px;
  align-items: center;
  border-top: none;
}
.divWarp:nth-child(odd) {
  border-top: 1px solid #cccccc;
}
.divWarp:nth-child(even) {
  border-bottom: none;
}
.divWarp:last-child {
  border-bottom: 1px solid #cccccc;
}
.border_bottom_none {
  border-bottom: none;
}
.title_second {
  border-left: 3px solid #409eff;
  margin: 15px 0;
  padding-left: 5px;
}
.fileName {
  padding: 6px 10px;
  border: 1px solid #ccc;
  border-bottom: none;
  background: #f5f5f5;
}
.btnWarp {
  padding: 20px;
  text-align: center;
}
</style>