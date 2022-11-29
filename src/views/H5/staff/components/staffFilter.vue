<template>
    <!-- 筛选弹出层 -->
    <van-popup v-model="showPopover" :style="{ height: '480px' }" position="bottom" 
    :close-on-click-overlay='closeShow' @click-overlay='close'>
        <div class="title">
            <span>筛选</span>
            <div class="img" @click="close"><img src="@/assets/images/closePopup.png" alt=""></div>
        </div>
        <van-form>
            <div class="srarch_basic">
                <div class="srarch_contant">
                    <div class="name">来源</div>
                    <van-field v-model="submitlist.name" placeholder="请输入客户姓名" />
                </div>
                <div class="srarch_contant">
                    <div class="name">所属部门</div>
                    <van-field readonly is-link clickable name="area" :value="submitlist.deptId" placeholder="点击选择部门"
                    @click="showUserId = true" />
                    <van-popup v-model="showUserId" position="bottom" :style="{ height: '480px' }" :overlay="show">
                    <van-cascader v-model="submitlist.dept" title="请选择部门" :options="deptTree" @close="showUserId = false"
                        :field-names="{ text: 'name', value: 'id', children: 'list' }" @finish="onFinishUserId"/>
                    </van-popup>
                </div>
                <div class="srarch_contant">
                    <div class="name">业务类型</div>
                    <van-field readonly is-link clickable name="area" :value="submitlist.bussinessTypeName" placeholder="全部"
                    @click="typeShow = true" />
                    <van-popup v-model="typeShow" position="bottom" :style="{ height: '480px' }" :overlay="show">
                        <van-picker
                            title="业务类型"
                            show-toolbar
                            :columns="option"
                            @confirm="onConfirm"
                            @cancel="onCancel"
                            />
                        </van-popup>
                    <!-- <div class="select">
                        <el-select
                        v-model="submitlist.bussinessType"
                        placeholder="业务类型"
                        clearable
                        size="small"
                        >
                            <el-option label="全部" value="" />
                            <el-option label="解冻" value="0" />
                            <el-option label="冻结" value="1" />
                        </el-select>
                    </div> -->
                </div>
                <div class="createTime">
                    <div class="name" style="">创建时间</div>
                    <div class="time">
                        <div>
                            <el-date-picker
                            v-model="submitlist.startCreateTime"
                            type="date"
                            value-format="yyyy-MM-dd 00:00:00"
                            placeholder="开始日期"
                            align="left">
                            </el-date-picker>
                        </div>
                        <div>
                            <el-date-picker
                            v-model="submitlist.endCreateTime"
                            type="date"
                            value-format="yyyy-MM-dd 23:59:59"
                            placeholder="终止日期"
                            align="right">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
                 <div class="createTime">
                    <div class="name" style="width:100%">最后登录时间</div>
                    <div class="time">
                        <div>
                            <el-date-picker
                                v-model="submitlist.startLastLoginTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="开始时间"
                                align="left">
                            </el-date-picker>
                        </div>
                        <div>
                            <el-date-picker
                                v-model="submitlist.endLastLoginTime"
                                type="datetime"
                                value-format="yyyy-MM-dd HH:mm:ss"
                                placeholder="终止时间"
                                align="right">
                            </el-date-picker>
                        </div>
                    </div>
                </div>
            </div>
            <div class="button" style="margin: 16px;">
                <van-button plain type="info" @click="reset">重置</van-button>
                <van-button type="info" @click="serach">确认</van-button>
            </div>
        </van-form>
    </van-popup>
</template>

<script>
// import { getstaffList } from '@/api/staff/index'
import { getdeptTree } from "@/api/organization/index";
export default{
    props:{
        showPopover:{
            type:Boolean,
        }
    },
    data(){
        return{
            bussinessType:'',
            // showPopover:false,
            show:false,
            typeShow:false,
            closeShow:false,
            showUserId:false,
            submitlist: {
                name:'',
                dept:'',
                deptId:'',
                bussinessType:'',
                startCreateTime:'',
                endCreateTime:'',
                startLastLoginTime:'',
                endLastLoginTime:''
            },
            deptTree:[],
            option: [
                { text: '全部', value: 0 },
                { text: '解冻', value: 1 },
                { text: '冻结', value: 2 },
            ],
        }
    },
    mounted() {
      this.getdeptTree();
    },
    updated(){
        // console.log('submitlist',this.submitlist);
    },
    methods:{
        onSubmit(){
            // console.log(1111);
        },
        // 获取部门
        getdeptTree() {
            getdeptTree().then((res) => {
                this.deptTree = res.data;
            });
        },
        // 关闭筛选
        close(){
            // this.showPopover = false
            this.$emit('close')
        },
        // 重置
        reset() {
            this.submitlist = {}
        },
        // 查询
        serach(){
            this.$emit('getstaffList',this.submitlist)
            this.close()
            this.reset()
        },
        onFinishUserId(value) {
            // console.log(value);
            this.submitlist.deptId = value.selectedOptions[value.tabIndex].name;
            this.submitlist.dept = value.value;
            this.showUserId = false;
        },
        onConfirm(value, index) {
            console.log('onChange',value);
            this.submitlist.bussinessTypeName = value.text
            // this.submitlist.bussinessType = value.value ? '0':"" 
            if(value.value === 0){
                this.submitlist.bussinessType = ''
            }else if(value.value === 1){
                this.submitlist.bussinessType = '0'
            }else if(value.value === 2){
                this.submitlist.bussinessType = '1'
            }
            // console.log(this.submitlist.bussinessTypeName, this.submitlist.bussinessType);
            this.typeShow = false
            
        },
        onCancel(picker, value, index) {
            // console.log('onChange',value);
            this.typeShow = false
        },
    }
}
</script>

<style style lang="scss" scoped>
.title{
    position: relative;
    font-size: 16px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #666666;
    text-align: center;
    padding: 20px 0;
    img{
        position: absolute;
        width: 14px;
        height: 14px;
        top: 12px;
        right: 12px;
    }
}
.srarch_contant {
    width: 100%;
    display: flex;
    align-items: center;
}
.createTime{
    margin-top: 15px;
    .time{
        display: flex;
        // justify-content: space-between;
        justify-content: space-between;
        padding-left: 15px;
        margin-top: 15px;
        // padding: 15px 15px 0;
        div{
            width: 90%;
        }
    }
}
.name {
    width: 100px;
    font-size: 15px;
    font-family: PingFang SC;
    font-weight: 500;
    color: #212121;
    padding-left: 15px;
}
.button{
    display: flex;
    justify-content: space-between;
}
.select{
    padding: 10px 0;
}
::v-deep .van-field__body {
    background: #F2F2F2;
    padding: 5px 15px;
    border-radius: 6px;
}
::v-deep .van-button{
    padding: 13px 67px;
    border-radius: 6px
}
::v-deep .el-select,::v-deep .el-cascader{
    width: 262px !important;
    margin-left: -3px;
}
::v-deep .el-input__inner{
    border: none;
    border-radius: 6px;
    background-color: #F2F2F2;
    color: #212121;
    height: 34px;
    width: 100%;
    text-align: left;
    padding: 0;
    padding-left: 10px;
}
::v-deep .van-popup--bottom{
    z-index: 2003 !important;
}
::v-deep .el-input__prefix{
    display: none;
}
::v-deep .van-cell__right-icon{
    position: absolute;
    right:22px;
    top: 14px;
}
</style>
