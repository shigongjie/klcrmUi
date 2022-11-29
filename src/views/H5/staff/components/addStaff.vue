<template>
  <div class="container">
    <!-- <div style="height: 44px" v-if="$store.state.user.isApp == 2"></div> -->
    <div class="header" :style="$store.state.user.isApp == 2 ? 'padding-top: 66px;' : ''">
      <!-- <span @click="jumpGo" style="">取消</span> -->
      <span><i @click="jumpGo" class="el-icon-arrow-left"></i></span>
      <span class="title-clue">{{ $route.query.id ? "员工详情" : "新建员工" }}</span>
      <!-- <span @click="submit" style="color:#2B82FC" v-if="!$route.query.id">保存</span> -->
    </div>
    <div class="pd">
      <div class="line"></div>
      <div class="imageWarp">
        <van-cell title="头像" />
        <div v-if="$route.query.id">
          <img v-if='submitParams.avatar !== null' :src="submitParams.avatar" alt="" class="userPhoto">
          <img v-else-if="submitParams.avatar === null" src="@/assets/images/defaultAvatar.png" alt="" class="userPhoto"/>
        </div>
        <div v-else-if="!$route.query.id">
          <van-uploader v-model="fileList" :max-count="1" :after-read="afterRead" 
          @delete="removePic" :deletable="false" >
          </van-uploader>
        </div>
        <div class="right-icon">
          <i class="el-icon-arrow-right" :style="$route.query.id ? 'display:none;' : ''"></i>
        </div>
      </div>
      <van-form ref="rulesForm" @submit="submit">
        <div class="titleh5">基础信息</div>
        <van-field v-model="submitParams.name" name="员工姓名" :required='editStatus' label="员工姓名" placeholder="请输入员工姓名"
        :rules="[{ required: true, message: '请输入员工姓名' }]"/>

        <van-field v-model="submitParams.account" name="登录账号" :required='editStatus' label="登录账号" placeholder="请输入登录账号"
        :rules="rules.name" />

        <van-field v-model="submitParams.password" name="登录密码" :required='editStatus' label="登录密码" placeholder="请输入登录密码" 
        :rules="rules.password" v-if="!$route.query.id"/>
        <van-field :is-link='editStatus' readonly clickable name="area" :value="submitParams.deptName" label="所属部门" placeholder="点击选择部门"
          @click="showUserId = true" :rules="[{ required: true, message: '请选择部门' }]" :required='editStatus' />
        <van-popup v-model="showUserId" position="bottom">
          <van-cascader v-model="submitParams.deptId" title="请选择部门" :options="deptList" @close="showUserId = false"
            :field-names="{ text: 'name', value: 'id', children: 'list' }"  @finish="onFinishUserId"/>
            <!-- submitParams.deptName -->
        </van-popup>
        <VantSelect label="当前职务" placeholder="请选择职务" v-model="submitParams.roleId" :columns="roleList"
        :option="{ label: 'name', value: 'id' }" :required='editStatus'
        :rules="[{ required: true, message: '请选择职务' }]" />
        
        <VantSelect label="员工性别" placeholder="请选择员工性别" v-model="submitParams.sex" :columns="sex"
        :option="{ label: 'sexName', value: 'name' }"/>
        <!-- <van-field name="radio" label="员工性别：" required :rules="[{ required: true, message: '员工性别：' }]">
          <template #input>
            <van-radio-group v-model="submitParams.sex" direction="horizontal">
              <van-radio name="0">保密</van-radio>
              <van-radio name="2">男</van-radio>
              <van-radio name="1">女</van-radio>
            </van-radio-group>
          </template>
        </van-field>  -->
        <van-field label="员工生日" v-model="submitParams.birthday" @click="show = true" placeholder="请选择日期" :is-link='editStatus'/>
        <van-popup v-model="show" :style="{ height: '50%' }" position="bottom">
            <van-datetime-picker
            v-model="birthday"
            type="date"
            title="请选择日期"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="getBirthday"
            @cancel='show = false'
          />
        </van-popup>
        <van-field v-model="submitParams.email" name="邮箱地址" :required='editStatus' label="电子邮箱" placeholder="请输入邮箱" 
        :rules="rules.email"/>
        <van-field v-model="submitParams.phone" name="手机号码" :required='editStatus' label="手机号码" maxlength="11" placeholder="请输入手机号码"
        :rules="[{ required: true, message: '请输入手机号码' }]"/>
        <van-field v-model="submitParams.vx" name="微信账号" label="微信账号" placeholder="请输入微信账号"/>
        <van-field v-model="submitParams.specialPlane" name="座机/分机" label="座机/分机" placeholder="请输入座机/分机"/>
        <!-- 更多信息 -->
        <div class="titleh5">更多信息</div>
        <van-field v-model="submitParams.empnoId" name="工号" label="工号" placeholder="请输入工号"/>
        <van-field v-model="submitParams.origo" name="籍贯" label="籍贯" placeholder="请输入籍贯"/>
        <van-field v-model="submitParams.schoolTag" name="毕业院校" label="毕业院校" placeholder="请输入毕业院校"/>
        <van-field label="毕业时间" v-model="submitParams.graduationDate" @click="isShow = true" :is-link='editStatus' placeholder="请选择毕业时间"/>
          <van-popup v-model="isShow" :style="{ height: '50%' }" position="bottom">
            <van-datetime-picker
            v-model="graduationDate"
            type="date"
            title="请选择毕业时间"
            :min-date="minDate"
            :max-date="maxDate"
            @confirm="getBirthday"
            @cancel='isShow = false'
          />
        </van-popup>
        <!-- <van-calendar placeholder="请选择毕业时间" v-model="isShow" @confirm="onConfirm" :min-date="minDate" :max-date="maxDate"/> -->
        <VantSelect label="学历" placeholder="请选择学历" v-model="submitParams.education" :columns="educationList"
        :option="{ label: 'dictLabel', value: 'dictSort' }"/>
        <van-field v-model="submitParams.professional" name="所学专业" label="所学专业" placeholder="请输入所学专业"/>
        <van-field v-model="submitParams.remark" name="备注信息" label="备注信息" placeholder="请输入备注信息"/>
        <div class="line" style="height:27px" v-if="!$route.query.id"></div>
        <div class='button' v-if="!$route.query.id">
            <van-button round block type="info" native-type="submit">保存</van-button>
        </div>
        </van-form>
        <div class="overFand" v-if="$route.query.id"></div>
    </div>
  </div>
