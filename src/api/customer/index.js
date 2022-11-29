import request from '@/utils/request'


// 获取列表
export function getlist(data) {
  return request({
    url: '/crm/customer/page',
    method: 'get',
    params: data
  })
}
// 新增公司
export function Addcompany(data) {
  return request({
    url: '/crm/company/save',
    method: 'post',
    data: data
  })
}
// 新增客户
export function customersave(data) {
  return request({
    url: '/crm/customer/save',
    method: 'post',
    data: data
  })
}
// 删除客户
export function customerremove(data) {
  return request({
    url: '/crm/customer/remove',
    method: 'post',
    data: data
  })
}


// 下拉框
// 线索
export function getxsList(data) {
  return request({
    url: '/crm/common/xsList',
    method: 'get',
    params: data
  })
}
// 地区
export function getareaList(data) {
  return request({
    url: '/crm/common/areaList',
    method: 'get',
    params: data
  })
}
// 企业
export function getcompanyList(data) {
  return request({
    url: '/crm/common/companyList',
    method: 'get',
    params: data
  })
}
// 客户
export function getcustomerList(data) {
  return request({
    url: '/crm/common/customerList',
    method: 'get',
    params: data
  })
}
// 客户
export function getlabelList(data) {
  return request({
    url: '/crm/common/labelList',
    method: 'get',
    params: data
  })
}
// 客户详情
export function customerdetail(data) {
  return request({
    url: '/crm/customer/detail',
    method: 'get',
    params: data
  })
}
// 人员
export function getstaffList(data) {
  return request({
    url: '/crm/common/staffList',
    method: 'get',
    params: data
  })
}

// 公海客户列表
export function seascustomerpage(data) {
  return request({
    url: '/crm/customer/high/seas/page',
    method: 'get',
    params: data
  })
}

// 移入公海
export function moveIntoHighSeas(data) {
  return request({
    url: '/crm/customer/moveIntoHighSeas',
    method: 'post',
    data: data
  })
}
export function receivehighseascustomer(data) {
  return request({
    url: '/crm/customer/high/seas/receive',
    method: 'post',
    data: data
  })
}

//转移线索
export function transfersales(data) {
  return request({
    url: '/crm/market/clue/changeStaff',
    method: 'post',
    data: data
  })
}

//转移客户
export function transfercustomer(data) {
  return request({
    url: '/crm/customer/transfer',
    method: 'post',
    data: data
  })
}

// 客户详情，概况信息
export function generalInfo(data) {
  return request({
    url: '/crm/customer/generalInfo',
    method: 'get',
    params: data
  })
}
// 联系人
export function getcontactList(data) {
  return request({
    url: '/crm/customer/contactList',
    method: 'get',
    params: data
  })
}
// 下级客户
export function getnextcustomerList(data) {
  return request({
    url: '/crm/customer/customerList',
    method: 'get',
    params: data
  })
}
// 跟进记录
export function followRecordList(data) {
  return request({
    url: '/crm/customer/followRecordList',
    method: 'get',
    params: data
  })
}
// 跟进详情
export function followrecorddetail(data) {
  return request({
    url: '/crm/follow/record/detail',
    method: 'get',
    params: data
  })
}

// 工单记录
export function workOrderRecordList(data) {
  return request({
    url: '/crm/customer/workOrderRecordList',
    method: 'get',
    params: data
  })
}
// 任务记录
export function workRecordList(data) {
  return request({
    url: '/crm/customer/workRecordList',
    method: 'get',
    params: data
  })
}
// 归属记录
export function customerAttributionRecordList(data) {
  return request({
    url: '/crm/customer/customerAttributionRecordList',
    method: 'get',
    params: data
  })
}

// 操作日志
export function operaLogList(data) {
  return request({
    url: '/crm/customer/operaLogList',
    method: 'get',
    params: data
  })
}
// 保存跟进
export function savefollowUp(data) {
  return request({
    url: '/crm/follow/record/followUp',
    method: 'post',
    data: data
  })
}

// 新建任务
export function saveWork(data) {
  return request({
    url: '/crm/work/saveWorkList',
    method: 'post',
    data: data
  })
}
// 通用下拉框
export function commonselectList(data) {
  return request({
    url: '/crm/common/selectList',
    method: 'get',
    params: data
  })
}
// 新建联系人
export function saveContact(data) {
  return request({
    url: '/crm/contact/saveContact',
    method: 'post',
    data: data
  })
}
// 下属人员下拉框
export function subordinateList(data) {
  return request({
    url: '/crm/common/subordinateList2',
    method: 'get',
    params: data
  })
}
// 添加协作
export function saveCoop(data) {
  return request({
    url: '/crm/customer/addCollaboration',
    method: 'post',
    data: data
  })
}

