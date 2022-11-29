/**模块配置 */
<template>
  <div>
    <el-table v-loading="loading" :data="tableData" style="width: 100%" border>
      <el-table-column prop="name" label="模块名称" width="280">
      </el-table-column>
      <el-table-column prop="showName" label="显示名称" width="180">
      </el-table-column>
      <el-table-column prop="description" label="模块描述">
        <template slot-scope="scope">
          {{
            scope.row.description == null
              ? "暂无模块描述"
              : scope.row.description
          }}
        </template>
      </el-table-column>
      <el-table-column prop="status" label="启用" width="280">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleChange(scope)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="address" label="操作" width="280">
        <template slot-scope="scope">
          <el-button size="mini" @click="handleEdit(scope.row)">
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog title="修改模块" :visible="dialogFormVisible" >
      <el-form :rules="rules" ref="editform" :model='editform'>
        <el-form-item label="模块名称" label-width="120px">
          <el-input v-model="editform.name" disabled></el-input>
        </el-form-item>
        <el-form-item label="显示名称" label-width="120px" prop="showName">
          <el-input v-model="editform.showName" @input="change($event)"></el-input>
        </el-form-item>
        <el-form-item label="模块描述" label-width="120px">
          <el-input type="textarea" @input="change2($event)" v-model="editform.description"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="handlesubmitForm">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { getCompanyModule, updateCompanyModule } from "@/api/bussiness/index";

export default {
  props: {
    companyData: {
      type: Object,
      default: {},
    },
  },
  data() {
    return {
      rules: {
        showName: [
          { required: true, message: "请输入显示名称", trigger: "blur" },
        ],
      },
      dialogFormVisible: false,
      loading: false,
      isStart: true,
      tableData: [],
      editform: {},
      currentRow: {},
    };
  },
  mounted() {
    this.getData();
  },
  methods: {
    change(e){
      this.$forceUpdate()
    },
    change2(e){
      this.$forceUpdate()
    },
    getData() {
      let data = {};
      data.companyId = this.$route.query.id;
      getCompanyModule(data).then((res) => {
        this.tableData = res.data;
      });
    },
    handlesubmitForm() {
      this.$refs.editform.validate((valid) => {
        if (valid) {
          this.editform.type = 1;
          updateCompanyModule(this.editform).then((res) => {
            this.getData();
            this.dialogFormVisible = false;
          });
        } else {
          return false;
        }
      });
    },
    handleEdit(row) {
      this.dialogFormVisible = true;
      this.currentRow = row;
      this.editform.name = this.currentRow.name;
      this.editform.moduleId = this.currentRow.id;
      this.editform.showName = this.currentRow.showName;
      this.editform.description = this.currentRow.description;
    },
    handleChange(item) {
      this.loading = true;
      item.row.status = 1;
      let data = {};
      data.moduleId = item.row.id;
      data.type = 0;
      // item.row.status == 0 ? (data.type = 1) : (data.type = 0);
      updateCompanyModule(data).then((res) => {
        this.getData();
        this.loading = false;
      });
    },
  },
};
</script>

<style>
</style>