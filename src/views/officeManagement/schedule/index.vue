<template>
  <div class="scheduleDiv" style="background-color:#f5f5f5 ;">
    <div class="scDiv">
      <el-row type="flex" justify="center">

        <el-col :span="10">
          <el-select class="mr10 wid" style="margin-left: 22px;" v-model="value" placeholder="请选择">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>

          <el-select class="mr10 wid" v-model="value" placeholder="请选择">
            <el-option v-for="item in schedule" :key="item.value" :label="item.label" :value="item.value">
            </el-option>
          </el-select>
          <el-button type="primary" icon="el-icon-plus">新建日程</el-button>
        </el-col>
        <el-col :span="4">
          <div class="topText">
            <p>2022年5月</p>
          </div>
        </el-col>
        <el-col :span="10">
          <div class="topRh">
            <el-button style="margin-left: 0;" >月</el-button>
            <el-button style="margin-left: 0;" >周</el-button>
            <el-button style="margin-left: 0;" >日</el-button>
            <el-button class="btn">今天</el-button>
            <el-button icon="el-icon-arrow-left"></el-button>
            <el-button style="margin-left: 0;" icon="el-icon-arrow-right"></el-button>
          </div>
        </el-col>

      </el-row>


      <el-row type="flex" justify="center">
        <el-col :span="24">
          <div>

            <el-calendar v-model="value">
              <!-- <template slot="dateCell" slot-scope="{date, data}">
              
            </template> -->
            </el-calendar>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        value: new Date(),
        schedule:[{
            value: "1",
            label: "我的日程",
          },
          {
            value: "2",
            label: "下属日程",
          },
          {
            value: "3",
            label: "全部日程",
          }],
        options: [{
            value: "选项1",
            label: "日历模式",
          },
          {
            value: "选项2",
            label: "列表模式",
          }
        ],
        value: "",
      };
    },
    methods: {},
  };

</script>

<style>
  .el-calendar__header {
    display: none;
  }

  .scheduleDiv {
    position: relative;
    display: flex;
    justify-content: center;
    top: 20px;
  }

  .scDiv {
    min-width: 1085px;
    position: absolute;
    width: 60%;
    top: 20px;
  }

  .wid {
    width: 117px;
  }

  .topRh {
    float: right;
    margin-right: 22px;
  }

  .topText {
    text-align: center;
    line-height:center;
  }
  p{
    margin: 0;
    padding: 0;
  }

  .topText {
    padding-top: 5px;
    font-size: 22px;
    color: #999999;
  }
  .btn {
    
    
  }

</style>
