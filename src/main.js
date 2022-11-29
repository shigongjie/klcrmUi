import Vue from 'vue'

import Cookies from 'js-cookie'

import Element from 'element-ui'
import './assets/styles/element-variables.scss'

import '@/assets/styles/index.scss' // global css
import '@/assets/styles/ruoyi.scss' // ruoyi css
import App from './App'
import store from './store'
import router from './router'
import directive from './directive' // directive
import plugins from './plugins' // plugins
import {
  DropdownMenu,
  CountDown,
  Switch,
  Radio,
  radioGroup,
  dropdownItem,
  Badge,
  TreeSelect,
  Calendar,
  Cascader,
  Uploader,
  Picker,
  Popup,
  Button,
  Field,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Dialog,
  Notify,
  Icon,
  Progress,
  Popover,
  DatetimePicker,
  Image as VanImage,
  Swipe,
  SwipeItem,
  // Gird,
  // GridItem,
  Overlay,
  Loading,
  Tab,
  Tabs,
  Toast,
  Area,
  Form,
  Step,
  Steps,
  List,
  ImagePreview,
  Col,
  PullRefresh,
} from 'vant';
Vue.use(Button)
  .use(Uploader)
  .use(Col)
  // .use(GridItem)
  .use(List)
  .use(radioGroup)
  .use(Popover)
  .use(Radio)
  .use(ImagePreview)
  .use(Switch)
  .use(Badge)
  .use(DropdownMenu)
  .use(TreeSelect)
  .use(Calendar)
  .use(dropdownItem)
  .use(Picker)
  .use(Cascader)
  .use(Popup)
  .use(Cell)
  .use(Field)
  .use(CellGroup)
  .use(Checkbox)
  .use(CheckboxGroup)
  .use(Dialog)
  .use(Notify)
  .use(Icon)
  .use(Progress)
  .use(VanImage)
  .use(Swipe)
  .use(SwipeItem)
  .use(Overlay)
  .use(Loading)
  .use(Tab)
  .use(Tabs)
  .use(Toast)
  .use(Area)
  .use(Form)
  .use(Step)
  .use(Steps)
  .use(DatetimePicker)
  .use(CountDown)
  .use(PullRefresh)
import 'vant/lib/button/style';
import {
  download
} from '@/utils/request'
import {
  isTabShow
} from '@/utils/request'

import {
  connectLink
} from '@/utils/addeventlisten'
import './assets/icons' // icon
import './permission' // permission control
import {
  getDicts
} from "@/api/system/dict/data";
import {
  getConfigKey
} from "@/api/system/config";
import {
  parseTime,
  resetForm,
  addDateRange,
  selectDictLabel,
  selectDictLabels,
  handleTree,
  getParent
} from "@/utils/ruoyi";
// 分页组件
import Pagination from "@/components/Pagination";
// 自定义表格工具组件
import RightToolbar from "@/components/RightToolbar"
// 富文本组件
import Editor from "@/components/Editor"
// wangeditor
import WangEditor from "@/components/wangeditor"
// 文件上传组件
import FileUpload from "@/components/FileUpload"
// 图片上传组件
import ImageUpload from "@/components/ImageUpload"
// 图片预览组件
import ImagePreviews from "@/components/ImagePreview"
// 字典标签组件
import DictTag from '@/components/DictTag'
// 头部标签组件
import VueMeta from 'vue-meta'
// 字典数据组件
import DictData from '@/components/DictData'

import VantSelect from '@/components/vantSelect'
import VantCascader from '@/components/vantCascader/index'
import VantCascader2 from '@/components/vantCascader/index2'
import Navbar from "@/views/H5/components/navbar.vue";

// 全局方法挂载
Vue.prototype.getDicts = getDicts
Vue.prototype.getConfigKey = getConfigKey
Vue.prototype.parseTime = parseTime
Vue.prototype.resetForm = resetForm
Vue.prototype.addDateRange = addDateRange
Vue.prototype.selectDictLabel = selectDictLabel
Vue.prototype.selectDictLabels = selectDictLabels
Vue.prototype.download = download
Vue.prototype.handleTree = handleTree
Vue.prototype.isTabShow = isTabShow
Vue.prototype.connectLink = connectLink
Vue.prototype.getParent = getParent

// 全局组件挂载
Vue.component('DictTag', DictTag)
Vue.component('Pagination', Pagination)
Vue.component('RightToolbar', RightToolbar)
Vue.component('Editor', Editor)
Vue.component('FileUpload', FileUpload)
Vue.component('ImageUpload', ImageUpload)
Vue.component('ImagePreviews', ImagePreviews)
Vue.component('VantSelect', VantSelect)
Vue.component('VantCascader', VantCascader)
Vue.component('VantCascader2', VantCascader2)
Vue.component('WangEditor', WangEditor)
Vue.component('Navbar', Navbar)



Vue.use(directive)
Vue.use(plugins)
Vue.use(VueMeta)

DictData.install()

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online! ! !
 */

Vue.use(Element, {
  size: Cookies.get('size') || 'medium',zIndex:3000 // set element-ui default size
})

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
