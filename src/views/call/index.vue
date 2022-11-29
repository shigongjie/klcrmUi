<template>
    <div class="app-container">
        <div class="topDiv">
            <el-form :model="queryParams" ref="queryForm" :inline="true" @submit.native.prevent>
                <el-form-item prop="taskName">
                    <el-input v-model="queryParams.taskName" placeholder="任务名称" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model="queryParams.name" placeholder="客户姓名" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="phone">
                    <el-input v-model="queryParams.phone" placeholder="客户手机号" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                  <el-form-item prop="userName">
                    <el-input v-model="queryParams.userName" placeholder="员工" clearable size="small"
                        @keyup.enter.native="handleQuery" />
                </el-form-item>
                <el-form-item prop="callStatus">
                    <el-select placeholder="通话状态" size="small" v-model="queryParams.callStatus">
                        <el-option
                        v-for="dict in dict.type.call_status"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                        ></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item prop="shoutTime">
                    <el-select placeholder="呼叫时长" size="small" v-model="queryParams.shoutTime">
                        <el-option label="0~30s" value="0"></el-option>
                        <el-option label="0~60s" value="1"></el-option>
                        <el-option label="60s+" value="2"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="callTime">
                    <el-select placeholder="通话时长" size="small" v-model="queryParams.callTime">
                        <el-option label="0~10s" value="0"></el-option>
                        <el-option label="11s~60s" value="1"></el-option>
                        <el-option label="60s~180s" value="2"></el-option>
                        <el-option label="180s+" value="3"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="userIntent">
                    <el-select placeholder="用户意向" size="small" v-model="queryParams.userIntent">
                        <el-option
                        v-for="dict in dict.type.user_intent"
                        :key="dict.value"
                        :label="dict.label"
                        :value="dict.value"
                        ></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="exception">
                    <el-select placeholder="触发异常" size="small" v-model="queryParams.exception">
                        <el-option label="是" value="1"></el-option>
                        <el-option label="否" value="0"></el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop="real">
                    <el-button type="primary" size="small" @click="handleQuery(0)">查询</el-button>
                    <el-button type="" size="small" @click="reset()">重置</el-button>
                    <el-button type="primary" size="small" @click="exportCllTask(0)">导出</el-button>
                </el-form-item>
            </el-form>
            <!-- <Tips ref="Tips" /> -->
            <div>
                <el-table border ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                @selection-change="handleSelectionChange" :row-style="selectedstyle">
                <el-table-column type="selection" width="55" align="center"> </el-table-column>
                <el-table-column prop="taskName" label="任务名称" width="" align="center">
                </el-table-column>
                <el-table-column prop="clientSource" label="客户来源" width="150" align="center">
                </el-table-column>
                <el-table-column prop="clientName" label="客户姓名" width="" align="center">
                </el-table-column>
                <el-table-column prop="clientPhone" label="客户手机号" width="" align="center">
                </el-table-column>
                <el-table-column prop="userName" width="" label="员工名称" align="center"></el-table-column>
                <el-table-column prop="callResult" width="150" label="通话状态" align="center">
                </el-table-column>
                <el-table-column prop="shoutTime" width="100" label="呼叫时长" align="center"></el-table-column>
                <el-table-column prop="callTime" width="100" label="通话时长" align="center"></el-table-column>
                <el-table-column prop="userIntent" width="100" label="用户意向" align="center">
                </el-table-column>
                <el-table-column prop="endTime" width="100" label="通话费用" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.callCharges !== null">{{scope.row.callCharges}}元</span>
                    </template>
                </el-table-column>
                <el-table-column prop="exception" width="100" label="是否触发异常" align="center">
                    <template slot-scope="scope">
                        <span v-if="scope.row.exception === 0">否</span>
                        <span v-else-if="scope.row.exception === 1">
                            <el-popover
                            placement="bottom"
                            width="150"
                            trigger="hover"
                            :content="scope.row.exceptionContent">
                            <div slot="reference">是</div>
                            </el-popover>
                        </span>
                    </template>
                </el-table-column>
                <el-table-column prop="createTime" width="180" label="创建时间" align="center"></el-table-column>
                <el-table-column prop="shortName" fixed="right" label="操作" width="100" align="center">
                    <template slot-scope="scope" v-if="scope.row.recordFile">
                        <audio src="" ref="audio"></audio>
                        <el-button @click.native.prevent="audioPlay(scope.row)" size="mini" >
                            播放
                        </el-button>
                    </template>
                </el-table-column>
                </el-table>
                <!-- 全选和反选 -->
                <div class="footer" v-if="tableData.length !== 0">
                    <div class="left">
                        <el-button icon="el-icon-success" @click="allCheak()">全选</el-button>
                        <el-button icon="el-icon-circle-check" @click="unAllCheak([tableData])">反选</el-button>
                    </div>
                    <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum"
                    :limit.sync="queryParams.pageSize" @pagination="getList"></pagination>
                </div>
            </div>
        </div>
    </div>
