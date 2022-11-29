import request from '@/utils/request'
// 获取销售线索列表
export function getsalesleadlist(data) {
  return request({
    url: '/crm/market/clue/list',
    method: 'get',
    params: data
  })
}
// 
export function updateDeptStatus(data) {
  return request({
    url: '/crm/dept/updateStatus',
    method: 'post',
    data: data
  })
}

// 导出
export function salesleadExport(data) {
  return request({
    url: '/crm/market/clue/export',
    method: 'post',
    data: data,
    responseType: 'blob'
  })
}

// 转为客户
export function changeClients(data) {
  return request({
    url: '/crm/market/clue/changeClients',
    method: 'post',
    data: data
  })
}
// 跟新线索
export function saveMark(data) {
  return request({
    url: '/crm/market/clue/saveMark',
    method: 'post',
    data: data
  })
}
// 获取销售详情
export function getMarketClueDetailById(data) {
  return request({
    url: '/crm/market/clue/getMarketClueDetailById',
    method: 'get',
    params: data
  })
}
//   删除
export function deleteByIds(data) {
  return request({
    url: '/crm/market/clue/deleteByIds',
    method: 'post',
    data: data
  })
}
// 获取动态
export function getDynamicsByFkId(data) {
  return request({
    url: '/crm/common/getDynamicsByFkId',
    method: 'get',
    params: data
  })
}
// 获取操作日志
export function getlogpage(data) {
  return request({
    url: '/crm/opera/log/page',
    method: 'get',
    params: data
  })
}
export function getdynamicList(data) {
  // type 1 跟进 不传 所有动态
  return request({
    url: '/crm/common/dynamicList',
    method: 'get',
    params: data
  })
}
export function getworkRecordList(data) {
  return request({
    url: '/crm/common/workRecordList',
    method: 'get',
    params: data
  })
}

export function getsaleLeaddetail(data) {
  return request({
    url: '/crm/market/clue/detail',
    method: 'get',
    params: data
  })
}

export function searchByMap(data) {
  return request({
    url: '/crm/xs/listByLocation',
    method: 'get',
    params: data
  })
}

export function updatesaleleadStatus(data) {
  return request({
    url: '/crm/common/updateStatus',
    method: 'post',
    data: data
  })
}

// 获取导入模板
export function getTemplate(data) {
  return request({
    url: '/crm/market/clue/download',
    method: 'post',
    data: data,
    responseType:"blob"
  })
}
// 执行导入
export function performImport(data) {
  return request({
    url: '/crm/market/clue/analyseImport',
    method: 'post',
    data: data,
  })
}
// 批量导入
export function importAll(data) {
  return request({
    url: '/crm/market/clue/import',
    method: 'post',
    data: data,
  })
}

