<template>
    <div class="h5-container" style="height:100%;background: #FFFFFF;">
        <!-- <Navbar :title="'公共线索'" @jump="jumpgo" /> -->
        <div class="container">
            <div v-if="$store.state.user.isApp == 2" style="height: 46px; background: #fff" />
            <div class="headers">
                <span style="width:80px"><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
                <span class="title-clue">公共线索</span>
                <span class="add-ai" @click="handleSearch">
                    <div class="imgWarp">
                        <img src="@/assets/images/searchHigh.png" alt="" />
                    </div>
                    高级筛选
                </span>
            </div>
            <div id="searchBox" class="searchBox" :style="$store.state.user.isApp == 2 ? 'top: 126px;' : ''">
                <div class="vanSelect">
                    <div class="areaText" @click="showArea = true">
                        <div class="text">
                            {{ pcdJson }}

                        </div>
                        <span>
                            <van-icon name="arrow-down" />
                        </span>
                    </div>
                    <!-- <van-field readonly clickable name="area" :value="pcdJson" label="" right-icon="arrow-down"
                        placeholder="选择省市" @click="showArea = true" /> -->
                    <van-popup v-model="showArea" position="bottom">
                        <van-cascader v-model="cascaderValue" title="请选择所在地区" :options="areaList"
                            :field-names="fieldNames" @finish="onFinish" />
                    </van-popup>
                </div>
                <div class="elSelect">
                    <van-field v-model="value" @input="remoteMethod" @mouseenter="mouseEnterSearch" label="" placeholder="请输入查询地址" />

                    <!-- <el-select size="medium" v-model="value" filterable remote reserve-keyword placeholder="请输入查询地址"
                        :remote-method="remoteMethod" :loading="loading">
                        <el-option v-for="item in options" :key="item.value"
                            :label="item.adname + item.name"
                            :value="item.pname + item.cityname + item.adname + item.name">
                        </el-option>
                    </el-select> -->

                    <el-button type="primary" size="medium" @click="search">搜索</el-button>
                </div>
                <div class="list" v-if="options.length > 0 && showList">
                    <div class="each" v-for="(item, index) in options" :key="index" @click="choose(item)">
                        {{ item.name }}
                        <span style="color: darkgray; font-size: 14px; font-weight: bolder; position: absolute; right: 10px">{{ item.adname  }}</span>
                    </div>
                </div>
            </div>

            <div id="container">
            </div>
            <div class="arrow">
              <div align="center" class="arrowon" v-if="arrowOn" @click="arrowOnClick">
                <img src="@/assets/images/arrowon.png" alt="">
              </div>
              <div align="center" class="arrowdown" :style="arrowDownStyle" v-else
                   @click="arrowDownClick"
                   @touchstart="arrowTouchStart"
                   @touchmove="arrowTouchMove"
                   @touchend="arrowTouchEnd">
                <img src="@/assets/images/arrowdown.png" alt="">
              </div>
            </div>
            <div>
              <van-popup
                v-model="showPopup"
                closeable
                close-icon="close"
                position="bottom"
                :overlay="false"
                :style="popupStyle"
              >
                <div style="opacity: 1;">
                  <van-list v-if="allData.length != 0" v-model="loading" :finished="finished" finished-text="" @load="onLoad">
                    <div class="location" v-if="fullScreenFlag">
                      <div class="imgWarp">
                        <img src="@/assets/images/location.png" alt="" />
                      </div>当前查询地址：{{ value }}
                    </div>
                    <van-checkbox-group v-model="result" ref="checkboxGroup">
                      <div style="height: 5px"></div>
                      <div class="card" v-for="(item, index) in list" :key="index" @click="markerSelect(item)">
                        <div>
                          <div>
                            <div class="name">
                              <span>{{ item.companyName }}</span>
                              <span>距离您{{ item.distance }}km</span>
                            </div>
                            <div class="">
                              法定代表人：{{ item.legalPerson }}
                            </div>
                            <div class="">
                              注册资金：{{ item.registerMoney }}
                            </div>
                            <div class="">
                              成立日期：{{ item.onTime }}
                            </div>
                            <div>
                              联系电话：{{ item.companyPhone == "" ? "暂无联系方式" : item.companyPhone }}
                            </div>
                          </div>
                        </div>
                        <van-checkbox :name="item.id">
                          <template #icon="props">
                            <img class="img-icon" :src="
                                      props.checked
                                          ? $store.state.user.activeIcon
                                          : $store.state.user.inactiveIcon
                                  " /> </template>
                        </van-checkbox>
                      </div>
                    </van-checkbox-group>
                  </van-list>
                </div>
                <div class="footer">
                  <van-checkbox style="flex-shrink: 0; margin-right: 20px" v-model="checked">全选({{ result.length }})
                    <template #icon="props">
                      <img class="img-icon" :src="
                          props.checked
                              ? $store.state.user.activeIcon
                              : $store.state.user.inactiveIcon
                      " /> </template>
                  </van-checkbox>
                  <van-button :loading="btnLoading" @click="submit" round type="info" class="btnself"
                              :disabled="result.length == 0" style="width: 100%" loading-text="数据移入中...">移入公海</van-button>
                </div>
              </van-popup>
            </div>
        </div>

    </div>