// 联系人列表
export function contactlistAll(data) {
  return request({
    url: '/crm/contact/list',
    method: 'get',
    params: data
  })
}
export function getContactDetailById(data) {
  return request({
    url: '/crm/contact/getContactDetailById',
    method: 'get',
    params: data
  })
}
// 删除联系人
export function deleteByIds(data) {
  return request({
    url: '/crm/contact/deleteByIds',
    method: 'post',
    data: data
  })
}
// 导出联系人
export function contactexport(data) {
  return request({
    url: '/crm/contact/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 重点关注
export function focusOrNot(data) {
  return request({
    url: '/crm/customer/focusOrNot',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 获取工单列表
export function getWorkOrderList(data) {
  return request({
    url: '/crm/workOrder/list',
    method: 'get',
    params: data
  })
}
// 新增工单
export function addWorkOrder(data) {
  return request({
    url: '/crm/workOrder/saveWork',
    method: 'post',
    data: data
  })
}
// 删除工单
export function removeWorkOrder(data) {
  return request({
    url: '/crm/workOrder/remove',
    method: 'post',
    data: data
  })
}

export function followrecordpage(data) {
  return request({
    url: '/crm/follow/record/page',
    method: 'get',
    params: data
  })
}

export function contactdetail(data) {
  return request({
    url: '/crm/contact/detail',
    method: 'get',
    params: data
  })
}

export function customerexport(data) {
  return request({
    url: '/crm/customer/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
export function customerexportbyCondition(data) {
  return request({
    url: '/crm/customer/export/byCondition',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

export function followremove(data) {
  return request({
    url: '/crm/follow/record/remove',
    method: 'post',
    data: data,
  })
}

// 首页数据简报
export function getHome(data) {
  return request({
    url: '/crm/system/home/getHome',
    method: 'get',
    params: data
  })
}
// 首页待办简报
export function getSchedule(data) {
  return request({
    url: '/crm/system/home/getSchedule',
    method: 'get',
    params: data
  })
}

// 获取导入模板
export function getTemplate(data) {
  return request({
    url: '/crm/customer/getTemplate',
    method: 'post',
    data: data,
  })
}
// 执行导入
export function performImport(data) {
  return request({
    url: '/crm/customer/performImport',
    method: 'post',
    data: data,
  })
}
// 批量导入
export function importAll(data) {
  return request({
    url: '/crm/customer/import',
    method: 'post',
    data: data,
  })
}

export function pageAll(data) {
  return request({
    url: '/crm/customer/pageAll',
    method: 'get',
    params: data
  })
}
export function seasinsert(data) {
  return request({
    url: '/crm/customer/high/seas/insert',
    method: 'post',
    data: data,
  })
}

//公海 获取导入模板
export function seagetTemplate(data) {
  return request({
    url: '/crm/customer/high/seas/getTemplate',
    method: 'post',
    data: data,
  })
}
//公海 执行导入
export function seaperformImport(data) {
  return request({
    url: '/crm/customer/high/seas/performImport',
    method: 'post',
    data: data,
  })
}
//公海 批量导入
export function seaimportAll(data) {
  return request({
    url: '/crm/customer/high/seas/import',
    method: 'post',
    data: data,
  })
}

// 编辑跟进回显
export function detailForEdit(data) {
  return request({
    url: '/crm/follow/record/detailForEdit',
    method: 'get',
    params: data
  })
}

// 首页工作报告统计
export function getIntradayWork(data) {
  return request({
    url: '/crm/system/home/getIntradayWork',
    method: 'get',
    params: data
  })
}

// 设置高级筛选字段权限
export function getHighSearchshowList(data) {
  return request({
    url: '/crm/common/showList',
    method: 'get',
    params: data
  })
}

//客户高级筛选
export function customerHighscreen(data) {
  return request({
    url: '/crm/customer/screen',
    method: 'get',
    params: data,
  })
}

// 快速搜索列表
export function fastsearchlist(data) {
  return request({
    url: '/crm/customer/fast/search/list',
    method: 'post',
    data: data,
  })
}

export function fastsearchsave(data) {
  return request({
    url: '/crm/customer/fast/search/save',
    method: 'post',
    data: data,
  })
}
// 删除快速搜索条件
export function fastsearchremove(data) {
  return request({
    url: '/crm/customer/fast/search/remove',
    method: 'post',
    data: data,
  })
}
// 置顶快速搜索条件
export function SetSearchtop(data) {
  return request({
    url: '/crm/customer/fast/search/top',
    method: 'post',
    data: data,
  })
}

// 客户详情联系人导出
export function customerContactExport(data) {
  return request({
    url: '/crm/customer/contact/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 下级客户导出
export function nextCustomerExport(data) {
  return request({
    url: '/crm/customer/customer/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}
// 跟进记录导出
export function followrecordexport(data) {
  return request({
    url: '/crm/customer/follow/record/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 任务记录导出
export function workrecordexport(data) {
  return request({
    url: '/crm/customer/work/record/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 工单记录记录导出
export function customerworkorderrecordexport(data) {
  return request({
    url: '/crm/customer/work/order/record/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 归属记录记录导出
export function attributionexport(data) {
  return request({
    url: '/crm/customer/customer/attribution/record/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 归属记录记录导出
export function logexport(data) {
  return request({
    url: '/crm/customer/opera/log/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 客户资料详情导出
export function customerdetailexport(data) {
  return request({
    url: '/crm/customer/detail/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}


