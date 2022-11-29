import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: 路由配置项
 *
 * hidden: true                     // 当设置 true 的时候该路由不会再侧边栏出现 如401，login等页面，或者如一些编辑页面/edit/1
 * alwaysShow: true                 // 当你一个路由下面的 children 声明的路由大于1个时，自动会变成嵌套的模式--如组件页面
 *                                  // 只有一个时，会将那个子路由当做根路由显示在侧边栏--如引导页面
 *                                  // 若你想不管路由下面的 children 声明的个数都显示你的根路由
 *                                  // 你可以设置 alwaysShow: true，这样它就会忽略之前定义的规则，一直显示根路由
 * redirect: noRedirect             // 当设置 noRedirect 的时候该路由在面包屑导航中不可被点击
 * name:'router-name'               // 设定路由的名字，一定要填写不然使用<keep-alive>时会出现各种问题
 * query: '{"id": 1, "name": "ry"}' // 访问路由的默认传递参数
 * roles: ['admin', 'common']       // 访问路由的角色权限
 * permissions: ['a:a:a', 'b:b:b']  // 访问路由的菜单权限
 * meta : {
    noCache: true                   // 如果设置为true，则不会被 <keep-alive> 缓存(默认 false)
    title: 'title'                  // 设置该路由在侧边栏和面包屑中展示的名字
    icon: 'svg-name'                // 设置该路由的图标，对应路径src/assets/icons/svg
    breadcrumb: false               // 如果设置为false，则不会在breadcrumb面包屑中显示
    activeMenu: '/system/user'      // 当路由设置了该属性，则会高亮相对应的侧边栏。
  }
 */