</template>

<script>
import { getareaList, copyMarketClue } from "@/api/publicSaleds/index";
import { searchByMap } from "@/api/saleslead/index";

import axios from "axios";
window._AMapSecurityConfig = {
    serviceHost: 'https://crm.lkkjjt.com/_AMapService',
}
import AMapLoader from '@amap/amap-jsapi-loader';
export default {
    data() {
        return {
            showList: false,
            fieldNames: {
                text: "name",
                value: "id",
                children: "list",
            },
            pcdJson: "福州市",
            pcd: "福建省福州市",
            cascaderValue: "350100000000",
            showArea: false,
            value: "",
            searchParams: "",
            textTip: '',
            mapKey: '7bc6f37657045d26b769ceb6bd2fba00',
            map: null,
            isshowTip: false,
            options: [],
            loading: true,
            areaList: [],
            stopWatch: false,
            showPopup: false,
            finished: false,
            checked: false,
            btnLoading: false,
            arrowOn: true,
            data: {},
            allData: [],
            result: [],
            list: [],
            markerList: [],
            timeOutEvent: null,
            popupStyle: { height: '30%', background: 'rgba(237,235,235, 0.7)' },
            arrowDownStyle: {bottom: '31%'},
            fullScreenFlag: false,
            paramas: {
              pageSize: 10,
              pageNum: 1,
            },
        }
    },
    watch: {
        // value(val) {
        //     // console.log(val, 111)
        //     if (!this.stopWatch) {
        //         setTimeout(() => {
        //             this.remoteMethod(val)
        //         }, 1000)
        //     }
        // }
    },
    mounted() {
        getareaList().then((res) => {
            this.areaList = res.data;
        });
        this.initMap()
    },

    methods: {
        arrowTouchStart(e) {
          var that = this;
          that.timeOutEvent = setTimeout(() => {
            that.longPress(e);
          }, 500);
        },
        arrowTouchMove(e) {
          if(!this.fullScreenFlag) {
            let element = e.targetTouches[0]
            let y = (1 - (element.clientY + 25) / window.innerHeight).toFixed(2) * 100;
            if (y > 40) {
              this.popupStyle = {height: '84%', background: 'rgba(237,235,235, 0.7)'};
              this.arrowDownStyle = {bottom: '85%'};
              document.getElementById("container").style.display = 'none';
              document.getElementById("searchBox").style.display = 'none';
              document.getElementsByClassName("container")[0].style.background = 'rgb(237,235,235)';
              this.fullScreenFlag = true;
            } else if (y < 30) {
              this.arrowDownClick();
            } else {
              this.popupStyle = {height: y + '%', background: 'rgba(237,235,235, 0.7)'};
              this.arrowDownStyle = {bottom: (y+1) + '%'};
              this.fullScreenFlag = false;
              document.getElementsByClassName("container")[0].style.background = 'rgb(255,255,255)';
              document.getElementById("container").style.display = 'block';
              document.getElementById("searchBox").style.display = 'flex';
            }
          }
        },
        arrowTouchEnd() {
          clearTimeout(this.timeOutEvent);
        },
        longPress() {
          this.timeOutEvent = 0;
        },
        markerSelect(item) {
          //this.map.clearMap();
          var num = this.list.indexOf(item) + 1;
          var numStr = num < 10 ? ("0"+ num++) : num++;
          var content = '<div style="position: relative">' +
            '<img style="position: relative; z-index: 1" width="32px"; height="42px" src="https://a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png" />' +
            '<span style="position: absolute; top: 6px; left: 7px; z-index: 2; color: white; font-size: 12px; font-weight: bold">' + numStr + '</span>' +
            '</div>'
          var marker = new window.AMap.Marker({
            content: content,
            position: [item.location.split(',')[0], item.location.split(',')[1]],
            offset: new window.AMap.Pixel(14, 21)
          });
          this.map.clearMap();
          this.map.add(this.markerList);
          this.map.add(marker);
          this.map.setFitView();
        },
        arrowOnClick() {
          if(this.list.length > 0) {
            this.showPopup = true;
            this.arrowOn = false;
            this.popupStyle = {height: '30%', background: 'rgba(237,235,235, 0.7)'};
            this.arrowDownStyle = {bottom: '31%'};
          }
        },
        arrowDownClick() {
          if(this.fullScreenFlag) {
            this.popupStyle = {height: '30%', background: 'rgba(237,235,235, 0.7)'};
            this.arrowDownStyle = {bottom: '31%'};
            this.fullScreenFlag = false;
            document.getElementsByClassName("container")[0].style.background = 'rgb(255,255,255)';
            document.getElementById("container").style.display = 'block';
            document.getElementById("searchBox").style.display = 'flex';
          } else {
            this.showPopup = false;
            this.arrowOn = true;
          }
        },
        onLoad() {
          this.loading = true;
          if (this.list.length >= this.allData.length && this.list.length != 0) {
            this.finished = true;
          } else {
            this.paramas.pageNum += 1
            let begin = (this.paramas.pageNum - 1) * this.paramas.pageSize;
            let end = this.paramas.pageNum * this.paramas.pageSize;
            this.list = this.list.concat(this.allData.slice(
              begin,
              end
            ))
            this.checked = true;
            this.loading = false;
            setTimeout(() => {
              // this.$refs.checkboxGroup.toggleAll(true);
              this.allData.slice(
                begin,
                end
              ).forEach((item) => {
                this.result.push(item.id);
              });
            }, 100);
          }
        },
        submit() {
          if (this.result.length > 200) {
            this.$message.error("单次不能移入超过200条线索");
            return;
          }
          this.btnLoading = true;
          copyMarketClue({ ids: this.result }).then((res) => {
            console.log(res);
            if (res.success) {
              this.btnLoading = false;
              this.$message({
                type: "success",
                message: "移入公海成功!",
              });
            } else {
              this.$message({
                type: "error",
                message: res.message,
              });
            }
          });
        },
        choose(item) {
            this.stopWatch = true;
            this.value = item.name;
            this.searchParams = item.adname + item.name;
            this.showList = false
            this.stopWatch = false;
            this.location()
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
                placeSearch.search(_this.searchParams, function (status, result) {
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
        handleSearch() {
            this.$router.push("/searchpublicSaleh5");
        },
        onFinish(value) {
            this.value = null;
            var pcd = value.selectedOptions.map((option) => option.name);
            var province = pcd[0];
            if(province.indexOf("市") != -1) {
              this.pcd = province;
              this.pcdJson = province;
            } else {
              this.pcd = value.selectedOptions.map((item)=>item.name).join("");
              this.pcdJson = pcd[1];
            }
            console.log(this.pcd);
            this.showArea = false;
        },
        mouseEnterSearch() {
          this.options = [];
          if(this.value != null && this.value != '' && this.value != undefined) {
            this.showList = true;
            axios.get(`https://restapi.amap.com/v3/place/text?key=${this.mapKey}&keywords=${this.pcd + this.value}`).then((res) => {
              this.options = res.data.pois
              this.loading = false;
              // this.search(this.value)
            });
          } else {
            this.options = [];
          }
        },
        remoteMethod(e) {
            if (e !== '') {
                this.showList = true;
                axios.get(`https://restapi.amap.com/v3/place/text?key=${this.mapKey}&keywords=${this.pcd + e}`).then((res) => {
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
        jumpgo() {
            this.$router.go(-1);
        },
        jumpGo() {

            if (this.$store.state.user.isApp == 2 && this.$route.query.token) {
                LukeappApi.clt_close_browser("paysuccess");
            } else {
                this.$router.push("/crm");
            }
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
        search(query) {
            if (this.value == "") {
                this.$toast('请输入查询地址')
                return
            }
            this.showList = false;
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
                placeSearch.search(_this.searchParams, function (status, result) {
                    // 搜索成功时，result即是对应的匹配数据
                    if (status == 'complete') {
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

                            _this.showPopup = true;
                            _this.checked = true;
                            _this.list = [];
                            _this.allData = [];
                            _this.result = [];
                            _this.markerList = [];
                            _this.loading = true;
                            _this.arrowOn = false;
                            _this.map.clearMap();

                            searchByMap(_this.data).then(res => {
                              _this.allData = res.data
                              _this.list = _this.list.concat(_this.allData.slice(0, 10))
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
                                  _this.result.push(item.id);
                                });
                                _this.map.add(_this.markerList);
                                _this.map.setFitView();
                              }, 100);
                            })
                            _this.loading = false;

                          /* _this.$router.push({
                               path: "/searchpublicSaleresultPageBySelfh5",
                               query: {
                                   ob: JSON.stringify(data),
                                   type: 'map'
                               },
                           })*/
                            //console.log(data)
                            //_this.addMarker(lng, lat);

                        } else {
                            // _this.$message({
                            //     message: '没有查询到对应的地址',
                            //     type: 'warning'
                            // });
                        }
                    } else if (status == 'no_data') {
                        // _this.$message({
                        //     message: '没有查询到对应的地址',
                        //     type: 'warning'
                        // });
                    } else {

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
                this.map.addControl(new AMap.ToolBar());
                // this.map.addControl(new AMap.PlaceSearch());
                //
            }).catch(e => {
                console.log(e);
            })
        },
    }
}
</script>

<style scoped lang="scss">
.marker-content {
  width: 25px;
  height: 34px;
  position: relative;
}

.marker-content img {
  position: relative;
  z-index: 1;
}

.marker-content span {
  color: white;
  position: absolute;
  z-index: 2;
  top: 10px;
  left: 10px;
}

.card {
  padding: 15px 20px;
  background: #ffffff;
  width: 95%;
  margin: auto;
  margin-top: 12px;
  border-radius: 10px;
  border-bottom: 1px solid #e9eaec;
  display: flex;
  justify-content: space-between;
  align-items: center;
  opacity: 100;
  z-index: -1;

  div {
    font-size: 12px;
    font-family: "PingFang SC";
    font-weight: 500;
    color: #666666;

    .name {
      display: flex;
      justify-content: space-between;

      span:nth-child(1) {
        font-size: 14px;
        font-family: "PingFang SC";
        font-weight: 500;
        color: #212121;
        margin-bottom: 18px;
        width: 250px;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      span:nth-child(2) {
        position: absolute;
        width: 100px;
        right: 20px;
        text-align: right;
      }
    }
  }
}

.footer {
  padding: 0 20px;
  height: 56px;
  width: 100%;
  position: fixed;
  bottom: 0;
  display: flex;
  justify-content: space-around;
  background: #ffffff;
  align-items: center;
  font-size: 13px;
  border-top: 1px solid #e9eaec;
}

.arrow {
  height: 48px;
  width: 100%;
  position: fixed;
  display: flex;
  justify-content: space-around;
  background: rgba(0,0,0,0);
  align-items: center;
  font-size: 13px;

  img {
    width: 21px;
    height: 21px;
  }
}

.arrowon {
  padding: 0 20px;
  height: 24px;
  width: 64px;
  position: fixed;
  bottom: 15px;
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,0.58);
  align-items: center;
  font-size: 13px;
  border-radius: 12px;
  border: 1px solid #C0C0C0;
}

.arrowdown {
  padding: 0 20px;
  height: 24px;
  width: 64px;
  position: fixed;
  display: flex;
  justify-content: space-around;
  background: rgba(255,255,255,0.58);
  align-items: center;
  font-size: 13px;
  border-radius: 12px;
  border: 1px solid #C0C0C0;
}

.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    font-weight: bold;
    color: #323232;
}

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
.el-icon-arrow-left{
  font-size:18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
}
.searchBox {
    // border: 1px solid;
    display: flex;
    height: 40px;
    position: absolute;
    top: 71px;
    width: 100%;
    z-index: 99999;
    padding: 0 10px;
    display: flex;
    flex-wrap: nowrap;

    .vanSelect {
        height: 40px;
        background: #FFFFFF;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-top-left-radius: 10px;
        border-bottom-left-radius: 10px;

        .areaText {
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-right: 1px solid #D2D2D2;
            padding: 0 8px;
            border-top-left-radius: 10px;
            border-bottom-left-radius: 10px;

            .text {
                height: 30px;
                width: 70px;
                color: #212121;
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
                font-size: 15px;
                // padding: 5px 0;
                white-space: nowrap;
                /*强制不换行*/
                text-overflow: ellipsis;
                /*隐藏后添加省略号*/
                overflow: hidden;
                background: #FFFFFF;
                text-align: center;
                line-height: 30px;
                border-top-left-radius: 10px;
                border-bottom-left-radius: 10px;
                // padding: 0 8px;
            }
        }

        // flex: 1;
        ::v-deep .van-cell {
            height: 100%;
            width: 100px;
            color: #212121;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            font-size: 15px;
            // padding: 5px 0;
            white-space: nowrap;
            /*强制不换行*/
            text-overflow: ellipsis;
            /*隐藏后添加省略号*/
            overflow: hidden;
            border-right: 1px solid #D2D2D2;
        }
    }

    .elSelect {
        display: flex;
        flex-wrap: nowrap;
        font-size: 15px;
        flex: 1;

        ::v-deep .van-cell {
            height: 40px;
            flex: 1;
            border-top-right-radius: 0;
            border-bottom-right-radius: 0;
            font-size: 15px;
            border-right: 1px solid #D2D2D2;
            border-top-left-radius: 0;
            border-bottom-left-radius: 0;
        }
    }

    ::v-deep .el-button {
        // width: 60px;
        font-size: 15px;
        text-align: center;
        // height: 40px;
        // line-height: 40px;
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        border-top-right-radius: 10px;
        border-bottom-right-radius: 10px;
    }

    ::v-deep .el-select {
        flex: 1;
        height: 40px;
        border-radius: 0;
        border: none;
        font-size: 12px;


        input {
            font-size: 12px;
        }

        input::-webkit-input-placeholder {
            /*WebKit browsers*/
            font-size: 12px;
        }

        .el-input--medium .el-input__inner {
            height: 40px;
            border-radius: 0;
            border: none;
        }
    }
}

.list {
    position: absolute;
    top: 45px;
    // border: 1px solid;
    width: calc(100% - 20px);
    background: #ffffff;
    max-height: 300px;
    overflow: auto;

    .each {
        padding: 8px 10px;
        font-size: 15px;
    }

    .nodata {
        text-align: center;
        padding: 8px 10px;
        font-size: 15px;
    }
}

#container {
    padding: 0px;
    margin: 0px;
    width: 100%;
    height: 100%;
}

#bai-du-map {
    overflow: hidden;
    width: 100%;
    height: 100%;
    margin: 0;
    font-family: "微软雅黑";
}

.amap-logo {
    display: none !important;
}

.amap-copyright {
    display: none !important;
}

.add-ai {
    color: #2a81fc;
    font-size: 14px;
    display: flex;
    align-items: center;
    width: 80px;

    .imgWarp {
        width: 15px;
        height: 15px;
        margin-right: 3px;

        img {
            width: 100%;
            height: 100%;
            background: cover;
            image-rendering: -moz-crisp-edges;
            image-rendering: -o-crisp-edges;
            image-rendering: -webkit-optimize-contrast;
            image-rendering: crisp-edges;
            -ms-interpolation-mode: nearest-neighbor;
        }
    }
}

.location {
  color: #666666;
  font-size: 14px;
  display: flex;
  align-items: center;
  padding-left: 20px;

  .imgWarp {
    width: 15px;
    height: 15px;
    margin-right: 3px;

    img {
      width: 100%;
      height: 100%;
      background: cover;
      image-rendering: -moz-crisp-edges;
      image-rendering: -o-crisp-edges;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
      -ms-interpolation-mode: nearest-neighbor;
    }
  }
}

::v-deep .el-popper {
    width: 250px !important;
}
</style>