</template>

<script>
// 所属部门
import { getDeptTree } from '@/api/workOrder/index'
// 职务
import { getroleList,saveStaff,getInfo,fileUpload} from '@/api/staff/index'
import {
  getsaleLeaddetail,
} from "@/api/saleslead/index";
import Dict from "@/components/dict/dict.vue";
export default {
  mixins: [Dict],
  data() {
    return {
      birthday:'',
      graduationDate:'',
      deptList:[],        // 所属部门
      roleList:[],        // 职务
      educationList:[] ,  // 学历
      fileList:[],
      editStatus: this.$route.query.id ? false : true,
      sex:[,
      {
        name:'0',
        sexName:'保密'
      },{
        name:'1',
        sexName:'男'
      },
      {
        name:'2',
        sexName:'女'
      }],
      rules:{
          name: [
            { required: true, message: "请输入账号", trigger: "onBlur" },
            { pattern: /^[^\s]*$/, message: "不能包含空格" , trigger: "onBlur" },
            { pattern: /^(\$|[a-zA-Z_])/, message: "必须以字母开头" },
            {
            // 自定义校验规则
              validator: value => {
                 return /^.{5,20}$/.test(value);
              },
              message: '请输入5到20的字符',
              trigger: 'onBlur'
            },
          ],
          password: [
            { required: true, message: "请输入密码", trigger: "onBlur" },
            {
              pattern: /^[0-9a-zA-Z]*$/,
              message: "只能输入数字，字母",
              trigger: "onBlur" 
            },
            {
            // 自定义校验规则
              validator: value => {
                 return /^.{6,20}$/.test(value);
              },
              message: '请输入6到20的字符',
              trigger: 'onBlur'
            },
          ] ,
          email: [
            { required: true, message: "请输入邮箱", trigger: "onBlur" },
            {
              pattern:
                /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/,
              message: "请输入正确的邮箱格式",
              trigger: "onBlur"
            },
          ],
      },
      submitParams: {
        birthday: "",
        graduationDate:"",
        userId: "",
        specialPlane:"",
        contactEntity: {},
        taskEntity: {},
      },
      show: false,
      isShow: false,
      showUserId:false,
      minDate: new Date(1980,0,1),
      maxDate: new Date(2022,12,31),
    };
  },
  created(){
  },
  beforeMount() {
    // 学历
     this.getDicts("education_type").then((res) => {
      // console.log(res);
      this.educationList = res.data;
    });
    this.id = this.$route.query.id;
  },
  mounted() {
    this.isEdit();
    this.getDeptTree()
    this.getroleList()
    if(this.id){
      const rightIcon = document.querySelectorAll('.van-cell__right-icon')
        rightIcon.forEach(item =>{
        item.style.opacity = 0;
      })
    }
  },
  updated(){
    // console.log('this.submitParams',this.submitParams);
  },
  methods: {
   // 获取部门列表
    getDeptTree(){
      getDeptTree().then((res) =>{
        this.deptList = res.data
        // console.log('部门',res);
      })
    },
    // 职务
    getroleList(){
      getroleList().then((res) =>{
        // console.log("职务",res);
        this.roleList = res.data
      })
    },
    // 上传头像
    afterRead(file, detail) {
      this.$nextTick(() => {
            const formdata = new FormData();     // new一个FormData
            formdata.append('file', file.file)  // 把上传的图片信息放入，传给后台
            fileUpload(formdata).then(res => {
              // console.log(res);
              this.submitParams.avatar = res.data
            })
          })
      },
    removePic(file) {
      // this.imageArr = this.imageArr.filter((item) => {
      //   if (item.file) {
      //     return item.file != file;
      //   } else {
      //     return item.url != file.url;
      //   }
      // });
    },
    clear(){
      this.submitParams.avatar = ""
    },
    // 日期函数
    formatDate(date) {
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    },
    // 员工生日与毕业时间
    getBirthday(value){
      if(this.show){
        this.show = false;
        this.submitParams.birthday = this.formatDate(value);
      }else if(this.isShow){
        this.isShow = false
        this.submitParams.graduationDate = this.formatDate(value);
      }
    },

     onFinishUserId(value) {
      // console.log(value);
      this.submitParams.deptName = value.selectedOptions[value.tabIndex].name;
      this.submitParams.deptId = value.value;
      this.showUserId = false;
    },
    
    // 是否编辑
    isEdit() {
      if (this.id != "" && this.id != undefined) {
        getInfo({ id: this.id }).then((res) => {
          // console.log(res.data);
          this.submitParams = res.data;
          // this.submitParams.password = '******'
          this.$refs.imgSrc =  res.data.avatar
          // this.fileList.push()
          // console.log(res);
          // this.submitParams.affiliationStaff = res.data.affiliationStaff;
          // if (res.data.taskEntity == null) {
          //   this.submitParams.taskEntity = {};
          // }
          // if (this.submitParams.address) {
          //   this.submitParams.address = this.submitParams.address
          //     .split(",")
          //     .map((item) => {
          //       return +item;
          //     });
          // }
          // if (this.submitParams.region) {
          //   this.submitParams.region = this.submitParams.region
          //     .split(",")
          //     .map((item) => {
          //       return +item;
          //     });
          // }
        });
      }
    },

    // 返回员工页面
    jumpGo() {
      this.$router.go(-1);
    },
    // 保存
    submit() {
      this.$refs.rulesForm.validate().then((val) => {
          // if (!this.checked) {
          //   this.submitParams.taskEntity = null;
          // } else {
          //   this.submitParams.taskEntity.remindType =
          //     this.remindType.toString();
          // }
          // if (
          //   this.submitParams.address != undefined &&
          //   this.submitParams.address != ""
          // ) {
          //   this.submitParams.address = this.submitParams.address.toString();
          // }
          // if (
          //   this.submitParams.region != undefined &&
          //   this.submitParams.region != ""
          // ) {
          //   this.submitParams.region = this.submitParams.region.toString();
          // }
          saveStaff(this.submitParams).then((res) => {
            if (this.id) {
              this.$router.push({
                path: "/staffh5",
              });
              this.$message({
                message: "编辑成功",
                type: "success",
              });
            } else {
              this.$router.push({
                path: "/staffh5",
              });
              this.$message({
                message: "新增成功",
                type: "success",
              });
            }
            this.open = false;
          });
        })
        .catch((err) => {
          console.log(err);
        });
    },
  },
};
</script>