// 公共路由
export const constantRoutes = [{
  path: '/redirect',
  component: Layout,
  hidden: true,
  children: [{
    path: '/redirect/:path(.*)',
    component: () => import('@/views/redirect')
  }]
},
{
  path: '/login',
  component: () => import('@/views/login'),
  hidden: true
},
{
  path: '/loginh5',
  component: () => import('@/views/H5/login/index'),
  hidden: true
},
{
  path: '/register',
  component: () => import('@/views/register'),
  hidden: true
},
{
  path: '/404',
  component: () => import('@/views/error/404'),
  hidden: true
},
{
  path: '/401',
  component: () => import('@/views/error/401'),
  hidden: true
},
{
  path: '',
  component: Layout,
  redirect: 'index',
  children: [{
    path: 'index',
    component: () => import('@/views/customer/index'),
    name: 'Index',
    meta: {
      title: '系统首页',
      icon: 'dashboard',
      affix: true
    }
  }]
},
{
  path: '/home',
  component: () => import('@/views/H5/home/index'),
  hidden: true
},
{
  path: '/crm',
  component: () => import('@/views/H5/crm/index'),
  hidden: true
},
{
  path: '/customerh5',
  component: () => import('@/views/H5/customer/index'),
  hidden: true
},
{
  path: '/customerDetailh5',
  component: () => import('@/views/H5/customer/components/customerdetail'),
  hidden: true
},
{
  path: '/addcustomer',
  component: () => import('@/views/H5/customer/components/addcustomer'),
  hidden: true
},
{
  path: '/transformsea',
  component: () => import('@/views/H5/customer/components/transformsea'),
  hidden: true
},
{
  path: '/transforwithperson',
  component: () => import('@/views/H5/customer/components/transforwithperson'),
  hidden: true
},
{
  path: '/saleleaddetailh5',
  component: () => import('@/views/H5/salelead/components/saledetail'),
  hidden: true
},
{
  path: '/addsalelead',
  component: () => import('@/views/H5/salelead/components/addsalelead'),
  hidden: true
},
{
  path: '/transforcustomer',
  component: () => import('@/views/H5/salelead/components/transforcustomer'),
  hidden: true
},
{
  path: '/connectperson',
  component: () => import('@/views/H5/connect/index'),
  hidden: true
},
{
  path: '/followuph5',
  component: () => import('@/views/H5/followup/index'),
  hidden: true
},
{
  path: '/messageh5',
  component: () => import('@/views/H5/message/index'),
  hidden: true
},
{
  path: '/messagelisth5',
  component: () => import('@/views/H5/message/list'),
  hidden: true
},
// {
//   path: '/searchResult',
//   component: () => import('@/views/saleslead/components/searchResult'),
//   hidden: true
// },
{
  path: '/mine',
  component: () => import('@/views/H5/mine/index'),
  hidden: true
},
{
  path: '/chath5',
  component: () => import('@/views/H5/chat/index'),
  hidden: true
},
{
  path: '/chatdetailh5',
  component: () => import('@/views/H5/chat/chat'),
  hidden: true
},
{
  path: '/userInfoh5',
  component: () => import('@/views/H5/mine/components/userinfo'),
  hidden: true
},
{
  path: '/offich5',
  component: () => import('@/views/H5/officManage/index'),
  hidden: true
},
{
  path: '/scheduleh5',
  component: () => import('@/views/H5/officManage/scheduleList'),
  hidden: true
},
{
  path: '/scheduledetailh5',
  component: () => import('@/views/H5/officManage/scheduleDetail'),
  hidden: true
},
{
  path: '/workreportdetailh5',
  component: () => import('@/views/H5/officManage/workreportdetail'),
  hidden: true
},
{
  path: '/workreporth5',
  component: () => import('@/views/H5/officManage/workreport'),
  hidden: true
},
{
  path: '/addreporth5',
  component: () => import('@/views/H5/officManage/addreport'),
  hidden: true
},
{
  path: '/addworkreporth5',
  component: () => import('@/views/H5/officManage/addworkreport'),
  hidden: true
},
{
  path: '/workerlisth5',
  component: () => import('@/views/H5/officManage/workerList'),
  hidden: true
},
{
  path: '/tasklisth5',
  component: () => import('@/views/H5/officManage/taskList'),
  hidden: true
},
{
  path: '/resetpsd',
  component: () => import('@/views/H5/psd/index'),
  hidden: true
},
{
  path: '/addconnectpersonh5',
  component: () => import('@/views/H5/connect/components/addconnect'),
  hidden: true
},
{
  path: '/saleleadh5',
  component: () => import('@/views/H5/salelead/index'),
  hidden: true
},
{
  path: '/seacustomerh5',
  component: () => import('@/views/H5/seacustomer/index'),
  hidden: true
},
{
  path: '/seacustomerdetailh5',
  component: () => import('@/views/H5/seacustomer/components/detail'),
  hidden: true
},
{
  path: '/pickcustomerh5',
  component: () => import('@/views/H5/seacustomer/components/pickcustomer'),
  hidden: true
},
{
  path: '/addSeacustomer',
  component: () => import('@/views/H5/seacustomer/components/add'),
  hidden: true
},
{
  path: '/publicSaleh5',
  component: () => import('@/views/H5/publicSaleh5/components/map'),
  hidden: true
},
{
  path: '/maph5',
  component: () => import('@/views/H5/publicSaleh5/components/map'),
  hidden: true
},
{
  path: '/searchpublicSaleh5',
  component: () => import('@/views/H5/publicSaleh5/components/search'),
  hidden: true
},
{
  path: '/searchpublicSaleresulth5',
  component: () => import('@/views/H5/publicSaleh5/components/result'),
  hidden: true
},
{
  path: '/searchpublicSaleresultPageBySelfh5',
  component: () => import('@/views/H5/publicSaleh5/components/resultPageSelf'),
  hidden: true
},
{
  path: '/AIlisth5',
  component: () => import('@/views/H5/mytask/index'),
  hidden: true
},
{
  path: '/AIdetailh5',
  component: () => import('@/views/H5/AI/detail'),
  hidden: true
},
{
  path: '/wallet',
  component: () => import('@/views/H5/wallet/userCenter'),
  hidden: true
},
{
  path: '/usageRecord',
  component: () => import('@/views/H5/wallet/usageRecord'),
  hidden: true
},
{
  path: '/rechargeRecord',
  component: () => import('@/views/H5/wallet/rechargeRecord'),
  hidden: true
},
{
  path: '/recharge',
  component: () => import('@/views/H5/wallet/recharge'),
  hidden: true
},
{
  path: '/AIh5',
  component: () => import('@/views/H5/AI/index'),
  hidden: true
},
{
  path: '/orderh5',
  component: () => import('@/views/H5/order/index'),
  hidden: true
},
{
  path: '/mytaskh5',
  component: () => import('@/views/H5/mytask/index'),
  hidden: true
},
{
  path: '/smslogsh5',
  component: () => import('@/views/H5/mytask/smslogsh5'),
  hidden: true
},
{
  path: '/phoneOnline',
  component: () => import('@/views/H5/components/phoneOnline'),
  hidden: true
},
{
  path: '/phoneTaskDetailh5',
  component: () => import('@/views/H5/mytask/phoneTaskDetail'),
  hidden: true
},
{
  path: '/phonelogsh5',
  component: () => import('@/views/H5/mytask/phoneLogs'),
  hidden: true
},
{
  path: '/rechargeSuccess',
  component: () => import('@/views/H5/rechargeResult/index'),
  hidden: true
},

{
  path: '/rechargeh5',
  component: () => import('@/views/H5/recharge/rechargeh5'),
  hidden: true
},
{
  path: '/packageh5',
  component: () => import('@/views/H5/recharge/packageh5'),
  hidden: true
},
{
  path: '/followh5',
  component: () => import('@/views/H5/customer/components/follow'),
  hidden: true
},
{
  path: '/resultDetailh5',
  component: () => import('@/views/H5/publicSaleh5/components/detail'),
  hidden: true
},
{
  path: '/smsh5',
  component: () => import('@/views/H5/components/sms'),
  hidden: true
},
// 员工管理
{
  path:'/staffh5',
  component:() => import('@/views/H5/staff'),
  hidden: true,
},
// 新增员工
{
  path:'/addStaff',
  component:() => import('@/views/H5/staff/components/addStaff'),
  hidden: true,
},
{
  path: '/user',
  component: Layout,
  hidden: true,
  redirect: 'noredirect',
  children: [{
    path: 'profile',
    component: () => import('@/views/system/user/profile/index'),
    name: 'Profile',
    meta: {
      title: '个人中心',
      icon: 'user'
    }
  }]
}
]

