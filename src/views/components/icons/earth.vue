<template>
    <div>
        <el-form :model="queryParams" ref="queryForm" :inline="true">
            <el-form-item prop="address" label="">
                <el-select size="small" style="width: 100%" @change="changeProvince" v-model="queryParams.province_code"
                    placeholder="选择省">
                    <el-option v-for="dict in provinceList" :key="dict.id" :label="dict.name" :value="dict.id">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop="address" label="">
                <el-select size="small" @change="changeCity" style="width: 100%" v-model="queryParams.city_code"
                    placeholder="选择市">
                    <el-option v-for="dict in cityList" :key="dict.id" :label="dict.name" :value="dict.id"></el-option>
                </el-select>
            </el-form-item>
            <!-- <el-form-item prop="address" label="">
                <el-select size="small" @change="changeRegion" style="width: 100%" v-model="queryParams.region_code"
                    placeholder="选择区">
                    <el-option v-for="dict in regionList" :key="dict.id" :label="dict.name" :value="dict.id">
                    </el-option>
                </el-select>
            </el-form-item> -->
            <el-form-item prop="industry">
                <el-select size="small" v-model="value" filterable remote reserve-keyword placeholder="请输入查询地址"
                    :remote-method="remoteMethod" :loading="loading" :style="{width: '300px'}">
                    <el-option v-for="item in options" :key="item.value"
                        :label="item.name"
                        :value="item.adname + item.name">
                      <span style="float: left">{{ item.name }}</span>
                      <span style="float: right; color: #8492a6; font-size: 13px">{{ item.adname }}</span>
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="search">采集</el-button>
            </el-form-item>
            <!-- <el-form-item>
                <el-button type="primary" icon="el-icon-search" size="mini" @click="reset">重置</el-button>
            </el-form-item> -->
        </el-form>
        <div>
          <div>
            <div style="margin-top:20px; width: 100%; float: left;" id="container">
              <!-- 技术支持和联系方式  -->

            </div>
            <div class="arrow">
              <div align="center" class="arrowleft" v-if="arrowleft" @click="arrowleftClick">
                <img src="@/assets/images/arrow_left.png" alt="">
              </div>
              <div align="center" class="arrowright" v-else
                   @click="arrowrightClick"
                   @mousedown="arrowMouseDown"
              >
                <img src="@/assets/images/arrow_right.png" alt="">
              </div>
            </div>
            <div style="padding: 20px; width: 0%; display: none; float: right;" id="content">
              <el-button plain icon="el-icon-switch-button" size="mini" @click="handleStaffAction('1')">移入公海</el-button>
              <div style="margin-top: 20px">
                <el-table border="" ref="multipleTable" :data="tableData" tooltip-effect="dark" style="width: 100%"
                          empty-text="请检索后展示数据" @selection-change="handleSelectionChange" >
                  <el-table-column type="selection" width="55" align="center"> </el-table-column>
                  <template v-for="(item, index) in columnShow">
                    <el-table-column v-if="item.id == 'distance'" :key="index"
                                     :label="item.name" width="" :resizable="true" align="center">
                      <template slot-scope="scope">
                        {{ scope.row.distance }}km
                      </template>
                    </el-table-column>

                    <el-table-column v-else-if="item.id == 'companyName'" :key="item.id" :label="item.name" :resizable="false" width="180" show-overflow-tooltip align="center">
                      <template slot-scope="scope">
                        <span style="color: #46a6ff; cursor: pointer" @click="handleRowClick(scope.row)">{{ scope.row.companyName }}</span>
                      </template>
                    </el-table-column>

                    <el-table-column v-else :key="item.name" :label="item.name" :prop="item.id" :width="item.width" :resizable="false"
                                     show-overflow-tooltip align="center">
                    </el-table-column>
                  </template>
                </el-table>
                <el-button v-show="total > 0" icon="el-icon-success" @click="allCheck" style="margin-top: 30px; float: left">全选</el-button>
                <pagination v-show="total > 0" :total="total" :page.sync="queryParams.pageNum" :limit.sync="queryParams.pageSize" @pagination="changePage" style="margin-top: 22px; float: right;" />
                <el-dialog :close-on-click-modal="false" :title="'移入公海'" :visible.sync="open" width="600px">
                  <el-form class="selfForm" ref="rulesForm" :model="submitParams" label-width="100px" size="small">
                    <el-form-item label="备注信息">
                      <el-input type="textarea" v-model="submitParams.remark" placeholder="请输入备注信息" :rows="6"></el-input>
                    </el-form-item>
                    <el-form-item label="">
                      *
                      转移到公海后此客户数据将属于公共资源，原归属人员不能再维护跟进和更新此客户数据。
                    </el-form-item>
                  </el-form>
                  <span slot="footer" class="dialog-footer">
                    <el-button @click="open = false">取 消</el-button>
                    <el-button type="primary" :loading="loading" @click="submit">确 定</el-button>
                  </span>
                </el-dialog>
              </div>
            </div>
          </div>
        </div>
    </div>