<style lang='scss' scoped>
.line {
  height: 10px;
  background: #f9f9f9;
}
.el-icon-arrow-left {
  font-size: 18px;
  font-weight: bold;
  color: #212121;
  vertical-align: middle;
  // margin-right: 134px;
}
.imageWarp{
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #212121;
  padding: 10px 0;
  .van-cell__title{
    line-height: 35px;
  }
  .van-cell::after {
    display: none;
  }
  ::v-deep .van-uploader__preview,::v-deep .van-uploader__upload{
    margin: 0;
    width: 53px;
    height: 53px;
    margin-right: 10px;
    border-radius: 50%;
  }
  .imgBox{
    // position: relative;
    // height: 100%;
  }
  .userPhoto{
    margin: 0;
    width: 53px;
    height: 53px;
    margin-right: 10px;
    border-radius: 50%;
    // z-index: 555;
  }
  ::v-deep .van-uploader__preview-image{
    height: 100%;
    width: 100%;
    border-radius: 50%;
  }
}
.container {
  height: 100%;
  color: #606266;
}
.header {
  font-size: 13px;
  position: fixed;
  width: 100%;
  height: 56px;
  display: flex;
  padding: 20px 15px;
  justify-content: space-between;
  align-items: center;
  z-index: 999;
  background: #ffffff;
  z-index: 3000;
}
.title-clue {
    font-size: 18px;
    font-family: PingFang SC;
    flex: 1;
    text-align: center;
    font-weight: bold;
    color: #323232;
}
.el-icon-arrow-right{
  font-size:18px;
  font-weight: bold;
  color: #999999;
  vertical-align: middle;
}
.pd {
  height: 100%;
  padding-top: 56px;
  // background: RGB(249, 249, 249);
}