// 动态路由，基于用户权限动态去加载
export const dynamicRoutes = [{
  path: '/system/user-auth',
  component: Layout,
  hidden: true,
  permissions: ['system:user:edit'],
  children: [{
    path: 'role/:userId(\\d+)',
    component: () => import('@/views/system/user/authRole'),
    name: 'AuthRole',
    meta: {
      title: '分配角色',
      activeMenu: '/system/user'
    }
  }]
},
{
  path: '/system/role-auth',
  component: Layout,
  hidden: true,
  permissions: ['system:role:edit'],
  children: [{
    path: 'user/:roleId(\\d+)',
    component: () => import('@/views/system/role/authUser'),
    name: 'AuthUser',
    meta: {
      title: '分配用户',
      activeMenu: '/system/role'
    }
  }]
},
{
  path: '/system/dict-data',
  component: Layout,
  hidden: true,
  permissions: ['system:dict:list'],
  children: [{
    path: 'index/:dictId(\\d+)',
    component: () => import('@/views/system/dict/data'),
    name: 'Data',
    meta: {
      title: '字典数据',
      activeMenu: '/system/dict'
    }
  }]
},
{
  path: '/monitor/job-log',
  component: Layout,
  hidden: true,
  permissions: ['monitor:job:list'],
  children: [{
    path: 'index',
    component: () => import('@/views/monitor/job/log'),
    name: 'JobLog',
    meta: {
      title: '调度日志',
      activeMenu: '/monitor/job'
    }
  }]
},
{
  path: '/tool/gen-edit',
  component: Layout,
  hidden: true,
  permissions: ['tool:gen:edit'],
  children: [{
    path: 'index/:tableId(\\d+)',
    component: () => import('@/views/tool/gen/editTable'),
    name: 'GenEdit',
    meta: {
      title: '修改生成配置',
      activeMenu: '/tool/gen'
    }
  }]
}
]

// 防止连续点击多次路由报错
let routerPush = Router.prototype.push;
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(err => err)
}

export default new Router({
  mode: 'history', // 去掉url中的#
  scrollBehavior: () => ({
    y: 0
  }),
  routes: constantRoutes
})