</template>

  <script>
import { getlist, massTextingdelete } from "@/api/sms/index";
import { noteTemplateList } from "@/api/messageSend/index";
import { recordslist,exportCall } from '@/api/chat/index'
export default {
    dicts: ["call_status","user_intent"],
    data() {
        return {
            time: "",
            queryParams: {
                pageNum: 1,
                pageSize: 10,
            },
            total: 0,
            tableData: [],
            list: [],
            templateList: [],
            chooseStaffIds:[],
            audioStatus:'',
            audioTime:'',

        };
    },
    beforeMount() {
        noteTemplateList().then((res) => {
            this.templateList = res.data;
        });
    },
    mounted() {
        this.getList();
    },
    methods: {
        copyduty() {
            this.$message.error("该功能暂不可用");
        },
        getList() {
            recordslist(this.queryParams).then((res) => {
                this.total = res.total;
                this.tableData = res.rows;
                console.log(res);
            });
        },
        handleSelectionChange(val) {
             let ids = [];
             val.forEach((item, index) => {
                    ids.push(item.id)
            });
            this.chooseStaffIds = ids
            // console.log(this.chooseStaffIds);
        },
        // 全选
        allCheak() {
            this.$refs.multipleTable.toggleAllSelection();
        },
        //反选
        unAllCheak(rows) {
            // 所有的选中未选中都做一个切换
            if (rows) {
                rows[0].forEach((row) => {
                    this.$refs.multipleTable.toggleRowSelection(row);
                });
            }
        },
        // 按钮点击播放
        audioPlay(ob){
            const recording = this.$refs.audio;
            recording.src = ob.recordFile
            setTimeout(()=>{
                recording.play()
            },500)
        },
        // canplaylog(){
        //    this.audioTime = parseInt(this.$refs.audio.duration)
        //     console.log(this.audioTime);
        //     setTimeout(()=>{
        //         this.audioIndex = ''
        //     },(this.audioTime+1)*1000)
        // },
        reset() {
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
            };
            this.time = "";
            this.getIndex = "";
            this.getList();
        },
        handleQuery() {
            if (this.time != "" && this.time != null && this.time != undefined) {
                this.queryParams.createstStartTime = this.time[0] + " " + "00:00:00";
                this.queryParams.createstEndTime = this.time[1] + " " + "23:59:59";
            }
            this.getList();
        },
        confirmDel(ob) {
            this.$confirm("是否确定删除对应的记录?", "是否确定删除对应的记录?", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    massTextingdelete({ ids: [ob.id] }).then((res) => {
                        this.$message({
                            type: "success",
                            message: "删除成功!",
                        });
                        this.getList();
                    });
                })
                .catch(() => {
                    this.$message({
                        type: "info",
                        message: "已取消删除",
                    });
                });
        },
        exports(ob) {
            exportCall(ob).then((data) => {
                if (!data) {
                this.$message.warning("文件下载失败");
                return;
                }
                if (typeof window.navigator.msSaveBlob !== "undefined") {
                window.navigator.msSaveBlob(
                    new Blob([data], {
                    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
                    }),
                    "单点外呼记录" + ".xlsx"
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
                link.setAttribute("download", "单点外呼记录" + ".xlsx");
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link); // 下载完成移除元素
                window.URL.revokeObjectURL(url); // 释放掉blob对象
                }
            });
        },
        exportCllTask(){
            if(this.chooseStaffIds.length === 0) {
                return this.$message({
                type: "error",
                message: "请至少选择一条数据!",
                })
            }
            let datas = {};
            datas.ids = this.chooseStaffIds;
            this.exports(datas)
        },
        // 点击播放本行变色
        selectedstyle({row}) {
          if (row.exception === 1) {
            return {
                "color": "red",
                };
            }
        },
    },
};
</script>
  <style  lang='scss' scoped>
  .topDiv {
      .tips {
          font-size: 13px;
          padding: 0 20px;
          color: #999999 ;
      }
  }

  .color4 {
      color: #409eff;
      cursor: pointer;
  }

  .texteclip {
      width: 200px;
      height: auto;
      word-wrap: break-word;
      /*强制换行*/
      overflow: hidden;
      /*超出隐藏*/
      text-overflow: ellipsis;
      /*隐藏后添加省略号*/
      white-space: nowrap;
      /*强制不换行*/
      cursor: pointer;
  }
  .footer{
  display: flex;
  padding: 10px 0;
  align-items:center;
  justify-content: space-between;
  .pagination-container{
      flex: 1;
      display: flex;
      align-items:center;
  }
}
  </style>