</template>

<script>
import { getprovinceList, getcityList, getregionList } from "@/api/city/index"
import { searchByMap } from "@/api/saleslead/index";
import { copyMarketClue } from "@/api/publicSaleds/index";

import axios from "axios";
window._AMapSecurityConfig = {
    serviceHost: 'https://crm.lkkjjt.com/_AMapService',
}
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
    data() {
        return {
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                region_code: "",
                city_code: '350100000000',
                province_code: '35'
            },
            value: "",
            textTip: '',
            mapKey: '7bc6f37657045d26b769ceb6bd2fba00',
            map: null,
            isshowTip: false,
            options: [],
            loading: true,
            provinceList: [],
            regionList: [],
            cityList: [],
            data: {},
            allData: [],
            allIds: [],
            markerList: [],
            timeOutEvent: null,
            // 总条数
            total: 0,
            currentPage: 1,
            tableData: [],
            choosedIds: [],
            multipleSelection: [],
            currentSaleId: "", //当前创建跟进客户ID
            showList: [
              { name: "线索编号", id: "id", disable: true, isPre: true, },
              { name: "企业名称", id: "companyName", disable: true, isPre: true },
              { name: "统一社会信用代码", id: "socialCode", disable: false, isPre: true, },
              { name: "企业经营状态", id: "manageType", disable: false, isPre: true,  },
              { name: "法定代表人", id: "legalPerson", disable: false, isPre: true,  },
              { name: "企业电话", id: "companyPhone", disable: false, isPre: true, },
              { name: "企业固话", id: "companyTel", disable: false, isPre: true, },
              { name: "企业邮箱", id: "email", disable: false, isPre: true, },
              { name: "成立日期", id: "onTime", disable: false, isPre: true, },
              { name: "距离", id: "distance", disable: false, isPre: true, }
            ],
            submitParams: {
              remark: ''
            },
            open: false,
            arrowleft: true,
            allCheckFlag: false,
            fullScreenFlag: false
        }
    },
    mounted() {
        getprovinceList().then(res => {
            this.provinceList = res.data
        })
        getcityList({ provinceCode: this.queryParams.province_code }).then(res => {
            this.cityList = res.data
        })
        this.initMap()
    },
    watch: {
        value(val) {
            console.log(val, 111)
            this.location(val)
        }
    },
    computed: {
      columnShow() {
        return this.showList.filter((item, index) => {
          if (item.isPre == 1) {
            return item;
          }
        });
      },
    },
    methods: {
        arrowMouseDown(e) {
          var that = this;
          var container = document.getElementById("container");
          var content = document.getElementById("content");
          var arrow = document.getElementsByClassName("arrow")[0];

          document.onmousemove = function (e) {
            var x = ((window.innerWidth - e.clientX + 25) / window.innerWidth) * 100;
            var containerX = 100 - x;

            if(x  < 42) {
              that.arrowrightClick();
              document.onmouseup = null;
              document.onmousemove = null;
              that.fullScreenFlag = false;
            } else if (x > 80) {
              container.style.display = 'none';
              content.style.width = '100%';
              arrow.style.right = '96%';
              that.fullScreenFlag = true;
              document.onmouseup = null;
              document.onmousemove = null;
            } else {
              container.style.display = 'flex';
              container.style.width = containerX+'%';
              content.style.display = 'block';
              content.style.width = x+'%';
              arrow.style.right = x+'%';
              that.arrowleft = false;
              that.fullScreenFlag = false;
            }
          }
          document.onmouseup = function (e) {
            document.onmousemove = null;
            document.onmouseup = null;
          }
        },
        allCheck() {
          if(this.allCheckFlag) {
            this.choosedIds = [];
            this.allCheckFlag = false;
          } else {
            this.choosedIds = this.allIds;
            this.allCheckFlag = true;
          }
          this.tableData.forEach(row => {
            this.$refs.multipleTable.toggleRowSelection(row);
          })
        },
        arrowrightClick() {
          console.log(this.fullScreenFlag)
          var content = document.getElementById("content");
          var container = document.getElementById("container");
          var arrow = document.getElementsByClassName("arrow")[0];

          if(this.fullScreenFlag) {
            container.style.width = '45%';
            container.style.display = 'flex';
            content.style.width = '55%';
            content.style.display = 'block';
            arrow.style.right = '55%';
            this.fullScreenFlag = false;
          } else {
            container.style.width = '100%';
            container.style.display = 'flex';
            content.style.width = '0%';
            content.style.display = 'none';
            arrow.style.right = '0';
            this.arrowleft = true;
          }
        },
        arrowleftClick() {
          document.getElementById("container").style.width = '45%';
          var content = document.getElementById("content");
          content.style.width = '55%';
          content.style.display = 'block';
          this.arrowleft = false;
          document.getElementsByClassName("arrow")[0].style.right = '55%';
        },
        handleStaffAction() {
          if (this.choosedIds.length <= 0) {
            this.$message.error("请至少选择一条数据");
            return;
          }
          this.open = true;
        },
        submit() {
          this.loading = true;
          if (this.choosedIds.length > 0) {
            this.$message.error("单次不能移入超过200条线索");
            this.open = false;
            this.loading = false;
            return;
          }
          copyMarketClue({
            ids: this.choosedIds,
            remark: this.submitParams.remark,
          }).then((res) => {
            if (res.success) {
              this.loading = false;
              this.open = false;
              this.$message.success("移入成功");
              this.choosedIds = [];
              this.$refs.multipleTable.clearSelection();
            } else {
              this.open = false;
              this.loading = false;
              this.$message.error(res.message);
            }
          });
        },
        handleSelectionChange(val) {
          console.log(val);
          if(val.length == 0 && !this.allCheckFlag) {
            this.choosedIds = [];
            return;
          }
          val.forEach((item) => {
            if (this.choosedIds.indexOf(item.id) == -1) {
              this.choosedIds.push(item.id);
            }
          });
        },
        handleRowClick(row) {
          var num = this.allData.indexOf(row) + 1;
          var numStr = num < 10 ? ("0"+ num++) : num++;
          var content = '<div style="position: relative">' +
            '<img style="position: relative; z-index: 1" width="32px"; height="42px" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" />' +
            '<span style="position: absolute; top: 6px; left: 7px; z-index: 2; color: white; font-size: 12px; font-weight: bold">' + numStr + '</span>' +
            '</div>'
          var marker = new window.AMap.Marker({
            content: content,
            position: [row.location.split(',')[0], row.location.split(',')[1]],
            offset: new window.AMap.Pixel(14, 21)
          });
          this.map.clearMap();
          this.map.add(this.markerList);
          this.map.add(marker);
          this.map.setFitView();
        },
        changePage(val) {
          let begin = (val.pageNum - 1) * this.queryParams.pageSize;
          let end = val.pageNum * this.queryParams.pageSize;
          this.tableData = this.allData.slice(
            begin,
            end
          );
          this.$nextTick(() => {
            this.tableData.forEach(row => {
              if (this.choosedIds.indexOf(row.id) >= 0) {
                this.$refs.multipleTable.toggleRowSelection(row, true);
              }
            })
          })
        },
        setCurrentPageData() {
          let begin = (this.currentPage - 1) * this.queryParams.pageSize;
          let end = this.currentPage * this.queryParams.pageSize;
          this.tableData = this.allData.slice(
            begin,
            end
          );
        },
        changeProvince(val) {
            this.value = null;
            console.log(val)
            this.queryParams.city_code = "";
            this.queryParams.region_code = "";
            getcityList({ provinceCode: val }).then(res => {
                this.cityList = res.data
            })
        },
        changeRegion() { },
        changeCity(val) {
            this.value = null;
            console.log(val)
            this.queryParams.region_code = "";
            getregionList({ cityCode: val }).then(res => {
                this.regionList = res.data
            })
        },
        remoteMethod(query) {
            if (query !== '') {
                let cityName = "";
                let provinceName = "";
                this.provinceList.forEach((item, index) => {
                    if (item.id == this.queryParams.province_code) {
                        provinceName = item.name
                    }
                })
                this.cityList.forEach((item, index) => {
                    if (item.id == this.queryParams.city_code) {
                        cityName = item.name
                    }
                })
                this.loading = true;
                axios.get(`https://restapi.amap.com/v3/place/text?key=${this.mapKey}&keywords=${provinceName + cityName + query}`).then((res) => {
                    this.options = res.data.pois
                    this.loading = false;
                    // this.search(this.value)
                });
            } else {
                this.options = [];
            }
        },
        editText() {
            this.isshowTip = false;
        },
        addMarker(lng, lat) {
            this.map.clearMap();
            let _this = this;
            this.mapMark = new window.AMap.Marker({
                position: [lng, lat],
                map: _this.map
            });
            this.mapMark.setMap(this.map);
        },
        location() {
            let _this = this;
            window.AMap.plugin('AMap.PlaceSearch', function () {
                var autoOptions = {
                    city: '全国',
                    map: _this.map, // 展现结果的地图实例
                    pageSize: 1, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                };
                var placeSearch = new window.AMap.PlaceSearch(autoOptions);
                console.log(_this.value)
                let searchParams = _this.value
                placeSearch.search(searchParams, function (status, result) {
                    // 搜索成功时，result即是对应的匹配数据
                    if (status == 'complete') {
                        if (result.poiList.pois.length > 0) {
                            let lng = result.poiList.pois[0].location.lng;
                            let lat = result.poiList.pois[0].location.lat;
                            _this.addMarker(lng, lat);

                        } else {
                            _this.$message({
                                message: '没有查询到对应的地址',
                                type: 'warning'
                            });
                        }
                    } else if (status == 'no_data') {
                        _this.$message({
                            message: '没有查询到对应的地址',
                            type: 'warning'
                        });
                    }
                });
            });
        },
        search(query) {
            let _this = this;
            if (!_this.value) {
                this.$message.error('请输入查询地址')
                return
            }
            window.AMap.plugin('AMap.PlaceSearch', function () {
                var autoOptions = {
                    city: '全国',
                    map: _this.map, // 展现结果的地图实例
                    pageSize: 1, // 单页显示结果条数
                    pageIndex: 1, // 页码
                    autoFitView: true // 是否自动调整地图视野使绘制的 Marker点都处于视口的可见范围
                };
                var placeSearch = new window.AMap.PlaceSearch(autoOptions);
                console.log(_this.value)
                let searchParams = _this.value
                placeSearch.search(searchParams, function (status, result) {
                    // 搜索成功时，result即是对应的匹配数据
                    if (status == 'complete') {
                        console.log(result)
                        if (result.poiList.pois.length > 0) {
                            let lng = result.poiList.pois[0].location.lng;
                            let lat = result.poiList.pois[0].location.lat;
                            // _this.longAndLat = lng + ',' + lat;
                          _this.data = {};
                          _this.data.province = result.poiList.pois[0].pname
                          _this.data.city = result.poiList.pois[0].cityname
                          _this.data.region = result.poiList.pois[0].adname
                          _this.data.name = result.poiList.pois[0].name
                          _this.data.location = lng + "," + lat

                          _this.markerList = [];
                          _this.loading = true;
                          _this.map.clearMap();

                          searchByMap(_this.data).then(res => {
                            _this.allData = res.data
                            _this.allData.forEach(item => {
                              _this.allIds.push(item.id);
                            })
                            _this.total = Math.ceil(_this.allData.length)
                            _this.setCurrentPageData()
                            _this.arrowleftClick();

                            setTimeout(() => {
                              let num = 1;
                              _this.allData.slice(0, 10).forEach((item) => {
                                var numStr = num < 10 ? ("0"+ num++) : num++;
                                var content = '<div style="position: relative">' +
                                  '<img style="position: relative; z-index: 1" width="30px"; height="42px" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-red.png" />' +
                                  '<span style="position: absolute; top: 6px; left: 7px; z-index: 2; color: white; font-size: 12px; font-weight: bold">' + numStr + '</span>' +
                                  '</div>'
                                var marker = new window.AMap.Marker({
                                  content: content,
                                  position: [item.location.split(',')[0], item.location.split(',')[1]],
                                  offset: new window.AMap.Pixel(15, 21)
                                });
                                _this.markerList.push(marker);
                              });
                              _this.map.add(_this.markerList);
                              _this.map.setFitView();
                            }, 100);
                          })
                          _this.loading = false;

                        } else {
                            _this.$message({
                                message: '没有查询到对应的地址',
                                type: 'warning'
                            });
                        }
                    } else if (status == 'no_data') {
                        _this.$message({
                            message: '没有查询到对应的地址',
                            type: 'warning'
                        });
                    }
                });
            });
        },
        initMap() {
            AMapLoader.load({
                key: "ffd57d87a2af11a8b11f60fc8437c992",// 申请好的Web端开发者Key，首次调用 load 时必填
                version: "2.0",      // 指定要加载的 JSAPI 的版本，缺省时默认为 1.4.15
                plugins: ['AMap.ToolBar', 'AMap.Driving'],       // 需要使用的的插件列表，如比例尺'AMap.Scale'等
            }).then((AMap) => {
                this.map = new AMap.Map("container", {  //设置地图容器id
                    viewMode: "2D",    //是否为3D地图模式
                    zoom: 12,           //初始化地图级别
                    plugins: ['AMap.ToolBar', 'AMap.Driving'],
                    center: [119.296494, 26.074507], //初始化地图中心点位置
                });
                // this.map.addControl(toolbar);
                // this.map.addControl(new AMap.PlaceSearch());
            }).catch(e => {
                console.log(e);
            })
        },
    }
}
</script>

<style scoped>
#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 800px;
}

.arrow {
  height: 100%;
  width: 48px;
  right: 0px;
  top: 50%;
  position: absolute;
  display: flex;
  justify-content: space-around;
  background: rgba(0,0,0,0);
  z-index: 999;
}

.arrow img {
  width: 50px;
  height: 50px;
  margin-top: 25px;
}

.arrowleft {
  width: 50px;
  height: 100px;
  margin-right: 50px;
  background: rgba(255,255,255,0.58);
  border-radius: 5px;
  border: 1px solid #C0C0C0;
  cursor: pointer;
}

.arrowright {
  width: 50px;
  height: 100px;
  margin-right: 50px;
  background: rgba(255,255,255,0.58);
  border-radius: 5px;
  border: 1px solid #C0C0C0;
  cursor: pointer;
}
</style>