.title {
  font-weight: 600;
  font-size: 13px;
  padding: 10px;
}

.right-icon{
  margin-right: 10px;
}
.selfForm {
  ::v-deep input {
    border: none;
    text-align: right;
  }

  ::v-deep .el-select {
    width: 100%;
  }

  ::v-deep .el-form-item {
    background: #ffffff;
    padding: 6px 10px;
    // padding-bottom: 15px;
    margin-bottom: 0;
    border-bottom: 1px solid #ebeff3;
  }

  ::v-deep .el-input__prefix {
    display: none;
  }

  ::v-deep .el-form-item__error {
    right: 15px;
    text-align: right;
  }

  ::v-deep .el-radio-group {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    width: 100%;
    margin-top: 8px;
    padding-right: 10px;
  }
}

.customer_name {
  ::v-deep input {
    border: none;
    text-align: left;
  }
}

.titleh5 {
  background: RGB(249, 249, 249);
  font-weight: 600;
  font-size: 13px;
  padding: 15px;
}
.button{
  padding: 10px 12px;
  background-color: #fff;
  .van-button--round{
    background: linear-gradient(90deg, #5B9EFC, #3C8BFA);
    border-radius: 12px;
  }
}
.overFand{
  top:0px;
  // margin-top: 50px;
  position: absolute;
  width: 100%;
  height: 1170px;
  // background-color: #fff;
  opacity: 0.3;
  z-index: 2000;
}
// ::v-deep i.van-icon.van-icon-arrow.van-cell__right-icon{
//    opacity: 0;
// }
</style>
